import { deserializeProofResult } from "@/lib/serialize";
import { getTicketProofRequest } from "@/lib/ticketProof";
import { gpcVerify } from "@pcd/gpc";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
// @ts-ignore ffjavascript does not have types
import { getCurveFromName } from "ffjavascript";
import { prisma } from '@/lib/prisma';

const GPC_ARTIFACTS_PATH = path.join(process.cwd(), "data/artifacts");
console.log("Debug: GPC_ARTIFACTS_PATH", GPC_ARTIFACTS_PATH);

export async function POST(req: NextRequest) {
  const { serializedProofResult } = await req.json();
  const { boundConfig, revealedClaims, proof } = deserializeProofResult(
    serializedProofResult
  );

  const request = getTicketProofRequest().getProofRequest();

  // Multi-threaded verification seems to be broken in NextJS, so we need to
  // initialize the curve in single-threaded mode.

  // @ts-ignore
  if (!globalThis.curve_bn128) {
    // @ts-ignore
    globalThis.curve_bn128 = getCurveFromName("bn128", { singleThread: true });
  }
  
  console.log("boundConfig.circuitIdentifier", boundConfig.circuitIdentifier);

  const res = await gpcVerify(
    proof,
    {
      ...request.proofConfig,
      circuitIdentifier: boundConfig.circuitIdentifier,
    },
    revealedClaims,
    GPC_ARTIFACTS_PATH
  );

  if (res === true) {
    // Extract nullifier from revealedClaims
    const nullifier = revealedClaims?.owner?.nullifierHashV4?.toString();
    if (!nullifier) {
      return NextResponse.json({ verified: true, code: null, error: 'Nullifier not found in proof.' });
    }

    // Try to find an existing code for this nullifier
    let voucher = await prisma.voucherCode.findFirst({ where: { nullifier } });
    if (voucher) {
      return NextResponse.json({ verified: true, code: voucher.voucher_code });
    }

    // Atomically assign an unused code
    voucher = await prisma.voucherCode.findFirst({ where: { nullifier: null } });
    if (!voucher) {
      return NextResponse.json({ verified: true, code: null, error: 'No codes remaining.' });
    }
    await prisma.voucherCode.update({ where: { id: voucher.id }, data: { nullifier } });
    return NextResponse.json({ verified: true, code: voucher.voucher_code });
  }

  return NextResponse.json({ verified: res });
}

import { deserializeProofResult } from "@/utils/serialize";
import { getTicketProofRequest } from "@/utils/ticketProof";
import { gpcVerify } from "@pcd/gpc";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
// @ts-ignore ffjavascript does not have types
import { getCurveFromName } from "ffjavascript";
import { prisma } from '@/utils/prisma';
import { hashTicketId } from '@/utils/hash';

const GPC_ARTIFACTS_PATH = path.join(process.cwd(), "data/artifacts");

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
    // Uncomment to also store get nullifier
    // const nullifier = revealedClaims?.owner?.nullifierHashV4?.toString();
    // Extract ticketId from revealedClaims
    const ticketIdRaw = revealedClaims?.pods?.ticket?.entries?.ticketId?.value;
    const ticketId = typeof ticketIdRaw === 'string' ? ticketIdRaw : String(ticketIdRaw);
    if (!ticketId) {
      return NextResponse.json({ verified: true, code: null, error: 'Ticket ID not found in proof.' });
    }
    const ticketIdHash = hashTicketId(ticketId);

    // Try to find an existing code for this ticketIdHash
    let voucher = await prisma.voucherCode.findFirst({ where: { ticket_id_hash: ticketIdHash } });
    if (voucher) {
      return NextResponse.json({ verified: true, code: voucher.voucher_code });
    }

    // Atomically assign an unused code
    voucher = await prisma.voucherCode.findFirst({ where: { ticket_id_hash: null } });
    if (!voucher) {
      return NextResponse.json({ verified: true, code: null, error: 'No codes remaining.' });
    }
    // Assign ticketIdHash to voucher code
    await prisma.voucherCode.update({ where: { id: voucher.id }, data: { ticket_id_hash: ticketIdHash } });
    return NextResponse.json({ verified: true, code: voucher.voucher_code });
  }

  return NextResponse.json({ verified: res });
}

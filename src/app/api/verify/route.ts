import { deserializeProofResult } from "@/utils/serialize";
import { getTicketProofRequest } from "@/utils/ticketProof";
import { gpcVerify } from "@pcd/gpc";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
// @ts-ignore ffjavascript does not have types
import { getCurveFromName } from "ffjavascript";
import { supabase } from '../server-utils/supabase';
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
    let { data: voucher, error } = await supabase
      .from('VoucherCode')
      .select('*')
      .eq('ticket_id_hash', ticketIdHash)
      .single();
    if (voucher) {
      return NextResponse.json({ verified: true, code: voucher.voucher_code });
    }

    // Atomically assign an unused code
    let { data: unusedVoucher, error: unusedError } = await supabase
      .from('VoucherCode')
      .select('*')
      .is('ticket_id_hash', null)
      .limit(1)
      .single();
    if (!unusedVoucher) {
      return NextResponse.json({ verified: true, code: null, error: 'No codes remaining.' });
    }
    // Assign ticketIdHash to voucher code
    const { error: updateError } = await supabase
      .from('VoucherCode')
      .update({ ticket_id_hash: ticketIdHash })
      .eq('id', unusedVoucher.id);
    return NextResponse.json({ verified: true, code: unusedVoucher.voucher_code });
  }

  return NextResponse.json({ verified: res });
}

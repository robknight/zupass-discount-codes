import { ticketProofRequest } from "@parcnet-js/ticket-spec";
//"ZeZomy3iAu0A37TrJUAJ+76eYjiB3notl9jiRF3vRJE",
//HZ3Zed6HmpTPJd9uMcEHnfVCG9Gaio3Jj/Ru0Fu3NhA
//"YwahfUdUYehkGMaWh0+q3F8itx2h8mybjPmt8CmTJSs",
export function getTicketProofRequest() {
  return ticketProofRequest({
    classificationTuples: [
      {
        signerPublicKey: "/ORfIt7ovFcRtCP/XxeTNUy/JlAJl84dYXn45IexCxk", // update this to the signer public key of pod you want to verify
        eventId: "2be43b15-10aa-4d7c-be94-240c4e2b5bc7", // update this to the event id of pod you want to verify
      },
    ],
    fieldsToReveal: {
      attendeeEmail: false,
      attendeeName: false,
      eventId: true,
      ticketId: true,
    },
    externalNullifier: {
      type: "string",
      value: "ProtocolBerg_DappCon_Discount_2025" // Set app-specific nullifier here
    }
  });
}

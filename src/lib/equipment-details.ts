export type ListingDetails = { quantity: number; condition: string; included: string[] };
export const listingDetails: Record<string, ListingDetails> = {
  "sony-a7-iv": { quantity: 2, condition: "Good", included: ["Mirrorless camera body", "Attached zoom lens"] },
  "cordless-drill": { quantity: 4, condition: "Good", included: ["Cordless drill", "Rechargeable battery", "Drill bits"] },
  "portable-projector": { quantity: 2, condition: "Good", included: ["Portable projector"] },
  "pa-speaker": { quantity: 1, condition: "Good", included: ["Portable PA speaker"] },
  "irrigation-pump": { quantity: 2, condition: "Good", included: ["Water pump", "Protective frame"] },
  "cargo-van": { quantity: 1, condition: "Good", included: ["Compact cargo van"] },
};
export const rentalGuidelines = [
  "Confirm the rental period, quantity and collection or delivery arrangements before handover.",
  "Check the equipment condition and included accessories together at collection.",
  "Follow the operating instructions provided by the equipment owner.",
  "Return the equipment and included accessories at the agreed time.",
];

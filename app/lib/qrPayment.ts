export type PaymentMethod = "gcash" | "maya";

export const paymentReferencePattern = /^[A-Z0-9]{6,40}$/;

const paymentQrCodes: Record<string, Record<PaymentMethod, string> & { amount: number }> = {
  glasswalk: { amount: 200, gcash: "/gcash-glasswalk.jpg", maya: "/maya-glasswalk.jpg" },
  miragewalk: { amount: 150, gcash: "/gcash-mirage%20walk.jpg", maya: "/maya-miragewalk.jpg" },
  mirrorwalk: { amount: 120, gcash: "/gcash-mirrorwalk.jpg", maya: "/maya-mirrorwalk.jpg" },
  viewdeck: { amount: 100, gcash: "/gcash-view%20deck.jpg", maya: "/maya-viewdeck.jpg" },
};

export function getPaymentQrCodes(attractionName: string) {
  const key = attractionName.toLowerCase().replace(/[^a-z0-9]/g, "");
  return Object.hasOwn(paymentQrCodes, key) ? paymentQrCodes[key] : undefined;
}

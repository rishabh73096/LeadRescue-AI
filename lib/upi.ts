export const UPI_VPA = process.env.NEXT_PUBLIC_UPI_VPA || "";
export const UPI_PAYEE = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "LeadRescue AI";

export const priceToInr = (price: string) => Number(price.replace(/[^\d]/g, "")) || 0;

// NPCI UPI deep link. Scanned by any UPI app; also opens an app on mobile.
export function upiLink({ amount, note }: { amount: number; note: string }) {
  const params = new URLSearchParams({ pa: UPI_VPA, pn: UPI_PAYEE, am: amount.toFixed(2), cu: "INR", tn: note });
  return `upi://pay?${params.toString().replace(/\+/g, "%20")}`;
}

export const isValidUtr = (v: string) => /^[A-Za-z0-9]{8,24}$/.test(v);

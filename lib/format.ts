
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");

export const formatMoney = (value: number) => usd.format(value);
export const formatNumber = (value: number, decimals = 0) =>
  decimals ? new Intl.NumberFormat("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value) : number.format(value);

export function monthlyPayment(principal: number, apr: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  const r = apr / 100 / 12;
  return r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
}

export function formatCompactMoney(value: number): string {
  if (value >= 1_000_000) return `$${+(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${+(value / 1_000).toFixed(1)}k`;
  return `$${value}`;
}

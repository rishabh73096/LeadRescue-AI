export function safeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string" || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  if (/[\r\n]/.test(value)) return fallback;
  return value;
}

export const loginUrl = (next: string) => `/login?next=${encodeURIComponent(next)}`;

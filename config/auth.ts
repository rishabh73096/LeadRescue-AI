// TEMPORARY: route/plan guards are switched off so the dashboard UI can be built without
// a working Supabase project. Set to true before launch (proxy, RequireAuth, RequirePlan).
export const GUARDS_ENABLED = false;

export const SUPPORT_HREF = "/contact";
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 60 * 60;

export type Role = "owner" | "admin" | "staff" | "user";

export const DEFAULT_SIGNUP_ROLE: Role = "owner";

export const DEMO_LOGIN_ENABLED = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === "true";
// Add local demo accounts here while developing against a test backend.
export const DEMO_ACCOUNTS: { label: string; email: string; password: string; role: Role }[] = [];

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import type { Address, User } from "@/types";

type Raw = Record<string, unknown>;

const emptyAddress: Address = { street: "", city: "", state: "", zipCode: "", country: "" };

function normalizeAddress(value: unknown): Address {
  const a = (value && typeof value === "object" ? value : {}) as Raw;
  return { ...emptyAddress, street: String(a.street ?? ""), city: String(a.city ?? ""), state: String(a.state ?? ""), zipCode: String(a.zipCode ?? ""), country: String(a.country ?? "") };
}

export function normalizeUser(u: SupabaseUser): User {
  const m = (u.user_metadata ?? {}) as Raw;
  const { country, state, city } = normalizeAddress(m.location);
  return {
    _id: u.id,
    fullName: String(m.name ?? m.full_name ?? ""),
    email: u.email ?? "",
    phone: String(m.phone ?? u.phone ?? ""),
    // Never trust user_metadata for permissions (users can edit it). The real role comes from the database: see useRole().
    role: "owner",
    createdAt: u.created_at,
    businessName: String(m.businessName ?? ""),
    website: String(m.website ?? ""),
    address: normalizeAddress(m.address),
    timezone: String(m.timezone ?? ""),
    bio: String(m.bio ?? ""),
    location: { country, state, city },
  };
}

const AUTH_MESSAGES: Record<string, string> = {
  invalid_credentials: "Incorrect email or password.",
  email_not_confirmed: "Please confirm your email first. Check your inbox for the link.",
  user_already_exists: "An account with this email already exists.",
  over_request_rate_limit: "Too many attempts. Please wait a moment and try again.",
  over_email_send_rate_limit: "Too many emails sent. Please wait a minute and try again.",
  otp_expired: "That code has expired. Please request a new one.",
  weak_password: "Please choose a stronger password.",
  same_password: "Your new password must be different from the old one.",
};

function fail(error: { code?: string; message: string }): never {
  throw new Error((error.code && AUTH_MESSAGES[error.code]) || error.message || "Something went wrong. Please try again.");
}

export async function register(input: { name: string; email: string; password: string; phone?: string }): Promise<{ hasSession: boolean }> {
  const { data, error } = await createClient().auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, phone: input.phone } },
  });
  if (error) fail(error);
  // Supabase hides duplicate emails when confirmation is on: identities comes back empty.
  if (data.user && data.user.identities?.length === 0) fail({ code: "user_already_exists", message: "" });
  return { hasSession: Boolean(data.session) };
}

export async function login(body: { email: string; password: string }): Promise<User> {
  const { data, error } = await createClient().auth.signInWithPassword(body);
  if (error) fail(error);
  return normalizeUser(data.user);
}

export async function logout() {
  await createClient().auth.signOut();
}

export async function getProfile(): Promise<User | null> {
  const { data } = await createClient().auth.getUser();
  return data.user ? normalizeUser(data.user) : null;
}

// Password reset: email a code -> verify it -> set a new password.
// The recovery email template must include {{ .Token }} (Supabase dashboard > Auth > Email Templates).
// The "token" threaded through the UI is just the email address.
export async function sendOtp(email: string): Promise<string> {
  const { error } = await createClient().auth.resetPasswordForEmail(email);
  if (error) fail(error);
  return email;
}

export async function verifyOtp(body: { otp: string; token: string }): Promise<string> {
  const { error } = await createClient().auth.verifyOtp({ email: body.token, token: body.otp, type: "recovery" });
  if (error) fail(error);
  return body.token;
}

export async function changePassword(body: { password: string }) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: body.password });
  if (error) fail(error);
  await supabase.auth.signOut();
}

export async function updateProfile(body: { name?: string; phone?: string; businessName?: string; website?: string; address?: Partial<Address>; timezone?: string; bio?: string; location?: Pick<Address, "country" | "state" | "city"> }) {
  const { error } = await createClient().auth.updateUser({ data: body });
  if (error) fail(error);
}

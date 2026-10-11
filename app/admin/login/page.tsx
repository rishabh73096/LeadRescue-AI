import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next } = await searchParams;
  const raw = Array.isArray(next) ? next[0] : next;
  // only ever send admins to admin pages
  const target = raw && raw.startsWith("/admin") && !raw.startsWith("/admin/login") && !raw.startsWith("//") ? raw : "/admin";
  return <AdminLoginForm next={target} />;
}

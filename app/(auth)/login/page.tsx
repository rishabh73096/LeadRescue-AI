import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { RoundBackButton } from "@/components/ui/round-back-button";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your account",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  return (
    <>
      <RoundBackButton />
      <LoginForm next={next} />
    </>
  );
}

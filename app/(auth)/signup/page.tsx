import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";
import { RoundBackButton } from "@/components/ui/round-back-button";
import { safeNext } from "@/lib/safe-next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your account",
};

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const { next: rawNext } = await searchParams;
  const next = safeNext(Array.isArray(rawNext) ? rawNext[0] : rawNext);

  return (
    <>
      <RoundBackButton />
      <SignupForm next={next} />
    </>
  );
}

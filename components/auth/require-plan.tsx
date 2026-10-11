"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { GUARDS_ENABLED } from "@/config/auth";
import { useSubscription } from "@/lib/subscription";
import { PageLoader } from "@/components/ui/spinner";

function Guard({ children }: { children: ReactNode }) {
  const { plan, ready } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (ready && !plan) router.replace("/choose-plan");
  }, [ready, plan, router]);

  if (!ready || !plan) return <PageLoader label="Checking your plan…" />;
  return <>{children}</>;
}

export function RequirePlan({ children }: { children: ReactNode }) {
  return GUARDS_ENABLED ? <Guard>{children}</Guard> : <>{children}</>;
}

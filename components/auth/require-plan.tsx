"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/lib/subscription";
import { PageLoader } from "@/components/ui/spinner";

export function RequirePlan({ children }: { children: ReactNode }) {
  const { plan, ready } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (ready && !plan) router.replace("/choose-plan");
  }, [ready, plan, router]);

  if (!ready || !plan) return <PageLoader label="Checking your plan…" />;
  return <>{children}</>;
}

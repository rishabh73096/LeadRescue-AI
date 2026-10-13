"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { GUARDS_ENABLED } from "@/config/auth";
import { useAuthState } from "@/context/AuthContext";
import { useSubscription } from "@/lib/subscription";
import { useAdminLookup } from "@/services/admin";
import { PageLoader } from "@/components/ui/spinner";

function Guard({ children }: { children: ReactNode }) {
  const { user } = useAuthState();
  const admin = useAdminLookup(user?._id);
  const { plan, ready } = useSubscription();
  const router = useRouter();

  // Platform admins never need to buy a plan.
  const needsPlan = admin === false && ready && !plan;

  useEffect(() => {
    if (needsPlan) router.replace("/choose-plan");
  }, [needsPlan, router]);

  if (admin === true) return <>{children}</>;
  if (admin === null || !ready || !plan) return <PageLoader label="Checking your plan…" />;
  return <>{children}</>;
}

export function RequirePlan({ children }: { children: ReactNode }) {
  return GUARDS_ENABLED ? <Guard>{children}</Guard> : <>{children}</>;
}

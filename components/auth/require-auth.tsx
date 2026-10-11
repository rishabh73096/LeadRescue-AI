"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthState } from "@/context/AuthContext";
import { loginUrl } from "@/lib/safe-next";
import { PageLoader } from "@/components/ui/spinner";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "guest") router.replace(loginUrl(pathname));
  }, [status, router, pathname]);

  if (status !== "authenticated") return <PageLoader label={status === "loading" ? "Loading your account…" : "Redirecting to sign in…"} />;
  return <>{children}</>;
}

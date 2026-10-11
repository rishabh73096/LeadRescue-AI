"use client";

import type { ReactNode } from "react";
import { AccessDenied } from "@/components/dashboard/access-denied";
import { PageLoader } from "@/components/ui/spinner";
import { useAuthState } from "@/context/AuthContext";
import { usePlatformAdmin } from "@/services/admin";

// UI gate only. Real protection is Supabase RLS (see supabase/migrations/0002_admin.sql).
export function AdminGate({ children }: { children: ReactNode }) {
  const { user, status } = useAuthState();
  const admin = usePlatformAdmin(user?._id);
  if (status === "loading" || admin === null) return <PageLoader label="Checking access…" />;
  return admin ? <>{children}</> : <AccessDenied />;
}

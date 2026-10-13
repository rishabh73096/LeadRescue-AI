"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/context/AuthContext";
import { useAdminLookup } from "@/services/admin";

// Sends signed-in people away from the sign-in and sign-up pages.
// Platform admins land in the admin console instead of the customer dashboard.
export function useGuestRedirect(target = "/dashboard") {
  const { status, user } = useAuthState();
  const admin = useAdminLookup(status === "authenticated" ? user?._id : undefined);
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || admin === null) return;
    router.replace(admin && target === "/dashboard" ? "/admin" : target);
  }, [status, admin, target, router]);
}

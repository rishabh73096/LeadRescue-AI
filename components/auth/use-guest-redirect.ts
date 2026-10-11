"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/context/AuthContext";

export function useGuestRedirect(target = "/dashboard") {
  const { status } = useAuthState();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") router.replace(target);
  }, [status, target, router]);
}

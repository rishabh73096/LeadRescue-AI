"use client";

import { useAuthState } from "@/context/AuthContext";
import { normalizeRole } from "@/lib/roles";
import type { Role } from "@/config/auth";

export function useRole(): { role: Role } {
  const { user } = useAuthState();
  return { role: normalizeRole(user?.role) };
}

"use client";

import { useEffect, useState } from "react";
import { GUARDS_ENABLED, type Role } from "@/config/auth";
import { useAuthState } from "@/context/AuthContext";
import { normalizeRole } from "@/lib/roles";
import { createClient } from "@/utils/supabase/client";

// The workspace role is read from `profiles.role` in the database, which users cannot change.
// (user_metadata is editable by the user, so it is never used for permissions.)
export function useRole(): { role: Role; ready: boolean } {
  const { user } = useAuthState();
  const id = user?._id;
  const [state, setState] = useState<{ id: string; role: Role } | null>(null);

  useEffect(() => {
    if (!GUARDS_ENABLED || !id) return;
    let cancelled = false;
    createClient()
      .from("profiles")
      .select("role")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => !cancelled && setState({ id, role: normalizeRole(data?.role) }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Guards off (UI development): everyone is an owner.
  if (!GUARDS_ENABLED) return { role: "owner", ready: true };
  if (!id) return { role: "staff", ready: false };
  return state && state.id === id ? { role: state.role, ready: true } : { role: "staff", ready: false };
}

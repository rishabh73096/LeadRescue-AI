"use client";

import { useEffect, useSyncExternalStore } from "react";
import { GUARDS_ENABLED } from "@/config/auth";
import { useAuthState } from "@/context/AuthContext";
import { ALL_FEATURES, isPlanName, planHas, type Feature, type PlanName } from "@/lib/plans";
import { registerLocalKey } from "@/lib/local-store";
import { createClient } from "@/utils/supabase/client";

// One shared copy of "which plan does this user have, and are they an admin" so every component can ask
// `can("aiReplies")` without each making its own request.
interface Snap {
  userId: string | null;
  plan: PlanName | null;
  isAdmin: boolean;
  ready: boolean;
}

const EMPTY: Snap = { userId: null, plan: null, isAdmin: false, ready: false };
let snap: Snap = EMPTY;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();
const set = (next: Snap) => {
  snap = next;
  listeners.forEach((l) => l());
};

const snapKey = (id: string) => `planstore:snapshot:${id}`;

async function fetchPlan(userId: string) {
  const supabase = createClient();
  try {
    const [sub, adm] = await Promise.all([
      supabase.from("subscriptions").select("plan,status,current_period_end").eq("user_id", userId).maybeSingle(),
      supabase.from("platform_admins").select("user_id").eq("user_id", userId).maybeSingle(),
    ]);
    if (sub.error || adm.error) throw sub.error ?? adm.error;
    const live = sub.data && sub.data.status === "active" && new Date(sub.data.current_period_end) > new Date() && isPlanName(sub.data.plan);
    const next: Snap = { userId, plan: live ? (sub.data!.plan as PlanName) : null, isAdmin: Boolean(adm.data), ready: true };
    try {
      registerLocalKey(snapKey(userId));
      window.localStorage.setItem(snapKey(userId), JSON.stringify({ plan: next.plan, isAdmin: next.isAdmin, end: sub.data?.current_period_end ?? null }));
    } catch {}
    set(next);
  } catch {
    // offline or unreachable: use the last copy we saw
    try {
      const raw = JSON.parse(window.localStorage.getItem(snapKey(userId)) || "null") as { plan: PlanName | null; isAdmin: boolean; end: string | null } | null;
      if (raw) return set({ userId, plan: raw.plan && raw.end && new Date(raw.end) > new Date() ? raw.plan : null, isAdmin: raw.isAdmin, ready: true });
    } catch {}
    set({ userId, plan: null, isAdmin: false, ready: true });
  }
}

export function refreshPlan(userId: string) {
  inflight = fetchPlan(userId).finally(() => (inflight = null));
  return inflight;
}

export interface PlanInfo {
  plan: PlanName | null;
  isAdmin: boolean;
  ready: boolean;
  can: (f: Feature) => boolean;
}

export function usePlan(): PlanInfo {
  const { user } = useAuthState();
  const id = user?._id ?? null;
  const s = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snap,
    () => EMPTY,
  );

  useEffect(() => {
    if (!GUARDS_ENABLED || !id) return;
    if (snap.userId !== id && !inflight) refreshPlan(id);
  }, [id]);

  // Guards off (UI development): everything is unlocked so every screen can be reviewed.
  if (!GUARDS_ENABLED) return { plan: "Pro", isAdmin: false, ready: true, can: () => true };
  const current = s.userId === id && id ? s : EMPTY;
  const open = new Set<Feature>(current.isAdmin ? ALL_FEATURES : []);
  return { plan: current.plan, isAdmin: current.isAdmin, ready: current.ready, can: (f) => open.has(f) || planHas(current.plan, f) };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "@/context/AuthContext";
import { registerLocalKey } from "@/lib/local-store";
import { createClient } from "@/utils/supabase/client";

export interface PendingPayment {
  plan: string;
  upi_ref: string;
}

// Source of truth is the Supabase `subscriptions` table (written only by the
// payment-verification trigger). See supabase/migrations/0001_subscriptions.sql.
export function useSubscription() {
  const { user, status } = useAuthState();
  const [plan, setPlan] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [ready, setReady] = useState(false);
  const id = user?._id ?? "";

  const load = useCallback(async () => {
    if (!id) {
      setPlan(null);
      setPending(null);
      return;
    }
    const supabase = createClient();
    const snapKey = `plan:snapshot:${id}`;
    try {
      const [sub, pay] = await Promise.all([
        supabase.from("subscriptions").select("plan,status,current_period_end").eq("user_id", id).maybeSingle(),
        supabase.from("payments").select("plan,upi_ref").eq("user_id", id).eq("status", "pending").order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      if (sub.error || pay.error) throw sub.error ?? pay.error;
      const active = sub.data && sub.data.status === "active" && new Date(sub.data.current_period_end) > new Date();
      setPlan(active ? sub.data!.plan : null);
      setPending(pay.data ?? null);
      try {
        registerLocalKey(snapKey);
        window.localStorage.setItem(snapKey, JSON.stringify({ plan: active ? sub.data!.plan : null, end: sub.data?.current_period_end ?? null }));
      } catch {}
    } catch {
      // Offline or Supabase unreachable: keep the last known plan so users are not bounced to "choose a plan".
      try {
        const snap = JSON.parse(window.localStorage.getItem(snapKey) || "null") as { plan: string | null; end: string | null } | null;
        if (snap) setPlan(snap.plan && snap.end && new Date(snap.end) > new Date() ? snap.plan : null);
      } catch {}
    }
  }, [id]);

  useEffect(() => {
    if (status === "loading") return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load subscription once the user is known
    load()
      .catch(() => {})
      .finally(() => !cancelled && setReady(true));
    return () => {
      cancelled = true;
    };
  }, [status, load]);

  const submitPayment = useCallback(
    async (input: { plan: string; amount: number; utr: string }) => {
      const { error } = await createClient().from("payments").insert({ plan: input.plan, amount_inr: input.amount, upi_ref: input.utr });
      if (error) throw new Error(error.code === "23505" ? "That UTR was already submitted." : "Couldn't submit your payment. Please check the reference and try again.");
      await load();
    },
    [load],
  );

  return { plan, pending, ready, refresh: load, submitPayment };
}

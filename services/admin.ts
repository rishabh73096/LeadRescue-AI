"use client";

import { useCallback, useEffect, useState } from "react";
import { GUARDS_ENABLED } from "@/config/auth";
import { DAY_MS } from "@/lib/date";
import { createClient } from "@/utils/supabase/client";
import type { AdminData, PaymentStatus, Profile, SubscriptionRow, Payment } from "@/types/admin";

const EMPTY: AdminData = { profiles: [], payments: [], subscriptions: [], demo: false };

function demoData(): AdminData {
  const now = Date.now();
  const iso = (d: number) => new Date(now + d * DAY_MS).toISOString();
  const profiles: Profile[] = [
    { id: "u1", name: "Asha Cleaners", email: "asha@example.com", phone: "+919800000001", created_at: iso(-40) },
    { id: "u2", name: "Bright Home Services", email: "bright@example.com", phone: "+919800000002", created_at: iso(-12) },
    { id: "u3", name: "Kumar Salon", email: "kumar@example.com", phone: "+919800000003", created_at: iso(-3) },
    { id: "u4", name: "Neha Agency", email: "neha@example.com", phone: "+919800000004", created_at: iso(-1) },
  ];
  const payments: Payment[] = [
    { id: "p1", user_id: "u3", plan: "Pro", amount_inr: 999, upi_ref: "412345678901", status: "pending", created_at: iso(-0.2) },
    { id: "p2", user_id: "u4", plan: "Starter", amount_inr: 499, upi_ref: "412345678902", status: "pending", created_at: iso(-0.05) },
    { id: "p3", user_id: "u1", plan: "Pro", amount_inr: 999, upi_ref: "398765432101", status: "verified", created_at: iso(-28) },
    { id: "p4", user_id: "u2", plan: "Starter", amount_inr: 499, upi_ref: "398765432102", status: "verified", created_at: iso(-10) },
    { id: "p5", user_id: "u2", plan: "Pro", amount_inr: 999, upi_ref: "398765432103", status: "rejected", created_at: iso(-11) },
  ];
  const subscriptions: SubscriptionRow[] = [
    { user_id: "u1", plan: "Pro", status: "active", current_period_end: iso(2), updated_at: iso(-28) },
    { user_id: "u2", plan: "Starter", status: "active", current_period_end: iso(20), updated_at: iso(-10) },
  ];
  return { profiles, payments, subscriptions, demo: true };
}

async function load(): Promise<AdminData> {
  try {
    const supabase = createClient();
    const [p, pay, sub] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("*"),
    ]);
    if (p.error || pay.error || sub.error) throw p.error ?? pay.error ?? sub.error;
    return { profiles: p.data as Profile[], payments: pay.data as Payment[], subscriptions: sub.data as SubscriptionRow[], demo: false };
  } catch {
    // While guards are off (UI development) fall back to sample data so the pages can be seen.
    return GUARDS_ENABLED ? EMPTY : demoData();
  }
}

export function useAdminData() {
  const [data, setData] = useState<AdminData | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    load().then((d) => !cancelled && setData(d));
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { data, refresh };
}

export async function setPaymentStatus(id: string, status: PaymentStatus) {
  const { error } = await createClient().from("payments").update({ status }).eq("id", id);
  if (error) throw new Error("Couldn't update the payment. Are you set up as a platform admin?");
}

export async function extendSubscription(userId: string, currentEnd: string, days: number) {
  const base = Math.max(new Date(currentEnd).getTime(), Date.now());
  const { error } = await createClient().from("subscriptions").update({ status: "active", current_period_end: new Date(base + days * DAY_MS).toISOString(), updated_at: new Date().toISOString() }).eq("user_id", userId);
  if (error) throw new Error("Couldn't update the subscription.");
}

export async function expireSubscription(userId: string) {
  const { error } = await createClient().from("subscriptions").update({ status: "expired", updated_at: new Date().toISOString() }).eq("user_id", userId);
  if (error) throw new Error("Couldn't update the subscription.");
}

export async function isPlatformAdmin(userId: string): Promise<boolean> {
  const { data } = await createClient().from("platform_admins").select("user_id").eq("user_id", userId).maybeSingle();
  return Boolean(data);
}

export function usePlatformAdmin(userId?: string): boolean | null {
  const [admin, setAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    if (!GUARDS_ENABLED || !userId) return;
    let cancelled = false;
    createClient()
      .from("platform_admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => !cancelled && setAdmin(Boolean(data)));
    return () => {
      cancelled = true;
    };
  }, [userId]);
  // Guards off (UI development): show admin pages to everyone.
  return GUARDS_ENABLED ? (userId ? admin : false) : true;
}

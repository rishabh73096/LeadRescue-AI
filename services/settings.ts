"use client";

import { useEffect, useSyncExternalStore } from "react";
import { currentUserId, registerReset } from "@/lib/collection";
import { registerLocalKey } from "@/lib/local-store";
import { createClient } from "@/utils/supabase/client";
import type { WorkspaceSettings } from "@/types/lead";

// Supabase table `workspace_settings` (one row per user, JSON `data`).
// Falls back to localStorage when signed out or the table is missing.
export const DEFAULT_SETTINGS: WorkspaceSettings = {
  businessName: "",
  language: "en",
  signature: "",
  services: [
    { name: "Deep cleaning", price: "₹2,500 – ₹6,500" },
    { name: "Sofa and carpet cleaning", price: "₹1,500 – ₹3,500" },
  ],
};

const KEY = "settings";
registerLocalKey(KEY);

let value: WorkspaceSettings = DEFAULT_SETTINGS;
let remote = false;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load() {
  const userId = await currentUserId();
  if (userId) {
    const { data, error } = await createClient().from("workspace_settings").select("data").maybeSingle();
    if (!error) {
      remote = true;
      value = { ...DEFAULT_SETTINGS, ...((data?.data as Partial<WorkspaceSettings>) ?? {}) };
      return emit();
    }
    console.warn("[workspace_settings] Supabase unavailable, using local data:", error.message);
  }
  remote = false;
  try {
    const raw = window.localStorage.getItem(KEY);
    value = raw ? { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<WorkspaceSettings>) } : DEFAULT_SETTINGS;
  } catch {
    value = DEFAULT_SETTINGS;
  }
  emit();
}

registerReset(() => {
  loading = null;
  value = DEFAULT_SETTINGS;
  emit();
  if (listeners.size) loading = load();
});

export function useSettings(): WorkspaceSettings {
  const v = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => value,
    () => DEFAULT_SETTINGS,
  );
  useEffect(() => {
    loading ??= load();
  }, []);
  return v;
}

export async function saveSettings(next: WorkspaceSettings) {
  value = next;
  emit();
  if (!remote) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    return;
  }
  const { error } = await createClient().from("workspace_settings").upsert({ data: next, updated_at: new Date().toISOString() });
  if (error) throw new Error("Couldn't save settings. Please try again.");
}

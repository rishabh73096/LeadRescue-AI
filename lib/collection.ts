"use client";

import { useEffect, useSyncExternalStore } from "react";
import { registerLocalKey } from "@/lib/local-store";
import { notify } from "@/lib/toast";
import { createClient } from "@/utils/supabase/client";

// A small cache between the UI and Supabase.
// - Signed in: rows come from / go to Supabase (RLS scopes them to the user).
// - Signed out, or the tables are missing: falls back to browser localStorage (demo mode).
// UI calls stay synchronous: changes apply to the cache first, then persist in the background.

export interface CollectionState<T> {
  items: T[];
  loaded: boolean;
}

type Resettable = { reset: () => void };
const registry: Resettable[] = [];

// Call when the signed-in user changes so the next screen refetches.
export const resetAllData = () => registry.forEach((c) => c.reset());
export const registerReset = (reset: () => void) => void registry.push({ reset });

export async function currentUserId(): Promise<string | null> {
  const { data } = await createClient().auth.getSession();
  return data.session?.user.id ?? null;
}

type Row = Record<string, unknown>;

interface Options<T> {
  table: string;
  localKey: string;
  seed?: () => T[];
  toRow: (item: T) => Row;
  fromRow: (row: Row) => T;
}

const EMPTY = { items: [], loaded: false } as CollectionState<never>;

export function createCollection<T extends { id: string }>(o: Options<T>) {
  let state: CollectionState<T> = EMPTY as CollectionState<T>;
  let remote = false;
  let userId: string | null = null;
  let loading: Promise<void> | null = null;
  const listeners = new Set<() => void>();
  registerLocalKey(o.localKey);

  const commit = (items: T[], loaded = true) => {
    state = { items, loaded };
    listeners.forEach((l) => l());
    if (loaded) queueMicrotask(() => saveSnapshot());
  };

  const saveLocal = () => {
    try {
      window.localStorage.setItem(o.localKey, JSON.stringify(state.items));
    } catch {}
  };

  const readLocal = (): T[] => {
    try {
      const raw = window.localStorage.getItem(o.localKey);
      if (raw) return JSON.parse(raw) as T[];
    } catch {}
    return o.seed?.() ?? [];
  };

  // Last data we loaded for this user, so the app still shows their leads with no internet.
  const snapKey = (userId: string) => `${o.localKey}:snapshot:${userId}`;
  const saveSnapshot = () => {
    if (!remote || !userId) return;
    try {
      registerLocalKey(snapKey(userId));
      window.localStorage.setItem(snapKey(userId), JSON.stringify(state.items));
    } catch {}
  };
  const readSnapshot = (id: string): T[] | null => {
    try {
      const raw = window.localStorage.getItem(snapKey(id));
      return raw ? (JSON.parse(raw) as T[]) : null;
    } catch {
      return null;
    }
  };

  async function load() {
    userId = await currentUserId();
    if (userId) {
      const { data, error } = await createClient().from(o.table).select("*");
      if (!error) {
        remote = true;
        commit((data as Row[]).map(o.fromRow));
        return saveSnapshot();
      }
      console.warn(`[${o.table}] Supabase unavailable:`, error.message);
      // Signed in but unreachable (offline or tables missing): show the last saved copy, never demo data.
      const snap = readSnapshot(userId);
      if (snap || (typeof navigator !== "undefined" && !navigator.onLine)) {
        remote = false;
        return commit(snap ?? []);
      }
    }
    remote = false;
    commit(readLocal());
  }

  const ensureLoaded = () => (loading ??= load());

  const fail = () => {
    notify.error("Couldn't save your change. Reloading.");
    loading = null;
    ensureLoaded();
  };

  const persist = (run: () => PromiseLike<{ error: unknown }>) => {
    if (!remote) return saveLocal();
    run().then(({ error }) => error && fail());
  };

  const api = {
    use(): CollectionState<T> {
      const s = useSyncExternalStore(
        (cb) => {
          listeners.add(cb);
          return () => listeners.delete(cb);
        },
        () => state,
        () => EMPTY as CollectionState<T>,
      );
      useEffect(() => {
        ensureLoaded();
      }, [s.loaded]);
      return s;
    },
    get: () => state.items,
    insert(rows: T[]) {
      commit([...rows, ...state.items]);
      persist(() => createClient().from(o.table).insert(rows.map(o.toRow)));
    },
    replace(id: string, patch: (item: T) => T) {
      const next = state.items.find((i) => i.id === id);
      if (!next) return;
      const updated = patch(next);
      commit(state.items.map((i) => (i.id === id ? updated : i)));
      persist(() => createClient().from(o.table).upsert(o.toRow(updated)));
    },
    remove(ids: string[]) {
      commit(state.items.filter((i) => !ids.includes(i.id)));
      persist(() => createClient().from(o.table).delete().in("id", ids));
    },
    reset() {
      loading = null;
      commit([], false);
      if (listeners.size) ensureLoaded();
    },
  };
  registry.push(api);
  return api;
}

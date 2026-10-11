"use client";

import { useSyncExternalStore } from "react";

// Ids of rows that just changed, so tables can briefly highlight them.
let current: ReadonlySet<string> = new Set();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function flash(ids: string[], ms = 2400) {
  current = new Set([...current, ...ids]);
  emit();
  setTimeout(() => {
    const next = new Set(current);
    ids.forEach((id) => next.delete(id));
    current = next;
    emit();
  }, ms);
}

export const useFlashing = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => current,
  );

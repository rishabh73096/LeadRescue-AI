"use client";

import { useSyncExternalStore } from "react";

const registeredKeys = new Set<string>();

export const registerLocalKey = (key: string) => void registeredKeys.add(key);

export function clearLocalStores() {
  registeredKeys.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  });
}

export function createLocalStore<T>(key: string, fallback: T) {
  registeredKeys.add(key);
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: T = fallback;

  const read = (): T => {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {}
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : fallback;
      } catch {
        cachedValue = fallback;
      }
    }
    return cachedValue;
  };

  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    window.addEventListener("storage", cb);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", cb);
    };
  };

  return {
    get: read,
    clear() {
      try {
        window.localStorage.removeItem(key);
      } catch {}
      listeners.forEach((l) => l());
    },
    set(value: T) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {}
      listeners.forEach((l) => l());
    },
    use: () => useSyncExternalStore(subscribe, read, () => fallback),
  };
}

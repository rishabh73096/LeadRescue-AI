"use client";

import { useSyncExternalStore } from "react";

type Connection = { effectiveType?: string; saveData?: boolean; downlink?: number; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void };

const connection = (): Connection | undefined => (typeof navigator === "undefined" ? undefined : (navigator as Navigator & { connection?: Connection }).connection);

// "Slow" = Data Saver is on, or the browser reports 3G or worse / under 1.5 Mbps.
export function isSlowNetwork(): boolean {
  const c = connection();
  if (!c) return false;
  return Boolean(c.saveData) || ["slow-2g", "2g", "3g"].includes(c.effectiveType ?? "") || (c.downlink !== undefined && c.downlink > 0 && c.downlink < 1.5);
}

export function subscribeNetwork(cb: () => void) {
  const c = connection();
  c?.addEventListener?.("change", cb);
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    c?.removeEventListener?.("change", cb);
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

export const useSlowNetwork = () => useSyncExternalStore(subscribeNetwork, isSlowNetwork, () => false);

// Retries a flaky request a couple of times with a short back-off before giving up.
export async function withRetry<T>(run: () => PromiseLike<T>, isFailure: (r: T) => boolean, tries = 3): Promise<T> {
  let last = await run();
  for (let i = 1; i < tries && isFailure(last); i++) {
    await new Promise((r) => setTimeout(r, 500 * i * i));
    last = await run();
  }
  return last;
}

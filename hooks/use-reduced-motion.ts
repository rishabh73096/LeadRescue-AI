"use client";

import { useSyncExternalStore } from "react";
import { isSlowNetwork, subscribeNetwork } from "@/lib/network";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  const off = subscribeNetwork(onChange);
  return () => {
    mql.removeEventListener("change", onChange);
    off();
  };
}

// True when the user asked for less motion, or the connection is slow (lite mode skips decorative animation).
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches || isSlowNetwork(),
    () => false,
  );
}

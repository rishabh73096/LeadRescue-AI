"use client";

import { useSyncExternalStore } from "react";

const tick = (cb: () => void) => {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
};
const snapshot = () => Math.floor(Date.now() / 60_000) * 60_000;

export const useNow = () => useSyncExternalStore(tick, snapshot, () => 0);

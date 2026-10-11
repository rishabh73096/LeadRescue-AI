"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Spinner } from "@/components/ui/spinner";
import { apiActivity } from "@/lib/api";

const SHOW_AFTER_MS = 250;
const HIDE_AFTER_MS = 350;

export function GlobalLoader() {
  const pending = useSyncExternalStore(apiActivity.subscribe, apiActivity.getSnapshot, () => 0);
  const busy = pending > 0;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(busy), busy ? SHOW_AFTER_MS : HIDE_AFTER_MS);
    return () => clearTimeout(timer);
  }, [busy]);

  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" aria-label="Working">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[300] h-[3px] overflow-hidden bg-brand/15">
        <span className="api-progress-bar bg-brand-gradient block h-full w-1/3 rounded-full" />
      </div>
      <div className="pointer-events-none fixed right-5 bottom-5 z-[300] flex items-center gap-2.5 rounded-full bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
        <Spinner className="size-3.5 text-white" />
        Working…
      </div>
    </div>
  );
}

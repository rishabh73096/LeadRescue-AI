"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Gauge, RotateCw, WifiOff } from "lucide-react";
import { useOnline } from "@/hooks/use-online";
import { useSlowNetwork } from "@/lib/network";
import { cn } from "@/lib/utils";

// Floating notice: "No internet connection" while offline, "Back online" for a moment after it returns.
export function OfflineNotice() {
  const online = useOnline();
  const slow = useSlowNetwork();
  const [slowDismissed, setSlowDismissed] = useState(false);

  // Lite mode: lets CSS switch off decorative animation on slow connections
  useEffect(() => {
    document.documentElement.toggleAttribute("data-lite", slow);
  }, [slow]);
  const [showBack, setShowBack] = useState(false);
  const [checking, setChecking] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      return;
    }
    if (!wasOffline.current) return;
    wasOffline.current = false;
    const show = setTimeout(() => setShowBack(true), 0);
    const hide = setTimeout(() => setShowBack(false), 2800);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [online]);

  // navigator.onLine can lie (connected to wifi but no internet), so "Retry" does a real request.
  const retry = async () => {
    setChecking(true);
    try {
      await fetch(`/icon.svg?ping=${Date.now()}`, { cache: "no-store" });
      window.location.reload();
    } catch {
      // still offline
    } finally {
      setChecking(false);
    }
  };

  if (online && !showBack) {
    if (!slow || slowDismissed) return null;
    return (
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex justify-center px-4">
        <div className="animate-in fade-in slide-in-from-bottom-4 pointer-events-auto flex items-center gap-3 rounded-full bg-[#0b1026] py-2.5 pr-2.5 pl-4 text-sm font-semibold text-white shadow-2xl duration-300">
          <span className="flex size-6 items-center justify-center rounded-full bg-amber-400 text-[#0b1026]"><Gauge className="size-3.5" /></span>
          <span>
            Slow connection
            <span className="hidden font-normal text-slate-300 sm:inline"> · lite mode on, animations paused</span>
          </span>
          <button type="button" onClick={() => setSlowDismissed(true)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs transition-all hover:bg-white/20 active:scale-95">Got it</button>
        </div>
      </div>
    );
  }

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex justify-center px-4">
      <div
        className={cn(
          "animate-in fade-in slide-in-from-bottom-4 pointer-events-auto flex items-center gap-3 rounded-full py-2.5 pr-3 pl-4 text-sm font-semibold text-white shadow-2xl duration-300",
          online ? "bg-[#1f7a4a]" : "bg-[#0b1026]",
        )}
      >
        {online ? (
          <>
            <CheckCircle2 className="size-4" /> Back online
          </>
        ) : (
          <>
            <span className="relative flex size-7 items-center justify-center rounded-full bg-[#e5484d]">
              <WifiOff className="size-3.5" />
              <span aria-hidden className="dot-ping absolute inset-0 rounded-full bg-[#e5484d]" />
            </span>
            <span>
              No internet connection
              <span className="hidden font-normal text-slate-300 sm:inline"> · changes won&apos;t save until you&apos;re back</span>
            </span>
            <button type="button" onClick={retry} disabled={checking} className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs transition-all hover:bg-white/20 active:scale-95 disabled:opacity-60">
              <RotateCw className={cn("size-3", checking && "animate-spin")} /> Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}

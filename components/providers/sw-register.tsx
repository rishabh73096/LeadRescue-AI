"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Registers the offline service worker and tells it which page is open, so every page you visit
// can be opened again with no internet.
export function SwRegister() {
  const pathname = usePathname();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !navigator.onLine) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.active?.postMessage({ type: "CACHE_URL", url: `${window.location.pathname}${window.location.search}` }))
      .catch(() => {});
  }, [pathname]);

  return null;
}

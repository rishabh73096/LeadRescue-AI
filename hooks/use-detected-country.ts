"use client";

import { useEffect, useState } from "react";
import { DEFAULT_COUNTRY, getCountry } from "@/lib/countries";

const CACHE_KEY = "geo:country";
const CACHE_MS = 7 * 24 * 60 * 60 * 1000;

function fromLocale(): string | null {
  try {
    const locale = new Intl.Locale(navigator.language);
    return (locale.region ?? locale.maximize().region) || null;
  } catch {
    return null;
  }
}

async function fromIp(signal: AbortSignal): Promise<string | null> {
  const sources: Array<[string, (j: Record<string, unknown>) => unknown]> = [
    ["https://ipwho.is/", (j) => j.country_code],
    ["https://ipapi.co/json/", (j) => j.country_code],
  ];
  for (const [url, pick] of sources) {
    try {
      const res = await fetch(url, { signal });
      if (!res.ok) continue;
      const code = pick(await res.json());
      if (typeof code === "string" && getCountry(code)) return code.toUpperCase();
    } catch {
      if (signal.aborted) return null;
    }
  }
  return null;
}

export function useDetectedCountry(): string {
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY);

  useEffect(() => {
    let cached: { code: string; at: number } | null = null;
    try {
      cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    } catch {}
    if (cached && Date.now() - cached.at < CACHE_MS && getCountry(cached.code)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the browser-only cache after mount
      setCountry(cached.code);
      return;
    }

    const guess = fromLocale();
    if (guess && getCountry(guess)) setCountry(guess.toUpperCase());

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    fromIp(controller.signal).then((code) => {
      clearTimeout(timeout);
      if (!code) return;
      setCountry(code);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ code, at: Date.now() }));
      } catch {}
    });
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return country;
}

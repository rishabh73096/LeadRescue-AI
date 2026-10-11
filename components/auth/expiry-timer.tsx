"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function ExpiryTimer({ seconds }: { seconds: number }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <p className="flex items-center gap-2 text-xs text-slate-500">
      <Clock className="size-3.5" />
      {left > 0 ? (
        <>
          Expires in <span className="text-brand font-semibold tabular-nums">{mm}:{ss}</span>
        </>
      ) : (
        "This code has expired — request a new one."
      )}
    </p>
  );
}

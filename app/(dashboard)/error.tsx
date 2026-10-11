"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50svh] flex-col items-center justify-center gap-4 text-center">
      <span className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-full"><TriangleAlert className="size-6" /></span>
      <h1 className="text-xl font-extrabold text-ink">This page couldn&apos;t load</h1>
      <p className="max-w-sm text-sm text-slate-500">Something unexpected happened. Your data is safe — try again, and if it keeps happening, reload the page.</p>
      <Button type="button" variant="brand" size="action" onClick={reset}>Try again</Button>
    </div>
  );
}

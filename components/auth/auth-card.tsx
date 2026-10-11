import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Card className={cn("w-full max-w-[500px] gap-0 overflow-visible rounded-3xl bg-white py-0 shadow-[0_10px_40px_-12px_rgba(15,157,117,0.18)] ring-0", className)}>
      <CardContent className="p-8 sm:p-9">{children}</CardContent>
    </Card>
  );
}

export function AuthHeading({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-[27px] leading-tight font-bold tracking-tight text-slate-900">{title}</h1>
      {description ? <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p> : null}
    </div>
  );
}

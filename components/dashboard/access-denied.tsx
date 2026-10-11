import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AccessDenied() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <Lock className="size-6" />
      </span>
      <h1 className="mt-5 text-2xl font-extrabold text-ink">You don&apos;t have access to this section</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">Your role doesn&apos;t include this page. Contact a super admin if you need it.</p>
      <Link href="/dashboard" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "mt-6 rounded-full")}>
        Back to dashboard
      </Link>
    </div>
  );
}

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthSubmit({ children, className, loading, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button type="submit" variant="brand" size="xl" loading={loading} className={cn("h-12 w-full rounded-xl text-sm font-semibold shadow-md shadow-brand/20", className)} {...props}>
      {children}
      {loading ? null : <ArrowRight className="size-4" />}
    </Button>
  );
}

export function AuthLinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className={cn(buttonVariants({ variant: "brand", size: "xl" }), "h-12 w-full rounded-xl text-sm font-semibold shadow-md shadow-brand/20")}>
      {children}
      <ArrowRight className="size-4" />
    </a>
  );
}

export function AuthOutlineButton({ children, href, disabled, className }: { children: ReactNode; href?: string; disabled?: boolean; className?: string }) {
  const classes = cn("h-11 w-full rounded-xl border-slate-200 bg-white text-xs text-slate-700 hover:border-brand hover:bg-white hover:text-brand", className);
  if (href && !disabled) {
    return (
      <Link href={href} className={cn(buttonVariants({ variant: "outline" }), classes)}>
        {children}
      </Link>
    );
  }
  return (
    <Button type="button" variant="outline" disabled className={classes}>
      {children}
    </Button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="h-px flex-1 bg-slate-200" />
      <span className="text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">{label}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

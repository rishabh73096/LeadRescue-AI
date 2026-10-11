"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/spinner";
import { GUARDS_ENABLED } from "@/config/auth";
import { useAuthState } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { usePlatformAdmin } from "@/services/admin";

// UI gate only. Real protection is Supabase RLS (see supabase/migrations/0002_admin.sql).
export function AdminGate({ children }: { children: ReactNode }) {
  return GUARDS_ENABLED ? <Guard>{children}</Guard> : <>{children}</>;
}

function Guard({ children }: { children: ReactNode }) {
  const { user, status, signOut } = useAuthState();
  const router = useRouter();
  const pathname = usePathname();
  const admin = usePlatformAdmin(user?._id);

  useEffect(() => {
    if (status === "guest") router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [status, router, pathname]);

  if (status !== "authenticated" || admin === null) return <PageLoader label="Checking access…" />;
  if (admin) return <>{children}</>;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-white px-6 text-center">
      <span className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-2xl"><Lock className="size-6" /></span>
      <h1 className="mt-5 text-2xl font-extrabold text-ink">This account is not an admin</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">The admin console is for the platform owner only. Customers sign in to their workspace instead.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "brand", size: "xl" }), "rounded-full px-6")}>Go to my workspace</Link>
        <Button type="button" variant="panel" size="xl" className="rounded-full px-6" onClick={async () => { await signOut(); router.replace("/admin/login"); }}>Sign in as admin</Button>
      </div>
    </div>
  );
}

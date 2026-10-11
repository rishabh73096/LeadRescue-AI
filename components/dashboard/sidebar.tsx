"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Headset } from "lucide-react";
import { NAV_ITEMS } from "@/config/navigation";
import { useRole } from "@/hooks/use-role";
import { useAuthState } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/types/dashboard";

export function Sidebar({ data, onNavigate }: { data: DashboardData; onNavigate?: () => void }) {
  const pathname = usePathname();
  const { help } = data;
  const { role } = useRole();
  const { user } = useAuthState();
  const displayName = user?.businessName || user?.fullName || data.account.name;

  return (
    <div className="flex min-h-full flex-col gap-4 p-5">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#0b1026] text-lg font-bold text-white">{displayName[0] || "A"}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink">{displayName}</p>
          <span className="mt-0.5 inline-flex items-center rounded-full bg-[#e8f0fe] px-2 py-0.5 text-[10px] font-medium text-[#1a73e8]">{ROLE_LABELS[role]}</span>
        </div>
      </div>

      <nav aria-label="Dashboard" className="flex flex-col">
        {NAV_ITEMS.filter((item) => item.roles.includes(role)).map(({ label, href, icon: Icon, gap }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3.5 rounded-xl px-4 py-3 text-[14px] transition-colors",
                gap && "mt-4",
                active ? "bg-[#e1f5ee] font-semibold text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-ink",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="flex-1 truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-brand/10 bg-[#ebf8f3] p-5 text-center">
        <span className="bg-brand/10 text-brand mx-auto flex size-11 items-center justify-center rounded-full">
          <Headset className="size-5" />
        </span>
        <p className="mt-3 text-sm font-bold text-ink">{help.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{help.description}</p>
        <Link href={help.href} onClick={onNavigate} className="text-brand mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-brand/30 bg-white text-sm font-semibold hover:bg-brand/5">
          {help.cta} <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

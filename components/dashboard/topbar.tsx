"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Bell, ChevronDown, LogIn, LogOut, Menu, PanelLeftClose, PanelLeftOpen, RotateCw, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/dashboard/global-search";
import { LogoMark } from "@/components/ui/logo-mark";
import { Avatar } from "@/components/ui/avatar";
import { useAuthState } from "@/context/AuthContext";
import { useRole } from "@/hooks/use-role";
import { ROLE_LABELS } from "@/lib/roles";
import { useEscapeKey } from "@/hooks/use-escape-key";
import type { NavArea } from "@/config/navigation";
import { notify } from "@/lib/toast";
import { BRAND } from "@/config/site";
import type { DashboardData } from "@/types/dashboard";

export function Topbar({ data, menuOpen, onMenu, collapsed, onToggleCollapse, area = "workspace" }: { data: DashboardData; menuOpen: boolean; onMenu: () => void; collapsed?: boolean; onToggleCollapse?: () => void; area?: NavArea }) {
  const isAdminArea = area === "admin";
  const router = useRouter();
  const { user, signOut, refresh } = useAuthState();
  const [account, setAccount] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  useEscapeKey(() => setAccount(false), account);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      if (typeof refresh === "function") {
        await refresh();
      }
      router.refresh();
      window.dispatchEvent(new CustomEvent("app:refresh"));
      notify.info("Page refreshed");
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 600);
    }
  };

  const name = user?.fullName || (isAdminArea ? "Platform admin" : data.account.name);
  const { role } = useRole();
  const roleLabel = isAdminArea ? "Platform admin" : ROLE_LABELS[role];

  return (
    <header className="sticky top-0 z-50 flex h-[66px] items-center gap-3 bg-[#0b1026] px-4 text-white sm:gap-5 sm:px-6">
      <button type="button" onClick={onMenu} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="dashboard-sidebar" className="-ml-1 flex size-9 items-center justify-center rounded-lg hover:bg-white/10 lg:hidden">
        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <button type="button" onClick={onToggleCollapse} aria-label={collapsed ? "Show sidebar" : "Hide sidebar"} aria-expanded={!collapsed} aria-controls="dashboard-sidebar" className="-ml-1 hidden size-9 items-center justify-center rounded-lg hover:bg-white/10 lg:flex">
        {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
      </button>

      <Link href={isAdminArea ? "/admin" : "/dashboard"} aria-label={`${BRAND.name} ${isAdminArea ? "admin console" : "dashboard"}`} className="group flex shrink-0 items-center gap-2.5">
        <LogoMark className="size-10" />
        <span className="hidden text-[21px] font-bold tracking-tight min-[400px]:inline">
          {BRAND.prefix}<span className="text-brand-bright">{BRAND.accent}</span>
        </span>
      </Link>
      {isAdminArea ? <span className="hidden shrink-0 rounded-full bg-amber-400/15 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-300 uppercase sm:inline">Admin console</span> : null}

      <GlobalSearch area={area} className="mx-auto hidden w-full max-w-[614px] md:block" />

      <div className="ml-auto flex items-center gap-2 sm:gap-3 md:ml-0">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          title="Refresh page data"
          aria-label="Refresh page data"
          className="group flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 text-xs font-semibold text-slate-200 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <RotateCw className={cn("size-3.5 transition-transform duration-500 group-hover:rotate-180", refreshing && "animate-spin text-brand-bright")} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button type="button" aria-label="Search" aria-expanded={mobileSearch} onClick={() => setMobileSearch((v) => !v)} className="flex size-9 items-center justify-center rounded-full hover:bg-white/10 md:hidden">
          <Search className="size-4" />
        </button>
        <button type="button" aria-label={`Notifications (${data.badges.notifications} unread)`} className="group relative flex size-9 items-center justify-center rounded-full hover:bg-white/10 active:scale-90">
          <Bell className="bell-shake size-4" />
          {data.badges.notifications ? <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-[#e5484d] text-[10px] font-semibold">{data.badges.notifications}</span> : null}
        </button>
        <span aria-hidden className="hidden h-7 w-px bg-white/15 sm:block" />

        <div className="relative">
          <button type="button" onClick={() => setAccount((v) => !v)} aria-haspopup="menu" aria-expanded={account} className="group flex items-center gap-3 rounded-full py-1 pr-1 pl-1 transition-transform hover:bg-white/10 active:scale-[0.97] sm:pr-2">
            <Avatar name={name} src={data.account.avatar} className="size-10 text-sm ring-2 ring-white/20" />
            <span className="hidden text-left leading-tight sm:block">
              <span className="block max-w-[140px] truncate text-sm font-semibold">{name}</span>
              <span className="block text-xs text-slate-400 ">{roleLabel}</span>
            </span>
            <ChevronDown className={cn("hidden size-4 text-slate-300 transition-transform duration-200 sm:block", account && "rotate-180")} />
          </button>
          {account ? (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setAccount(false)} aria-hidden />
              <div role="menu" className="animate-in fade-in zoom-in-95 slide-in-from-top-1 absolute right-0 z-20 mt-2 w-52 origin-top-right overflow-hidden rounded-xl bg-white py-1 text-sm text-slate-700 shadow-xl ring-1 ring-slate-100 duration-150">
                                {user ? (
                  <button type="button" role="menuitem" onClick={() => { signOut(); setAccount(false); }} className="flex w-full items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                    <LogOut className="size-4" /> Sign out
                  </button>
                ) : (
                  <Link href="/login" role="menuitem" className="flex items-center gap-2 px-4 py-2.5 hover:bg-slate-50">
                    <LogIn className="size-4" /> Sign in
                  </Link>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
      {mobileSearch ? (
        <div className="absolute inset-x-0 top-full border-t border-white/10 bg-[#0b1026] p-3 md:hidden">
          <GlobalSearch area={area} onNavigate={() => setMobileSearch(false)} />
        </div>
      ) : null}
    </header>
  );
}

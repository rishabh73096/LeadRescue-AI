"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AccessDenied } from "@/components/dashboard/access-denied";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { navItemFor } from "@/config/navigation";
import { useRole } from "@/hooks/use-role";
import { dashboardData } from "@/data/dashboard";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { role } = useRole();
  const allowed = navItemFor(pathname)?.roles.includes(role) ?? true;
  const close = () => setOpen(false);

  useLockBodyScroll(open);
  useEscapeKey(close, open);

  return (
    <div className={"min-h-svh bg-white"}>
      <Topbar data={dashboardData} menuOpen={open} onMenu={() => setOpen((v) => !v)} />
      <div className="lg:grid lg:grid-cols-[290px_minmax(0,1fr)]">
        <div onClick={close} aria-hidden className={`fixed inset-0 top-[66px] z-30 bg-slate-900/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
        <aside
          id="dashboard-sidebar"
          className={`fixed top-[66px] bottom-0 left-0 z-40 w-[290px] max-w-[85vw] overflow-y-auto border-r border-slate-100 bg-white transition-transform duration-200 lg:sticky lg:z-10 lg:h-[calc(100svh-66px)] lg:max-w-none lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar data={dashboardData} onNavigate={close} />
        </aside>
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-7 lg:py-7">{allowed ? children : <AccessDenied />}</main>
      </div>
    </div>
  );
}

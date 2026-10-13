"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageSkeleton } from "@/components/dashboard/page-skeleton";
import { AccessDenied } from "@/components/dashboard/access-denied";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { navItemFor, type NavArea } from "@/config/navigation";
import { useRole } from "@/hooks/use-role";
import { createLocalStore } from "@/lib/local-store";
import { dashboardData } from "@/data/dashboard";

// Desktop sidebar collapse, remembered per browser.
const collapsedStore = createLocalStore<boolean>("sidebar-collapsed", false);

export function DashboardShell({ children, area = "workspace" }: { children: ReactNode; area?: NavArea }) {
  const [open, setOpen] = useState(false);
  const collapsed = collapsedStore.use();
  const pathname = usePathname();
  const { role, ready } = useRole();
  const allowed = area === "admin" ? true : navItemFor(pathname)?.roles.includes(role) ?? true;
  const close = () => setOpen(false);

  useLockBodyScroll(open);
  useEscapeKey(close, open);

  return (
    <div className={"min-h-svh bg-white"}>
      <Topbar data={dashboardData} menuOpen={open} onMenu={() => setOpen((v) => !v)} area={area} collapsed={collapsed} onToggleCollapse={() => collapsedStore.set(!collapsed)} />
      <div className={`mx-auto w-full max-w-[1520px] ${collapsed ? "lg:grid lg:grid-cols-1" : "lg:grid lg:grid-cols-[290px_minmax(0,1fr)]"}`}>
        <div onClick={close} aria-hidden className={`fixed inset-0 top-[66px] z-30 bg-slate-900/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
        <aside
          id="dashboard-sidebar"
          className={`fixed top-[66px] bottom-0 left-0 z-40 w-[290px] max-w-[85vw] overflow-y-auto border-r border-slate-100 bg-white transition-transform duration-200 lg:sticky lg:z-10 lg:h-[calc(100svh-66px)] lg:max-w-none lg:translate-x-0 lg:animate-in lg:fade-in lg:slide-in-from-left-4 lg:duration-200 ${collapsed ? "lg:hidden" : ""} ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar data={dashboardData} area={area} onNavigate={close} />
        </aside>
        <main className="min-w-0 px-4 py-5 sm:px-6 lg:px-7 lg:py-7">{!ready ? <PageSkeleton /> : allowed ? children : <AccessDenied />}</main>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type NavLink = { label: string; href: string };

// Desktop: Kobra's Navigation Menu (a highlight pill glides between the links).
export function DesktopNav({ links }: { links: NavLink[] }) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {links.map((l) => (
          <NavigationMenuItem key={l.href}>
            <NavigationMenuLink render={<Link href={l.href} />} className={cn(navigationMenuTriggerStyle(), "text-slate-600 hover:text-ink")}>
              {l.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

// Phones had no way to reach Features / Pricing / FAQ, so they get a simple dropdown menu.
export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="landing-mobile-menu" onClick={() => setOpen((v) => !v)} className="flex size-10 items-center justify-center rounded-full bg-[#f1f1f2] text-ink transition-transform active:scale-90">
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 top-16 z-40 bg-slate-900/30" onClick={() => setOpen(false)} aria-hidden />
          <nav id="landing-mobile-menu" aria-label="Menu" className="animate-in fade-in slide-in-from-top-2 absolute inset-x-0 top-full z-50 border-b border-slate-100 bg-white px-5 py-4 shadow-xl duration-200">
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-[15px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-ink active:bg-slate-100">{l.label}</Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/login" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-50">Sign in</Link>
              </li>
            </ul>
          </nav>
        </>
      ) : null}
    </div>
  );
}

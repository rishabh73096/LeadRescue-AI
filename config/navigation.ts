import type { Role } from "@/config/auth";
import type { Feature } from "@/lib/plans";
import { CalendarClock, ContactRound, House, KanbanSquare, MessageSquareText, Repeat, Settings, ShieldCheck, Tag, UploadCloud, Users, Wallet, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  gap?: boolean;
  /** Platform-admin only (the SaaS owner), not a workspace role. */
  admin?: boolean;
  /** Needs this plan feature; the item shows a "Pro" tag when the plan lacks it. */
  feature?: Feature;
  keywords?: string[];
}

const ALL: Role[] = ["owner", "admin", "staff"];
const EVERYONE: Role[] = ["owner", "admin", "staff", "user"];
const MANAGERS: Role[] = ["owner", "admin"];

// Planned sections. Pages are not built yet; see docs/ARCHITECTURE.md.
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", roles: ALL, href: "/dashboard", icon: House, keywords: "home overview today overdue".split(" ") },
  { label: "Leads", roles: ALL, href: "/leads", icon: ContactRound, keywords: "leads enquiries customers contacts".split(" ") },
  { label: "Pipeline", roles: ALL, href: "/pipeline", icon: KanbanSquare, keywords: "pipeline stages new contacted quote won lost".split(" ") },
  { label: "Follow-ups", roles: ALL, href: "/follow-ups", icon: CalendarClock, keywords: "follow ups reminders overdue due".split(" ") },
  { label: "AI Replies", feature: "aiReplies", roles: ALL, href: "/replies", icon: MessageSquareText, keywords: "ai replies drafts hindi english templates".split(" ") },
  { label: "Import Leads", roles: MANAGERS, href: "/import", icon: UploadCloud, gap: true, keywords: "import csv upload".split(" ") },
  { label: "Settings", roles: MANAGERS, href: "/settings", icon: Settings, keywords: "settings workspace services pricing usage".split(" ") },
  { label: "Overview", roles: EVERYONE, admin: true, href: "/admin", icon: ShieldCheck, keywords: "admin platform overview revenue".split(" ") },
  { label: "Payments", roles: EVERYONE, admin: true, href: "/admin/payments", icon: Wallet, keywords: "payments upi utr verify".split(" ") },
  { label: "Customers", roles: EVERYONE, admin: true, href: "/admin/customers", icon: Users, keywords: "customers users accounts".split(" ") },
  { label: "Subscriptions", roles: EVERYONE, admin: true, href: "/admin/subscriptions", icon: Repeat, keywords: "subscriptions renew expiring".split(" ") },
  { label: "Plans", roles: EVERYONE, admin: true, href: "/admin/plans", icon: Tag, keywords: "plans pricing upi".split(" ") },
];

export type NavArea = "workspace" | "admin";

// The customer workspace and the platform-admin console are separate areas with separate menus.
export const visibleNav = (role: Role, area: NavArea = "workspace") => NAV_ITEMS.filter((i) => (area === "admin" ? i.admin : !i.admin && i.roles.includes(role)));

export const navItemFor = (pathname: string) =>
  NAV_ITEMS.filter((i) => (i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(`${i.href}/`))).sort((a, b) => b.href.length - a.href.length)[0];

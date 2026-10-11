import type { Role } from "@/config/auth";
import { CalendarClock, ContactRound, House, KanbanSquare, MessageSquareText, Settings, UploadCloud, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  gap?: boolean;
  keywords?: string[];
}

const ALL: Role[] = ["owner", "admin", "staff"];
const MANAGERS: Role[] = ["owner", "admin"];

// Planned sections. Pages are not built yet; see docs/ARCHITECTURE.md.
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", roles: ALL, href: "/dashboard", icon: House, keywords: "home overview today overdue".split(" ") },
  { label: "Leads", roles: ALL, href: "/leads", icon: ContactRound, keywords: "leads enquiries customers contacts".split(" ") },
  { label: "Pipeline", roles: ALL, href: "/pipeline", icon: KanbanSquare, keywords: "pipeline stages new contacted quote won lost".split(" ") },
  { label: "Follow-ups", roles: ALL, href: "/follow-ups", icon: CalendarClock, keywords: "follow ups reminders overdue due".split(" ") },
  { label: "AI Replies", roles: ALL, href: "/replies", icon: MessageSquareText, keywords: "ai replies drafts hindi english templates".split(" ") },
  { label: "Import Leads", roles: MANAGERS, href: "/import", icon: UploadCloud, gap: true, keywords: "import csv upload".split(" ") },
  { label: "Settings", roles: MANAGERS, href: "/settings", icon: Settings, keywords: "settings workspace services pricing usage".split(" ") },
];

export const navItemFor = (pathname: string) =>
  NAV_ITEMS.filter((i) => (i.href === "/" ? pathname === "/" : pathname === i.href || pathname.startsWith(`${i.href}/`))).sort((a, b) => b.href.length - a.href.length)[0];

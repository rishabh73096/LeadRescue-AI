import { Bell, CalendarClock, ClipboardCheck, Clock, FileSpreadsheet, Globe, Inbox, Mail, MessageCircle, ShieldCheck, Sparkles, Upload, UserRoundCheck, Users } from "lucide-react";
import type { LandingContent } from "@/types/landing";

export const LANDING: LandingContent = {
  headline: [
    { text: "Rescue every", tiles: [{ icon: Mail, bg: "#0f9d75" }, { icon: MessageCircle, bg: "#0e1116" }] },
    { text: "enquiry before", tiles: [{ icon: Clock, bg: "#f59f00" }, { icon: Bell, bg: "#e8590c" }] },
    { text: "it goes cold.", muted: true },
  ],
  subhead: "Track every lead, get AI-drafted replies in English and Hindi, and see exactly who needs a follow-up today. Built for cleaning companies and small service teams.",
  heroNote: "Drafts and reminders only. You stay in control of every message.",
  flow: {
    title: "Every enquiry. One list.",
    sub: "Website forms, emails and WhatsApp chats land in one place. Reply, follow up, or let a quote go cold on purpose.",
    sources: [
      { name: "Website form", meta: "12 new this week", icon: Globe, color: "#0f9d75" },
      { name: "Email", meta: "7 new this week", icon: Mail, color: "#e8590c" },
      { name: "WhatsApp", meta: "9 logged by hand", icon: MessageCircle, color: "#16a34a" },
      { name: "CSV import", meta: "40 leads imported", icon: FileSpreadsheet, color: "#0e1116" },
    ],
    panel: {
      title: "Today's follow-ups",
      scope: "All sources",
      badge: "3 OVERDUE",
      pinned: "Quote follow-ups are due at 24h and 48h",
      rows: [
        { name: "Meera Kapoor", text: "Quote sent 48h ago, no reply", source: 2 },
        { name: "Sunrise Salon", text: "Asked about weekly cleaning", source: 0 },
        { name: "Arjun Mehta", text: "Wants a deep clean this Saturday", source: 1 },
        { name: "Neha Agarwal", text: "Imported, never contacted", source: 3 },
      ],
      placeholder: "Draft a reply in English or Hindi…",
    },
  },
  bento: {
    title: "Built for the follow-up, not the inbox.",
    sub: "Simple on purpose. No CRM migration, no bulk messaging.",
    items: [
      { type: "hero", title: "Every enquiry in one place.", desc: "Nothing waits in someone's inbox or a forgotten chat.", chips: [Mail, Globe, MessageCircle, Upload], stat: { value: "1", label: "list for every enquiry" } },
      { type: "mock", title: "New to Won. Four clear stages.", desc: "Move a lead forward in one click.", blocks: [{ label: "New", grow: 3 }, { label: "Contacted", grow: 3 }, { label: "Quote sent", grow: 2 }, { label: "Won", grow: 1 }] },
      { type: "stat", value: "24h", title: "First nudge", desc: "A reminder if a new lead goes quiet." },
      { type: "stat", value: "48h", title: "Quote follow-up", desc: "Never let a sent quote go cold.", dark: true },
      { type: "chips", title: "Works with how you work.", desc: "Add leads by hand, paste a CSV, or log chats as they happen.", chips: [{ icon: Users, label: "Add by hand" }, { icon: FileSpreadsheet, label: "CSV import" }, { icon: Mail, label: "Email" }, { icon: MessageCircle, label: "WhatsApp log" }] },
      { type: "wave", icon: Sparkles, title: "Sounds like you.", desc: "Drafts use your service, price range and the customer's message." },
      { type: "icon", icon: ShieldCheck, title: "You press send.", desc: "Drafts and reminders only. Nothing goes out on its own." },
      { type: "mock", title: "English or Hindi.", desc: "Pick the language per customer.", blocks: [{ label: "EN", grow: 2 }, { label: "हिन्दी", grow: 2 }] },
      { type: "pills", title: "Know what needs you. At a glance.", desc: "One status for every lead.", pills: [{ label: "Overdue", color: "#e5484d" }, { label: "Due today", color: "#f59f00" }, { label: "Waiting", color: "#8b8f98" }, { label: "Won", color: "#0f9d75" }] },
      { type: "footer", icon: UserRoundCheck, title: "Made for small teams.", desc: "Cleaning companies, salons and small agencies. Start with a CSV, no migration." },
    ],
  },
  audience: {
    eyebrow: "Cleaning companies, salons and small agencies",
    title: "Made for teams",
    titleMuted: "who lose leads to busy days.",
    cards: [
      { who: "Cleaning company", role: "Website form and WhatsApp enquiries", scenario: "30 enquiries come in. Five never get a reply. LeadRescue lists those five first, with a draft ready.", icon: Inbox },
      { who: "Salon owner", role: "Bookings by DM and phone", scenario: "A bridal enquiry was quoted on Monday. On Wednesday the reminder appears with a polite Hindi follow-up.", icon: CalendarClock },
      { who: "Small agency", role: "Proposals sent by email", scenario: "Import last quarter's leads from a CSV and see which proposals never got an answer.", icon: ClipboardCheck },
    ],
  },
  pricing: {
    title: "Pick a plan.",
    sub: "Start small. Upgrade when the follow-ups start paying for it.",
    plans: [
      { name: "Starter", tagline: "For one owner managing leads.", price: "₹499", features: ["Lead list and pipeline", "CSV import", "Follow-up dates", "Activity history"] },
      { name: "Pro", tagline: "For teams that reply fast.", price: "₹999", featured: true, features: ["Everything in Starter", "AI reply drafts, English and Hindi", "24h / 48h follow-up reminders", "Overdue dashboard"] },
    ],
  },
  faq: [
    { q: "Does it send WhatsApp messages for me?", a: "No. It drafts replies and reminds you. You copy and send them yourself, so there is no bulk messaging or unofficial automation." },
    { q: "Do I need to move my data into a new CRM?", a: "No. Start with a CSV import or add leads by hand." },
    { q: "Can it reply in Hindi?", a: "Yes. Pick English or Hindi per customer and edit the draft before you send." },
    { q: "Who is it for?", a: "Small service businesses such as cleaning companies, salons and agencies that get enquiries through forms, email and chat." },
  ],
  cta: { title: "Stop losing leads to a busy week.", sub: "Pick a plan and have your first overdue list in minutes." },
};

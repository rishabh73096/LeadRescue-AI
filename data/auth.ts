import type { AuthHeroData } from "@/types/content";

export const authHeroData: AuthHeroData = {
  headline: "Never lose an enquiry",
  headlineAccent: "to a forgotten follow-up",
  description: "Track every lead, get AI-drafted replies in English and Hindi, and see exactly who needs attention today.",
  categories: [
    { key: "pipeline", label: "Pipeline", caption: "New to Won in one view", icon: "layout-grid", tone: "blue", image: "/images/auth/pipeline.svg", fallback: "linear-gradient(160deg,#9fb4c9,#4b5d70)" },
    { key: "drafts", label: "AI Drafts", caption: "Editable reply suggestions", icon: "sparkles", tone: "purple", image: "/images/auth/drafts.svg", fallback: "linear-gradient(160deg,#5b4bb7,#2b2060)" },
    { key: "followups", label: "Follow-ups", caption: "24h / 48h quote reminders", icon: "clock", tone: "orange", image: "/images/auth/followups.svg", fallback: "linear-gradient(160deg,#c9893a,#6b4a2f)" },
    { key: "import", label: "CSV Import", caption: "No complex migration", icon: "file-text", tone: "teal", image: "/images/auth/import.svg", fallback: "linear-gradient(160deg,#6f8a4a,#2c4a3a)" },
    { key: "hindi", label: "Hindi + English", caption: "Reply in their language", icon: "message-circle", tone: "green", image: "/images/auth/hindi.svg", fallback: "linear-gradient(160deg,#274a78,#1f2733)" },
  ],
  trust: [
    { title: "Drafts, not spam", caption: "You approve every message", icon: "shield-check" },
    { title: "Simple setup", caption: "Live in under 10 minutes", icon: "zap" },
    { title: "Built for small teams", caption: "Cleaning, salons, agencies", icon: "shield-half" },
  ],
};

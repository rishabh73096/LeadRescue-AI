import { MailCheck } from "lucide-react";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010").replace(/\/$/, "");

export const BRAND = {
  icon: MailCheck,
  name: "LeadRescue AI",
  prefix: "LeadRescue",
  accent: " AI",
  tagline: "Recover forgotten enquiries",
  loginTagline: "See which enquiries need a reply today.",
  signupTagline: "Start recovering enquiries your team forgot to follow up.",
  appTitle: "LeadRescue AI",
};

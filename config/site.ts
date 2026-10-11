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

export const SEO = {
  title: `${BRAND.name}: Follow up every enquiry, in English and Hindi`,
  description: "Track every enquiry, get AI-drafted replies in English and Hindi, and see who needs a follow-up today. Simple lead follow-up software for cleaning companies, salons and small service businesses in India. From ₹499/month.",
  keywords: [
    "lead follow-up software India",
    "enquiry management software",
    "CRM for small business India",
    "WhatsApp lead follow-up",
    "AI reply drafts Hindi",
    "lead tracking for cleaning companies",
    "follow-up reminders",
    "small business CRM ₹499",
  ],
  locale: "en_IN",
  twitter: "",
};

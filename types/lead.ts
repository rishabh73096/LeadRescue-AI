export type LeadStatus = "new" | "contacted" | "quote_sent" | "won" | "lost";

export type LeadSource = "website" | "whatsapp" | "phone" | "email" | "referral" | "other";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: LeadSource;
  service: string;
  message: string;
  status: LeadStatus;
  value: number;
  nextFollowUpAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type LeadInput = Pick<Lead, "name" | "phone" | "email" | "source" | "service" | "message" | "value" | "nextFollowUpAt">;

export type ActivityType = "created" | "status" | "note" | "followup" | "draft" | "edit";

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  body: string;
  at: string;
}

export type Language = "en" | "hi";

export interface Draft {
  id: string;
  leadId: string;
  language: Language;
  text: string;
  createdAt: string;
}

export interface ServiceItem {
  name: string;
  price: string;
}

export interface WorkspaceSettings {
  businessName: string;
  language: Language;
  signature: string;
  services: ServiceItem[];
}

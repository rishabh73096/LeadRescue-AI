"use client";

import { createCollection } from "@/lib/collection";
import { logActivity } from "@/services/leads";
import type { Draft, Language } from "@/types/lead";

// Supabase table `drafts`. Falls back to localStorage when signed out or the table is missing.
const drafts = createCollection<Draft>({
  table: "drafts",
  localKey: "drafts",
  toRow: (d) => ({ id: d.id, lead_id: d.leadId, language: d.language, text: d.text, created_at: d.createdAt }),
  fromRow: (r) => ({ id: String(r.id), leadId: String(r.lead_id), language: r.language as Language, text: String(r.text), createdAt: String(r.created_at) }),
});

export function useDrafts(): Draft[] {
  return [...drafts.use().items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveDraft(leadId: string, language: Language, text: string): Draft {
  const draft: Draft = { id: crypto.randomUUID(), leadId, language, text, createdAt: new Date().toISOString() };
  drafts.insert([draft]);
  logActivity(leadId, "draft", `Reply drafted (${language === "hi" ? "Hindi" : "English"})`);
  return draft;
}

export const monthKey = (iso: string) => iso.slice(0, 7);

export const draftsThisMonth = (list: Draft[]) => list.filter((d) => monthKey(d.createdAt) === monthKey(new Date().toISOString())).length;

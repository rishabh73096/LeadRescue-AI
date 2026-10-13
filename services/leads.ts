"use client";

import { flash } from "@/lib/flash";
import { createCollection } from "@/lib/collection";
import { seedLeads } from "@/data/leads";
import { DAY_MS } from "@/lib/date";
import { statusMeta } from "@/lib/leads";
import type { Activity, ActivityType, Lead, LeadInput, LeadSource, LeadStatus } from "@/types/lead";

// Supabase tables `leads` and `activities` (supabase/migrations/0003_workspace_data.sql).
// Falls back to localStorage demo data when signed out or the tables don't exist yet.

const leads = createCollection<Lead>({
  table: "leads",
  localKey: "leads",
  seed: () => seedLeads(),
  toRow: (l) => ({ id: l.id, name: l.name, phone: l.phone, email: l.email, source: l.source, service: l.service, message: l.message, status: l.status, value: l.value, next_follow_up_at: l.nextFollowUpAt, created_at: l.createdAt, updated_at: l.updatedAt }),
  fromRow: (r) => ({ id: String(r.id), name: String(r.name), phone: String(r.phone ?? ""), email: String(r.email ?? ""), source: r.source as LeadSource, service: String(r.service ?? ""), message: String(r.message ?? ""), status: r.status as LeadStatus, value: Number(r.value ?? 0), nextFollowUpAt: r.next_follow_up_at ? String(r.next_follow_up_at) : null, createdAt: String(r.created_at), updatedAt: String(r.updated_at) }),
});

const activities = createCollection<Activity>({
  table: "activities",
  localKey: "activities",
  toRow: (a) => ({ id: a.id, lead_id: a.leadId, type: a.type, body: a.body, at: a.at }),
  fromRow: (r) => ({ id: String(r.id), leadId: String(r.lead_id), type: r.type as ActivityType, body: String(r.body), at: String(r.at) }),
});

const stamp = () => new Date().toISOString();
export const inDays = (n: number) => new Date(Date.now() + n * DAY_MS).toISOString();
const find = (id: string) => leads.get().find((l) => l.id === id);

export function useLeads() {
  const { items, loaded } = leads.use();
  return { leads: items, loaded };
}

export function useLead(id: string) {
  const { leads: all, loaded } = useLeads();
  return { lead: all.find((l) => l.id === id), loaded };
}

export function useActivities(leadId?: string) {
  const { items } = activities.use();
  const sorted = [...items].sort((a, b) => b.at.localeCompare(a.at));
  return leadId ? sorted.filter((a) => a.leadId === leadId) : sorted;
}

export function logActivity(leadId: string, type: ActivityType, body: string) {
  activities.insert([{ id: crypto.randomUUID(), leadId, type, body, at: stamp() }]);
}

export function addLead(input: LeadInput): Lead {
  const now = stamp();
  const lead: Lead = { ...input, id: crypto.randomUUID(), status: "new", createdAt: now, updatedAt: now };
  leads.insert([lead]);
  flash([lead.id]);
  logActivity(lead.id, "created", "Lead added");
  return lead;
}

export function addLeads(inputs: LeadInput[]): number {
  const now = stamp();
  const created = inputs.map((i): Lead => ({ ...i, id: crypto.randomUUID(), status: "new", createdAt: now, updatedAt: now }));
  if (created.length === 0) return 0;
  leads.insert(created);
  flash(created.map((l) => l.id));
  activities.insert(created.map((l): Activity => ({ id: crypto.randomUUID(), leadId: l.id, type: "created", body: "Imported from CSV", at: now })));
  return created.length;
}

export function updateLead(id: string, patch: Partial<LeadInput>) {
  leads.replace(id, (l) => ({ ...l, ...patch, updatedAt: stamp() }));
  flash([id]);
  logActivity(id, "edit", "Details updated");
}

export function setLeadStatus(id: string, status: LeadStatus) {
  const current = find(id);
  if (!current || current.status === status) return;
  leads.replace(id, (l) => ({ ...l, status, updatedAt: stamp(), nextFollowUpAt: status === "won" || status === "lost" ? null : l.nextFollowUpAt }));
  flash([id]);
  logActivity(id, "status", `Status changed to ${statusMeta(status).label}`);
}

export function setFollowUp(id: string, iso: string | null) {
  leads.replace(id, (l) => ({ ...l, nextFollowUpAt: iso, updatedAt: stamp() }));
  logActivity(id, "followup", iso ? `Follow-up set for ${new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : "Follow-up cleared");
}

// Mark the follow-up as done (customer was contacted) and schedule the next one.
export function completeFollowUp(id: string, nextInDays: number) {
  if (!find(id)) return;
  leads.replace(id, (l) => ({ ...l, status: l.status === "new" ? "contacted" : l.status, nextFollowUpAt: inDays(nextInDays), updatedAt: stamp() }));
  logActivity(id, "followup", `Follow-up done. Next in ${nextInDays} day${nextInDays > 1 ? "s" : ""}`);
}

export function addNote(id: string, text: string) {
  logActivity(id, "note", text);
  leads.replace(id, (l) => ({ ...l, updatedAt: stamp() }));
}

// Puts a deleted lead back (used by the Undo button). Its activity history cannot be restored.
export function restoreLead(lead: Lead) {
  leads.insert([lead]);
  flash([lead.id]);
  logActivity(lead.id, "created", "Lead restored");
}

export function deleteLead(id: string) {
  leads.remove([id]);
  // the database cascades; drop them from the local cache too
  activities.remove(activities.get().filter((a) => a.leadId === id).map((a) => a.id));
}

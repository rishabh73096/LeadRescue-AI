// What each plan includes. Keep in sync with config/landing.ts (pricing cards) and supabase/migrations/0006_plan_features.sql.
export type PlanName = "Starter" | "Pro";

export type Feature = "leads" | "pipeline" | "csvImport" | "followUps" | "activity" | "aiReplies" | "reminders" | "overdueDashboard";

export const FEATURE_LABELS: Record<Feature, string> = {
  leads: "Lead list",
  pipeline: "Pipeline board",
  csvImport: "CSV import",
  followUps: "Follow-up dates",
  activity: "Activity history",
  aiReplies: "AI reply drafts (English + Hindi)",
  reminders: "24h / 48h follow-up reminders",
  overdueDashboard: "Overdue dashboard",
};

const STARTER: Feature[] = ["leads", "pipeline", "csvImport", "followUps", "activity"];

export const PLAN_FEATURES: Record<PlanName, Feature[]> = {
  Starter: STARTER,
  Pro: [...STARTER, "aiReplies", "reminders", "overdueDashboard"],
};

export const ALL_FEATURES = Object.keys(FEATURE_LABELS) as Feature[];

// AI drafts per month
export const PLAN_AI_DRAFT_CAP: Record<PlanName, number> = { Starter: 0, Pro: 100 };

export const isPlanName = (v: unknown): v is PlanName => v === "Starter" || v === "Pro";
export const planHas = (plan: string | null | undefined, f: Feature) => (isPlanName(plan) ? PLAN_FEATURES[plan].includes(f) : false);
export const lowestPlanWith = (f: Feature): PlanName => (PLAN_FEATURES.Starter.includes(f) ? "Starter" : "Pro");

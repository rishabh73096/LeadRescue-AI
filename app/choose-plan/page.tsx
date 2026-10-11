import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/require-auth";
import { PlanPicker } from "@/components/landing/plan-picker";

export const metadata: Metadata = { title: "Choose your plan", robots: { index: false } };

export default async function ChoosePlanPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const { plan } = await searchParams;
  return (
    <RequireAuth>
      <PlanPicker preselect={plan} />
    </RequireAuth>
  );
}

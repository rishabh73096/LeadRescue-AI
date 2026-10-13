import type { Metadata } from "next";
import { FeatureGate } from "@/components/billing/feature-gate";
import { RepliesView } from "@/components/replies/replies-view";

export const metadata: Metadata = { title: "AI Replies" };

export default async function RepliesPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead } = await searchParams;
  return (
    <FeatureGate feature="aiReplies">
      <RepliesView initialLead={lead} />
    </FeatureGate>
  );
}

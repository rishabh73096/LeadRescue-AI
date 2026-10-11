import type { Metadata } from "next";
import { RepliesView } from "@/components/replies/replies-view";

export const metadata: Metadata = { title: "AI Replies" };

export default async function RepliesPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const { lead } = await searchParams;
  return <RepliesView initialLead={lead} />;
}

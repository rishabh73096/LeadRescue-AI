import type { Metadata } from "next";
import { House } from "lucide-react";
import { PagePlaceholder } from "@/components/dashboard/page-placeholder";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <PagePlaceholder title="Dashboard" description="Overview of today's work." icon={House} />;
}

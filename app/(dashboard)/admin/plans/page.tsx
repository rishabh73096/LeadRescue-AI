import type { Metadata } from "next";
import { PlansView } from "@/components/admin/admin-plans";

export const metadata: Metadata = { title: "Admin · Plans" };

export default function Page() {
  return <PlansView />;
}

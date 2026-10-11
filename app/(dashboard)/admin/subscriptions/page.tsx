import type { Metadata } from "next";
import { SubscriptionsView } from "@/components/admin/admin-subscriptions";

export const metadata: Metadata = { title: "Admin · Subscriptions" };

export default function Page() {
  return <SubscriptionsView />;
}

import type { Metadata } from "next";
import { PaymentsView } from "@/components/admin/admin-payments";

export const metadata: Metadata = { title: "Admin · Payments" };

export default function Page() {
  return <PaymentsView />;
}

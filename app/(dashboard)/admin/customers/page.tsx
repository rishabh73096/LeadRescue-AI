import type { Metadata } from "next";
import { CustomersView } from "@/components/admin/admin-customers";

export const metadata: Metadata = { title: "Admin · Customers" };

export default function Page() {
  return <CustomersView />;
}

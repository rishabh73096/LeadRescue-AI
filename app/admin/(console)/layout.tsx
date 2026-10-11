import type { ReactNode } from "react";
import { AdminGate } from "@/components/admin/admin-gate";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

// Platform-admin console: its own shell and menu, separate from the customer workspace.
export default function AdminConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGate>
      <DashboardShell area="admin">{children}</DashboardShell>
    </AdminGate>
  );
}

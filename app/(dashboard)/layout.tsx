import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { RequireAuth } from "@/components/auth/require-auth";
import { RequirePlan } from "@/components/auth/require-plan";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <RequireAuth>
        <RequirePlan>
          <DashboardShell>{children}</DashboardShell>
        </RequirePlan>
      </RequireAuth>
    </AuthProvider>
  );
}

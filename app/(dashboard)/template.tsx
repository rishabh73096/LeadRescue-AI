import type { ReactNode } from "react";
import { PageTransition } from "@/components/dashboard/page-transition";

// Re-mounts on every dashboard navigation, so each page eases in.
export default function DashboardTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

import type { ReactNode } from "react";
import { PageTransition } from "@/components/dashboard/page-transition";

export default function AdminTemplate({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}

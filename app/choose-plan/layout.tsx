import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function ChoosePlanLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

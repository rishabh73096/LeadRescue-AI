import type { ReactNode } from "react";

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-svh items-center justify-center bg-[#0b1026] px-4 py-10">{children}</div>;
}

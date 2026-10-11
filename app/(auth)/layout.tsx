import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { AuthHero } from "@/components/auth/hero/auth-hero";
import { authHeroData } from "@/data/auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
    <div className="relative min-h-svh bg-[#f1faf6]">
      <div className="mx-auto grid min-h-svh max-w-[1440px] items-center gap-10 px-4 pt-16 pb-8 lg:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(500px,640px)] lg:gap-14">
        <AuthHero content={authHeroData} />
        <main className="flex justify-center">{children}</main>
      </div>
    </div>
    </AuthProvider>
  );
}

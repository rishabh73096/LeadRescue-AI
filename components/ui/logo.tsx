import { BRAND } from "@/config/site";
import Link from "next/link";
import { LogoMark } from "@/components/ui/logo-mark";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
  tone?: "dark" | "light";
  size?: "md" | "lg";
}

export function Logo({ className, href = "/", tone = "dark", size = "md" }: LogoProps) {
  const large = size === "lg";

  return (
    <Link href={href} aria-label={`${BRAND.name} home`} className={cn("group inline-flex items-center gap-3", className)}>
      <LogoMark className={large ? "size-14" : "size-10"} />
      {tone === "dark" ? (
        <span className={cn("font-bold tracking-tight text-black", large ? "text-4xl" : "text-xl")}>
          {BRAND.prefix}<span className="text-brand">{BRAND.accent}</span>
        </span>
      ) : (
        <>
          <span className="text-2xl font-bold tracking-tight text-white">{BRAND.prefix}</span>
          <span className="bg-brand-gradient rounded-md px-2 py-0.5 text-xs font-semibold text-white">{BRAND.accent.trim()}</span>
        </>
      )}
    </Link>
  );
}

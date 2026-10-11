import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoundBackButton({ href = "/", label = "Back to home", className }: { href?: string; label?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn("absolute top-4 left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-md transition-all duration-200 hover:-translate-x-0.5 hover:shadow-lg active:scale-95", className)}
    >
      <ArrowLeft className="size-5" />
    </Link>
  );
}

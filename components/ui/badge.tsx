import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "purple" | "blue" | "green" | "amber" | "red" | "slate" | "indigo" | "teal";

const TONES: Record<BadgeTone, { solid: string; dot: string }> = {
  purple: { solid: "bg-[#dcf5ec] text-[#5b3fd0]", dot: "bg-[#7c4de8]" },
  blue: { solid: "bg-[#dbe7ff] text-[#2850c8]", dot: "bg-[#3b6cf0]" },
  green: { solid: "bg-[#d9f5e5] text-[#1f7a4a]", dot: "bg-[#2fb36d]" },
  amber: { solid: "bg-[#fdecc8] text-[#8a5a00]", dot: "bg-[#e8a43a]" },
  red: { solid: "bg-[#fde0e0] text-[#c2262e]", dot: "bg-[#e5484d]" },
  slate: { solid: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  indigo: { solid: "bg-[#e0defa] text-[#3b34c4]", dot: "bg-[#0f9d75]" },
  teal: { solid: "bg-[#d5f3ee] text-[#0f766e]", dot: "bg-[#2bb5a2]" },
};

interface BadgeProps extends ComponentProps<"span"> {
  tone?: BadgeTone;
  shape?: "pill" | "tag";
  size?: "sm" | "md";
  dot?: boolean;
  outline?: boolean;
}

export function Badge({ tone = "slate", shape = "pill", size = "md", dot, outline, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 font-semibold whitespace-nowrap", shape === "pill" ? "rounded-full" : "rounded-md", size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs", TONES[tone].solid, outline && "border border-current/20", className)} {...props}>
      {dot ? <span className={cn("size-1.5 rounded-full", TONES[tone].dot)} /> : null}
      {children}
    </span>
  );
}

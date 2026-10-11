import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function NativeSelect({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn("h-11 w-full rounded-lg bg-[#ebf8f3] px-3 text-sm text-ink outline-none focus:ring-2 focus:ring-brand/40", className)} {...props} />;
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeadingProps {
  children: ReactNode;
  className?: string;
}

export function PageHeading({ children, className }: PageHeadingProps) {
  return (
    <div className={cn("bg-card rounded-3xl px-6 md:py-10 py-6 text-center shadow-sm sm:py-12", className)}>
      <h1 className="text-brand font-heading text-4xl font-bold sm:text-5xl">{children}</h1>
    </div>
  );
}

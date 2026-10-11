import type { ComponentProps, ElementType } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps<T extends ElementType = "h2"> {
  as?: T;
  className?: string;
}

export function SectionHeading<T extends ElementType = "h2">({
  as,
  className,
  ...props
}: SectionHeadingProps<T> & Omit<ComponentProps<T>, keyof SectionHeadingProps<T>>) {
  const Tag = as || "h2";
  return <Tag className={cn("section-heading text-brand", className)} {...props} />;
}

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type IconButtonProps = {
  label: string;
  icon: ReactNode;
  badge?: number;
  className?: string;
} & (
  | ({ href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentProps<"button">, "className">)
);

export function IconButton({ label, icon, badge, className, ...props }: IconButtonProps) {
  const classes = cn(
    buttonVariants({ variant: "brand-outline", size: "icon-xl" }),
    "relative",
    className
  );

  const content = (
    <>
      {icon}
      {badge !== undefined ? (
        <span className="bg-brand absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link aria-label={label} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} className={classes} {...props}>
      {content}
    </button>
  );
}

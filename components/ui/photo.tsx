import Image from "next/image";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PhotoProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  fallback?: string;
  overlay?: string;
  sizes?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
}

export function Photo({ src, fallback = "linear-gradient(160deg,#64748b,#1e293b)", overlay, sizes = "100vw", priority, fit = "cover", className, style, children, ...props }: PhotoProps) {
  const background = fallback === "transparent" ? undefined : fallback;
  const hasValidSrc = typeof src === "string" && src.trim().length > 0;

  return (
    <div role="img" className={cn("relative overflow-hidden", className)} style={{ backgroundImage: background, ...style }} {...props}>
      {hasValidSrc ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={/^https?:\/\//.test(src) || src.startsWith("data:") || src.endsWith(".svg")}
          className={fit === "contain" ? "object-contain object-center" : "object-cover object-center"}
        />
      ) : null}
      {overlay ? <div aria-hidden className="absolute inset-0" style={{ backgroundImage: overlay }} /> : null}
      {children ? <div className="relative h-full">{children}</div> : null}
    </div>
  );
}


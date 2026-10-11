"use client";

import { useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollRow({ children, label, className }: { children: ReactNode; label: string; className?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  const arrow = "absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition-all hover:scale-110 hover:text-brand active:scale-90 md:flex";

  return (
    <div className="relative">
      <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${label} left`} className={cn(arrow, "left-2")}>
        <ChevronLeft className="size-5" />
      </button>
      <ul ref={track} aria-label={label} className={cn("flex flex-col gap-5 py-3 md:snap-x md:snap-mandatory md:flex-row md:overflow-x-auto md:scroll-smooth md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden", className)}>
        {children}
      </ul>
      <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${label} right`} className={cn(arrow, "right-2")}>
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

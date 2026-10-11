"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { useLockBodyScroll } from "@/hooks/use-lock-body-scroll";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const panel = useRef<HTMLDivElement>(null);
  useLockBodyScroll(open);
  useEscapeKey(onClose, open);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    return () => previous?.focus?.();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="animate-in fade-in fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-[2px] duration-150 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn("animate-in fade-in zoom-in-95 relative my-auto w-full max-w-[816px] rounded-2xl bg-white p-6 shadow-2xl outline-none duration-200 sm:p-8", className)}
      >
        <button type="button" onClick={onClose} aria-label="Close" className="hover:bg-brand-soft hover:text-brand absolute top-5 right-5 flex size-9 items-center justify-center rounded-full bg-[#eef1ff] text-slate-600 transition-colors active:scale-90 sm:top-7 sm:right-7">
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalHeader({ title, description, className }: { title: ReactNode; description?: ReactNode; className?: string }) {
  return (
    <div className={cn("pr-10", className)}>
      <h2 className="text-xl font-extrabold text-ink">{title}</h2>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

export function ModalFooter({ children, className, border }: { children: ReactNode; className?: string; border?: boolean }) {
  return <div className={cn("mt-6 flex flex-wrap items-center justify-end gap-3", border && "-mx-6 border-t border-slate-100 px-6 pt-4 sm:-mx-8 sm:px-8", className)}>{children}</div>;
}

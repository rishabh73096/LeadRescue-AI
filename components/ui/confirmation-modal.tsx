"use client";

import { useEffect, type ReactNode } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ConfirmationModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "default";
  icon?: ReactNode;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  variant = "danger",
  icon,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && !loading && onCancel();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, loading, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4",
        "bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      )}
      onClick={() => !loading && onCancel()}
    >
      <div
        className={cn(
          "relative w-full max-w-sm rounded-2xl bg-white shadow-2xl",
          "border border-slate-100 p-6 animate-in zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => !loading && onCancel()}
          disabled={loading}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div
          className={cn(
            "mb-4 flex size-12 items-center justify-center rounded-2xl",
            isDanger ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
          )}
        >
          {icon ?? (isDanger ? <Trash2 className="size-6" /> : <AlertTriangle className="size-6" />)}
        </div>

        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>

        <div className="mt-6 flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 h-10 rounded-xl"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDanger ? "destructive" : "brand"}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 h-10 rounded-xl gap-2",
              isDanger && "bg-rose-600 hover:bg-rose-700 text-white"
            )}
          >
            {loading && <Spinner className="size-4" />}
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

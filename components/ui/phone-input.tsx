"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { applyFilter } from "@/lib/input-filters";
import { IN_DIAL, formatIndian } from "@/lib/phone";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e164: string) => void;
  onBlur?: () => void;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
}

const nationalDigits = (v: string) => (v.startsWith(IN_DIAL) ? v.slice(IN_DIAL.length) : "").replace(/\D/g, "").slice(0, 10);

// India only: fixed +91 prefix, 10 digits starting 6-9. Emits "+91XXXXXXXXXX" (or "" when empty).
export function PhoneInput({ id, name, value, onChange, onBlur, invalid, disabled, className }: PhoneInputProps) {
  const [digits, setDigits] = useState(() => nationalDigits(value));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the parent form cleared the value
    if (value === "" && digits !== "") setDigits("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      className={cn(
        "flex h-12 items-stretch rounded-xl border border-slate-200 bg-white transition-colors focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/20",
        invalid && "border-destructive ring-3 ring-destructive/20",
        className,
      )}
    >
      <span className="flex shrink-0 items-center gap-2 border-r border-slate-200 px-3.5 text-sm font-medium text-slate-700 select-none">
        <span aria-hidden className="text-base">🇮🇳</span>
        {IN_DIAL}
      </span>
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={formatIndian(digits)}
        disabled={disabled}
        placeholder="98765 43210"
        aria-invalid={invalid}
        onBlur={onBlur}
        onChange={(e) => {
          const next = applyFilter("digits", e.target.value).slice(0, 10);
          setDigits(next);
          onChange(next ? `${IN_DIAL}${next}` : "");
        }}
        className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 text-sm shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
      />
    </div>
  );
}

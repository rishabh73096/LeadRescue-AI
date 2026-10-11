"use client";

import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";
import { OTP_LENGTH } from "@/config/auth";
import { Input } from "@/components/ui/input";

interface OtpInputProps {
  name?: string;
  length?: number;
  onChange?: (code: string) => void;
}

export function OtpInput({ name = "otp", length = OTP_LENGTH, onChange }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function commit(next: string[]) {
    setDigits(next);
    onChange?.(next.join(""));
  }

  function setAt(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    commit(next);
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) refs.current[index + 1]?.focus();
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(length).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    commit(next);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <input type="hidden" name={name} value={digits.join("")} />
      {digits.map((digit, i) => (
        <Input
          key={i}
          variant="otp"
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          data-filled={Boolean(digit)}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onPaste={onPaste}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className="min-w-0"
        />
      ))}
    </div>
  );
}

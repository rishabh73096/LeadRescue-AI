"use client";

import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/ui/country-select";
import { useDetectedCountry } from "@/hooks/use-detected-country";
import { DEFAULT_COUNTRY, getCountry, type Country } from "@/lib/countries";
import { applyFilter } from "@/lib/input-filters";
import { exampleNumber, formatNational, maxNationalDigits, toE164 } from "@/lib/phone";
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

export function PhoneInput({ id, name, value, onChange, onBlur, invalid, disabled, className }: PhoneInputProps) {
  const detected = useDetectedCountry();
  const [initial] = useState(() => (value.startsWith("+") ? parsePhoneNumberFromString(value) : undefined));
  const [picked, setPicked] = useState<string | null>(initial?.country ?? null);
  const [digits, setDigits] = useState(initial?.nationalNumber ?? "");
  const country: Country = getCountry(picked ?? detected) ?? getCountry(DEFAULT_COUNTRY)!;

  const emit = (c: Country, d: string) => onChange(toE164(c, d));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the parent form cleared the value
    if (value === "" && digits !== "") setDigits("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    if (digits) emit(country, digits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.code]);

  return (
    <div
      className={cn(
        "flex h-12 items-stretch rounded-xl border border-slate-200 bg-white transition-colors focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/20",
        invalid && "border-destructive ring-3 ring-destructive/20",
        className,
      )}
    >
      <CountrySelect
        value={country}
        disabled={disabled}
        onChange={(code) => {
          setPicked(code);
          const next = getCountry(code);
          if (next) {
            const trimmed = digits.slice(0, maxNationalDigits(next));
            setDigits(trimmed);
            emit(next, trimmed);
          }
        }}
      />
      <Input
        id={id}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        value={formatNational(country, digits)}
        disabled={disabled}
        placeholder={exampleNumber(country) || "Phone number"}
        aria-invalid={invalid}
        onBlur={onBlur}
        onChange={(e) => {
          const next = applyFilter("digits", e.target.value).slice(0, maxNationalDigits(country));
          setDigits(next);
          emit(country, next);
        }}
        className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 text-sm shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent"
      />
    </div>
  );
}

import { AsYouType, getExampleNumber, parsePhoneNumberFromString } from "libphonenumber-js/max";
import examples from "libphonenumber-js/examples.mobile.json";
import type { Country } from "@/lib/countries";

export const maxNationalDigits = (country: Country) => 15 - country.dial.length;

export function toE164(country: Country, digits: string): string {
  if (!digits) return "";
  return parsePhoneNumberFromString(digits, country.code)?.number ?? `+${country.dial}${digits}`;
}

export const formatNational = (country: Country, digits: string): string => new AsYouType(country.code).input(digits);

export function exampleNumber(country: Country): string {
  return getExampleNumber(country.code, examples)?.formatNational() ?? "";
}

// India-only product: numbers are stored as +91XXXXXXXXXX.
export const IN_DIAL = "+91";
export const IN_MOBILE = /^\+91[6-9]\d{9}$/;
export const isIndianMobile = (value: string) => IN_MOBILE.test(value);
export const formatIndian = (digits: string) => (digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits);

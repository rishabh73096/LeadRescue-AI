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

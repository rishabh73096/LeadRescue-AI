import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/max";

export interface Country {
  code: CountryCode;
  name: string;
  dial: string;
  flag: string;
}

const flagOf = (code: string) => String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

const names = typeof Intl !== "undefined" && "DisplayNames" in Intl ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

export const COUNTRIES: Country[] = getCountries()
  .map((code) => ({ code, name: names?.of(code) ?? code, dial: getCountryCallingCode(code), flag: flagOf(code) }))
  .sort((a, b) => a.name.localeCompare(b.name));

const BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));

export const DEFAULT_COUNTRY: CountryCode = "US";
export const getCountry = (code: string | null | undefined): Country | undefined => (code ? BY_CODE.get(code.toUpperCase() as CountryCode) : undefined);

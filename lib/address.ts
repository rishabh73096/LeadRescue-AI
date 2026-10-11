import { City, Country, State } from "country-state-city";

const ALIASES: Record<string, string> = { usa: "US", "u.s.": "US", "u.s.a.": "US", america: "US", uk: "GB", "united kingdom": "GB", uae: "AE" };

export const COUNTRY_LIST = Country.getAllCountries();

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function findCountry(value: string) {
  const v = value.trim();
  if (!v) return undefined;
  const iso = ALIASES[v.toLowerCase()];
  return COUNTRY_LIST.find((c) => (iso ? c.isoCode === iso : same(c.isoCode, v) || same(c.name, v)));
}

export const statesOf = (country: string) => {
  const c = findCountry(country);
  return c ? State.getStatesOfCountry(c.isoCode) : [];
};

export function findState(country: string, value: string) {
  const v = value.trim();
  return v ? statesOf(country).find((s) => same(s.name, v) || same(s.isoCode, v)) : undefined;
}

export function citiesOf(country: string, state: string): string[] {
  const c = findCountry(country);
  if (!c) return [];
  const s = findState(country, state);
  const rows = s ? City.getCitiesOfState(c.isoCode, s.isoCode) : statesOf(country).length ? [] : City.getCitiesOfCountry(c.isoCode) ?? [];
  return [...new Set(rows.map((r) => r.name))].sort((a, b) => a.localeCompare(b));
}

const POSTAL: Record<string, RegExp> = {
  US: /^\d{5}(-\d{4})?$/,
  IN: /^\d{6}$/,
  CA: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  GB: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
  AU: /^\d{4}$/,
  DE: /^\d{5}$/,
  FR: /^\d{5}$/,
  MX: /^\d{5}$/,
};
const GENERIC_POSTAL = /^[A-Za-z0-9][A-Za-z0-9 -]{1,9}$/;

export function isValidPostal(country: string, zip: string): boolean {
  const iso = findCountry(country)?.isoCode;
  return (iso && POSTAL[iso] ? POSTAL[iso] : GENERIC_POSTAL).test(zip.trim());
}

export const postalLabel = (country: string) => (findCountry(country)?.isoCode === "US" ? "ZIP Code" : "ZIP / Postal Code");

export function timezonesOf(country: string): string[] {
  const zones = findCountry(country)?.timezones ?? [];
  return zones.map((z) => `${z.zoneName} (${z.gmtOffsetName})`);
}

export const sameCountry = (a: string, b: string) => {
  const first = findCountry(a);
  const second = findCountry(b);
  return Boolean(first && second && first.isoCode === second.isoCode);
};

"use client";

import { useMemo } from "react";
import { Globe2, Landmark, MapPinned } from "lucide-react";
import { FormField, TextField } from "@/components/ui/form-field";
import { SelectField } from "@/components/ui/select-field";
import { COUNTRY_LIST, citiesOf, findCountry, findState, postalLabel, statesOf } from "@/lib/address";

export interface AddressValues {
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

interface Props {
  values: AddressValues;
  errors: Partial<Record<keyof AddressValues, string>>;
  onChange: (name: keyof AddressValues, value: string) => void;
  onBlur?: (name: keyof AddressValues) => void;
  disabled?: boolean;
  showZip?: boolean;
  countryLocked?: boolean;
}

// SelectField reads plain <option> elements only, so this returns elements instead of being a component.
const optionsFor = (names: string[], current: string) => [
  <option key="" value="">Select</option>,
  ...(current && !names.includes(current) ? [<option key={`current-${current}`} value={current}>{current}</option>] : []),
  ...names.map((n) => <option key={n} value={n}>{n}</option>),
];

export function AddressFields({ values, errors, onChange, onBlur, disabled, showZip = true, countryLocked = false }: Props) {
  const country = findCountry(values.country)?.name ?? values.country;
  const states = useMemo(() => statesOf(country).map((s) => s.name), [country]);
  const state = findState(country, values.state)?.name ?? values.state;
  const cities = useMemo(() => citiesOf(country, state), [country, state]);
  const countries = useMemo(() => COUNTRY_LIST.map((c) => c.name), []);

  const pickCountry = (v: string) => {
    onChange("country", v);
    onChange("state", "");
    onChange("city", "");
    onChange("zipCode", "");
  };
  const pickState = (v: string) => {
    onChange("state", v);
    onChange("city", "");
  };

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField label="Country" htmlFor="country" error={errors.country} hint={countryLocked ? "Set in your Business Profile" : undefined}>
        <SelectField id="country" name="country" icon={Globe2} value={country} onChange={(e) => pickCountry(e.target.value)} onBlur={() => onBlur?.("country")} disabled={disabled || countryLocked} aria-invalid={Boolean(errors.country)}>
          {optionsFor(countries, country)}
        </SelectField>
      </FormField>
      <FormField label="State / Province" htmlFor="state" error={errors.state}>
        <SelectField id="state" name="state" icon={Landmark} value={state} onChange={(e) => pickState(e.target.value)} onBlur={() => onBlur?.("state")} disabled={disabled || !country || (states.length === 0 && !state)} aria-invalid={Boolean(errors.state)}>
          {optionsFor(states, state)}
        </SelectField>
      </FormField>
      <FormField label="City" htmlFor="city" error={errors.city}>
        <SelectField id="city" name="city" icon={MapPinned} value={values.city} onChange={(e) => onChange("city", e.target.value)} onBlur={() => onBlur?.("city")} disabled={disabled || !country || (states.length > 0 && !state)} aria-invalid={Boolean(errors.city)}>
          {optionsFor(cities, values.city)}
        </SelectField>
      </FormField>
      {showZip ? (
              <FormField label={postalLabel(country)} htmlFor="zipCode" error={errors.zipCode}>
        <TextField id="zipCode" name="zipCode" value={values.zipCode} onChange={(e) => onChange("zipCode", e.target.value)} onBlur={() => onBlur?.("zipCode")} placeholder={findCountry(country)?.isoCode === "IN" ? "110001" : "78701"} disabled={disabled || !country} aria-invalid={Boolean(errors.zipCode)} />
      </FormField>
      ) : null}
    </div>
  );
}

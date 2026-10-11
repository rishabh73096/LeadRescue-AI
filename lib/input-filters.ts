export type InputFilter = "name" | "digits" | "number" | "email" | "otp";

const FILTERS: Record<InputFilter, (value: string) => string> = {
  name: (v) => v.replace(/[^\p{L}\p{M}\s.'’-]/gu, "").replace(/\s{2,}/g, " ").slice(0, 40),
  number: (v) => v.replace(/\D/g, "").slice(0, 9),
  digits: (v) => v.replace(/\D/g, "").slice(0, 15),
  email: (v) => v.replace(/\s/g, "").slice(0, 120),
  otp: (v) => v.replace(/\D/g, "").slice(0, 1),
};

export const applyFilter = (filter: InputFilter | undefined, value: string) => (filter ? FILTERS[filter](value) : value);

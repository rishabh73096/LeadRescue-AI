"use client";

import { useCallback, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { z } from "zod";
import { applyFilter, type InputFilter } from "@/lib/input-filters";
import { notify } from "@/lib/toast";

type Values = Record<string, string | boolean>;
type Errors<T> = Partial<Record<keyof T & string, string>>;

export function useForm<T extends Values>(schema: z.ZodType<unknown>, initial: T) {
  const [values, setValuesState] = useState<T>(initial);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [submitting, setSubmitting] = useState(false);
  const valuesRef = useRef<T>(initial);
  const touched = useRef(new Set<string>());

  const issues = useCallback(
    (vals: T): Errors<T> => {
      const result = schema.safeParse(vals);
      const out: Errors<T> = {};
      if (!result.success) {
        for (const issue of result.error.issues) {
          const key = String(issue.path[0] ?? "");
          if (key && !(key in out)) (out as Record<string, string>)[key] = issue.message;
        }
      }
      return out;
    },
    [schema],
  );

  const refresh = useCallback(() => {
    const all = issues(valuesRef.current);
    setErrors(() => {
      const next: Errors<T> = {};
      touched.current.forEach((key) => {
        if ((all as Record<string, string>)[key]) (next as Record<string, string>)[key] = (all as Record<string, string>)[key];
      });
      return next;
    });
  }, [issues]);

  const setValue = useCallback(
    <K extends keyof T & string>(name: K, value: T[K]) => {
      valuesRef.current = { ...valuesRef.current, [name]: value };
      setValuesState(valuesRef.current);
      touched.current.add(name);
      refresh();
    },
    [refresh],
  );

  const blur = useCallback(
    (name: keyof T & string) => {
      touched.current.add(name);
      refresh();
    },
    [refresh],
  );

  const field = (name: keyof T & string, options: { filter?: InputFilter } = {}) => ({
    id: name,
    name,
    value: String(values[name] ?? ""),
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(name, applyFilter(options.filter, e.target.value) as T[typeof name]),
    onBlur: () => blur(name),
    "aria-invalid": Boolean(errors[name]),
  });

  const handleSubmit = (onValid: (data: T) => Promise<void> | void) => async (event?: FormEvent) => {
    event?.preventDefault();
    if (submitting) return;

    Object.keys(valuesRef.current).forEach((key) => touched.current.add(key));
    const found = issues(valuesRef.current);
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      notify.error((found as Record<string, string>)[firstKey]);
      document.getElementById(firstKey)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      await onValid(valuesRef.current);
    } catch (error) {
      notify.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const reset = (next: T = initial) => {
    valuesRef.current = next;
    setValuesState(next);
    setErrors({});
    touched.current.clear();
  };

  return { values, errors, submitting, field, setValue, blur, handleSubmit, reset };
}

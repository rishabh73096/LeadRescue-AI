"use client";

import { z } from "zod";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormField, TextAreaField, TextField } from "@/components/ui/form-field";
import { Modal, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { NativeSelect } from "@/components/ui/native-select";
import { PhoneInput } from "@/components/ui/phone-input";
import { useForm } from "@/hooks/use-form";
import { isIndianMobile } from "@/lib/phone";
import { SOURCES } from "@/lib/leads";
import { notify } from "@/lib/toast";
import { addLead, inDays, updateLead } from "@/services/leads";
import type { Lead, LeadSource } from "@/types/lead";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter the customer's name").max(80),
    phone: z.string().refine((v) => !v || isIndianMobile(v), "Enter a valid 10-digit Indian mobile number"),
    email: z.string().trim().refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Enter a valid email"),
    source: z.string(),
    service: z.string().trim().max(120),
    message: z.string().trim().max(1000),
    value: z.string().refine((v) => !v || /^\d{1,9}$/.test(v), "Use digits only"),
    followUp: z.string(),
  })
  .refine((v) => v.phone || v.email, { path: ["phone"], message: "Add a phone number or an email" });

type Values = { name: string; phone: string; email: string; source: string; service: string; message: string; value: string; followUp: string };

const dayInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : "");
const toValues = (l?: Lead): Values => ({ name: l?.name ?? "", phone: l?.phone ?? "", email: l?.email ?? "", source: l?.source ?? "website", service: l?.service ?? "", message: l?.message ?? "", value: l?.value ? String(l.value) : "", followUp: dayInput(l?.nextFollowUpAt ?? null) });

export function LeadFormModal({ open, lead, onClose }: { open: boolean; lead?: Lead; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title={lead ? "Edit lead" : "Add lead"} className="max-w-[620px]">
      {/* remount per open so the form starts fresh */}
      <LeadFormBody key={lead?.id ?? "new"} lead={lead} onClose={onClose} />
    </Modal>
  );
}

function LeadFormBody({ lead, onClose }: { lead?: Lead; onClose: () => void }) {
  const form = useForm<Values>(schema, toValues(lead));

  const submit = form.handleSubmit((v) => {
    const input = {
      name: v.name.trim(),
      phone: v.phone,
      email: v.email.trim(),
      source: v.source as LeadSource,
      service: v.service.trim(),
      message: v.message.trim(),
      value: Number(v.value || 0),
      nextFollowUpAt: v.followUp ? new Date(`${v.followUp}T09:00:00`).toISOString() : null,
    };
    if (lead) updateLead(lead.id, input);
    else addLead({ ...input, nextFollowUpAt: input.nextFollowUpAt ?? inDays(1) });
    notify.success(lead ? "Lead updated" : "Lead added");
    onClose();
  });

  return (
    <form onSubmit={submit} noValidate>
      <ModalHeader title={lead ? "Edit lead" : "Add lead"} description="Who enquired, what they want and when to follow up." />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="Name" htmlFor="name" error={form.errors.name} className="sm:col-span-2">
          <TextField {...form.field("name", { filter: "name" })} placeholder="Priya Sharma" autoComplete="off" />
        </FormField>
        <FormField label="Phone" htmlFor="phone" error={form.errors.phone}>
          <PhoneInput id="phone" name="phone" value={form.values.phone} onChange={(v) => form.setValue("phone", v)} onBlur={() => form.blur("phone")} invalid={Boolean(form.errors.phone)} />
        </FormField>
        <FormField label="Email" htmlFor="email" error={form.errors.email}>
          <TextField {...form.field("email", { filter: "email" })} type="email" icon={Mail} placeholder="optional" />
        </FormField>
        <FormField label="Service wanted" htmlFor="service" error={form.errors.service}>
          <TextField {...form.field("service")} placeholder="Deep cleaning, 3BHK" />
        </FormField>
        <FormField label="Estimated value (₹)" htmlFor="value" error={form.errors.value}>
          <TextField {...form.field("value")} inputMode="numeric" placeholder="6500" />
        </FormField>
        <FormField label="Source" htmlFor="source">
          <NativeSelect id="source" value={form.values.source} onChange={(e) => form.setValue("source", e.target.value)}>
            {SOURCES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </NativeSelect>
        </FormField>
        <FormField label="Next follow-up" htmlFor="followUp" hint="Defaults to tomorrow">
          <TextField {...form.field("followUp")} type="date" />
        </FormField>
        <FormField label="Their message" htmlFor="message" error={form.errors.message} className="sm:col-span-2">
          <TextAreaField {...form.field("message")} placeholder="Paste what the customer wrote" />
        </FormField>
      </div>
      <ModalFooter border>
        <Button type="button" variant="neutral" size="xl" className="rounded-full px-6" onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="brand" size="xl" className="rounded-full px-6" loading={form.submitting}>{lead ? "Save changes" : "Add lead"}</Button>
      </ModalFooter>
    </form>
  );
}

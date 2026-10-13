"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Check, CreditCard, ListChecks, Lock, MessageSquareText, Plus, Trash2, UserRound } from "lucide-react";
import { AreaTrend } from "@/components/charts/charts";
import { ChartCard, Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { useNow } from "@/hooks/use-now";
import { perDay } from "@/lib/stats";
import { Button, buttonVariants } from "@/components/ui/button";
import { FormField, TextAreaField, TextField } from "@/components/ui/form-field";
import { NativeSelect } from "@/components/ui/native-select";
import { PageHeader } from "@/components/ui/page-header";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { useAuthState } from "@/context/AuthContext";
import { useRole } from "@/hooks/use-role";
import { useMounted } from "@/hooks/use-mounted";
import { ROLE_LABELS } from "@/lib/roles";
import { notify } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { MONTHLY_DRAFT_CAP } from "@/components/replies/replies-view";
import { ALL_FEATURES, FEATURE_LABELS } from "@/lib/plans";
import { usePlan } from "@/lib/plan-store";
import { draftsThisMonth, useDrafts } from "@/services/drafts";
import { saveSettings, useSettings } from "@/services/settings";
import type { Language, WorkspaceSettings } from "@/types/lead";

export function SettingsView() {
  const mounted = useMounted();
  const saved = useSettings();
  if (!mounted) return null;
  // key remounts the form when saved settings change elsewhere (e.g. sign-out clears them)
  return <SettingsForm key={JSON.stringify(saved)} saved={saved} />;
}

function SettingsForm({ saved }: { saved: WorkspaceSettings }) {
  const { user } = useAuthState();
  const { role } = useRole();
  const now = useNow();
  const planInfo = usePlan();
  const drafts = useDrafts();
  const [s, setS] = useState<WorkspaceSettings>(saved);
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const used = draftsThisMonth(drafts);

  const setService = (i: number, patch: Partial<WorkspaceSettings["services"][number]>) => setS((p) => ({ ...p, services: p.services.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));

  const save = async () => {
    try {
      await saveSettings({ ...s, services: s.services.filter((x) => x.name.trim()).map((x) => ({ name: x.name.trim(), price: x.price.trim() })) });
      notify.success("Settings saved");
    } catch (error) {
      notify.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Your business details are used when drafting replies." actions={<>{dirty ? <span className="animate-in fade-in slide-in-from-right-2 flex items-center gap-2 text-xs font-medium text-slate-500"><span className="dot-ping size-2 rounded-full bg-amber-400" />Unsaved changes</span> : null}<Button type="button" variant="brand" size="xl" className="rounded-full px-6" disabled={!dirty} onClick={save}>Save changes</Button></>} />

      <Grid cols={3}>
        <StatCard icon={ListChecks} label="Services listed" value={String(saved.services.length)} />
        <StatCard icon={MessageSquareText} label="AI drafts this month" value={`${used} / ${MONTHLY_DRAFT_CAP}`} sub={`${Math.round((used / MONTHLY_DRAFT_CAP) * 100)}% of your limit`} />
        <StatCard icon={CreditCard} label="Plan" value={planInfo.isAdmin ? "Admin" : planInfo.plan ?? "None"} />
      </Grid>
      <ChartCard title="AI draft usage" description="Last 14 days" table={{ head: ["Day", "Drafts"], rows: perDay(drafts, (d) => d.createdAt, 14, now).map((p) => [p.label, p.value]) }}>
        <AreaTrend data={perDay(drafts, (d) => d.createdAt, 14, now)} name="Drafts" height={180} />
      </ChartCard>

      <Panel className="p-5 sm:p-6">
        <PanelHeader title="Business" icon={Briefcase} />
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <FormField label="Business name" htmlFor="businessName">
            <TextField id="businessName" value={s.businessName} onChange={(e) => setS({ ...s, businessName: e.target.value.slice(0, 80) })} placeholder="Sparkle Cleaners" />
          </FormField>
          <FormField label="Default reply language" htmlFor="language">
            <NativeSelect id="language" value={s.language} onChange={(e) => setS({ ...s, language: e.target.value as Language })}>
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </NativeSelect>
          </FormField>
          <FormField label="Reply sign-off" htmlFor="signature" hint="Added at the end of every draft" className="sm:col-span-2">
            <TextAreaField id="signature" value={s.signature} onChange={(e) => setS({ ...s, signature: e.target.value.slice(0, 200) })} placeholder={"Team Sparkle Cleaners\n+91 98765 43210"} className="min-h-20" />
          </FormField>
        </div>
      </Panel>

      <Panel className="p-5 sm:p-6">
        <PanelHeader title="Services and price ranges" description="Drafts quote these. Leave a price empty to skip it." aside={<Button type="button" variant="soft" size="lg" className="h-9 rounded-full px-4" onClick={() => setS((p) => ({ ...p, services: [...p.services, { name: "", price: "" }] }))}><Plus />Add</Button>} />
        <ul className="mt-5 space-y-3">
          {s.services.map((x, i) => (
            <li key={i} className="animate-in fade-in slide-in-from-top-2 grid grid-cols-[1fr_auto] gap-3 duration-300 sm:grid-cols-[1fr_1fr_auto]">
              <TextField aria-label="Service name" value={x.name} onChange={(e) => setService(i, { name: e.target.value.slice(0, 80) })} placeholder="Service" />
              <TextField aria-label="Price range" value={x.price} onChange={(e) => setService(i, { price: e.target.value.slice(0, 40) })} placeholder="₹2,000 – ₹5,000" className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto" />
              <Button type="button" variant="ghost" size="icon" className="size-11" aria-label="Remove service" onClick={() => setS((p) => ({ ...p, services: p.services.filter((_, j) => j !== i) }))}><Trash2 /></Button>
            </li>
          ))}
          {s.services.length === 0 ? <li className="text-sm text-slate-400">No services yet.</li> : null}
        </ul>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Plan and usage" icon={CreditCard} />
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Plan</dt><dd className="font-semibold text-ink">{planInfo.isAdmin ? "Platform admin (all features)" : planInfo.plan ?? "None active"}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">AI drafts this month</dt><dd className="font-semibold text-ink">{planInfo.can("aiReplies") ? `${used} / ${MONTHLY_DRAFT_CAP}` : "Not in your plan"}</dd></div>
          </dl>
          <ul className="mt-5 space-y-2 text-sm">
            {ALL_FEATURES.map((f) => {
              const on = planInfo.can(f);
              return (
                <li key={f} className={cn("flex items-center gap-2", on ? "text-slate-700" : "text-slate-400")}>
                  {on ? <Check className="text-brand size-4" /> : <Lock className="size-4" />}
                  {FEATURE_LABELS[f]}
                  {!on ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pro</span> : null}
                </li>
              );
            })}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {planInfo.plan === "Starter" && !planInfo.isAdmin ? (
              <Link href="/choose-plan?plan=Pro" className={cn(buttonVariants({ variant: "brand", size: "lg" }), "h-10 rounded-full px-5")}>Upgrade to Pro</Link>
            ) : null}
            <Link href="/choose-plan" className={cn(buttonVariants({ variant: "neutral", size: "lg" }), "h-10 rounded-full px-5")}>Change or renew plan</Link>
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <PanelHeader title="Account" icon={UserRound} />
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Name</dt><dd className="truncate font-semibold text-ink">{user?.fullName || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Email</dt><dd className="truncate font-semibold text-ink">{user?.email || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Role</dt><dd className="font-semibold text-ink">{ROLE_LABELS[role]}</dd></div>
          </dl>
        </Panel>
      </div>
    </div>
  );
}

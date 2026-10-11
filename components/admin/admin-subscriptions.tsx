"use client";

import { useState } from "react";
import { DemoBanner, StatusBadge, Table, Who, fmtDate, profileOf } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { useNow } from "@/hooks/use-now";
import { DAY_MS } from "@/lib/date";
import { notify } from "@/lib/toast";
import { expireSubscription, extendSubscription, useAdminData } from "@/services/admin";
import type { SubscriptionRow } from "@/types/admin";

export function SubscriptionsView() {
  const { data, refresh } = useAdminData();
  const now = useNow();
  const [busy, setBusy] = useState<string | null>(null);
  if (!data) return null;

  const end = (s: SubscriptionRow) => new Date(s.current_period_end).getTime();
  const sorted = [...data.subscriptions].sort((a, b) => end(a) - end(b));
  const daysLeft = (s: SubscriptionRow) => Math.ceil((end(s) - now) / DAY_MS);

  const run = async (s: SubscriptionRow, fn: () => Promise<void>, done: string) => {
    if (data.demo) return notify.info("Sample data: connect Supabase to change real subscriptions.");
    setBusy(s.user_id);
    try {
      await fn();
      notify.success(done);
      refresh();
    } catch (error) {
      notify.error(error);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Subscriptions" description="Soonest to end first. Extend a plan after a renewal, or expire it." />
      <DemoBanner show={data.demo} />
      <Table head={["Customer", "Plan", "Status", "Ends", "Days left", ""]} empty="No subscriptions yet.">
        {sorted.map((s) => {
          const left = daysLeft(s);
          const live = s.status === "active" && left > 0;
          return (
            <tr key={s.user_id}>
              <td className="px-4 py-3.5"><Who profile={profileOf(data, s.user_id)} /></td>
              <td className="px-4 py-3.5">{s.plan}</td>
              <td className="px-4 py-3.5"><StatusBadge status={live ? "active" : "expired"} /></td>
              <td className="px-4 py-3.5 text-slate-500">{fmtDate(s.current_period_end)}</td>
              <td className={live && left <= 7 ? "px-4 py-3.5 font-semibold text-[#c2262e]" : "px-4 py-3.5 text-slate-500"}>{live ? left : "—"}</td>
              <td className="px-4 py-3.5">
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="soft" size="lg" className="h-8 rounded-full px-3 text-xs" loading={busy === s.user_id} onClick={() => run(s, () => extendSubscription(s.user_id, s.current_period_end, 30), "Extended by 30 days")}>+30 days</Button>
                  {live ? <Button type="button" variant="destructive" size="lg" className="h-8 rounded-full px-3 text-xs" disabled={busy === s.user_id} onClick={() => window.confirm("Expire this subscription now?") && run(s, () => expireSubscription(s.user_id), "Subscription expired")}>Expire</Button> : null}
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

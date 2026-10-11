"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { DemoBanner, StatusBadge, Table, Who, fmtDateTime, profileOf } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { CountTabs } from "@/components/ui/count-tabs";
import { PageHeader } from "@/components/ui/page-header";
import { formatInr } from "@/lib/leads";
import { notify } from "@/lib/toast";
import { setPaymentStatus, useAdminData } from "@/services/admin";
import type { PaymentStatus } from "@/types/admin";

export function PaymentsView() {
  const { data, refresh } = useAdminData();
  const [tab, setTab] = useState<PaymentStatus>("pending");
  const [busy, setBusy] = useState<string | null>(null);
  if (!data) return null;

  const count = (s: PaymentStatus) => data.payments.filter((p) => p.status === s).length;
  const rows = data.payments.filter((p) => p.status === tab);

  const act = async (id: string, status: PaymentStatus, label: string) => {
    if (data.demo) return notify.info("Sample data: connect Supabase to verify real payments.");
    if (!window.confirm(`${label} this payment? Check the UTR in your UPI/bank app first.`)) return;
    setBusy(id);
    try {
      await setPaymentStatus(id, status);
      notify.success(status === "verified" ? "Verified. The plan is now active." : "Payment rejected");
      refresh();
    } catch (error) {
      notify.error(error);
    } finally {
      setBusy(null);
    }
  };

  const copy = (v: string) => navigator.clipboard?.writeText(v).then(() => notify.success("UTR copied"), () => notify.error("Couldn't copy"));

  return (
    <div className="space-y-6">
      <PageHeader title="Payments" description="Match each UTR against your UPI or bank statement, then verify. Verifying activates 30 days of the plan." />
      <DemoBanner show={data.demo} />
      <CountTabs<PaymentStatus> label="Payment status" value={tab} onChange={setTab} tabs={[{ value: "pending", label: "Pending", count: count("pending"), tone: "amber" }, { value: "verified", label: "Verified", count: count("verified") }, { value: "rejected", label: "Rejected", count: count("rejected") }]} />
      <Table head={["Customer", "Plan", "Amount", "UTR", "Submitted", "Status", ""]} empty={`No ${tab} payments.`}>
        {rows.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3.5"><Who profile={profileOf(data, p.user_id)} /></td>
            <td className="px-4 py-3.5">{p.plan}</td>
            <td className="px-4 py-3.5 font-semibold text-ink">{formatInr(p.amount_inr)}</td>
            <td className="px-4 py-3.5"><button type="button" onClick={() => copy(p.upi_ref)} className="inline-flex items-center gap-1.5 font-mono text-xs hover:text-brand">{p.upi_ref}<Copy className="size-3" /></button></td>
            <td className="px-4 py-3.5 text-slate-500">{fmtDateTime(p.created_at)}</td>
            <td className="px-4 py-3.5"><StatusBadge status={p.status} /></td>
            <td className="px-4 py-3.5">
              {p.status === "pending" ? (
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="success" size="lg" className="h-8 rounded-full px-3 text-xs" loading={busy === p.id} onClick={() => act(p.id, "verified", "Verify")}><Check />Verify</Button>
                  <Button type="button" variant="destructive" size="lg" className="h-8 rounded-full px-3 text-xs" disabled={busy === p.id} onClick={() => act(p.id, "rejected", "Reject")}><X />Reject</Button>
                </div>
              ) : null}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Clock, Repeat, Users } from "lucide-react";
import { Grid } from "@/components/charts/chart-card";
import { StatCard } from "@/components/charts/stat-card";
import { DemoBanner, StatusBadge, Table, Who, fmtDate } from "@/components/admin/admin-ui";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { useNow } from "@/hooks/use-now";
import { useAdminData } from "@/services/admin";

export function CustomersView() {
  const { data } = useAdminData();
  const now = useNow();
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    if (!data) return [];
    const q = query.trim().toLowerCase();
    return data.profiles
      .filter((p) => !q || `${p.name} ${p.email} ${p.phone}`.toLowerCase().includes(q))
      .map((p) => ({ p, sub: data.subscriptions.find((s) => s.user_id === p.id), pending: data.payments.some((x) => x.user_id === p.id && x.status === "pending") }));
  }, [data, query]);

  if (!data) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description={`${data.profiles.length} accounts`} />
      <DemoBanner show={data.demo} />
      <Grid cols={4}>
        <StatCard icon={Users} label="All customers" value={String(data.profiles.length)} />
        <StatCard icon={Repeat} label="Paying now" value={String(data.subscriptions.filter((s) => s.status === "active" && new Date(s.current_period_end).getTime() > now).length)} />
        <StatCard icon={CalendarPlus} label="Joined last 30 days" value={String(data.profiles.filter((p) => now - new Date(p.created_at).getTime() < 30 * 86_400_000).length)} />
        <StatCard icon={Clock} label="Awaiting verification" value={String(new Set(data.payments.filter((p) => p.status === "pending").map((p) => p.user_id)).size)} />
      </Grid>
      <SearchInput value={query} onValueChange={setQuery} placeholder="Search name, email, phone" clearable tone="white" className="w-full sm:w-80" />
      <Table head={["Customer", "Phone", "Joined", "Plan", "Status", "Renews / ends"]} empty="No customers match.">
        {rows.map(({ p, sub, pending }) => {
          const live = sub && sub.status === "active" && new Date(sub.current_period_end).getTime() > now;
          return (
            <tr key={p.id}>
              <td className="px-4 py-3.5"><Who profile={p} /></td>
              <td className="px-4 py-3.5 text-slate-600">{p.phone || "—"}</td>
              <td className="px-4 py-3.5 text-slate-500">{fmtDate(p.created_at)}</td>
              <td className="px-4 py-3.5">{sub?.plan ?? "—"}</td>
              <td className="px-4 py-3.5">{live ? <StatusBadge status="active" /> : pending ? <StatusBadge status="pending" /> : <StatusBadge status={sub ? "expired" : "none"} />}</td>
              <td className="px-4 py-3.5 text-slate-500">{sub ? fmtDate(sub.current_period_end) : "—"}</td>
            </tr>
          );
        })}
      </Table>
    </div>
  );
}

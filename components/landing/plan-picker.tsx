"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Clock, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LANDING } from "@/config/landing";
import { useAuthState } from "@/context/AuthContext";
import { useSubscription } from "@/lib/subscription";
import { notify } from "@/lib/toast";
import { TEST_MODE, UPI_VPA, isValidUtr, priceToInr, upiLink } from "@/lib/upi";
import { cn } from "@/lib/utils";

export function PlanPicker({ preselect }: { preselect?: string }) {
  const router = useRouter();
  const { user } = useAuthState();
  const { plan, pending, ready, refresh, submitPayment, activateTest } = useSubscription();
  const plans = LANDING.pricing.plans;
  const [selected, setSelected] = useState(plans.find((p) => p.name === preselect)?.name ?? plans.find((p) => p.featured)?.name ?? plans[0].name);
  const [paying, setPaying] = useState(false);
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const chosen = plans.find((p) => p.name === selected)!;
  const amount = priceToInr(chosen.price);

  useEffect(() => {
    // someone who already has a plan goes to the dashboard, unless they came here to switch to a different one
    if (ready && plan && (!preselect || preselect === plan)) router.replace("/dashboard");
  }, [ready, plan, preselect, router]);

  const submit = async () => {
    const ref = utr.trim();
    if (!isValidUtr(ref)) return notify.error("Enter the 12-digit UTR / transaction ID from your UPI app.");
    setBusy(true);
    try {
      await submitPayment({ plan: chosen.name, amount, utr: ref });
      notify.success("Payment submitted. We'll activate your plan once it's verified.");
    } catch (error) {
      notify.error(error);
    } finally {
      setBusy(false);
    }
  };

  const testActivate = async () => {
    setBusy(true);
    try {
      await activateTest(chosen.name);
      notify.success(`${chosen.name} plan activated (test mode)`);
      router.replace("/dashboard");
    } catch (error) {
      notify.error(error);
    } finally {
      setBusy(false);
    }
  };

  const check = async () => {
    setBusy(true);
    await refresh().catch(() => {});
    setBusy(false);
  };

  if (ready && pending && !plan) {
    return (
      <Shell>
        <div className="mt-10 max-w-[520px] rounded-3xl bg-[#f4f4f5] p-6">
          <Clock className="size-6 text-brand" />
          <h1 className="font-inter mt-4 text-2xl font-extrabold tracking-[-0.03em] text-ink">Payment under verification</h1>
          <p className="mt-2 text-sm text-slate-600">
            We received your {pending.plan} plan payment (UTR <span className="font-semibold text-ink">{pending.upi_ref}</span>). Your dashboard opens as soon as it&apos;s verified, usually within a few hours.
          </p>
          <Button type="button" variant="brand" size="xl" className="mt-6 rounded-full px-8" loading={busy} onClick={check}>Check status</Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="font-inter mt-10 text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">Choose your plan{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.</h1>
      <p className="mt-3 text-slate-500">Pick a plan and pay with any UPI app. Prices are per month, in INR.</p>
      {TEST_MODE ? (
        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-[#fdecc8] px-4 py-3 text-sm text-[#8a5a00]">
          <span className="rounded-full bg-[#8a5a00] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">Test mode</span>
          No real money is taken here. Use the button below to activate a plan instantly.
        </div>
      ) : null}

      <div className={cn("mt-8 grid gap-3", plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {plans.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => { setSelected(p.name); setPaying(false); }}
            aria-pressed={selected === p.name}
            className={cn("rounded-3xl bg-[#f4f4f5] p-6 text-left ring-2 transition-all", selected === p.name ? "ring-brand bg-white shadow-lg" : "ring-transparent hover:ring-slate-200")}
          >
            <p className="text-sm font-bold text-ink">{p.name}</p>
            <p className="mt-1 text-xs text-slate-500">{p.tagline}</p>
            <p className="font-inter mt-5 text-4xl font-extrabold tracking-[-0.04em] text-ink">{p.price}<span className="ml-1 text-xs font-normal tracking-normal text-slate-500">a month</span></p>
            <ul className="mt-5 space-y-2 text-[13px] text-slate-700">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-brand" />{f}</li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {!paying ? (
        <div className="mt-8">
          <Button type="button" variant="brand" size="xl" className="rounded-full px-8" onClick={() => setPaying(true)} disabled={!ready}>
            Pay {chosen.price} with UPI
          </Button>
          {TEST_MODE ? (
            <Button type="button" variant="neutral" size="xl" className="ml-3 rounded-full px-8" loading={busy} onClick={testActivate} disabled={!ready}>
              Activate {chosen.name} (test, no payment)
            </Button>
          ) : null}
        </div>
      ) : !UPI_VPA ? (
        <p className="mt-8 text-sm text-red-600">UPI is not configured. Set NEXT_PUBLIC_UPI_VPA in .env.local.</p>
      ) : (
        <div className="mt-8 grid gap-6 rounded-3xl bg-[#f4f4f5] p-6 md:grid-cols-[auto_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-2xl bg-white p-4">
              <QRCodeSVG value={upiLink({ amount, note: `LeadRescue ${chosen.name}` })} size={200} marginSize={0} />
            </div>
            <p className="text-xs text-slate-500">Scan with GPay, PhonePe, Paytm or any UPI app</p>
            <a href={upiLink({ amount, note: `LeadRescue ${chosen.name}` })} className="text-brand inline-flex items-center gap-1.5 text-xs font-semibold md:hidden">
              <Smartphone className="size-3.5" /> Open UPI app
            </a>
          </div>
          <div>
            <p className="text-sm font-bold text-ink">Pay {chosen.price} to {UPI_VPA}</p>
            <p className="mt-1 text-xs text-slate-500">After paying, enter the UTR / transaction ID shown in your UPI app so we can match the payment.</p>
            <label htmlFor="utr" className="mt-5 block text-xs font-medium text-slate-700">UTR / transaction ID</label>
            <Input id="utr" value={utr} onChange={(e) => setUtr(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 24))} inputMode="text" autoComplete="off" placeholder="e.g. 412345678901" className="mt-1.5 max-w-sm" disabled={busy} />
            <Button type="button" variant="brand" size="xl" className="mt-4 rounded-full px-8" loading={busy} onClick={submit}>I&apos;ve paid, submit</Button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-white px-5 py-10">
      <div className="mx-auto max-w-[900px]">
        <Logo />
        {children}
      </div>
    </div>
  );
}

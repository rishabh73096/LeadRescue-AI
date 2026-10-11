import Link from "next/link";
import { ArrowDown, ArrowRight, Check, ChevronDown, FileSpreadsheet, Globe, Mail, MessageCircle, Phone } from "lucide-react";
import { BRAND } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { LogoMark } from "@/components/ui/logo-mark";
import { FlowDemo } from "@/components/landing/flow-demo";
import { cn } from "@/lib/utils";
import type { BentoItem, LandingContent } from "@/types/landing";

const wrap = "mx-auto w-full max-w-[1120px] px-5 sm:px-8";
const btnDark = "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]";
const btnLight = "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f1f1f2] px-7 text-[15px] font-semibold text-ink transition-colors hover:bg-[#e8e8ea]";

export function LandingNav() {
  const links = [["Features", "/#features"], ["How it works", "/#how"], ["Pricing", "/#pricing"], ["FAQ", "/#faq"]];
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-8 px-5 sm:px-8">
        <Logo />
        <nav className="hidden gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm text-slate-600 hover:text-ink">{label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/login" className="hidden h-10 items-center rounded-full px-4 text-sm font-semibold text-slate-700 hover:text-ink sm:inline-flex">Sign in</Link>
          <Link href="/signup" className="inline-flex h-10 items-center rounded-full bg-[#f1f1f2] px-5 text-sm font-semibold text-ink hover:bg-[#e8e8ea]">Get started</Link>
        </div>
      </div>
    </header>
  );
}

export function Hero({ c }: { c: LandingContent }) {
  const tilt = [-7, 6, -5, 8];
  return (
    <section className="px-5 pt-16 pb-20 text-center sm:pt-24">
      <h1 className="font-inter mx-auto max-w-[1100px] text-[clamp(2.9rem,9.6vw,7.4rem)] leading-[0.98] font-extrabold tracking-[-0.055em] text-ink">
        {c.headline.map((line, li) => (
          <span key={li} className={cn("block", line.muted && "bg-linear-to-b from-[#1a1a1a] to-[#9a9aa0] bg-clip-text text-transparent")}>
            {line.text}
            {line.tiles?.map((t, ti) => (
              <span
                key={ti}
                aria-hidden
                className="mx-[0.06em] inline-flex size-[0.92em] items-center justify-center rounded-[26%] align-[-0.12em] shadow-[0_10px_24px_-10px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:rotate-0 hover:scale-110 first:ml-[0.14em]"
                style={{ background: t.bg, color: t.fg ?? "#fff", transform: `rotate(${tilt[(li * 2 + ti) % 4]}deg)` }}
              >
                <t.icon className="size-[52%]" strokeWidth={2.2} />
              </span>
            ))}
          </span>
        ))}
      </h1>
      <p className="mx-auto mt-10 max-w-[620px] text-lg leading-8 text-slate-500 sm:text-xl">{c.subhead}</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/signup" className={btnDark}>Start free</Link>
        <a href="#how" className={btnLight}>See how it works <ArrowDown className="size-4" /></a>
      </div>
      <p className="mt-5 text-sm text-slate-400">{c.heroNote}</p>
    </section>
  );
}

export function HowItWorks({ c }: { c: LandingContent }) {
  return (
    <section id="how" className={cn(wrap, "max-w-[1240px] scroll-mt-20 py-16")}>
      <div className="mx-auto mb-12 max-w-[640px] text-center">
        <h2 className="font-inter text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">{c.flow.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-500">{c.flow.sub}</p>
      </div>
      <FlowDemo flow={c.flow} />
    </section>
  );
}

function BentoCard({ item, className }: { item: BentoItem; className?: string }) {
  const dark = item.type === "stat" && item.dark;
  const head = (
    <div>
      <h3 className={cn("text-[17px] leading-snug font-bold", dark ? "text-white" : "text-ink")}>{item.title}</h3>
      <p className={cn("mt-1.5 max-w-[34ch] text-[13px] leading-5", dark ? "text-white/60" : "text-slate-500")}>{item.desc}</p>
    </div>
  );
  return (
    <div className={cn("flex flex-col justify-between gap-6 rounded-3xl p-6", dark ? "bg-ink" : "bg-[#f4f4f5]", className)}>
      {item.type === "hero" ? (
        <>
          {head}
          <div className="mt-auto">
            <div className="flex flex-wrap gap-2.5">
              {item.chips.map((Ic, i) => (
                <span key={i} className={cn("flex size-11 items-center justify-center rounded-xl", i === 0 ? "bg-brand text-white" : i === 1 ? "bg-ink text-white" : "bg-white text-ink shadow-sm")}>
                  <Ic className="size-5" />
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-end gap-3">
              <span className="font-inter text-7xl leading-none font-extrabold tracking-[-0.05em] text-ink">{item.stat.value}</span>
              <span className="pb-1.5 text-xs text-slate-500">{item.stat.label}</span>
            </div>
          </div>
        </>
      ) : item.type === "mock" ? (
        <>
          {head}
          <div className="flex gap-2">
            {item.blocks.map((b) => (
              <div key={b.label} style={{ flexGrow: b.grow }} className="relative h-24 basis-0 rounded-xl bg-[repeating-linear-gradient(135deg,#ececee_0_8px,#f6f6f7_8px_16px)]">
                <span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-700 shadow-sm">{b.label}</span>
              </div>
            ))}
          </div>
        </>
      ) : item.type === "stat" ? (
        <>
          <span className={cn("font-inter text-6xl leading-none font-extrabold tracking-[-0.05em]", dark ? "text-white" : "text-ink")}>{item.value}</span>
          {head}
        </>
      ) : item.type === "chips" ? (
        <>
          {head}
          <div className="flex flex-wrap gap-2">
            {item.chips.map(({ icon: Ic, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-ink shadow-sm"><Ic className="size-3.5 text-brand" />{label}</span>
            ))}
          </div>
        </>
      ) : item.type === "wave" ? (
        <>
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-ink shadow-sm"><item.icon className="size-4" /></span>
          <div className="flex h-10 items-center gap-1" aria-hidden>
            {[40, 70, 100, 55, 85, 45, 90, 60, 30, 75, 50, 95, 35].map((h, i) => <span key={i} className="w-[5px] rounded-full bg-ink" style={{ height: `${h}%` }} />)}
          </div>
          {head}
        </>
      ) : item.type === "icon" ? (
        <>
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-ink shadow-sm"><item.icon className="size-4" /></span>
          {head}
        </>
      ) : item.type === "pills" ? (
        <>
          {head}
          <div className="flex flex-wrap gap-2">
            {item.pills.map((p, i) => (
              <span key={p.label} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold", i === 0 ? "bg-ink text-white" : "bg-white text-slate-700 shadow-sm")}>
                <span className="size-1.5 rounded-full" style={{ background: p.color }} />{p.label}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-ink shadow-sm"><item.icon className="size-5" /></span>
          <div>
            <h3 className="text-[17px] font-bold text-ink">{item.title}</h3>
            <p className="mt-0.5 text-[13px] text-slate-500">{item.desc}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const BENTO_SPANS = [
  "md:col-span-6 md:row-span-2", "md:col-span-6", "md:col-span-3", "md:col-span-3", "md:col-span-6", "md:col-span-3", "md:col-span-3", "md:col-span-6", "md:col-span-6", "md:col-span-12",
];

export function Bento({ c }: { c: LandingContent }) {
  return (
    <section id="features" className={cn(wrap, "scroll-mt-20 py-16")}>
      <div className="mx-auto mb-12 max-w-[640px] text-center">
        <h2 className="font-inter text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">{c.bento.title}</h2>
        <p className="mt-4 text-lg leading-8 text-slate-500">{c.bento.sub}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-12">
        {c.bento.items.map((item, i) => <BentoCard key={item.title} item={item} className={BENTO_SPANS[i]} />)}
      </div>
    </section>
  );
}

export function Audience({ c }: { c: LandingContent }) {
  const a = c.audience;
  return (
    <section className={cn(wrap, "py-16")}>
      <div className="mx-auto mb-12 text-center">
        <p className="text-xs text-slate-400">{a.eyebrow}</p>
        <h2 className="font-inter mt-3 text-4xl font-extrabold tracking-[-0.045em] text-ink sm:text-5xl">{a.title}<br /><span className="text-slate-400">{a.titleMuted}</span></h2>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {a.cards.map((card) => (
          <figure key={card.who} className="flex flex-col gap-5 rounded-3xl bg-[#f4f4f5] p-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white"><card.icon className="size-5" /></span>
            <blockquote className="text-[15px] leading-7 text-ink">{card.scenario}</blockquote>
            <figcaption className="mt-auto text-sm"><b className="text-ink">{card.who}</b><span className="block text-xs text-slate-500">{card.role}</span></figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-slate-400">Illustrative scenarios, not customer reviews.</p>
    </section>
  );
}

export function Pricing({ c }: { c: LandingContent }) {
  const p = c.pricing;
  return (
    <section id="pricing" className={cn(wrap, "scroll-mt-20 py-16")}>
      <div className="mx-auto mb-12 max-w-[560px] text-center">
        <h2 className="font-inter text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl">{p.title}</h2>
        <p className="mt-4 text-slate-500">{p.sub}</p>
      </div>
      <div className={cn("mx-auto grid gap-3", p.plans.length === 3 ? "max-w-[960px] md:grid-cols-3" : "max-w-[700px] md:grid-cols-2")}>
        {p.plans.map((plan) => (
          <div key={plan.name} className={cn("flex flex-col rounded-3xl p-6", plan.featured ? "bg-ink text-white" : "bg-[#f4f4f5] text-ink")}>
            <p className="text-sm font-bold">{plan.name}</p>
            <p className={cn("mt-1 text-xs", plan.featured ? "text-white/60" : "text-slate-500")}>{plan.tagline}</p>
            <p className="font-inter mt-6 text-5xl font-extrabold tracking-[-0.04em]">{plan.price}<span className={cn("ml-1.5 text-xs font-normal tracking-normal", plan.featured ? "text-white/60" : "text-slate-500")}>a month</span></p>
            <Link href={`/signup?next=${encodeURIComponent(`/choose-plan?plan=${plan.name}`)}`} className={cn("mt-6 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold", plan.featured ? "bg-brand text-white" : "bg-ink text-white")}>Get started</Link>
            <ul className="mt-6 space-y-3 text-[13px]">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><Check className={cn("mt-0.5 size-3.5 shrink-0", plan.featured ? "text-brand-bright" : "text-brand")} />{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">Introductory test pricing for early customers. Prices in INR.</p>
    </section>
  );
}

export function Faq({ c }: { c: LandingContent }) {
  return (
    <section id="faq" className={cn(wrap, "max-w-[760px] scroll-mt-20 py-16")}>
      <h2 className="font-inter mb-8 text-center text-4xl font-extrabold tracking-[-0.04em] text-ink">Questions</h2>
      <div className="space-y-2">
        {c.faq.map((f) => (
          <details key={f.q} className="group rounded-2xl bg-[#f4f4f5] px-6 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15px] font-semibold text-ink">
              {f.q}<ChevronDown className="size-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function FinalCta({ c }: { c: LandingContent }) {
  return (
    <section className={cn(wrap, "py-16")}>
      <div className="rounded-[2.5rem] bg-ink px-6 py-16 text-center text-white">
        <LogoMark className="mx-auto size-14" />
        <h2 className="font-inter mx-auto mt-6 max-w-[620px] text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">{c.cta.title}</h2>
        <p className="mx-auto mt-4 max-w-[480px] text-white/60">{c.cta.sub}</p>
        <Link href="/signup" className="mt-8 inline-flex h-12 items-center rounded-full bg-white px-8 text-[15px] font-semibold text-ink transition-transform hover:scale-[1.03]">Start free</Link>
      </div>
    </section>
  );
}

export function LandingFooter() {
  const product = [["Features", "/#features"], ["How it works", "/#how"], ["Pricing", "/#pricing"], ["FAQ", "/#faq"]];
  const channels = [
    { label: "WhatsApp enquiries", icon: MessageCircle },
    { label: "Email", icon: Mail },
    { label: "Website forms", icon: Globe },
    { label: "Phone calls", icon: Phone },
    { label: "CSV import", icon: FileSpreadsheet },
  ];
  const company = [["Sign in", "/login"], ["Create account", "/signup"], ["Privacy Policy", "/privacy-policy"], ["Terms", "/terms-of-service"]];
  const colTitle = "text-sm font-semibold text-ink";
  const link = "text-[15px] text-slate-500 transition-colors hover:text-ink";

  return (
    <footer className="overflow-hidden border-t border-slate-100 bg-white">
      <div className={cn(wrap, "pt-16")}>
        <div className="grid gap-12 md:grid-cols-[1.3fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-[280px] text-[17px] leading-relaxed text-slate-500">Recover the enquiries your team forgot to follow up.</p>
            <Link href="/signup" className={cn(btnDark, "mt-7 h-12 gap-2.5")}>
              <ArrowRight className="size-4" />
              Get started
            </Link>
            <p className="mt-5 font-mono text-xs text-slate-400">Plans from ₹499/mo · Pay by UPI</p>
          </div>

          <nav aria-label="Product">
            <h2 className={colTitle}>Product</h2>
            <ul className="mt-5 space-y-3.5">
              {product.map(([label, href]) => <li key={href}><Link href={href} className={link}>{label}</Link></li>)}
            </ul>
          </nav>

          <div>
            <h2 className={colTitle}>Works with</h2>
            <ul className="mt-5 space-y-3.5">
              {channels.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2.5 text-[15px] text-slate-500"><Icon className="size-[18px] text-slate-400" />{label}</li>
              ))}
            </ul>
          </div>

          <nav aria-label="Company">
            <h2 className={colTitle}>Company</h2>
            <ul className="mt-5 space-y-3.5">
              {company.map(([label, href]) => (
                <li key={label}><Link href={href} className={link}>{label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex items-center justify-between border-t border-slate-100 pt-8 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
          <a href="mailto:support@leadrescue.ai" aria-label="Email support" className="flex size-11 items-center justify-center rounded-full bg-[#f1f1f2] text-ink transition-colors hover:bg-[#e8e8ea]">
            <Mail className="size-[18px]" />
          </a>
        </div>
      </div>

      {/* oversized wordmark that fades into the page */}
      <div aria-hidden className="pointer-events-none mt-6 select-none text-center">
        <p className="font-inter -mb-[0.12em] text-[clamp(56px,17.5vw,260px)] leading-[0.9] font-extrabold tracking-[-0.06em] text-[#ededee] [mask-image:linear-gradient(to_bottom,black_25%,transparent_92%)]">
          {BRAND.prefix.toLowerCase()}
        </p>
      </div>
    </footer>
  );
}

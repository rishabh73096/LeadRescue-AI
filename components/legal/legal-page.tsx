import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LandingFooter } from "@/components/landing/sections";
import { Logo } from "@/components/ui/logo";
import { LEGAL_UPDATED, type LegalSection } from "@/config/legal";

export function LegalPage({ title, intro, sections, other }: { title: string; intro: string; sections: LegalSection[]; other: { label: string; href: string } }) {
  return (
    <>
      <header className="border-b border-slate-100">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-ink">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-medium text-slate-400">Last updated {LEGAL_UPDATED}</p>
        <h1 className="font-inter mt-2 text-4xl font-extrabold tracking-[-0.04em] text-ink sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-500">{intro}</p>

        <nav aria-label="On this page" className="mt-10 rounded-2xl bg-[#f6f6f7] p-5">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">On this page</p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#s${i + 1}`} className="text-slate-600 hover:text-ink">{i + 1}. {s.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`} className="scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight text-ink">{i + 1}. {s.title}</h2>
              {s.body?.map((p) => <p key={p} className="mt-3 leading-relaxed text-slate-600">{p}</p>)}
              {s.bullets ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-600 marker:text-slate-300">
                  {s.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-slate-100 pt-6 text-sm text-slate-500">
          Also read our <Link href={other.href} className="text-brand font-semibold hover:underline">{other.label}</Link>.
        </p>
      </main>

      <LandingFooter />
    </>
  );
}

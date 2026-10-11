import type { Metadata } from "next";
import { Audience, Bento, Faq, FinalCta, Hero, HowItWorks, LandingFooter, LandingNav, Pricing } from "@/components/landing/sections";
import { LANDING } from "@/config/landing";
import { BRAND } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `${BRAND.name}: ${BRAND.tagline}` },
  description: LANDING.subhead,
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <Hero c={LANDING} />
        <HowItWorks c={LANDING} />
        <Bento c={LANDING} />
        <Audience c={LANDING} />
        <Pricing c={LANDING} />
        <Faq c={LANDING} />
        <FinalCta c={LANDING} />
      </main>
      <LandingFooter />
    </>
  );
}

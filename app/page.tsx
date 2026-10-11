import type { Metadata } from "next";
import { Audience, Bento, Faq, FinalCta, Hero, HowItWorks, LandingFooter, LandingNav, Pricing } from "@/components/landing/sections";
import { JsonLd } from "@/components/seo/json-ld";
import { LANDING } from "@/config/landing";
import { BRAND, SEO, SITE_URL } from "@/config/site";
import { faqSchema, organizationSchema, softwareSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: SEO.title },
  description: SEO.description,
  keywords: SEO.keywords,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", url: SITE_URL, siteName: BRAND.name, locale: SEO.locale, title: SEO.title, description: SEO.description },
  twitter: { card: "summary_large_image", title: SEO.title, description: SEO.description },
};

export default function LandingPage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), softwareSchema(), faqSchema(LANDING.faq)]} />
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

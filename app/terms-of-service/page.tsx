import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { TERMS } from "@/config/legal";
import { BRAND } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service", description: `The rules for using ${BRAND.name}.`, robots: { index: true, follow: true } };

export default function TermsPage() {
  return <LegalPage title="Terms of Service" intro="The rules for using the service, paying for it and what to expect from us." sections={TERMS} other={{ label: "Privacy Policy", href: "/privacy-policy" }} />;
}

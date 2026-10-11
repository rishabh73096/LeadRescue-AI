import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { PRIVACY } from "@/config/legal";
import { BRAND } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy", description: `How ${BRAND.name} handles your data.`, robots: { index: true, follow: true } };

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" intro="What we collect, why we collect it, and the choices you have. Plain language, no surprises." sections={PRIVACY} other={{ label: "Terms of Service", href: "/terms-of-service" }} />;
}

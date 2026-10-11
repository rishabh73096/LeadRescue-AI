import { BRAND } from "@/config/site";

export const LEGAL_UPDATED = "11 October 2026";
export const LEGAL_EMAIL = "support@leadrescue.ai";

export interface LegalSection {
  title: string;
  body?: string[];
  bullets?: string[];
}

export const PRIVACY: LegalSection[] = [
  { title: "Who we are", body: [`${BRAND.name} ("we", "us") is a tool that helps small service businesses track enquiries, schedule follow-ups and draft replies. This policy explains what personal data we handle and why.`, `You can reach us at ${LEGAL_EMAIL}.`] },
  {
    title: "Data we collect",
    body: ["We handle two kinds of data:"],
    bullets: [
      "Your account data: name, email address, phone number, business name, role and password (stored hashed by our authentication provider).",
      "Your workspace data: the leads, notes, follow-up dates, reply drafts and settings you enter or import. This can include your customers' names, phone numbers, email addresses and the messages they sent you.",
      "Payment data: when you pay by UPI we receive the plan, amount and the UTR (transaction reference) you submit. We never see your UPI PIN, bank account or card details.",
      "Technical data: basic logs such as IP address, browser type and error reports, used to keep the service secure and working.",
    ],
  },
  {
    title: "Your customers' data",
    body: ["For the leads you store, you decide what is collected and why. You are the one responsible for having a lawful basis to contact those people, and we process their data only on your behalf to provide the service. Please do not upload sensitive data such as health, financial account or government ID details."],
  },
  {
    title: "How we use data",
    bullets: [
      "To provide the product: sign you in, show your leads and reminders, and generate reply drafts.",
      "To verify payments and activate or renew your plan.",
      "To contact you about your account, security and service changes.",
      "To fix bugs, prevent abuse and improve the product.",
    ],
    body: ["We do not sell personal data and we do not use your leads for advertising."],
  },
  {
    title: "AI reply drafts",
    body: ["When you ask for a draft, the lead's enquiry text, service and your price details are sent to our AI provider to generate the reply. Drafts are suggestions only. We never send messages to your customers: you review, edit and send every message yourself."],
  },
  {
    title: "Who we share data with",
    body: ["We use a small number of service providers who process data for us under their own security commitments:"],
    bullets: [
      "Supabase: authentication and database hosting.",
      "Our web hosting and infrastructure provider.",
      "Our AI provider, for generating drafts.",
      "Your bank and UPI apps process the payment itself; we only receive the reference you submit.",
    ],
  },
  { title: "Cookies and local storage", body: ["We use cookies and browser storage only to keep you signed in and remember simple preferences such as a collapsed sidebar. We do not use advertising or cross-site tracking cookies."] },
  { title: "How long we keep data", body: ["We keep account and workspace data while your account is active. If you ask us to delete your account, we delete your workspace data within 30 days, except records we must keep by law, such as payment and accounting records. Backups are overwritten on a regular cycle."] },
  {
    title: "Your rights",
    body: ["Under India's Digital Personal Data Protection Act, 2023 and similar laws, you can:"],
    bullets: ["Ask what personal data we hold about you and get a copy.", "Ask us to correct or update it.", "Ask us to delete it, or withdraw your consent.", "Nominate someone to exercise these rights on your behalf.", "Raise a grievance with us and, if unresolved, with the Data Protection Board of India."],
  },
  { title: "Security", body: ["Data is encrypted in transit, access to each workspace is restricted by row-level security in the database, and administrative access is limited. No system is perfectly secure, so please use a strong, unique password."] },
  { title: "Children", body: [`${BRAND.name} is for businesses and is not directed at children under 18.`] },
  { title: "Changes to this policy", body: ["If we make material changes we will update the date above and, where appropriate, notify you by email or in the app."] },
  { title: "Contact and grievances", body: [`For any request or complaint about your data, write to ${LEGAL_EMAIL}. We aim to reply within 7 working days.`] },
];

export const TERMS: LegalSection[] = [
  { title: "Agreement", body: [`By creating an account or using ${BRAND.name} you agree to these Terms and to our Privacy Policy. If you use the service for a business, you confirm you can bind that business.`] },
  { title: "The service", body: [`${BRAND.name} helps you record enquiries, track their status, schedule follow-ups and draft replies. It does not send messages to your customers, and it does not guarantee any number of replies, sales or recovered leads.`] },
  { title: "Your account", bullets: ["Provide accurate details and keep your password secret.", "You are responsible for activity under your account.", "Tell us promptly if you suspect unauthorised access.", "You must be at least 18 years old."] },
  {
    title: "Plans and payment",
    bullets: [
      "Plans are billed monthly in Indian rupees (INR). Current prices are shown on the pricing page and may change with notice.",
      "You pay by UPI and submit the UTR. Your plan is activated after we verify the payment, usually within a few hours on working days.",
      "Each payment covers 30 days. Plans do not renew automatically: you pay again to extend.",
      "Prices include applicable taxes unless stated otherwise. If you are GST-registered and need an invoice, contact us.",
      "A payment submitted with a wrong or reused UTR may be rejected.",
    ],
  },
  { title: "Refunds", body: [`If the service does not work as described, write to ${LEGAL_EMAIL} within 7 days of payment and we will review a refund in good faith. After 7 days, payments are non-refundable except where required by law.`] },
  {
    title: "Acceptable use",
    body: ["You agree not to:"],
    bullets: [
      "Use the service for spam, harassment, scams or anything unlawful.",
      "Contact people who have not agreed to hear from you, or break the rules of WhatsApp, email providers or telecom regulations when you send messages yourself.",
      "Upload data you have no right to use, or sensitive personal data.",
      "Probe, overload, reverse engineer or attempt to break the security of the service.",
      "Resell or share your account without our written consent.",
    ],
  },
  { title: "Your data and customers", body: ["You own the data you put into the service. You give us permission to store and process it to provide the service. You are responsible for having a lawful basis to store your customers' details and to contact them, and for responding to their requests."] },
  { title: "AI drafts", body: ["Drafts are generated automatically and may be inaccurate or unsuitable. Always read and edit a draft before you send it. You are responsible for what you send to your customers."] },
  { title: "Availability", body: ["We work to keep the service running but do not promise it will always be uninterrupted or error-free. We may update, change or pause features, with notice where practical."] },
  { title: "Suspension and termination", body: ["You can stop using the service at any time and ask us to delete your account. We may suspend or end access if you break these Terms, misuse the service, or fail to pay. On termination your right to use the service ends; we handle your data as described in the Privacy Policy."] },
  { title: "Liability", body: ["The service is provided \"as is\". To the extent the law allows, we are not liable for indirect or consequential loss, lost profits or lost business, and our total liability for any claim is limited to the amount you paid us in the 3 months before the claim."] },
  { title: "Governing law", body: ["These Terms are governed by the laws of India. Courts in India have jurisdiction over any dispute, after you have first tried to resolve it with us by writing to the contact below."] },
  { title: "Changes", body: ["We may update these Terms. If a change is material we will tell you in the app or by email. Continuing to use the service after the change means you accept it."] },
  { title: "Contact", body: [`Questions about these Terms: ${LEGAL_EMAIL}.`] },
];

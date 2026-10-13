# LeadRescue AI

Lead follow-up software for small service businesses in India (cleaning companies, salons, small agencies).
Owners add their enquiries, see exactly who needs a reply today, and get AI-drafted replies in English and Hindi.
It never sends messages for you: you review and send every message yourself.

- Plans: **Starter ₹499/mo** and **Pro ₹999/mo**, paid by **UPI** (QR code).
- Two kinds of people sign in: **customers** (business owners who buy the software) and the **platform admin** (you, who runs it).
- Product notes and status: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Market and pricing: [../MAIN-DOCUMENT.md](../MAIN-DOCUMENT.md).

---

## 1. What is in the product

### Customer workspace (`/dashboard` and friends)

| Page | What it does |
|---|---|
| Dashboard | Today's numbers, charts, leads that need a reply, recent activity |
| Leads | List, status tabs, search, add / edit / delete (with Undo), inline status change |
| Lead detail | Notes, follow-up presets, WhatsApp / call links, full activity timeline |
| Pipeline | Board with 5 stages (New, Contacted, Quote sent, Won, Lost), drag and drop |
| Follow-ups | Overdue, due today, upcoming, no date. Mark done and pick the next date |
| AI Replies | Draft a reply per lead (English or Hindi), edit, copy, open in WhatsApp. **Pro only** |
| Import Leads | CSV upload, column matching, preview, duplicate phone skipping |
| Settings | Business name, services and price ranges (used in drafts), plan and features, account |

### Platform admin console (`/admin`)

| Page | What it does |
|---|---|
| Overview | Customers, active subscriptions, MRR, payments waiting, revenue chart |
| Payments | Check each UPI payment (UTR) and **Verify** or **Reject**. Verify turns the plan on for 30 days |
| Customers | Every account. Change a customer's **plan** and **role**, see which features they have |
| Subscriptions | Days left, extend by 30 days, expire |
| Plans | What each plan includes, UPI receiver |

### Public site

Landing page (hero, animated "how it works" demo, bento features, pricing, FAQ, footer), Privacy Policy, Terms of Service, SEO (sitemap, robots, share image, structured data), installable app manifest, offline support.

---

## 2. Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui style components, Base UI |
| Backend | **Supabase** (Auth + Postgres + Row Level Security). No custom server |
| Charts | Recharts through **Evil Charts** (`components/evilcharts`) |
| Animation | `motion` (loaded lazily as `m` components) |
| UI kit extras | **Kobra** Navigation Menu, Carousel, Toast (`components/ui`) |
| Forms | Zod + a small `useForm` hook |
| UPI QR | `qrcode.react` |
| Offline | Service worker (`public/sw.js`) |

---

## 3. Quick start

```bash
npm install
cp .env.example .env.local     # then fill the values (section 4)
npm run dev                    # http://localhost:3000
```

Then set up Supabase once (section 5). Until then the app still opens and shows demo data stored in your browser.

Scripts: `npm run dev` · `npm run build` · `npm start` · `npm run lint`. (Do not run `npm run build` while `npm run dev` is running; they share the `.next` folder.)

---

## 4. Environment variables (`.env.local`)

| Variable | Needed | Meaning |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes (production) | Your real address, e.g. `https://leadrescue.ai`. Used by the sitemap, canonical links and share image |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | yes | Supabase publishable (anon) key. Safe to expose; RLS protects data |
| `NEXT_PUBLIC_UPI_VPA` | yes | Your UPI ID that receives payments, e.g. `name@ybl` |
| `NEXT_PUBLIC_UPI_PAYEE_NAME` | no | Name shown in the customer's UPI app. Default `LeadRescue AI` |
| `NEXT_PUBLIC_PAYMENT_TEST_MODE` | no | `true` = dummy QR and a one-click "Activate plan" button. **Must be `false` in production** |

Restart the dev server after changing `.env.local`. Never commit it. Never put a Supabase **service role** key in a `NEXT_PUBLIC_` variable.

---

## 5. Supabase setup (run once)

1. Create a Supabase project. Put its URL and publishable key in `.env.local`.
2. Open **SQL Editor** and run these **in this order**. (The `supabase/` folder is in `.gitignore`: the SQL has already been applied to the project and is not part of the repo. Keep your own copy if you need to set up another project.)

| File | Creates |
|---|---|
| `0001_subscriptions.sql` | `subscriptions`, `payments`, and the trigger that turns a plan on when a payment is verified |
| `0002_admin.sql` | `profiles` (auto-filled on signup), `platform_admins`, `is_platform_admin()`, admin rules |
| `0003_workspace_data.sql` | `leads`, `activities`, `drafts`, `workspace_settings` with RLS |
| `0004_test_payments.sql` | Optional. `app_flags` + `activate_test_plan()` for testing mode |
| `0005_roles_and_checks.sql` | `profiles.role`, locked-down roles, stricter admin check (email must be confirmed) |
| `0006_plan_features.sql` | `has_active_plan()`, Pro-only drafts, paid-only leads, admin can change plans and roles |
| `0007_grants.sql` | Table privileges for logged-in users (fixes "permission denied for table ...") |

The tables are: `subscriptions`, `payments`, `profiles`, `platform_admins`, `leads`, `activities`, `drafts`, `workspace_settings` (and `app_flags` for testing mode).

3. **Authentication settings**
   - Email confirmation: for easy testing, turn "Confirm email" off. In production keep it on (admin access needs a confirmed email).
   - Password reset: edit the **Reset Password** email template so it contains `{{ .Token }}`, and set the OTP length to 6. The app asks for the 6-digit code.
4. **Make yourself the admin**: sign up once at `/signup` with the email you want, then run:

```sql
insert into public.platform_admins (user_id)
select id from auth.users where email = 'you@example.com';
```

Admin accounts are never created from the signup form. Admins sign in at `/admin/login`.

---

## 6. Two logins, two areas

| | Customer | Platform admin |
|---|---|---|
| Sign in | `/login` (create account at `/signup`) | `/admin/login` |
| Lands in | `/dashboard` | `/admin` |
| Needs a plan | Yes (pays by UPI) | No, never |
| Sees | Leads, pipeline, follow-ups, replies, import, settings | Payments, customers, subscriptions, plans |

The customer menu and the admin menu are completely separate. Signing in as admin at `/login` still sends you to `/admin`.

---

## 7. Plans and feature gating

Defined once in `lib/plans.ts` and mirrored in the database (`0006`).

| Feature | Starter ₹499 | Pro ₹999 |
|---|---|---|
| Lead list, pipeline, CSV import, follow-up dates, activity history | ✓ | ✓ |
| AI reply drafts (English + Hindi) | locked | ✓ |
| 24h / 48h follow-up reminders | locked | ✓ |
| Overdue dashboard | locked | ✓ |

- In the app: `usePlan().can("aiReplies")`, `<FeatureGate feature="...">`, a "Pro" tag in the sidebar and an upgrade card.
- In the database: `has_active_plan('Pro')` blocks drafts for non-Pro users even if someone edits the browser code.
- Platform admins have every feature.

---

## 8. Payments (UPI)

1. Customer opens `/choose-plan`, picks a plan, sees a UPI QR for the right amount.
2. They pay in any UPI app and enter the **UTR** (transaction number).
3. A `payments` row is saved as `pending`.
4. You check your bank or UPI app, then open **Admin, Payments** and press **Verify**.
5. A database trigger gives the customer 30 days of that plan. Paying again adds 30 more days. Plans do not auto-renew.

There is **no automatic confirmation or webhook**, because a plain UPI ID cannot send one. For that you need a payment gateway (Razorpay, Cashfree, PayU). That is the planned next step.

**Testing mode:** set `NEXT_PUBLIC_PAYMENT_TEST_MODE=true` and run `0004`. `/choose-plan` then shows "Activate (test, no payment)". To switch it off for good: set the variable to `false` and run
`update public.app_flags set value = false where key = 'test_payments';`

---

## 9. Security model (role alone is never trusted)

1. **Roles are not user-editable.** `user_metadata` can be changed by the user, so it is never used for permissions. The workspace role lives in `profiles.role`; only an admin can change it.
2. **Server checks in `proxy.ts`** (Next.js middleware): guests are sent to login; `/admin/*` requires a row in `platform_admins`; workspace pages require an active plan (admins exempt).
3. **Row Level Security is the real lock.** Every table only returns the signed-in user's rows. Admin-only tables and actions use `is_platform_admin()` (confirmed email required). Paid data uses `has_active_plan()`.
4. **UI gates** (`RequireAuth`, `RequirePlan`, `AdminGate`, `FeatureGate`) only make the experience nicer; they are not the security.
5. Security headers and a Content Security Policy are set in `next.config.ts` (production). The Supabase address is allowed there.
6. Redirect targets are checked (`lib/safe-next.ts`) to stop open redirects.

---

## 10. Project structure

```
app/                     routes (App Router)
  (auth)/                login, signup, forgot-password
  (dashboard)/           customer workspace pages + loading skeletons
  admin/                 /admin/login and the admin console ((console) group)
  choose-plan/           plan + UPI payment
  privacy-policy/ terms-of-service/
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx
components/
  landing/               landing sections, animated demo, bento visuals, nav
  dashboard/             shell, sidebar, topbar, search, skeletons
  charts/                stat cards, chart cards, lazy chart wrappers
  evilcharts/            Evil Charts library files (area, bar)
  admin/ leads/ pipeline/ follow-ups/ replies/ import/ settings/ overview/
  billing/               FeatureGate and upgrade card
  auth/ ui/ providers/ seo/ legal/
config/                  site, landing text, navigation, legal text, auth switches
lib/                     helpers: plans, plan-store, collection, network, upi, csv, stats, seo...
services/                data access: leads, drafts, settings, admin, auth
hooks/                   useRole, useOnline, useReducedMotion, ...
utils/supabase/          browser, server and proxy Supabase clients
supabase/migrations/     SQL files (git-ignored, already applied, section 5)
public/                  sw.js (offline), offline.html, images
docs/ARCHITECTURE.md     longer product and architecture notes
```

---

## 11. How the main pieces work

- **Data layer.** `lib/collection.ts` sits between the screens and Supabase. Screens call simple functions (`addLead`, `setLeadStatus`...). Changes show instantly, then save in the background. If you are signed out (or the tables do not exist yet) it falls back to demo data in the browser. Signed in but offline, it shows the last saved copy.
- **Plan and role stores.** `lib/plan-store.ts` (plan + admin flag) and `hooks/use-role.ts` (role from `profiles`) are fetched once and shared.
- **Toasts.** Always use `notify` from `lib/toast.ts`: `message`, `description`, `action` (e.g. Undo), `promise`, `success`, `error`, `warning`, `info`. They render with the Kobra Toast.
- **Charts.** `components/charts/charts.tsx` lazy-loads the chart code, so pages open fast. Colours come from the `.viz` tokens in `app/globals.css`.
- **Animation.** All motion uses the lazy `m` components inside `MotionProvider`. Anything that animates must be rendered **inside** that provider (see `app/layout.tsx`).
- **Slow network ("lite mode").** On 3G, Data Saver or very low bandwidth, endless decorative animation is paused and a notice appears (`lib/network.ts`). "Reduce motion" is respected too.
- **Offline.** `public/sw.js` saves every page you open, so it opens again with no internet. Never-opened pages show `offline.html`. A "No internet connection" pill appears with a Retry button. Account data is not stored by the service worker.
- **SEO.** `app/layout.tsx` and `app/page.tsx` metadata, `lib/seo.ts` structured data (Organization, SoftwareApplication with INR prices, FAQ), `sitemap.ts`, `robots.ts`, generated share image.
- **Logout** asks "Sign out?" first, then returns to the right login page (customer or admin).

---

## 12. Developer switches

| Switch | File | Meaning |
|---|---|---|
| `GUARDS_ENABLED` | `config/auth.ts` | `true` = real login, plan and admin checks (use this normally). `false` = UI-development mode: no redirects, everything unlocked, sample data |
| `NEXT_PUBLIC_PAYMENT_TEST_MODE` | `.env.local` | Payment testing mode (section 8) |

---

## 13. Before you launch

- [ ] `GUARDS_ENABLED = true`
- [ ] `NEXT_PUBLIC_PAYMENT_TEST_MODE=false` and `update public.app_flags set value = false where key = 'test_payments';`
- [ ] `NEXT_PUBLIC_SITE_URL` is your real domain; submit `/sitemap.xml` in Google Search Console
- [ ] `NEXT_PUBLIC_UPI_VPA` is your real UPI ID (scan the QR with another phone and check the payee and amount)
- [ ] All migrations `0001` to `0007` run; you are listed in `platform_admins`
- [ ] "Confirm email" is on in Supabase Auth
- [ ] Replace the placeholder support email `support@leadrescue.ai` (footer, legal pages, structured data)
- [ ] Have the Privacy Policy and Terms (`config/legal.ts`) reviewed by someone qualified; they are drafts
- [ ] Replace the placeholder auth screen text and images in `data/auth.ts`

---

## 14. Troubleshooting

| Problem | Fix |
|---|---|
| `UPI is not configured` | Set `NEXT_PUBLIC_UPI_VPA` in `.env.local` and restart `npm run dev` |
| `permission denied for table ...` | Run `0007_grants.sql` |
| `relation "public.leads" does not exist` | Run the migrations in order (section 5) |
| "This page couldn't load" with a `LazyMotion` / `motion` message | A component uses `motion.*`. Use `m.*` from `motion/react-m` and render it inside `MotionProvider` |
| Signed in as admin but sent to "choose a plan" | Run `0005` and `0006`, and make sure you are in `platform_admins` with a confirmed email |
| Starter user sees an upgrade card on AI Replies | Expected. Pro feature |
| Offline mode does nothing in dev | Open the page once while online first, then clear site data (DevTools, Application, Clear storage) if an old service worker is stuck |
| Build fails with chunk / 500 errors | Stop `npm run dev` and any old `next start`, then run `npm run build` again |
| New `.env.local` values not applied | Restart the dev server |

---

## 15. Not built yet

- Automatic UPI confirmation and renewals (needs Razorpay or similar, plus a webhook route and a server-side key)
- Real AI endpoint for drafts (`lib/draft-reply.ts` is a template stand-in; keep the same inputs and output)
- Staff members inside one workspace (data is per user today; would need a `workspace_id`)
- WhatsApp Business API sending (out of scope on purpose: messages are always sent by the owner)
- Kobra paid components (Accordion, Sheet) need a registry token; the FAQ uses a native accordion
- MCP server (see `docs/ARCHITECTURE.md`)

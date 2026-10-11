# LeadRescue AI: Architecture, Flow and Status

AI-assisted enquiry follow-up for small service businesses (first target: cleaning companies). See [../../MAIN-DOCUMENT.md](../../MAIN-DOCUMENT.md) for market, pricing and validation.

## 1. Architecture

```
Browser (Next.js 16, React 19, Tailwind 4)
  app/(auth)/*        login · signup · forgot-password
  app/(dashboard)/*   dashboard · leads · pipeline · follow-ups · replies · import · settings
        │  Supabase JS (@supabase/ssr): cookie session, RLS-scoped queries
        │  proxy.ts refreshes the session and guards routes
        ▼
Supabase (being set up by the owner)  ◄──►  MCP server (pending)
  Auth · Postgres (RLS per user/workspace)     exposes lead tools to Claude / agents
  subscriptions · payments · leads · activities
        │
        └── LLM API (drafts only, per-workspace monthly cap)
```

Rule: **AI drafts text; application code owns statuses, dates, reminders, limits.**

## 2. Data model (Supabase Postgres)

| Collection | Key fields |
|---|---|
| workspaces | name, industry, services[], priceRanges, language, plan, aiUsage{month,count} |
| users | workspaceId, name, email, role (owner/admin/staff), passwordHash |
| leads | workspaceId, name, phone, email, source, service, message, status (new/contacted/quote_sent/won/lost), value, nextFollowUpAt, ownerId, createdAt |
| activities | workspaceId, leadId, type (status/note/draft/reminder), body, by, at |
| drafts | workspaceId, leadId, language (en/hi), text, edited, sentMarkedAt |
| imports | workspaceId, filename, rows, created, skipped, errors[] |

Indexes: `(workspace_id, status)`, `(workspace_id, next_follow_up_at)`, unique `(workspace_id, phone)` (soft). Every table has RLS; users only see rows of their own workspace.

Already defined in `supabase/migrations/0001_subscriptions.sql`: `subscriptions` (user_id, plan, status, current_period_end) and `payments` (user_id, plan, amount_inr, upi_ref, status pending/verified/rejected). A trigger activates 30 days of plan when a payment is set to `verified`. Users can read their own rows and insert a pending payment; they cannot activate anything.

## 3. Core flows

**Enquiry → rescue**
1. Lead added manually or via CSV import → status `new`, `nextFollowUpAt` = +1 day.
2. Dashboard lists leads with a *reason*: no reply in 24h, quote sent 48h ago, follow-up overdue.
3. Owner opens lead → "Draft reply" → server builds prompt (service, price range, enquiry, language) → draft returned, editable.
4. Owner copies/sends manually, marks Contacted/Quote Sent; activity logged; next follow-up date set.
5. Won/Lost closes the lead.

**Auth (Supabase):** signup (`signUp`, name/phone/role in user metadata) → login (`signInWithPassword`) → session cookie → `AuthProvider` listens to `onAuthStateChange`. `proxy.ts` redirects guests away from app routes (`/login?next=…`) and signed-in users away from `/login`, `/signup`. Forgot password: `resetPasswordForEmail` → 6-digit code from the email (`verifyOtp`, type `recovery`) → `updateUser({password})` → sign out → login. The recovery email template must contain `{{ .Token }}`.

**Subscription (India, UPI QR):** `/choose-plan` → pick plan → QR (`upi://pay?pa=<VPA>&am=<₹>&cu=INR`, env `NEXT_PUBLIC_UPI_VPA`) → user pays in any UPI app → enters UTR → `payments` row (`pending`) → owner checks the UPI/bank app and runs `update payments set status='verified' where upi_ref='<UTR>'` → trigger activates the plan → dashboard unlocks (`RequirePlan` reads `subscriptions`). No payment gateway yet; Razorpay is the later upgrade for automatic verification and renewals.

## 4. Routes

| Route | Purpose | Status |
|---|---|---|
| /login /signup /forgot-password | Auth | Done |
| / | Public landing page | Done |
| /choose-plan | Plan selection + UPI QR payment + UTR submit | Done (manual verification) |
| /admin | Platform admin overview: customers, MRR, payments to verify | Done (needs migration 0002) |
| /admin/payments | Verify or reject UPI payments by UTR | Done |
| /admin/customers | Accounts with plan and status | Done |
| /admin/subscriptions | Extend or expire plans, days left | Done |
| /admin/plans | Read-only plans and UPI receiver | Done |
| /dashboard | Today's work: stats, needs-a-reply list, pipeline bars, recent activity | Done (UI, local data) |
| /leads | List, status tabs, search, add/edit/delete, inline status | Done (UI, local data) |
| /leads/[id] | Lead detail, notes, follow-up presets, activity timeline | Done (UI, local data) |
| /pipeline | Stage board, drag and drop | Done (UI, local data) |
| /follow-ups | Overdue / today / upcoming / no date, mark done + next date | Done (UI, local data) |
| /replies | Draft per lead, EN/HI, edit, copy, WhatsApp link, monthly cap | Done (template drafts; AI endpoint pending) |
| /import | CSV upload, column mapping, preview, duplicate skip | Done (UI, local data) |
| /settings | Business, services and prices, plan and usage, account | Done (UI, local data) |

## 5. Data access (pending: Supabase queries replace the REST API)

`POST /auth/*` (existing contract) · `GET/POST /leads`, `PATCH /leads/:id`, `POST /leads/:id/status` · `GET /follow-ups?due=overdue|today` · `POST /leads/:id/draft {language}` · `POST /imports/csv` · `GET /usage`.

## 6. MCP build (prototype)

An MCP server lets Claude (or any agent) operate a workspace while building and demoing the prototype, and later powers an in-app assistant.

| Tool | Input | Output |
|---|---|---|
| list_leads | status?, due? | leads[] |
| get_overdue_followups | limit? | leads[] with reason |
| add_lead | name, contact, service, message | lead |
| update_lead_status | id, status, note? | lead |
| set_followup | id, date | lead |
| draft_reply | id, language | draft text (not sent) |
| import_leads_csv | csv text | counts |

Resources: `workspace://settings`, `lead://{id}`. Guardrails: workspace-scoped token, no send-message tool, usage cap applies to `draft_reply`.

## 7. Frontend build order (UI first, one screen at a time)

Backend is Supabase, set up separately. Screens are built against `services/*.ts` local stores so they can be swapped to Supabase queries without UI changes.

All eight workspace screens and the five admin screens are built. `services/leads.ts`, `drafts.ts`, `settings.ts` now read and write Supabase through `lib/collection.ts` (tables from `0003_workspace_data.sql`, RLS by `user_id`). When signed out, or if the tables don't exist yet, they fall back to localStorage demo data. Remaining: connect the AI draft endpoint (replaces `lib/draft-reply.ts`), enforce plan and draft limits server-side, multi-user workspaces (staff roles) which need a `workspace_id` instead of `user_id`.

**Platform admin:** separate from workspace roles (owner/admin/staff). A user is a platform admin only if their id is in `platform_admins` (migration `0002_admin.sql`; RLS enforces it). Admin nav items are hidden from everyone else (`config/navigation.ts`, `usePlatformAdmin`). Admin data comes from `profiles`, `payments`, `subscriptions`; with guards off and no Supabase, pages show sample data.

## 8. Prototype scope (original build order)

1. Backend skeleton + auth + workspace (days 6–8)
2. Leads CRUD + statuses + activities (9–12)
3. Follow-up dates and overdue dashboard (13–14)
4. `draft_reply` endpoint + UI (15–17)
5. CSV import, usage limits (18–20)
6. MCP server wrapping the same service layer (parallel, ~1 day)

## 9. Feature status

| Feature | Status | Where |
|---|---|---|
| Auth on Supabase: login, signup, forgot password (emailed 6-digit code) | Done, untested against live project | `services/auth.ts`, `components/auth/`, `app/(auth)/` |
| Session: Supabase cookie session, `AuthProvider`, `useAuthState`; route guard in `proxy.ts` | Done | `context/AuthContext.tsx`, `proxy.ts`, `utils/supabase/` |
| Role hook + role-filtered navigation (owner / admin / staff) | Done | `hooks/use-role.ts`, `config/navigation.ts` |
| Dashboard shell: topbar, sidebar, page search (Ctrl/Cmd+K), access-denied | Done | `components/dashboard/` |
| UI kit (forms, tables, modals, tabs, toasts, skeletons, pagination, etc.) | Done | `components/ui/` |
| Zod form schemas + `useForm` hook | Done | `lib/schemas.ts`, `hooks/use-form.ts` |
| Security headers / CSP, open-redirect-safe `next` param | Done | `next.config.ts`, `lib/safe-next.ts` |
| Type-check and production build pass | Done | verified |
| Landing page: hero, flow demo, feature grid, scenarios, pricing, FAQ, CTA | Done | `app/page.tsx`, `components/landing/`, `config/landing.ts` |
| Purchase flow: pricing → signup → choose plan → UPI QR → UTR → manual verify → dashboard | Done (manual verification) | `components/landing/plan-picker.tsx`, `lib/subscription.ts`, `lib/upi.ts`, `supabase/migrations/` |
| Workspace screens: leads, lead detail, pipeline, follow-ups, dashboard, AI replies, import, settings | Done, run on local demo data | `components/{leads,pipeline,follow-ups,overview,replies,import,settings}/`, `services/*.ts`, `lib/leads.ts` |
| Platform admin: overview, payments, customers, subscriptions, plans | Done, sample data until Supabase is connected | `components/admin/`, `services/admin.ts`, `supabase/migrations/0002_admin.sql` |
| Route/plan guards | Temporarily OFF (`GUARDS_ENABLED=false` in `config/auth.ts`); turn on before launch | `config/auth.ts` |
| Per-product auth text, SVG art, accent color, logo mark | Done | `data/auth.ts`, `public/images/auth/`, `app/globals.css` |
| Supabase data layer: leads, activities, drafts, settings with RLS | Done in code; owner must run migrations 0001–0003 | `lib/collection.ts`, `services/`, `supabase/migrations/` |
| Replace auth hero text/imagery and logo mark with real brand | Pending | `data/auth.ts`, `public/images/` |
| Razorpay (automatic UPI verification, renewals); plan limits and AI usage caps | Pending | manual UPI QR in place |
| Payment admin screen and renewal reminders | Pending | verification is a SQL update today |
| MVP 1: Business signup and workspace | Pending | auth UI done; workspace creation needs backend |
| MVP 2: Add/import leads | Pending | |
| MVP 3: Lead pipeline and status updates | Pending | |
| MVP 4: AI reply drafts (editable, EN/HI) | Pending | |
| MVP 5: Follow-up dates and overdue dashboard | Pending | |
| MVP 6: Activity history and usage limits | Pending | |
| MCP server | Pending | |
| 24h/48h quote reminders | Pending | post-MVP |
| WhatsApp Business API sending | Out of scope | needs consent, templates, fees |

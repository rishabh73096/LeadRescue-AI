# LeadRescue AI: Architecture, Flow and Status

AI-assisted enquiry follow-up for small service businesses (first target: cleaning companies). See [../../MAIN-DOCUMENT.md](../../MAIN-DOCUMENT.md) for market, pricing and validation.

## 1. Architecture

```
Browser (Next.js 16, React 19, Tailwind 4)
  app/(auth)/*        login · signup · forgot-password
  app/(dashboard)/*   dashboard · leads · pipeline · follow-ups · replies · import · settings
        │  Api() axios client (Bearer token + x-api-key)
        ▼
Backend REST API (pending)           ◄──►  MCP server (pending)
  auth · workspaces · leads · activities        exposes lead tools to Claude / agents
  follow-ups · ai-drafts · imports · usage
        │                                   │
        ├── MongoDB (tenant-scoped: every doc has workspaceId)
        └── LLM API (drafts only, per-workspace monthly cap)
```

Rule: **AI drafts text; application code owns statuses, dates, reminders, limits.**

## 2. Data model (MongoDB)

| Collection | Key fields |
|---|---|
| workspaces | name, industry, services[], priceRanges, language, plan, aiUsage{month,count} |
| users | workspaceId, name, email, role (owner/admin/staff), passwordHash |
| leads | workspaceId, name, phone, email, source, service, message, status (new/contacted/quote_sent/won/lost), value, nextFollowUpAt, ownerId, createdAt |
| activities | workspaceId, leadId, type (status/note/draft/reminder), body, by, at |
| drafts | workspaceId, leadId, language (en/hi), text, edited, sentMarkedAt |
| imports | workspaceId, filename, rows, created, skipped, errors[] |

Indexes: `{workspaceId, status}`, `{workspaceId, nextFollowUpAt}`, unique `{workspaceId, phone}` (soft).

## 3. Core flows

**Enquiry → rescue**
1. Lead added manually or via CSV import → status `new`, `nextFollowUpAt` = +1 day.
2. Dashboard lists leads with a *reason*: no reply in 24h, quote sent 48h ago, follow-up overdue.
3. Owner opens lead → "Draft reply" → server builds prompt (service, price range, enquiry, language) → draft returned, editable.
4. Owner copies/sends manually, marks Contacted/Quote Sent; activity logged; next follow-up date set.
5. Won/Lost closes the lead.

**Auth:** signup (creates workspace + owner) → login → token in localStorage → `GET /auth/profile` hydrates `AuthProvider` → dashboard. Forgot password: `sendOTP` → `verifyOTP` → `changePassword`.

## 4. Routes

| Route | Purpose | Status |
|---|---|---|
| /login /signup /forgot-password | Auth | Done |
| / | Public landing page | Done |
| /choose-plan | Plan selection after signup | Prototype |
| /dashboard | Dashboard placeholder (today's work) | Prototype placeholder |
| /leads, /leads/[id] | List, filters, detail with activity timeline | Pending |
| /pipeline | Stage board | Pending |
| /follow-ups | Overdue / due today / upcoming | Pending |
| /replies | Draft history, language toggle | Pending |
| /import | CSV upload and mapping | Pending |
| /settings | Services, price ranges, usage, plan | Pending |

## 5. API (pending)

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

## 7. Prototype scope (build order)

1. Backend skeleton + auth + workspace (days 6–8)
2. Leads CRUD + statuses + activities (9–12)
3. Follow-up dates and overdue dashboard (13–14)
4. `draft_reply` endpoint + UI (15–17)
5. CSV import, usage limits (18–20)
6. MCP server wrapping the same service layer (parallel, ~1 day)

## 8. Feature status

| Feature | Status | Where |
|---|---|---|
| Auth UI: login, signup, forgot password (OTP, 4-digit, 5 min expiry) | Done | `components/auth/`, `app/(auth)/` |
| Session: token store, `AuthProvider`, `useAuthState`, 401 handling | Done | `context/AuthContext.tsx`, `lib/api.ts` |
| Role hook + role-filtered navigation (owner / admin / staff) | Done | `hooks/use-role.ts`, `config/navigation.ts` |
| Dashboard shell: topbar, sidebar, page search (Ctrl/Cmd+K), access-denied | Done | `components/dashboard/` |
| UI kit (forms, tables, modals, tabs, toasts, skeletons, pagination, etc.) | Done | `components/ui/` |
| Zod form schemas + `useForm` hook | Done | `lib/schemas.ts`, `hooks/use-form.ts` |
| Security headers / CSP, open-redirect-safe `next` param | Done | `next.config.ts`, `lib/safe-next.ts` |
| Type-check and production build pass | Done | verified |
| Landing page: hero, flow demo, feature grid, scenarios, pricing, FAQ, CTA | Done | `app/page.tsx`, `components/landing/`, `config/landing.ts` |
| Purchase flow: pricing → signup → choose plan → dashboard (plan gate) | Prototype | `app/choose-plan/`, `lib/subscription.ts`; plan stored in browser, no real payment |
| Per-product auth text, SVG art, accent color, logo mark | Done | `data/auth.ts`, `public/images/auth/`, `app/globals.css` |
| Backend API (auth + data), MongoDB, tenant scoping | Pending | none in repo |
| Replace auth hero text/imagery and logo mark with real brand | Pending | `data/auth.ts`, `public/images/` |
| Billing (Razorpay/Stripe), plan limits, usage caps | Pending | |
| Real billing webhook to activate plan (replaces browser-stored plan) | Pending | |
| MVP 1: Business signup and workspace | Pending | auth UI done; workspace creation needs backend |
| MVP 2: Add/import leads | Pending | |
| MVP 3: Lead pipeline and status updates | Pending | |
| MVP 4: AI reply drafts (editable, EN/HI) | Pending | |
| MVP 5: Follow-up dates and overdue dashboard | Pending | |
| MVP 6: Activity history and usage limits | Pending | |
| MCP server | Pending | |
| 24h/48h quote reminders | Pending | post-MVP |
| WhatsApp Business API sending | Out of scope | needs consent, templates, fees |

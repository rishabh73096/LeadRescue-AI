-- Workspace data: leads, activities, drafts, settings. Each row belongs to one user (the workspace owner).
-- Run after 0001 and 0002.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  phone text not null default '',
  email text not null default '',
  source text not null default 'other' check (source in ('website', 'whatsapp', 'phone', 'email', 'referral', 'other')),
  service text not null default '' check (char_length(service) <= 120),
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'new' check (status in ('new', 'contacted', 'quote_sent', 'won', 'lost')),
  value integer not null default 0 check (value >= 0),
  next_follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_user_status_idx on public.leads (user_id, status);
create index if not exists leads_user_followup_idx on public.leads (user_id, next_follow_up_at);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  type text not null check (type in ('created', 'status', 'note', 'followup', 'draft', 'edit')),
  body text not null check (char_length(body) <= 2000),
  at timestamptz not null default now()
);
create index if not exists activities_lead_idx on public.activities (lead_id, at desc);

create table if not exists public.drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  language text not null check (language in ('en', 'hi')),
  text text not null check (char_length(text) <= 4000),
  created_at timestamptz not null default now()
);
create index if not exists drafts_user_idx on public.drafts (user_id, created_at desc);

create table if not exists public.workspace_settings (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.activities enable row level security;
alter table public.drafts enable row level security;
alter table public.workspace_settings enable row level security;

create policy "own leads" on public.leads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own activities" on public.activities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own drafts" on public.drafts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own settings" on public.workspace_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

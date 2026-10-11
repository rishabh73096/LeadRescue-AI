-- Subscriptions + manual UPI payments. Run in Supabase SQL editor.
-- Flow: user pays via UPI QR -> submits UTR (payments row, 'pending') ->
-- you verify it in your bank/UPI app -> set status = 'verified' -> trigger activates the plan for 30 days.

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null check (plan in ('Starter', 'Pro')),
  status text not null default 'active' check (status in ('active', 'expired')),
  current_period_end timestamptz not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  plan text not null check (plan in ('Starter', 'Pro')),
  amount_inr integer not null,
  upi_ref text not null check (upi_ref ~ '^[A-Za-z0-9]{8,24}$'),
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  -- keep prices in sync with config/landing.ts
  constraint payments_amount_matches_plan check ((plan = 'Starter' and amount_inr = 499) or (plan = 'Pro' and amount_inr = 999)),
  constraint payments_upi_ref_unique unique (upi_ref)
);

create index if not exists payments_user_idx on public.payments (user_id, created_at desc);

alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;

create policy "read own subscription" on public.subscriptions for select using (auth.uid() = user_id);

create policy "read own payments" on public.payments for select using (auth.uid() = user_id);
create policy "submit own pending payment" on public.payments for insert
  with check (auth.uid() = user_id and status = 'pending');

-- Activate (or extend) the plan when a payment is marked verified.
create or replace function public.activate_subscription() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'verified' and old.status is distinct from 'verified' then
    insert into public.subscriptions (user_id, plan, status, current_period_end, updated_at)
    values (new.user_id, new.plan, 'active', now() + interval '30 days', now())
    on conflict (user_id) do update set
      plan = excluded.plan,
      status = 'active',
      current_period_end = greatest(public.subscriptions.current_period_end, now()) + interval '30 days',
      updated_at = now();
  end if;
  return new;
end $$;

create trigger payments_activate after update of status on public.payments
  for each row execute function public.activate_subscription();

-- To verify a payment (SQL editor / service role only; clients cannot update):
--   update public.payments set status = 'verified' where upi_ref = '<UTR>';

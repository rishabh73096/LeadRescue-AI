-- Testing mode for plans: lets a signed-in user activate a plan without paying,
-- but ONLY while the 'test_payments' flag below is true. Set it to false before launch.

create table if not exists public.app_flags (
  key text primary key,
  value boolean not null default false
);

alter table public.app_flags enable row level security;
drop policy if exists "anyone can read flags" on public.app_flags;
create policy "anyone can read flags" on public.app_flags for select using (true);

insert into public.app_flags (key, value) values ('test_payments', true)
on conflict (key) do nothing;

create or replace function public.activate_test_plan(p_plan text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_plan not in ('Starter', 'Pro') then raise exception 'unknown plan'; end if;
  if not coalesce((select value from public.app_flags where key = 'test_payments'), false) then
    raise exception 'test payments are switched off';
  end if;

  insert into public.subscriptions (user_id, plan, status, current_period_end, updated_at)
  values (auth.uid(), p_plan, 'active', now() + interval '30 days', now())
  on conflict (user_id) do update set
    plan = excluded.plan,
    status = 'active',
    current_period_end = now() + interval '30 days',
    updated_at = now();
end $$;

revoke execute on function public.activate_test_plan(text) from public, anon;
grant execute on function public.activate_test_plan(text) to authenticated;

-- BEFORE LAUNCH run:  update public.app_flags set value = false where key = 'test_payments';

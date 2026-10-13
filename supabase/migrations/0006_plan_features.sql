-- Plan features enforced in the database (the UI also hides them, but this is the real lock),
-- plus what the platform admin may change.

-- True when the signed-in user has an active, unexpired plan that includes the feature tier.
-- p_min = 'Starter' (any paid plan) or 'Pro'. Platform admins always pass.
create or replace function public.has_active_plan(p_min text) returns boolean
language sql security definer stable set search_path = public as $$
  select public.is_platform_admin() or exists (
    select 1 from public.subscriptions s
    where s.user_id = auth.uid()
      and s.status = 'active'
      and s.current_period_end > now()
      and (p_min = 'Starter' or s.plan = 'Pro')
  );
$$;

-- AI reply drafts are a Pro feature: only Pro (or admin) can create or edit them.
drop policy if exists "own drafts" on public.drafts;
drop policy if exists "read own drafts" on public.drafts;
drop policy if exists "delete own drafts" on public.drafts;
drop policy if exists "write drafts on Pro" on public.drafts;
drop policy if exists "edit drafts on Pro" on public.drafts;

create policy "read own drafts" on public.drafts
  for select using (auth.uid() = user_id);
create policy "delete own drafts" on public.drafts
  for delete using (auth.uid() = user_id);
create policy "write drafts on Pro" on public.drafts
  for insert with check (auth.uid() = user_id and public.has_active_plan('Pro'));
create policy "edit drafts on Pro" on public.drafts
  for update using (auth.uid() = user_id and public.has_active_plan('Pro'))
  with check (auth.uid() = user_id and public.has_active_plan('Pro'));

-- Everything in the workspace needs a paid plan (Starter or Pro).
drop policy if exists "own leads" on public.leads;
create policy "own leads" on public.leads
  for all using (auth.uid() = user_id and public.has_active_plan('Starter'))
  with check (auth.uid() = user_id and public.has_active_plan('Starter'));

drop policy if exists "own activities" on public.activities;
create policy "own activities" on public.activities
  for all using (auth.uid() = user_id and public.has_active_plan('Starter'))
  with check (auth.uid() = user_id and public.has_active_plan('Starter'));

-- Platform admin can change a customer's plan (create one if they have none) and their workspace role.
drop policy if exists "admin inserts subscriptions" on public.subscriptions;
create policy "admin inserts subscriptions" on public.subscriptions
  for insert with check (public.is_platform_admin());
grant insert on public.subscriptions to authenticated;

drop policy if exists "admin updates profiles" on public.profiles;
create policy "admin updates profiles" on public.profiles
  for update using (public.is_platform_admin()) with check (public.is_platform_admin());
-- only the role column can ever be written, and only through the admin policy above
grant update (role) on public.profiles to authenticated;

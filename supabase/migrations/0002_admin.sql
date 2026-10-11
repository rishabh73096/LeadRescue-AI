-- Platform admin (you, the SaaS owner): verify UPI payments, see customers and subscriptions.
-- Run after 0001_subscriptions.sql.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.profiles enable row level security;
alter table public.platform_admins enable row level security;

-- Copy basic details from auth.users so admins can see who a payment belongs to.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- backfill existing users
insert into public.profiles (id, email, name, phone)
select id, email, raw_user_meta_data ->> 'name', raw_user_meta_data ->> 'phone' from auth.users
on conflict (id) do nothing;

create or replace function public.is_platform_admin() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.platform_admins where user_id = auth.uid());
$$;

create policy "read own profile" on public.profiles for select using (auth.uid() = id);
create policy "admin reads profiles" on public.profiles for select using (public.is_platform_admin());
create policy "read own admin row" on public.platform_admins for select using (auth.uid() = user_id);

create policy "admin reads payments" on public.payments for select using (public.is_platform_admin());
create policy "admin updates payments" on public.payments for update
  using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy "admin reads subscriptions" on public.subscriptions for select using (public.is_platform_admin());
create policy "admin updates subscriptions" on public.subscriptions for update
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- Make yourself an admin (SQL editor, once):
--   insert into public.platform_admins (user_id) select id from auth.users where email = 'you@example.com';

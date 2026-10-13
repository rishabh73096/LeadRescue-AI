-- Roles must never come from anything a user can edit (like user_metadata).
-- This adds a server-side role and tightens the admin check.

-- 1) Workspace role lives in profiles. Users can read it but cannot change it
--    (no update policy and no UPDATE grant on profiles).
alter table public.profiles
  add column if not exists role text not null default 'owner' check (role in ('owner', 'admin', 'staff'));

-- 2) New profiles always start as 'owner'. The role sent from the signup form is ignored.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, phone, role)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'phone', 'owner')
  on conflict (id) do nothing;
  return new;
end $$;

-- 3) Platform admin = listed in platform_admins AND has a confirmed email.
create or replace function public.is_platform_admin() returns boolean
language sql security definer stable set search_path = public, auth as $$
  select exists (
    select 1
    from public.platform_admins pa
    join auth.users u on u.id = pa.user_id
    where pa.user_id = auth.uid() and u.email_confirmed_at is not null
  );
$$;

-- 4) Make sure signed-in users can never write to the role tables directly.
revoke insert, update, delete on public.profiles from authenticated, anon;
revoke insert, update, delete on public.platform_admins from authenticated, anon;

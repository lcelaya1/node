create table if not exists public.demo_users (
  id uuid primary key default gen_random_uuid(),
  seed_user_id bigint not null unique,
  name text not null,
  age integer not null,
  city text not null,
  bio text not null,
  plans_created integer not null default 0,
  plans_done integer not null default 0,
  avatar_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_users_name_idx
  on public.demo_users (name);

create or replace function public.set_demo_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_demo_users_updated_at on public.demo_users;

create trigger set_demo_users_updated_at
before update on public.demo_users
for each row
execute function public.set_demo_users_updated_at();

create table if not exists public.demo_user_interests (
  id uuid primary key default gen_random_uuid(),
  seed_demo_user_interest_id bigint not null unique,
  demo_user_id uuid not null references public.demo_users(id) on delete cascade,
  interest_catalog_id uuid not null references public.interest_catalog(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (demo_user_id, interest_catalog_id)
);

create index if not exists demo_user_interests_demo_user_id_idx
  on public.demo_user_interests (demo_user_id);

create index if not exists demo_user_interests_interest_catalog_id_idx
  on public.demo_user_interests (interest_catalog_id);

alter table public.demo_users enable row level security;
alter table public.demo_user_interests enable row level security;

drop policy if exists "Authenticated users can read demo users" on public.demo_users;
create policy "Authenticated users can read demo users"
on public.demo_users
for select
to authenticated
using (true);

drop policy if exists "Service role manages demo users" on public.demo_users;
create policy "Service role manages demo users"
on public.demo_users
for all
to service_role
using (true)
with check (true);

drop policy if exists "Authenticated users can read demo user interests" on public.demo_user_interests;
create policy "Authenticated users can read demo user interests"
on public.demo_user_interests
for select
to authenticated
using (true);

drop policy if exists "Service role manages demo user interests" on public.demo_user_interests;
create policy "Service role manages demo user interests"
on public.demo_user_interests
for all
to service_role
using (true)
with check (true);

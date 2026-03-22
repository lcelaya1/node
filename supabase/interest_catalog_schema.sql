create table if not exists public.interest_catalog (
  id uuid primary key default gen_random_uuid(),
  seed_interest_id bigint not null unique,
  name text not null unique,
  photo_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists interest_catalog_name_idx
  on public.interest_catalog (name);

create or replace function public.set_interest_catalog_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_interest_catalog_updated_at on public.interest_catalog;

create trigger set_interest_catalog_updated_at
before update on public.interest_catalog
for each row
execute function public.set_interest_catalog_updated_at();

alter table public.interest_catalog enable row level security;

drop policy if exists "Authenticated users can read interest catalog" on public.interest_catalog;
create policy "Authenticated users can read interest catalog"
on public.interest_catalog
for select
to authenticated
using (true);

drop policy if exists "Service role manages interest catalog" on public.interest_catalog;
create policy "Service role manages interest catalog"
on public.interest_catalog
for all
to service_role
using (true)
with check (true);

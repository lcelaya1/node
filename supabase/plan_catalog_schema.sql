-- Catalog of curated plans used by the Join flow.
-- This is separate from public.plans, which stores user-created plans.

create table if not exists public.plan_catalog (
  id uuid primary key default gen_random_uuid(),
  seed_plan_id bigint not null unique,
  title text not null,
  event_date date not null,
  start_time text not null,
  place_name text not null,
  address text not null,
  description text not null,
  social_battery text not null check (social_battery in ('low', 'mid', 'full')),
  budget text not null check (budget in ('free', '€', '€€', '€€€')),
  distance text not null check (distance in ('close-by', 'short-ride', 'further-out')),
  timing text not null check (timing in ('today', 'tomorrow', 'weekend')),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plan_catalog_social_battery_idx
  on public.plan_catalog (social_battery);

create index if not exists plan_catalog_budget_idx
  on public.plan_catalog (budget);

create index if not exists plan_catalog_distance_idx
  on public.plan_catalog (distance);

create index if not exists plan_catalog_timing_idx
  on public.plan_catalog (timing);

create index if not exists plan_catalog_event_date_idx
  on public.plan_catalog (event_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_plan_catalog_updated_at on public.plan_catalog;

create trigger set_plan_catalog_updated_at
before update on public.plan_catalog
for each row
execute function public.set_updated_at();

alter table public.plan_catalog enable row level security;

drop policy if exists "Authenticated users can read plan catalog" on public.plan_catalog;
create policy "Authenticated users can read plan catalog"
on public.plan_catalog
for select
to authenticated
using (true);

drop policy if exists "Service role manages plan catalog" on public.plan_catalog;
create policy "Service role manages plan catalog"
on public.plan_catalog
for all
to service_role
using (true)
with check (true);

-- Matching helper for the Join flow.
-- Scores exact matches first, then partial matches.
create or replace function public.match_plan_catalog(
  p_social_battery text default null,
  p_budget text default null,
  p_distance text default null,
  p_timing text default null,
  p_limit integer default 20
)
returns table (
  id uuid,
  seed_plan_id bigint,
  title text,
  event_date date,
  start_time text,
  place_name text,
  address text,
  description text,
  social_battery text,
  budget text,
  distance text,
  timing text,
  photo_url text,
  match_score integer
)
language sql
stable
as $$
  select
    pc.id,
    pc.seed_plan_id,
    pc.title,
    pc.event_date,
    pc.start_time,
    pc.place_name,
    pc.address,
    pc.description,
    pc.social_battery,
    pc.budget,
    pc.distance,
    pc.timing,
    pc.photo_url,
    (
      case when p_social_battery is not null and pc.social_battery = p_social_battery then 3 else 0 end +
      case when p_budget is not null and pc.budget = p_budget then 3 else 0 end +
      case when p_distance is not null and pc.distance = p_distance then 2 else 0 end +
      case when p_timing is not null and pc.timing = p_timing then 4 else 0 end
    ) as match_score
  from public.plan_catalog pc
  order by
    match_score desc,
    pc.event_date asc,
    pc.start_time asc,
    pc.seed_plan_id asc
  limit greatest(coalesce(p_limit, 20), 1);
$$;


create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.plan_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  plan_title text,
  overall_rating smallint not null check (overall_rating between 0 and 4),
  overall_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_id)
);

create table if not exists public.plan_feedback_reviews (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.plan_feedback(id) on delete cascade,
  participant_seed_user_id bigint,
  participant_name text not null,
  participant_avatar_url text,
  participant_age integer,
  confirmed boolean not null default false,
  selected_vibes text[] not null default '{}',
  custom_vibe text,
  wants_to_meet_again boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (feedback_id, participant_name)
);

create table if not exists public.repeat_groups (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.repeat_group_members (
  id uuid primary key default gen_random_uuid(),
  group_id text not null references public.repeat_groups(id) on delete cascade,
  participant_seed_user_id bigint,
  participant_name text not null,
  participant_avatar_url text,
  participant_age integer,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (group_id, participant_name)
);

drop trigger if exists set_plan_feedback_updated_at on public.plan_feedback;
create trigger set_plan_feedback_updated_at
before update on public.plan_feedback
for each row
execute function public.set_updated_at();

drop trigger if exists set_repeat_groups_updated_at on public.repeat_groups;
create trigger set_repeat_groups_updated_at
before update on public.repeat_groups
for each row
execute function public.set_updated_at();

alter table public.plan_feedback enable row level security;
alter table public.plan_feedback_reviews enable row level security;
alter table public.repeat_groups enable row level security;
alter table public.repeat_group_members enable row level security;

drop policy if exists "Users manage their own plan feedback" on public.plan_feedback;
create policy "Users manage their own plan feedback"
on public.plan_feedback
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage their own plan feedback reviews" on public.plan_feedback_reviews;
create policy "Users manage their own plan feedback reviews"
on public.plan_feedback_reviews
for all
to authenticated
using (
  exists (
    select 1
    from public.plan_feedback
    where public.plan_feedback.id = plan_feedback_reviews.feedback_id
      and public.plan_feedback.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.plan_feedback
    where public.plan_feedback.id = plan_feedback_reviews.feedback_id
      and public.plan_feedback.user_id = auth.uid()
  )
);

drop policy if exists "Users manage their own repeat groups" on public.repeat_groups;
create policy "Users manage their own repeat groups"
on public.repeat_groups
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage their own repeat group members" on public.repeat_group_members;
create policy "Users manage their own repeat group members"
on public.repeat_group_members
for all
to authenticated
using (
  exists (
    select 1
    from public.repeat_groups
    where public.repeat_groups.id = repeat_group_members.group_id
      and public.repeat_groups.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.repeat_groups
    where public.repeat_groups.id = repeat_group_members.group_id
      and public.repeat_groups.user_id = auth.uid()
  )
);

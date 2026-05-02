create table if not exists public.repeat_group_plans (
  id text primary key,
  group_id text not null references public.repeat_groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  when_text text not null default '',
  where_text text not null default '',
  created_by_name text not null default 'You',
  created_at timestamptz not null default now()
);

create index if not exists repeat_group_plans_group_id_idx
  on public.repeat_group_plans (group_id);

create index if not exists repeat_group_plans_user_id_idx
  on public.repeat_group_plans (user_id);

alter table public.repeat_group_plans enable row level security;

drop policy if exists "Users manage their own repeat group plans" on public.repeat_group_plans;
create policy "Users manage their own repeat group plans"
on public.repeat_group_plans
for all
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.repeat_groups
    where public.repeat_groups.id = repeat_group_plans.group_id
      and public.repeat_groups.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.repeat_groups
    where public.repeat_groups.id = repeat_group_plans.group_id
      and public.repeat_groups.user_id = auth.uid()
  )
);

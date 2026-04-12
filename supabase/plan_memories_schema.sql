create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public)
values ('plan-memories', 'plan-memories', true)
on conflict (id) do nothing;

create table if not exists public.plan_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  file_name text,
  storage_path text not null,
  public_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists plan_memories_user_plan_idx
on public.plan_memories (user_id, plan_id, sort_order);

alter table public.plan_memories enable row level security;

drop policy if exists "Users manage their own plan memories" on public.plan_memories;
create policy "Users manage their own plan memories"
on public.plan_memories
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Authenticated users upload their own plan memories" on storage.objects;
create policy "Authenticated users upload their own plan memories"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'plan-memories'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Authenticated users update their own plan memories" on storage.objects;
create policy "Authenticated users update their own plan memories"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'plan-memories'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'plan-memories'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Authenticated users delete their own plan memories" on storage.objects;
create policy "Authenticated users delete their own plan memories"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'plan-memories'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Public can read plan memories" on storage.objects;
create policy "Public can read plan memories"
on storage.objects
for select
to public
using (bucket_id = 'plan-memories');

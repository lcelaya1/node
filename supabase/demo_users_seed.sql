-- Seed data for public.demo_users
insert into public.demo_users (seed_user_id, name, age, city, bio, plans_created, plans_done, avatar_url) values
  (1, 'Sofia', 27, 'Barcelona', 'Design student on a quest for BCN''s best coffee. Passionate about art, cinema, and meeting people who challenge my perspective.', 2, 15, 'https://wjohtvugahrzjkgydwxk.supabase.co/storage/v1/object/public/avatars/Hike%20in%20Barcelona%20at%20Sunset.jpeg'),
  (2, 'Marcos', 24, 'Barcelona', 'Architecture grad with a soft spot for rooftops and record stores. Always planning the next trip.', 5, 9, 'https://wjohtvugahrzjkgydwxk.supabase.co/storage/v1/object/public/avatars/At%20Hergett.jpeg'),
  (3, 'Lucía', 29, 'Barcelona', 'Marketing creative who lives for long dinners and spontaneous plans. Cocktails always involved.', 8, 22, 'https://wjohtvugahrzjkgydwxk.supabase.co/storage/v1/object/public/avatars/_%20(20).jpeg')
on conflict (seed_user_id) do update set
  name = excluded.name,
  age = excluded.age,
  city = excluded.city,
  bio = excluded.bio,
  plans_created = excluded.plans_created,
  plans_done = excluded.plans_done,
  avatar_url = excluded.avatar_url;

-- Seed data for public.demo_user_interests
insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 1, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 9
where du.seed_user_id = 1
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 2, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 21
where du.seed_user_id = 1
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 3, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 19
where du.seed_user_id = 1
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 4, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 8
where du.seed_user_id = 1
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 5, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 22
where du.seed_user_id = 2
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 6, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 2
where du.seed_user_id = 2
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 7, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 7
where du.seed_user_id = 2
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 8, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 6
where du.seed_user_id = 2
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 9, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 15
where du.seed_user_id = 3
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 10, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 18
where du.seed_user_id = 3
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 11, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 23
where du.seed_user_id = 3
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

insert into public.demo_user_interests (seed_demo_user_interest_id, demo_user_id, interest_catalog_id)
select 12, du.id, ic.id
from public.demo_users du
join public.interest_catalog ic on ic.seed_interest_id = 26
where du.seed_user_id = 3
on conflict (seed_demo_user_interest_id) do update set
  demo_user_id = excluded.demo_user_id,
  interest_catalog_id = excluded.interest_catalog_id;

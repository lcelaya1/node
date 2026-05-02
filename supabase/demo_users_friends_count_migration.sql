alter table public.demo_users
add column if not exists friends_count integer not null default 0;

update public.demo_users
set friends_count = case seed_user_id
  when 1 then 6
  when 2 then 5
  when 3 then 7
  else friends_count
end;

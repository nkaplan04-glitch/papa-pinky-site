-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- Profiles table: stores house info linked to Supabase Auth users
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  house_name text not null,
  headcount integer not null default 0,
  role text not null default 'house' check (role in ('house', 'chef')),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Submissions table: stores daily meal orders per house
create table submissions (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references profiles(id) on delete cascade,
  order_date date not null default (current_date + interval '1 day')::date,
  breakfast text[] not null default '{}',
  lunch text,
  dinner text,
  breakfast_time text,
  lunch_time text,
  dinner_time text,
  daily_headcount integer,
  submitted_at timestamptz not null default now(),
  unique(house_id, order_date)
);

-- Allow public read/write for now (no RLS)
-- You can add RLS policies later for production security
alter table profiles enable row level security;
alter table submissions enable row level security;

-- Permissive policies so the app works without auth complexity
create policy "Allow all on profiles" on profiles for all using (true) with check (true);
create policy "Allow all on submissions" on submissions for all using (true) with check (true);

-- Create a trigger to auto-create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, house_name, headcount, role, approved)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'house_name', 'Unknown'),
    coalesce((new.raw_user_meta_data->>'headcount')::integer, 0),
    coalesce(new.raw_user_meta_data->>'role', 'house'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed the chef account (you'll register this via the app or manually)
-- The chef will be approved by default

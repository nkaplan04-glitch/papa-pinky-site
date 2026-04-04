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
  notes text not null default '',
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

-- Menu items table: chef-editable menu
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('breakfast', 'lunch_dinner')),
  tags text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table menu_items enable row level security;
create policy "Allow all on menu_items" on menu_items for all using (true) with check (true);

-- Suggestions table: houses suggest menu items for chef review
create table suggestions (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references profiles(id) on delete cascade,
  suggestion_text text not null,
  category text not null default 'general' check (category in ('breakfast', 'lunch_dinner', 'general')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  created_at timestamptz not null default now()
);

alter table suggestions enable row level security;
create policy "Allow all on suggestions" on suggestions for all using (true) with check (true);

-- Seed breakfast menu items
INSERT INTO menu_items (name, category, tags) VALUES
('Breakfast quesadillas with eggs, turkey sausage and shredded cheddar cheese', 'breakfast', ARRAY['G','E','D']),
('French toast with fresh strawberries and blueberries, syrup, scrambled eggs with turkey sausage patties', 'breakfast', ARRAY['G','E','D']),
('Sausage/Bacon egg and cheese on a toasted bagel', 'breakfast', ARRAY['G','E','D']),
('Breakfast with scrambled eggs, bacon, sausage and protein pancakes served with ketchup, syrup and butter', 'breakfast', ARRAY['G','E','D']),
('Chicken and waffles served with syrup', 'breakfast', ARRAY['G','E','D']),
('Bagel with lox and cream cheese', 'breakfast', ARRAY['G','F','D']);

-- Seed lunch/dinner menu items
INSERT INTO menu_items (name, category, tags) VALUES
('Chicken turkey bacon ranch wrap with lettuce, tomatoes and shredded mozzarella', 'lunch_dinner', ARRAY['G','D']),
('Chicken or beef quesadillas with shredded cheese, sour cream, salsa and guacamole', 'lunch_dinner', ARRAY['G','D']),
('Turkey avocado club with ham, lettuce, tomatoes, bacon and mayo on Texas toast', 'lunch_dinner', ARRAY['G','E','D']),
('Chicken and lamb gyros with lettuce, tomatoes and tzatziki on warm pita', 'lunch_dinner', ARRAY['G','D']),
('Chicken and beef tacos with corn/flour tortillas, lettuce, tomatoes, salsa and guac', 'lunch_dinner', ARRAY['G']),
('Chicken fried rice with peas, carrots and eggs', 'lunch_dinner', ARRAY['E','S']),
('Double smash burger with onions, lettuce, tomatoes, pickles and ketchup on brioche', 'lunch_dinner', ARRAY['G','E','D']),
('Chicken Caesar wrap or salad', 'lunch_dinner', ARRAY['G','D','E']),
('Turkey BLT on Texas toast with cheddar and mayo', 'lunch_dinner', ARRAY['G','D','E']),
('Chicken cutlet panini on ciabatta with mozzarella, lettuce and tomatoes and a side of chipotle mayo or ranch dressing', 'lunch_dinner', ARRAY['G','D','E']),
('Chicken penne alla vodka with fresh herbs and Parmesan cheese', 'lunch_dinner', ARRAY['G','D']),
('Vegetable fried rice with scrambled eggs and crispy tofu', 'lunch_dinner', ARRAY['V','E','S']),
('Chicken pesto pasta with balsamic glaze', 'lunch_dinner', ARRAY['G','N','D']),
('Caprese panini on sourdough with mozzarella, fresh basil, tomato and balsamic glaze pressed warm', 'lunch_dinner', ARRAY['V','K','G','D']),
('Tuna poke bowl with rice, avocado, cucumber and poke sauce', 'lunch_dinner', ARRAY['F','S']),
('Grilled chicken, rice and avocado burrito, panini pressed with your choice of cheese and spicy mayo', 'lunch_dinner', ARRAY['G','D','E']),
('Chicken teriyaki with broccoli and rice', 'lunch_dinner', ARRAY['S']),
('Cobb salad with chicken, bacon, avocado, cucumber, tomatoes and shredded cheddar, side of ranch or balsamic dressing', 'lunch_dinner', ARRAY['D','E']),
('Chicken Parmesan over pasta', 'lunch_dinner', ARRAY['G','D','E']),
('Chicken tikka masala with homemade naan bread served with rice and fresh cilantro', 'lunch_dinner', ARRAY['G','D']),
('Chicken marsala with mashed potatoes and mixed vegetable medley', 'lunch_dinner', ARRAY['D']),
('Hibachi chicken with rice and vegetables', 'lunch_dinner', ARRAY['S']),
('Loaded nachos with guacamole, salsa and sour cream', 'lunch_dinner', ARRAY['V','K','G','D']),
('Chopped cheese with lettuce and tomatoes, ketchup and mayo on the side', 'lunch_dinner', ARRAY['G','D']);

-- Site content (for editable pages like About)
create table if not exists site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table site_content enable row level security;

create policy "Anyone can read site_content"
  on site_content for select using (true);

create policy "Authenticated users can upsert site_content"
  on site_content for all using (true) with check (true);

-- Function to fully delete a user (auth + profile) so the email can be reused
-- Only allows the chef role to perform this action
create or replace function delete_user_completely(user_id uuid)
returns void as $$
declare
  caller_role text;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role is null or caller_role != 'chef' then
    raise exception 'Only the chef can delete users';
  end if;

  delete from auth.users where id = user_id;
end;
$$ language plpgsql security definer;

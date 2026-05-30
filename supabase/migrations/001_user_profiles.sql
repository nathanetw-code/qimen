-- supabase/migrations/001_user_profiles.sql
create table public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  birth_date date not null,
  birth_time time not null,
  gender text not null check (gender in ('male', 'female')),
  day_stem text,
  destiny_palace_number integer,
  destiny_direction text,
  destiny_door text,
  destiny_deity text,
  element text,
  created_at timestamptz default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

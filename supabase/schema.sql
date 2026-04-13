-- ============================================================
-- Idea → Income — Supabase Schema
-- ============================================================
-- Run this in Supabase SQL Editor to set up tables.
-- Requires: auth.users (auto-created by Supabase Auth)
-- ============================================================

-- 1. Profiles — basic user info synced from auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. Subscriptions — Stripe subscription status
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive', -- active, canceled, past_due, inactive
  plan text not null default 'free', -- free, pro
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

-- RLS
alter table public.subscriptions enable row level security;
create policy "Users can read own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);
-- Only server (service role) can insert/update subscriptions

-- 3. Saved sessions — persistent user progress
create table if not exists public.saved_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  idea_id text not null,
  idea_title text not null,
  step_number integer not null default 0,
  current_step jsonb, -- StartThisOutput shape
  completed_steps jsonb not null default '[]'::jsonb,
  artifacts jsonb not null default '[]'::jsonb,
  saved_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, idea_id)
);

-- RLS
alter table public.saved_sessions enable row level security;
create policy "Users can read own sessions"
  on public.saved_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions"
  on public.saved_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions"
  on public.saved_sessions for update using (auth.uid() = user_id);
create policy "Users can delete own sessions"
  on public.saved_sessions for delete using (auth.uid() = user_id);

-- 4. User stats — replaces localStorage session stats
create table if not exists public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_sessions integer not null default 0,
  total_outputs integer not null default 0,
  last_session_date timestamptz,
  updated_at timestamptz default now()
);

-- RLS
alter table public.user_stats enable row level security;
create policy "Users can read own stats"
  on public.user_stats for select using (auth.uid() = user_id);
create policy "Users can insert own stats"
  on public.user_stats for insert with check (auth.uid() = user_id);
create policy "Users can update own stats"
  on public.user_stats for update using (auth.uid() = user_id);

-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- Creates courses + lessons tables and seeds the first course.
-- Additive and safe to re-run.

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  subtitle text,
  published boolean not null default false
);
alter table public.courses enable row level security;

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  course_id uuid not null references public.courses(id) on delete cascade,
  day_number integer not null,
  title text not null,
  summary text,
  body text not null default '',
  published boolean not null default false,
  unique (course_id, day_number)
);
create index if not exists lessons_course_day_idx
  on public.lessons (course_id, day_number);
alter table public.lessons enable row level security;

-- Seed the first course
insert into public.courses (slug, title, subtitle, published)
values (
  'ai-in-7-days',
  'AI in 7 Days',
  'A plain-spoken intro to AI for professionals. No jargon, no login, no cost.',
  false
) on conflict (slug) do nothing;

-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- after creating your Supabase project.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique,
  industry text,
  experience text check (experience in ('beginner', 'intermediate', 'advanced')),
  challenge text
);

-- Index for fastest "newest first" queries on the admin page.
create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- We use the service role key from server code (lib/supabase.ts), so RLS
-- is not strictly required to make inserts work. But enabling it is good
-- hygiene in case anything ever uses the anon key.
alter table public.waitlist enable row level security;

-- No public policies — only the service role (used server-side) can read/write.

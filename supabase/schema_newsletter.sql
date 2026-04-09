-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)
-- AFTER the original schema.sql has already been run.
-- This migration is additive and safe to re-run.

-- 1. Add unsubscribe support to the existing waitlist table
alter table public.waitlist
  add column if not exists unsubscribed boolean not null default false,
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();

create unique index if not exists waitlist_unsubscribe_token_idx
  on public.waitlist (unsubscribe_token);

-- 2. Newsletter issues — one row per send
create table if not exists public.newsletters (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  subject text not null,
  body text not null,
  sent_at timestamptz,
  recipient_count integer
);

create index if not exists newsletters_created_at_idx
  on public.newsletters (created_at desc);

-- Same RLS posture as waitlist: enabled, no public policies, only service role can read/write.
alter table public.newsletters enable row level security;

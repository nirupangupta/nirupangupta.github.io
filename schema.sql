-- Nirupan Gupta Portfolio — Supabase schema
-- Run this in Supabase SQL Editor after creating your project.
-- IMPORTANT: create the single admin user in Supabase Auth first, then add their UUID below.

create extension if not exists pgcrypto;

drop table if exists public.site_revisions cascade;
drop table if exists public.admin_users cascade;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table public.site_revisions (
  id uuid primary key default gen_random_uuid(),
  version integer generated always as identity,
  status text not null check (status in ('draft','published','archived')),
  title text not null default 'Portfolio update',
  content jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  published_at timestamptz
);

create index site_revisions_status_idx on public.site_revisions(status, created_at desc);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

alter table public.admin_users enable row level security;
alter table public.site_revisions enable row level security;

create policy "public can read published revision"
on public.site_revisions for select
using (status = 'published');

create policy "admins can read all revisions"
on public.site_revisions for select to authenticated
using (public.is_admin());

create policy "admins can insert revisions"
on public.site_revisions for insert to authenticated
with check (public.is_admin() and created_by = auth.uid());

create policy "admins can update revisions"
on public.site_revisions for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can delete revisions"
on public.site_revisions for delete to authenticated
using (public.is_admin());

create policy "admins can read their admin record"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

-- Storage bucket for portfolio assets.
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

create policy "public can view portfolio assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

create policy "admins can upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-assets' and public.is_admin());

create policy "admins can update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin())
with check (bucket_id = 'portfolio-assets' and public.is_admin());

create policy "admins can delete portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-assets' and public.is_admin());

-- After creating the one admin account in Authentication > Users, run:
-- insert into public.admin_users (user_id, email)
-- values ('YOUR-AUTH-USER-UUID', 'your-admin-email@example.com');

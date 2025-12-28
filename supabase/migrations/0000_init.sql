-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Leads Table (Contact Form)
create table if not exists public.leads (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    message text,
    status text default 'new' -- new, contacted, converted, archived
);

-- Appointments Table (Booking)
create table if not exists public.appointments (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    scheduled_at timestamp with time zone not null,
    name text not null,
    email text not null,
    phone text,
    objective text,
    status text default 'confirmed', -- confirmed, cancelled, completed
    google_event_id text
);

-- Site Settings (Global Config)
create table if not exists public.site_settings (
    key text primary key,
    value text, -- JSON string or simple text
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Analytics (Simple internal tracking)
create table if not exists public.analytics_events (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    event_name text not null,
    page_path text,
    metadata jsonb
);

-- RLS Policies
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.site_settings enable row level security;
alter table public.analytics_events enable row level security;

-- Public can insert leads (Contact Form)
create policy "Public can insert leads"
on public.leads for insert
to anon
with check (true);

-- Only Authenticated (Admin) can view leads
create policy "Admins can view leads"
on public.leads for select
to authenticated
using (true);

-- Public can insert appointments
create policy "Public can insert appointments"
on public.appointments for insert
to anon
with check (true);

-- Only Authenticated (Admin) can view/update appointments
create policy "Admins can view appointments"
on public.appointments for select
to authenticated
using (true);

create policy "Admins can update appointments"
on public.appointments for update
to authenticated
using (true);

-- Settings: Public read (if needed), Admin write
create policy "Public can read settings"
on public.site_settings for select
to anon
using (true);

create policy "Admins can update settings"
on public.site_settings for update
to authenticated
using (true);

-- Analytics: Public insert
create policy "Public can insert analytics"
on public.analytics_events for insert
to anon
with check (true);

create policy "Admins can view analytics"
on public.analytics_events for select
to authenticated
using (true);

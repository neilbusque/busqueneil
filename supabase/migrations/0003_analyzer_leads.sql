create table if not exists public.analyzer_leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  url         text not null,
  score       int  not null,
  grade       text not null,
  delivered   boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists analyzer_leads_email_idx on public.analyzer_leads (email, created_at desc);
create index if not exists analyzer_leads_created_idx on public.analyzer_leads (created_at desc);
alter table public.analyzer_leads enable row level security;
-- No anon/authenticated policies: only the service role (server) touches this table.

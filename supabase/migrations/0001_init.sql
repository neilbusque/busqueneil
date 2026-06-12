-- busqueneil.com posts schema. Applied via Management API /database/query.

create type post_type as enum ('status', 'article', 'project', 'now');

create table public.posts (
  id            uuid primary key default gen_random_uuid(),
  type          post_type not null default 'status',
  slug          text not null unique,
  title         text,
  body_md       text not null default '',
  body_html     text not null default '',
  excerpt       text,
  link_url      text,
  project_meta  jsonb,
  images        jsonb not null default '[]',
  tags          text[] not null default '{}',
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index posts_feed_idx on public.posts (status, published_at desc);
create index posts_type_idx on public.posts (type, status, published_at desc);
create index posts_tags_idx on public.posts using gin (tags);

alter table public.posts enable row level security;

create policy "public read published" on public.posts
  for select using (status = 'published');

create policy "admin full access" on public.posts
  for all to authenticated using (true) with check (true);

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

-- storage: public-read bucket for post images, authenticated writes
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true);

create policy "public read post images" on storage.objects
  for select using (bucket_id = 'post-images');

create policy "auth write post images" on storage.objects
  for insert to authenticated with check (bucket_id = 'post-images');

create policy "auth update post images" on storage.objects
  for update to authenticated using (bucket_id = 'post-images');

create policy "auth delete post images" on storage.objects
  for delete to authenticated using (bucket_id = 'post-images');

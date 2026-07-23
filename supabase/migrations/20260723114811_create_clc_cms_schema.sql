create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin', 'editor', 'author', 'member');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'scheduled', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.event_status as enum ('upcoming', 'open', 'closed', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role public.app_role not null default 'member',
  avatar_url text,
  bio text,
  instagram_url text,
  linkedin_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  name text not null,
  slug text not null unique,
  email text,
  avatar_url text,
  bio text,
  instagram_url text,
  linkedin_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon text,
  color text not null default '#1262d6',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  author_id uuid references public.authors(id) on delete set null,
  title text not null,
  slug text not null unique,
  subtitle text,
  excerpt text,
  cover_image_url text,
  cover_image_alt text,
  content jsonb not null default '{}'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  editor_pick boolean not null default false,
  reading_minutes integer not null default 1 check (reading_minutes > 0),
  view_count bigint not null default 0 check (view_count >= 0),
  published_at timestamptz,
  scheduled_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint article_publish_dates check (
    (status = 'published' and published_at is not null)
    or status <> 'published'
  )
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  poster_url text,
  speaker text,
  moderator text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  platform_url text,
  ticket_price numeric(12,2) not null default 0 check (ticket_price >= 0),
  quota integer check (quota is null or quota > 0),
  registration_url text,
  status public.event_status not null default 'upcoming',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_series (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  level text not null check (level in ('Pemula', 'Menengah', 'Lanjutan')),
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  series_id uuid references public.course_series(id) on delete cascade,
  title text not null,
  slug text not null unique,
  level text not null check (level in ('Pemula', 'Menengah', 'Lanjutan')),
  summary text,
  content jsonb not null default '{}'::jsonb,
  video_url text,
  external_url text,
  sort_order integer not null default 0,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table if not exists public.reading_history (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.articles(id) on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists articles_status_published_idx on public.articles (status, published_at desc);
create index if not exists articles_category_idx on public.articles (category_id);
create index if not exists articles_featured_idx on public.articles (featured) where featured = true;
create index if not exists events_status_starts_idx on public.events (status, starts_at);
create index if not exists lessons_level_status_idx on public.lessons (level, status);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists set_authors_updated_at on public.authors;
create trigger set_authors_updated_at before update on public.authors for each row execute function public.set_updated_at();
drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at before update on public.articles for each row execute function public.set_updated_at();
drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at before update on public.events for each row execute function public.set_updated_at();
drop trigger if exists set_course_series_updated_at on public.course_series;
create trigger set_course_series_updated_at before update on public.course_series for each row execute function public.set_updated_at();
drop trigger if exists set_lessons_updated_at on public.lessons;
create trigger set_lessons_updated_at before update on public.lessons for each row execute function public.set_updated_at();

create or replace function public.current_user_is_staff()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'editor', 'author')
  );
$$;

alter table public.profiles enable row level security;
alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;
alter table public.tags enable row level security;
alter table public.article_tags enable row level security;
alter table public.events enable row level security;
alter table public.course_series enable row level security;
alter table public.lessons enable row level security;
alter table public.user_bookmarks enable row level security;
alter table public.reading_history enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "profiles can read own profile" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles can update own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "public can read active authors" on public.authors
  for select to anon, authenticated
  using (is_active = true);
create policy "staff can manage authors" on public.authors
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read categories" on public.categories
  for select to anon, authenticated
  using (true);
create policy "staff can manage categories" on public.categories
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read published articles" on public.articles
  for select to anon, authenticated
  using (status = 'published' and published_at <= now());
create policy "staff can manage articles" on public.articles
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read tags" on public.tags
  for select to anon, authenticated
  using (true);
create policy "staff can manage tags" on public.tags
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read published article tags" on public.article_tags
  for select to anon, authenticated
  using (
    exists (
      select 1 from public.articles
      where articles.id = article_tags.article_id
        and articles.status = 'published'
        and articles.published_at <= now()
    )
  );
create policy "staff can manage article tags" on public.article_tags
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read visible events" on public.events
  for select to anon, authenticated
  using (status in ('upcoming', 'open', 'closed', 'completed'));
create policy "staff can manage events" on public.events
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read course series" on public.course_series
  for select to anon, authenticated
  using (true);
create policy "staff can manage course series" on public.course_series
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "public can read published lessons" on public.lessons
  for select to anon, authenticated
  using (status = 'published' and (published_at is null or published_at <= now()));
create policy "staff can manage lessons" on public.lessons
  for all to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

create policy "users can manage own bookmarks" on public.user_bookmarks
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users can manage own reading history" on public.reading_history
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "anyone can subscribe to newsletter" on public.newsletter_subscribers
  for insert to anon, authenticated
  with check (true);
create policy "staff can read newsletter subscribers" on public.newsletter_subscribers
  for select to authenticated
  using (public.current_user_is_staff());
create policy "staff can manage newsletter subscribers" on public.newsletter_subscribers
  for update to authenticated
  using (public.current_user_is_staff())
  with check (public.current_user_is_staff());

grant usage on schema public to anon, authenticated;
grant select on public.authors, public.categories, public.articles, public.tags, public.article_tags, public.events, public.course_series, public.lessons to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant select, insert, update, delete on public.user_bookmarks, public.reading_history to authenticated;
grant select, insert, update, delete on public.profiles, public.authors, public.categories, public.articles, public.tags, public.article_tags, public.events, public.course_series, public.lessons, public.newsletter_subscribers to authenticated;

insert into public.categories (name, slug, color, sort_order)
values
  ('Regulasi', 'regulasi', '#1262d6', 1),
  ('Hukum', 'hukum', '#111827', 2),
  ('Crypto', 'crypto', '#f5b301', 3),
  ('Blockchain', 'blockchain', '#0f766e', 4),
  ('Web3', 'web3', '#7c3aed', 5),
  ('Ekonomi', 'ekonomi', '#2563eb', 6),
  ('Investasi', 'investasi', '#16a34a', 7),
  ('Keamanan Digital', 'keamanan-digital', '#dc2626', 8),
  ('Pajak', 'pajak', '#ea580c', 9),
  ('Analisis', 'analisis', '#475569', 10)
on conflict (slug) do update
set name = excluded.name,
    color = excluded.color,
    sort_order = excluded.sort_order;

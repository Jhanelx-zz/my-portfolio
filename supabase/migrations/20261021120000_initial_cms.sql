create extension if not exists pgcrypto with schema extensions;

create table public.portfolio_admins (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.portfolio_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null check (bucket_id in ('portfolio-public', 'portfolio-private')),
  object_path text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes >= 0),
  is_public boolean not null default false,
  alt_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);

create table public.portfolio_profile (
  singleton boolean primary key default true check (singleton),
  full_name text not null default '',
  display_name text not null default '',
  professional_title text not null default '',
  hero_intro text not null default '',
  biography text not null default '',
  professional_summary text not null default '',
  location text not null default '',
  interests text[] not null default '{}',
  career_goals text[] not null default '{}',
  avatar_media_id uuid references public.media_assets (id) on delete set null,
  resume_media_id uuid references public.media_assets (id) on delete set null,
  legacy_avatar_url text,
  legacy_resume_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  seed_key text unique,
  category text not null,
  name text not null,
  description text not null default '',
  proficiency_label text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  category text not null,
  status text not null default '',
  short_description text not null default '',
  full_description text not null default '',
  problem text not null default '',
  solution text not null default '',
  role text not null default '',
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  lessons_learned text[] not null default '{}',
  project_date date,
  github_url text,
  demo_url text,
  documentation_url text,
  cover_media_id uuid references public.media_assets (id) on delete set null,
  legacy_cover_url text,
  legacy_gallery jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_gallery (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  media_id uuid references public.media_assets (id) on delete restrict,
  legacy_url text,
  caption text not null default '',
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, media_id),
  constraint project_gallery_media_or_legacy_check
    check ((media_id is null) <> (legacy_url is null)),
  constraint project_gallery_legacy_url_check
    check (legacy_url is null or (legacy_url like '/images/%' and position('..' in legacy_url) = 0))
);

create or replace function public.replace_project_gallery(
  p_project_id uuid,
  p_media_ids uuid[],
  p_legacy_urls text[],
  p_captions text[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_portfolio_admin() then
    raise exception using errcode = '42501', message = 'Administrator access required';
  end if;

  if not exists (
    select 1 from public.projects where id = p_project_id
  ) then
    raise exception using errcode = 'P0002', message = 'Project not found';
  end if;

  if p_media_ids is null or p_legacy_urls is null or p_captions is null
    or cardinality(p_media_ids) > 20 then
    raise exception using errcode = '22023', message = 'A project gallery can contain at most 20 images';
  end if;

  if cardinality(p_media_ids) <> cardinality(p_legacy_urls)
    or cardinality(p_media_ids) <> cardinality(p_captions)
    or exists (select 1 from unnest(p_captions) as requested(caption) where length(caption) > 300)
    or (select count(media_id) from unnest(p_media_ids) as requested(media_id))
      <> (select count(distinct media_id) from unnest(p_media_ids) as requested(media_id))
    or (select count(legacy_url) from unnest(p_legacy_urls) as requested(legacy_url))
      <> (select count(distinct legacy_url) from unnest(p_legacy_urls) as requested(legacy_url))
    or exists (
      select 1 from unnest(p_legacy_urls) as requested(legacy_url)
      where legacy_url is not null
        and (legacy_url not like '/images/%' or position('..' in legacy_url) > 0)
    )
  then
    raise exception using errcode = '22023', message = 'Gallery image IDs and captions must match and image IDs must be unique';
  end if;

  if exists (
    select 1
    from unnest(p_media_ids) as requested(media_id)
    left join public.media_assets media
      on media.id = requested.media_id
      and media.bucket_id = 'portfolio-public'
      and media.is_public
      and media.mime_type like 'image/%'
    where requested.media_id is not null and media.id is null
  ) then
    raise exception using errcode = '22023', message = 'Gallery images must be published media';
  end if;

  delete from public.project_gallery where project_id = p_project_id;

  insert into public.project_gallery (project_id, media_id, legacy_url, caption, display_order)
  select p_project_id, requested.media_id, requested.legacy_url, requested.caption,
    (requested.position - 1)::integer
  from unnest(p_media_ids, p_legacy_urls, p_captions) with ordinality
    as requested(media_id, legacy_url, caption, position);
end;
$$;

revoke all on function public.replace_project_gallery(uuid, uuid[], text[], text[]) from public;
grant execute on function public.replace_project_gallery(uuid, uuid[], text[], text[]) to authenticated;

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (
    kind in ('achievement', 'award', 'certification', 'training', 'workshop', 'competition', 'recognition', 'milestone')
  ),
  title text not null,
  description text not null default '',
  issuer text not null default '',
  issued_on date,
  expires_on date,
  verification_url text,
  certificate_media_id uuid references public.media_assets (id) on delete set null,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.work_experience (
  id uuid primary key default gen_random_uuid(),
  seed_key text unique,
  job_title text not null,
  organization text not null,
  employment_type text not null default '',
  location text not null default '',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text not null default '',
  responsibilities text[] not null default '{}',
  technologies text[] not null default '{}',
  accomplishments text[] not null default '{}',
  link_url text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (is_current or end_date is null or end_date >= start_date)
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  seed_key text unique,
  institution text not null,
  qualification text not null,
  field_of_study text not null default '',
  start_date date,
  end_date date,
  is_current boolean not null default false,
  details text not null default '',
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_date is null or end_date is null or end_date >= start_date)
);

create table public.contact_settings (
  singleton boolean primary key default true check (singleton),
  introduction text not null default '',
  email text not null default '',
  email_is_public boolean not null default true,
  phone text not null default '',
  phone_is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create view public.public_contact_settings
with (security_barrier = true)
as
select
  introduction,
  case when email_is_public then email else null end as email,
  case when phone_is_public then phone else null end as phone
from public.contact_settings
where singleton;

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  url text not null,
  is_enabled boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index skills_public_order_idx on public.skills (display_order) where is_published;
create index projects_public_order_idx on public.projects (display_order) where is_published;
create index projects_featured_idx on public.projects (is_featured, display_order) where is_published;
create index achievements_public_order_idx on public.achievements (display_order) where is_published;
create index work_experience_public_order_idx on public.work_experience (display_order) where is_published;
create index education_public_order_idx on public.education (display_order) where is_published;
create index social_links_public_order_idx on public.social_links (display_order) where is_enabled;
create index project_gallery_order_idx on public.project_gallery (project_id, display_order);

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'media_assets',
    'portfolio_profile',
    'skills',
    'projects',
    'project_gallery',
    'achievements',
    'work_experience',
    'education',
    'contact_settings',
    'social_links'
  ]
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end;
$$;

alter table public.portfolio_admins enable row level security;
alter table public.media_assets enable row level security;
alter table public.portfolio_profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_gallery enable row level security;
alter table public.achievements enable row level security;
alter table public.work_experience enable row level security;
alter table public.education enable row level security;
alter table public.contact_settings enable row level security;
alter table public.social_links enable row level security;

create policy "Administrators can verify their own allowlist entry"
on public.portfolio_admins for select to authenticated
using (user_id = (select auth.uid()));

create policy "Public can read published media metadata"
on public.media_assets for select to anon, authenticated
using (is_public and bucket_id = 'portfolio-public');
create policy "Administrators manage media metadata"
on public.media_assets for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read published profile"
on public.portfolio_profile for select to anon, authenticated
using (is_published);
create policy "Administrators manage profile"
on public.portfolio_profile for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read published skills"
on public.skills for select to anon, authenticated
using (is_published);
create policy "Administrators manage skills"
on public.skills for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read published projects"
on public.projects for select to anon, authenticated
using (is_published);
create policy "Administrators manage projects"
on public.projects for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read galleries of published projects"
on public.project_gallery for select to anon, authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = project_gallery.project_id
      and projects.is_published
  )
);
create policy "Administrators manage project galleries"
on public.project_gallery for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read published achievements"
on public.achievements for select to anon, authenticated
using (is_published);
create policy "Administrators manage achievements"
on public.achievements for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read published work experience"
on public.work_experience for select to anon, authenticated
using (is_published);
create policy "Administrators manage work experience"
on public.work_experience for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read published education"
on public.education for select to anon, authenticated
using (is_published);
create policy "Administrators manage education"
on public.education for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Administrators manage contact settings"
on public.contact_settings for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

create policy "Public can read enabled social links"
on public.social_links for select to anon, authenticated
using (is_enabled);
create policy "Administrators manage social links"
on public.social_links for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));

grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on all tables in schema public to authenticated;
revoke insert, update, delete on public.portfolio_admins from anon, authenticated;
grant select on public.public_contact_settings to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-public', 'portfolio-public', true, 6291456, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']),
  ('portfolio-private', 'portfolio-private', false, 6291456, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Administrators can view private portfolio files"
on storage.objects for select to authenticated
using (
  bucket_id = 'portfolio-private'
  and (select public.is_portfolio_admin())
);
create policy "Administrators can upload portfolio files"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('portfolio-public', 'portfolio-private')
  and (select public.is_portfolio_admin())
);
create policy "Administrators can update portfolio files"
on storage.objects for update to authenticated
using (
  bucket_id in ('portfolio-public', 'portfolio-private')
  and (select public.is_portfolio_admin())
)
with check (
  bucket_id in ('portfolio-public', 'portfolio-private')
  and (select public.is_portfolio_admin())
);
create policy "Administrators can delete portfolio files"
on storage.objects for delete to authenticated
using (
  bucket_id in ('portfolio-public', 'portfolio-private')
  and (select public.is_portfolio_admin())
);

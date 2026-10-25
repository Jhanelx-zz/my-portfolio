do $$
begin
  if (select count(*) from public.portfolio_admins) > 1 then
    raise exception 'More than one portfolio administrator is configured. Review the allowlist manually before enforcing the single-administrator constraint.';
  end if;
end;
$$;

alter table public.portfolio_admins
  add column if not exists singleton boolean not null default true;
create unique index if not exists portfolio_admins_singleton_idx
  on public.portfolio_admins (singleton);
create unique index if not exists portfolio_admins_user_id_unique_idx
  on public.portfolio_admins (user_id);
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.portfolio_admins'::regclass
      and conname = 'portfolio_admins_singleton_check'
  ) then
    alter table public.portfolio_admins
      add constraint portfolio_admins_singleton_check check (singleton);
  end if;
end;
$$;
revoke insert, update, delete on public.portfolio_admins from anon, authenticated;

alter table public.skills add column if not exists seed_key text;
alter table public.work_experience add column if not exists seed_key text;
alter table public.education add column if not exists seed_key text;
alter table public.work_experience alter column start_date drop not null;

update public.skills as skill
set seed_key = seeded.seed_key
from (
  values
    ('skill-programming-js-ts-php', 'Programming & Web Foundations', 'Basic programming with JavaScript, TypeScript, and PHP'),
    ('skill-programming-html-css', 'Programming & Web Foundations', 'HTML, CSS, and Tailwind CSS for page structure and styling'),
    ('skill-programming-react-next', 'Programming & Web Foundations', 'Exploring React and Next.js website layouts'),
    ('skill-programming-ai-assisted', 'Programming & Web Foundations', 'Learning by reviewing, testing, and improving code with AI assistance'),
    ('skill-data-sql', 'Databases & Data', 'Basic SQL and relational database concepts'),
    ('skill-data-mysql-postgresql', 'Databases & Data', 'Exposure to MySQL and PostgreSQL'),
    ('skill-data-organization', 'Databases & Data', 'Organizing application data and understanding table relationships'),
    ('skill-support-labs', 'IT Support & Campus Operations', 'Assisting with computer laboratory maintenance and troubleshooting'),
    ('skill-support-av', 'IT Support & Campus Operations', 'Helping set up audio-visual equipment and event livestreams'),
    ('skill-support-records', 'IT Support & Campus Operations', 'Supporting document processing and student data verification'),
    ('skill-support-operations', 'IT Support & Campus Operations', 'Learning through day-to-day technical support tasks'),
    ('skill-creative-layouts', 'Creative & UI Exploration', 'Exploring website layouts and different interface ideas'),
    ('skill-creative-graphic-design', 'Creative & UI Exploration', 'Basic graphic design and digital editing'),
    ('skill-creative-event-materials', 'Creative & UI Exploration', 'Creating event materials, certificates, and visual layouts'),
    ('skill-creative-multimedia', 'Creative & UI Exploration', 'Trying multimedia edits, audio, and visual transitions')
) as seeded(seed_key, category, name)
where skill.seed_key is null
  and skill.category = seeded.category
  and skill.name = seeded.name
  and skill.id = (
    select candidate.id
    from public.skills candidate
    where candidate.seed_key is null
      and candidate.category = seeded.category
      and candidate.name = seeded.name
    order by candidate.created_at, candidate.id
    limit 1
  );

update public.work_experience as experience
set seed_key = seeded.seed_key,
    start_date = case
      when seeded.seed_key = 'experience-software-project-developer'
        and experience.start_date = date '2024-01-01'
      then null
      else experience.start_date
    end
from (
  values
    ('experience-misits-student-assistant', 'Student Assistant', 'MISITS Department · Our Lady of Lourdes College Foundation (OLLCF)'),
    ('experience-software-project-developer', 'Custom Software & Web Application Developer', 'Mendoza''s Store · Barangay Alawihao Youth Council')
) as seeded(seed_key, job_title, organization)
where experience.seed_key is null
  and experience.job_title = seeded.job_title
  and experience.organization = seeded.organization
  and experience.id = (
    select candidate.id
    from public.work_experience candidate
    where candidate.seed_key is null
      and candidate.job_title = seeded.job_title
      and candidate.organization = seeded.organization
    order by candidate.created_at, candidate.id
    limit 1
  );

update public.education as education
set seed_key = 'education-ollcf-bsit'
where education.seed_key is null
  and education.institution = 'Our Lady of Lourdes College Foundation'
  and education.qualification = 'Bachelor of Science in Information Technology'
  and education.id = (
    select candidate.id
    from public.education candidate
    where candidate.seed_key is null
      and candidate.institution = 'Our Lady of Lourdes College Foundation'
      and candidate.qualification = 'Bachelor of Science in Information Technology'
    order by candidate.created_at, candidate.id
    limit 1
  );

create unique index if not exists skills_seed_key_unique_idx
  on public.skills (seed_key);
create unique index if not exists work_experience_seed_key_unique_idx
  on public.work_experience (seed_key);
create unique index if not exists education_seed_key_unique_idx
  on public.education (seed_key);

alter table public.project_gallery alter column media_id drop not null;
alter table public.project_gallery add column if not exists legacy_url text;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.project_gallery'::regclass
      and conname = 'project_gallery_media_or_legacy_check'
  ) then
    alter table public.project_gallery
      add constraint project_gallery_media_or_legacy_check
      check ((media_id is null) <> (legacy_url is null));
  end if;
end;
$$;
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.project_gallery'::regclass
      and conname = 'project_gallery_legacy_url_check'
  ) then
    alter table public.project_gallery
      add constraint project_gallery_legacy_url_check
      check (legacy_url is null or (legacy_url like '/images/%' and position('..' in legacy_url) = 0));
  end if;
end;
$$;

insert into public.project_gallery (project_id, legacy_url, caption, display_order)
select project.id,
  image.value ->> 'url',
  coalesce(image.value ->> 'caption', ''),
  coalesce(existing.max_order, -1) + image.position::integer
from public.projects project
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(project.legacy_gallery) = 'array'
    then project.legacy_gallery else '[]'::jsonb end
) with ordinality as image(value, position)
left join lateral (
  select max(gallery.display_order) as max_order
  from public.project_gallery gallery
  where gallery.project_id = project.id
) existing on true
where image.value ->> 'url' like '/images/%'
  and position('..' in image.value ->> 'url') = 0
  and not exists (
    select 1 from public.project_gallery gallery
    where gallery.project_id = project.id
      and gallery.legacy_url = image.value ->> 'url'
  );

drop function if exists public.replace_project_gallery(uuid, uuid[]);
drop function if exists public.replace_project_gallery(uuid, uuid[], text[]);
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
  if not exists (select 1 from public.projects where id = p_project_id) then
    raise exception using errcode = 'P0002', message = 'Project not found';
  end if;
  if p_media_ids is null or p_legacy_urls is null or p_captions is null
    or cardinality(p_media_ids) > 20
    or cardinality(p_media_ids) <> cardinality(p_legacy_urls)
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
    raise exception using errcode = '22023', message = 'Gallery image IDs and captions must match, be unique, and contain no more than 20 images';
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
    raise exception using errcode = '22023', message = 'Gallery images must be public image media';
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

create table if not exists public.creative_works (
  id uuid primary key default gen_random_uuid(),
  seed_key text unique,
  title text not null,
  category text not null,
  description text not null default '',
  media_type text not null check (media_type in ('photo', 'video')),
  image_media_id uuid references public.media_assets (id) on delete set null,
  legacy_image_url text,
  image_alt text,
  video_url text,
  show_creator_credit boolean not null default true,
  creator_credit text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (legacy_image_url is null or (legacy_image_url like '/images/%' and position('..' in legacy_image_url) = 0)),
  check (video_url is null or (video_url like '/images/%' and position('..' in video_url) = 0))
);
create index if not exists creative_works_public_order_idx
  on public.creative_works (display_order) where is_published;
alter table public.creative_works enable row level security;
drop policy if exists "Public can read published creative works" on public.creative_works;
create policy "Public can read published creative works"
on public.creative_works for select to anon, authenticated
using (is_published);
drop policy if exists "Administrators manage creative works" on public.creative_works;
create policy "Administrators manage creative works"
on public.creative_works for all to authenticated
using ((select public.is_portfolio_admin()))
with check ((select public.is_portfolio_admin()));
grant select, insert, update, delete on public.creative_works to anon, authenticated;
drop trigger if exists set_updated_at on public.creative_works;
create trigger set_updated_at before update on public.creative_works
for each row execute function public.set_updated_at();

insert into public.creative_works (
  seed_key, title, category, description, media_type, legacy_image_url,
  image_alt, video_url, show_creator_credit, creator_credit, is_published,
  display_order
)
values
  ('design-pubmat-poster', 'Pubmat Poster', 'Pubmats & Graphic Design', 'Promotional poster design.', 'photo', '/images/design/pubmat-poster.png', 'Pubmat poster design', null, true, null, true, 0),
  ('design-coreldraw-layout', 'CorelDRAW Layout', 'CorelDRAW Designs & Editing', 'Graphic layout created or edited using CorelDRAW.', 'photo', '/images/design/coreldraw-layout.jpg', 'CorelDRAW graphic layout', null, true, null, true, 1),
  ('design-av-presentation', 'Audio-Visual Presentation', 'Audio-Visual Presentations', 'Video presentation and multimedia work.', 'video', null, 'Audio-visual presentation video', '/images/design/av-presentation.mp4', true, null, true, 2),
  ('design-animated-story-edit', 'Animated Story Edit', 'Audio-Visual Presentations', 'My first animated-story editing attempt, adding sound effects, a background, and blended transitions.', 'video', null, 'Animated story edit with sound effects and blended transitions', '/images/design/animation.mp4', true, null, true, 3),
  ('design-tshirt-layout', 'T-shirt Layout', 'T-shirt Layouts', 'Custom T-shirt graphic layout.', 'photo', '/images/design/tshirt-layout.png', 'T-shirt graphic layout', null, true, null, true, 4),
  ('design-pageant-event-design', 'Pageant Event Design', 'Event & Pageant Designs', 'Visual design for an event or pageant.', 'photo', '/images/design/pageant-event-design.jpg', 'Pageant event design', null, true, null, true, 5),
  ('design-third-birthday-layout', '3rd Birthday Layout', 'Event & Pageant Designs', 'A birthday layout created for a friend''s child''s 3rd birthday.', 'photo', '/images/design/3rd.png', 'Birthday layout for a friend''s child''s 3rd birthday', null, true, null, true, 6),
  ('design-seventh-birthday-layout', '7th Birthday Layout', 'Event & Pageant Designs', 'A birthday layout created for a friend''s child''s 7th birthday.', 'photo', '/images/design/7th.png', 'Birthday layout for a friend''s child''s 7th birthday', null, true, null, true, 7),
  ('design-esports-certificate', 'E-Sports MLBB CCS 2026 Certificate', 'Event & Pageant Designs', 'Certificate layout for the E-Sports MLBB CCS 2026 event.', 'photo', '/images/design/e-sports.png', 'Certificate layout for E-Sports MLBB CCS 2026', null, true, null, true, 8),
  ('design-mass-judge-certificate', 'Mass Demonstration Competition CCS 2026 Judge Certificate', 'Event & Pageant Designs', 'Judge certificate layout for the Mass Demonstration Competition CCS 2026.', 'photo', '/images/design/mass-cert.png', 'Judge certificate layout for Mass Demonstration Competition CCS 2026', null, true, null, true, 9),
  ('design-smoking-awareness-flyer', 'Smoking Awareness Flyer', 'Pubmats & Graphic Design', 'An early digital-editing design created to promote awareness about smoking.', 'photo', '/images/design/flyer.png', 'Flyer design promoting awareness about smoking', null, true, null, true, 10),
  ('design-pageant-visual-edit', 'Pageant Visual Edit', 'Event & Pageant Designs', 'Video edit for a pageant event.', 'video', null, 'Pageant event video edit', '/images/design/pageant-visual-edit.mp4', true, null, true, 11)
on conflict (seed_key) do nothing;

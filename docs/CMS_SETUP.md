# Portfolio CMS setup

The public portfolio continues to work without Supabase. When Supabase is
configured, published CMS records drive the home, About, Skills, Projects,
Experience, Achievements, Design & Creative Works, Contact, résumé, navigation,
and footer content. Unconfigured deployments use the existing local portfolio
data.

## 1. Create a Supabase project

Create a project in Supabase and keep its project URL and publishable key
private to your local environment and deployment settings. Do not add a
service-role key to this application.

In **Authentication → Providers → Email**, keep email/password sign-in enabled
and disable public sign-ups. The local Supabase config also disables both
`[auth].enable_signup` and `[auth.email].enable_signup`. Create the administrator
account yourself from the Supabase Dashboard's **Authentication → Users** page;
do not enable public registration or expose a registration flow.

## 2. Apply the database migrations

Run the migrations in order using the Supabase SQL Editor, or use the Supabase
CLI against a local project:

1. `supabase/migrations/20261021120000_initial_cms.sql`
2. `supabase/migrations/20261022120000_seed_existing_portfolio.sql`
3. `supabase/migrations/20261023120000_cms_phase2_safety_and_creative_works.sql`

The first migration creates the CMS tables, row-level security policies,
storage buckets, and access-control functions. The second imports the existing
portfolio content and keeps the current local image/resume paths available
until you replace them with uploaded media. The third migration adds safe
repeatability keys, makes the unknown project-developer start date nullable,
preserves existing project gallery paths/captions/order in editable gallery
rows, enforces the single-admin constraint, and imports the existing Design
gallery as editable CMS records.

Do not run migrations on production as part of this setup checklist. For a
disposable local test, install the Supabase CLI and Docker, then from the
repository root:

```powershell
# The checked-in config disables [auth].enable_signup and [auth.email].enable_signup.
supabase start
supabase migration up --local
supabase status -o env
```

Use the local API URL and publishable/anon key reported by
`supabase status` in `.env.local`. Create one test user in the local Studio,
add only that user's UUID to `portfolio_admins`, then test login, edits,
published public reads, and denied writes from an anonymous session and a
second ordinary authenticated user. Do not link a production project or run
`db reset` against data you need.

## 3. Create the single administrator

After creating the one administrator in **Authentication → Users**, copy that
user's UUID and run this statement as the project owner in the SQL Editor,
replacing the placeholder:

```sql
insert into public.portfolio_admins (user_id)
values ('00000000-0000-0000-0000-000000000000');
```

The allowlist is constrained to one row, and application roles cannot insert,
update, or delete administrator rows. The admin panel checks the allowlist in
protected route loaders and Server Actions; database RLS checks it again for
content writes and storage operations. If a pre-existing database has multiple
admin rows, the repair migration deliberately stops with an error rather than
choosing or deleting an account. Review the allowlist manually as the project
owner before retrying.

## 4. Configure local development

Copy `.env.example` to `.env.local` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Keep `.env.local` out of version control. Restart `npm run dev` after changing
environment variables. Visit `/admin/login` and sign in with the allowlisted
administrator account. Public data updates are cached briefly and CMS saves
expire the corresponding Next.js cache tags immediately.

## 5. Configure Vercel

Add the same two public Supabase values in the Vercel project's **Settings →
Environment Variables** for Preview and Production, then redeploy. In
Supabase Authentication URL settings, set the production site URL and add the
local and deployed `/admin/login` URLs to the allowed redirect URLs.

Do not configure a service-role key in Vercel. The application uses
cookie-aware Supabase clients, the publishable key, and database/storage RLS.

## Content and media notes

- The seed migration is repeatable for the skills, experience, and education
  records through stable `seed_key` values and `ON CONFLICT DO NOTHING`.
  Existing profile and project rows are also protected by their singleton/slug
  conflicts, and social links check for their URLs before inserting.
- On a database where the earlier seed already ran, apply the third forward
  migration once; it tags the matching existing skills, experience, and
  education records without deleting or replacing them. It also clears the
  previously inferred `2024-01-01` date only on the matching project-developer
  record. Unknown dates remain null. Existing duplicate rows are not deleted;
  only one exact matching seeded record receives each key, and subsequent seed
  runs will not add another copy.
- Use **Admin → Media** to upload public images and a résumé, then select those
  assets in the profile/project editors. The public bucket serves only media
  marked public; private résumé/media objects require an authenticated admin
  session. The Supabase Storage policies restrict mutations to the allowlisted
  administrator.
- Contact email and phone visibility are controlled separately in Contact
  settings. Only enabled/public fields are exposed to anonymous visitors.
- Achievements start empty because the existing portfolio did not contain
  achievement records; add any credentials you want to publish in the admin.
- The Design gallery is seeded from its existing local data without removing
  those files or changing the local fallback. Photo entries may keep their
  `/images/design/...` paths or use uploaded public image assets. Existing
  videos remain local paths; video uploads are not currently supported.
- Back up existing databases before applying migrations. The third migration
  intentionally fails when it finds multiple administrators so the account
  owner can review them instead of silently dropping access.

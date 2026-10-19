# Fresh repository / empty Supabase quick start (CMS 4.0.3)

This package is for a **new GitHub repository and a new empty Supabase project**. No earlier database content or deployment is imported.

1. Create a NEW Supabase project. Copy its project URL, **publishable/anon key** and **service role secret**. Never commit secrets.
2. In Supabase SQL Editor, run `supabase/schema.sql` **once** for initial database structure. The script also seeds default site settings/taxonomies, but does not copy old customer content.
3. Create your own admin account in Supabase Authentication (email + password), then change the email in `credentials/FIRST-SUPER-ADMIN.sql` and run it. Verify the SELECT returns your role.
4. Create a fresh GitHub repository; upload the **contents of this project directory to the repository root**, including hidden files such as `.gitignore`. Do not upload the parent folder as a nested root.
5. Import the repository into Vercel (Next.js framework). Set Node.js 24.x, build command `npm run build`, default install/output settings.
6. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`, `ANALYTICS_SALT` in Vercel Project Settings > Environment Variables. `NEXT_PUBLIC_SITE_URL` must match the deployment domain. Optional newsletter variables are in `.env.example`.
7. Deploy, visit `/`, then `/admin/login`, and configure SEO, site design and content.
8. Locally run `npm install`, `npm run verify`, `npm run build` before future pushes if Node 24 is installed.

**Important:** This CMS requires Supabase for persistent posts, users, pages, and revisions. An **empty database is fine**; **no database at all** is not compatible with its CMS editing features. Vercel deployments are not a substitute for database backups.

See `ROLLBACK-AND-RECOVERY.md` for release rollback and database restoration.

# Fresh GitHub + Vercel deployment

1. Upload the contents of this archive to the repository root (do not upload a containing folder).
2. Configure Node.js 24.x in Vercel. Framework preset: Next.js. Root directory: repository root.
3. Create a new Supabase project; run `supabase/schema.sql` in the SQL editor.
4. Configure the environment variables listed in `.env.example` in Vercel, using values from your own new Supabase project. Do not commit secrets.
5. Deploy. Admin screens that require Supabase will not work until the database and authentication are configured.
6. Rollback of app code: Vercel > Deployments > previous successful deployment > Redeploy / Promote, or revert the GitHub commit. This does NOT roll back database data.
7. Back up database data separately in Supabase before schema or content changes.

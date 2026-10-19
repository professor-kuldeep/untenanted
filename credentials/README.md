# Credential Setup

Use `CREDENTIALS-TEMPLATE.txt` as your private handoff sheet after the Supabase and Vercel projects are created.

Do not put a completed credential file into this project repository. The recommended private filename is:

`CREDENTIALS-PRIVATE.txt`

That filename is already excluded by `.gitignore`.

The included `FIRST-SUPER-ADMIN.sql` changes an existing Supabase Auth user's CMS role to `super_admin`.

Real API keys cannot be pre-generated inside this ZIP because they belong to your own Supabase, Vercel and optional Resend accounts.

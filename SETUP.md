# Untenanted Heart CMS V5.2 Setup

## 1. Create Supabase

Create a new Supabase project. In SQL Editor, run the complete file:

`supabase/schema.sql`

Create the Storage bucket(s) required by the schema/setup if they are not created automatically by your Supabase environment.

## 2. Create the first Super Admin

In Supabase Authentication, create:

`untenantedheart@gmail.com`

Set a strong password, then run:

`credentials/FIRST-SUPER-ADMIN.sql`

## 3. Configure Supabase Auth URLs

Set the production Site URL to your final Untenanted Heart domain.

Add the production redirect URLs for password recovery:

- `https://YOUR-DOMAIN/account/reset-password`
- `https://YOUR-DOMAIN/admin/reset-password`

For local development also allow:

- `http://localhost:3000/account/reset-password`
- `http://localhost:3000/admin/reset-password`

## 4. Configure Vercel environment variables

Required:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ANALYTICS_SALT`

Optional newsletter:

- `RESEND_API_KEY`
- `NEWSLETTER_FROM`

Optional GA4 + Google Search Console CMS reporting:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

Never add the Supabase service-role key or Google private key to client-side variables or GitHub.

## 5. Deploy from GitHub

Upload the project contents to the repository root, then connect the repository to Vercel.

Expected runtime:

- Node.js 24.x
- Next.js 16.4.2
- build command: `npm run build`

V5.2 has no automatic `prebuild` hook.

## 6. Configure the CMS

After deployment, sign in at `/admin/login` and configure:

- Site Design / Navigation
- Homepage
- SEO defaults
- Traffic & Search
- Newsletter
- Taxonomies
- Redirects

### Traffic & Search

In Admin → Traffic & Search, add when available:

- GA4 Measurement ID, e.g. `G-XXXXXXXXXX`
- GA4 Property ID
- Google Search Console property URL
- Google site verification token
- analytics consent preference

For the server-side GA4/GSC report cards, create a Google service account, place its email/private key in Vercel environment variables, and grant that service account read access to the GA4 property and Search Console property.

## 7. Enable admin MFA

Go to Admin → Security Center → Add Authenticator.

Scan the QR code with a TOTP authenticator app and verify the 6-digit code. Once a verified factor exists, future CMS logins require the authenticator challenge.

## 8. Test password reset

Test both:

- `/account/forgot-password`
- `/admin/forgot-password`

Confirm the recovery email returns to the matching reset-password page and allows a new password to be saved.

## 9. Test backups and health

- Admin → Backup & Restore: download a Safe Backup.
- Super Admin: optionally test Full Backup and merge restore on a non-production copy first.
- Admin → System Health: confirm database/storage/integration status.
- `/api/health`: confirm the public health response does not expose secrets.

## 10. Final production test

Test public pages, mobile navigation, search, story/community forms, newsletter subscription, member login, saves/reactions, admin login, MFA, password reset, publishing, redirects, sitemap, robots, RSS and canonical/metadata output.

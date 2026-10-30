# Untenanted Heart CMS V5.2 — Final JMP-Aligned Release

A standalone Next.js + Supabase publishing, community, membership and SEO platform for Untenanted Heart.

V5.2 keeps the Untenanted Heart public experience and adds the operational CMS patterns used in the final JMP system where they are relevant: a stronger admin shell, first-party traffic analytics, GA4/GSC reporting, attribution, consent controls, MFA/session security, backup/restore and system health monitoring.

## Stack

- Next.js 16.4.2
- React / React DOM 19.3.1
- Node.js 24.x
- Supabase Auth, PostgreSQL and Storage
- Optional Resend newsletter email
- Optional Google Analytics 4 and Google Search Console reporting

## Main CMS areas

- Dashboard
- Posts and visual block editor
- Editorial workflow and calendar
- Homepage builder
- Page builder
- Media library
- Collections and Daily Reflection
- Community / story moderation
- Newsletter Centre
- SEO Control Center
- Redirect Manager
- Taxonomy Manager
- Traffic & Search
- Security Center
- Backup & Restore
- System Health
- Users / roles / audit history

## Security

- Supabase authentication
- Admin password reset
- Optional TOTP authenticator MFA for CMS users
- MFA challenge on later admin sign-ins once a verified TOTP factor exists
- Sign out other sessions
- Role-based access controls backed by Supabase RLS
- Service-role key remains server-only

## Analytics & search

The platform has privacy-conscious first-party event tracking for public pages and campaign attribution. A visitor identifier is hashed server-side with `ANALYTICS_SALT`; raw IP addresses are not stored by this tracker.

The CMS Traffic & Search area can also show live GA4 and Google Search Console reporting when optional Google service-account credentials are configured in Vercel and granted access to the relevant properties.

## Database

V5.2 is standalone. For a fresh installation, run only:

`supabase/schema.sql`

Do not run V1/V2/V3/V4 migration chains against a new V5.2 database.

## First administrator

Create `untenantedheart@gmail.com` in Supabase Authentication, then run:

`credentials/FIRST-SUPER-ADMIN.sql`

## Deployment

See `SETUP.md` and `DEPLOYMENT-CHECKLIST.md`.

For the JMP-aligned additions, see `FINAL-JMP-ALIGNMENT.md`.

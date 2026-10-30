# Password Reset — V5.2

Password recovery is available for both public members and CMS administrators.

## Member recovery

- `/account/forgot-password`
- `/account/reset-password`

## Admin recovery

- `/admin/forgot-password`
- `/admin/reset-password`

The flow sends a Supabase recovery email, establishes the recovery session and allows the user to save a new password.

In Supabase Authentication → URL Configuration, allow the production reset URLs for both account and admin recovery. Also add localhost reset URLs when testing locally.

For production email reliability, configure an appropriate SMTP provider in Supabase Auth.

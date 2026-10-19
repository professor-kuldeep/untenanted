-- Untenanted Heart CMS V4.0.1
-- FIRST SUPER ADMIN SETUP
--
-- 1. First create the user in Supabase Authentication.
-- 2. Replace the email below with the exact Auth user email.
-- 3. Run this in Supabase SQL Editor.

update public.profiles
set role = 'super_admin',
    active = true,
    updated_at = now()
where email = 'untenantedheart@gmail.com';

-- Verify the result:
select id, email, display_name, role, active
from public.profiles
where email = 'untenantedheart@gmail.com';

-- 1. Create untenantedheart@gmail.com in Supabase Authentication > Users.
-- 2. Then run this in the Supabase SQL Editor.
update public.profiles
set role='super_admin', active=true, updated_at=now()
where email='untenantedheart@gmail.com';

select id,email,display_name,role,active
from public.profiles
where email='untenantedheart@gmail.com';

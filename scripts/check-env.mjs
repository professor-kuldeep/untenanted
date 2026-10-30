const required=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_SITE_URL','ANALYTICS_SALT'];
const optional=['RESEND_API_KEY','NEWSLETTER_FROM'];
console.log('Untenanted Heart CMS V5 — environment check');
let bad=false;
for(const key of required){const ok=Boolean(process.env[key]?.trim());console.log(`${ok?'OK ':'MISS'} ${key}`);if(!ok)bad=true;}
for(const key of optional)console.log(`${process.env[key]?.trim()?'OK ':'OPT '} ${key}`);
const site=process.env.NEXT_PUBLIC_SITE_URL||'';
if(site&&!/^https:\/\//i.test(site)){console.error('NEXT_PUBLIC_SITE_URL should use https:// in production.');bad=true;}
const supa=process.env.NEXT_PUBLIC_SUPABASE_URL||'';
if(supa&&!/^https:\/\/.+\.supabase\.co\/?$/i.test(supa))console.warn('Check NEXT_PUBLIC_SUPABASE_URL; it does not look like a standard Supabase project URL.');
if((process.env.ANALYTICS_SALT||'').length>0&&(process.env.ANALYTICS_SALT||'').length<24){console.error('ANALYTICS_SALT should be at least 24 characters.');bad=true;}
if(bad)process.exit(1);

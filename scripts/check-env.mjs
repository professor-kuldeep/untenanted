const required=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','NEXT_PUBLIC_SITE_URL','ANALYTICS_SALT'];
const optional=['RESEND_API_KEY','NEWSLETTER_FROM'];
console.log('Untenanted Heart CMS V4.0.3 — environment check');
let missing=0,invalid=0;
for(const key of required){
  const value=process.env[key];
  if(!value){console.log(`MISSING  ${key}`);missing++;continue}
  let issue='';
  if(key==='NEXT_PUBLIC_SUPABASE_URL'&&!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(value))issue='unexpected Supabase URL format';
  if(key==='NEXT_PUBLIC_SITE_URL'&&(!/^https:\/\//i.test(value)||/your-domain|example\.com/i.test(value)))issue='use the final HTTPS site URL';
  if(key==='ANALYTICS_SALT'&&(value.length<24||/change-this|example|placeholder/i.test(value)))issue='use a long random secret value';
  if(issue){console.log(`INVALID  ${key} — ${issue}`);invalid++;}else console.log(`OK       ${key}`);
}
for(const key of optional)console.log(`${process.env[key]?'OK':'OPTIONAL'}  ${key}`);
if(missing||invalid){
  console.error(`\nEnvironment check failed: ${missing} missing, ${invalid} invalid required value(s).`);
  process.exitCode=1;
}else console.log('\nEnvironment check passed.');

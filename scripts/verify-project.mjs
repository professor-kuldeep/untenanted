import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
let errors=[];
const fail=m=>errors.push(m);
const exists=p=>fs.existsSync(path.join(root,p));

const required=[
  'package.json','next.config.mjs','proxy.js',
  'app/layout.jsx','app/page.jsx','app/globals.css','app/account/forgot-password/page.jsx','app/account/reset-password/page.jsx',
  'app/admin/layout.jsx','app/admin/admin.css','app/admin/login/page.jsx','app/admin/forgot-password/page.jsx','app/admin/reset-password/page.jsx',
  'app/admin/(dashboard)/layout.jsx','app/admin/(dashboard)/page.jsx','app/admin/(dashboard)/traffic-search/page.jsx','app/admin/(dashboard)/security/page.jsx','app/admin/(dashboard)/backup/page.jsx','app/admin/(dashboard)/system/page.jsx',
  'components/Header.jsx','components/Footer.jsx','components/StoryCard.jsx','components/PasswordResetRequest.jsx','components/PasswordResetForm.jsx',
  'components/admin/AdminNav.jsx','components/admin/PostEditor.jsx','components/admin/SeoDashboard.jsx','components/admin/TrafficSearchManager.jsx','components/admin/SecurityCenter.jsx','components/admin/BackupManager.jsx',
  'lib/content.js','lib/seo.js','lib/admin-auth.js','lib/api-admin.js','lib/google.js','lib/supabase/server.js','lib/supabase/browser.js','lib/supabase/admin.js',
  'supabase/schema.sql','credentials/FIRST-SUPER-ADMIN.sql','public/sw.js','.github/workflows/build.yml'
];
for(const f of required)if(!exists(f))fail(`Missing required file: ${f}`);

const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if(pkg.name!=='untenanted-heart-cms-v5')fail(`Unexpected package name: ${pkg.name}`);
if(pkg.version!=='5.2.0')fail(`Expected version 5.2.0, found ${pkg.version}`);
if(pkg.engines?.node!=='24.x')fail('Node engine must be 24.x');
if(pkg.scripts?.prebuild)fail('V5 must not couple repository verification to npm prebuild.');
if(pkg.dependencies?.next!=='16.4.2')fail(`Expected Next.js 16.4.2, found ${pkg.dependencies?.next}`);
if(pkg.dependencies?.react!=='19.3.1'||pkg.dependencies?.['react-dom']!=='19.3.1')fail('React and React DOM must be 19.3.1');
if(exists('middleware.js'))fail('middleware.js must not exist; Next.js 16 project uses proxy.js.');

function walk(dir){
  if(!fs.existsSync(dir))return [];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
    const p=path.join(dir,e.name);return e.isDirectory()?walk(p):[p];
  });
}
const source=walk(path.join(root,'app')).concat(walk(path.join(root,'components')),walk(path.join(root,'lib')))
  .filter(f=>/\.(?:js|jsx|mjs)$/.test(f));

const importRe=/(?:import\s+(?:[^'\"]+?\s+from\s+)?|export\s+[^'\"]+?\s+from\s+|import\()(['\"])([^'\"]+)\1/g;
const extensions=['','.js','.jsx','.mjs','.json','.css'];
for(const file of source){
  const text=fs.readFileSync(file,'utf8');
  if(text.includes("@/"))fail(`Alias import is not allowed in standalone V5: ${path.relative(root,file)}`);
  let m;
  while((m=importRe.exec(text))){
    const spec=m[2];
    if(!spec.startsWith('.'))continue;
    const base=path.resolve(path.dirname(file),spec);
    const candidates=extensions.map(x=>base+x).concat(extensions.slice(1).map(x=>path.join(base,'index'+x)));
    if(!candidates.some(fs.existsSync))fail(`Broken local import in ${path.relative(root,file)}: ${spec}`);
  }
}

const adminLayout=fs.readFileSync(path.join(root,'app/admin/layout.jsx'),'utf8');
if(!adminLayout.includes("import './admin.css'"))fail('Admin layout must import ./admin.css');
if(!exists('app/admin/admin.css'))fail('app/admin/admin.css is required by the admin layout.');


const traffic=fs.readFileSync(path.join(root,'components/admin/TrafficSearchManager.jsx'),'utf8');
if(!traffic.includes('GA4 & Search Console')||!traffic.includes('Export CSV'))fail('Traffic & Search manager is incomplete.');
const security=fs.readFileSync(path.join(root,'components/admin/SecurityCenter.jsx'),'utf8');
if(!security.includes('auth.mfa.enroll')||!security.includes("scope:'others'"))fail('Security Center must include TOTP MFA and other-session sign-out.');
const analytics=fs.readFileSync(path.join(root,'components/VisitTracker.jsx'),'utf8');
const analyticsLib=fs.readFileSync(path.join(root,'lib/analytics.js'),'utf8');
if(!analytics.includes("'page_view'")||!analyticsLib.includes('utm_campaign'))fail('First-party visit tracker is incomplete.');
const memberAuth=fs.readFileSync(path.join(root,'components/MemberAuth.jsx'),'utf8');
if(!memberAuth.includes('/account/forgot-password'))fail('Member login must expose Forgot password.');
const adminLogin=fs.readFileSync(path.join(root,'app/admin/login/page.jsx'),'utf8');
if(!adminLogin.includes('/admin/forgot-password'))fail('Admin login must expose Forgot password.');
const proxyText=fs.readFileSync(path.join(root,'proxy.js'),'utf8');
if(!proxyText.includes("'/admin/forgot-password'")||!proxyText.includes("'/admin/reset-password'"))fail('Admin password recovery routes must be public in proxy.js.');
const resetRequest=fs.readFileSync(path.join(root,'components/PasswordResetRequest.jsx'),'utf8');
if(!resetRequest.includes('resetPasswordForEmail'))fail('Password reset request component must call resetPasswordForEmail.');
const resetForm=fs.readFileSync(path.join(root,'components/PasswordResetForm.jsx'),'utf8');
if(!resetForm.includes('updateUser({password})'))fail('Password reset form must update the authenticated user password.');

const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');
if(!sw.includes("uh-v5-2-public"))fail('Service worker must use the V5.2 cache namespace.');

const schema=fs.readFileSync(path.join(root,'supabase/schema.sql'),'utf8');
if(!schema.includes('UNTENANTED HEART CMS V5.2 — STANDALONE FRESH SCHEMA'))fail('Supabase schema is not labeled as the V5.2 standalone schema.');
if(/upgrade-v[1-4]|UPGRADE FROM V|CMS V[1-4]/i.test(schema))fail('Standalone schema still contains legacy migration/version references.');

if(errors.length){
  console.error(`V5 verification failed with ${errors.length} issue(s):`);
  for(const e of errors)console.error(`- ${e}`);
  process.exit(1);
}
console.log(`Untenanted Heart CMS V5.2 verification passed: ${required.length} critical files and ${source.length} source modules checked.`);

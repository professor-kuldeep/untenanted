import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const required=['app/sitemap.js','app/robots.js','app/feed.xml/route.js','app/llms.txt/route.js','app/emotion/[slug]/page.jsx','app/tag/[slug]/page.jsx','lib/seo.js','components/JsonLd.jsx','components/Breadcrumbs.jsx','components/admin/SeoDashboard.jsx','components/admin/RedirectManager.jsx','proxy.js'];
const missing=required.filter(x=>!fs.existsSync(path.join(root,x)));
const site=process.env.NEXT_PUBLIC_SITE_URL||'';
console.log('Untenanted Heart V4.0.2 SEO project audit');
console.log('-------------------------------------');
if(missing.length){console.error('Missing SEO infrastructure:');missing.forEach(x=>console.error(' - '+x));process.exitCode=1}else console.log('✓ SEO infrastructure files present');
if(!site)console.warn('! NEXT_PUBLIC_SITE_URL is not set in this shell. Set it in Vercel for correct canonicals/sitemaps.');
else if(!/^https:\/\//.test(site))console.warn('! NEXT_PUBLIC_SITE_URL should use https://');
else console.log('✓ Canonical base URL:',site);
const privateRoutes=['app/admin/layout.jsx','app/account/page.jsx','app/account/login/page.jsx','app/report/page.jsx','app/saved/page.jsx','app/for-you/page.jsx'];
for(const rel of privateRoutes){
  const full=path.join(root,rel);
  if(!fs.existsSync(full)){console.warn(`! Optional SEO audit route missing: ${rel}`);continue}
  const text=fs.readFileSync(full,'utf8');
  if(!text.includes('index:false'))console.warn(`! ${rel} does not visibly declare noindex`)
}
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if(pkg.engines?.node!=='24.x')console.warn('! package.json should pin Node.js 24.x for this V4 build.');
if(!String(pkg.dependencies?.next||'').startsWith('16.'))console.warn('! V4 expects Next.js 16.x.');
if(fs.existsSync(path.join(root,'middleware.js')))console.warn('! middleware.js exists; V4 should use proxy.js on Next.js 16.');
if(!process.exitCode)console.log('✓ Static SEO checks passed. Run the CMS SEO Control Center after Supabase is connected for content-level audits.');

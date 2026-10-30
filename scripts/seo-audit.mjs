import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const must=['app/sitemap.js','app/robots.js','app/feed.xml/route.js','app/llms.txt/route.js','lib/seo.js','components/JsonLd.jsx','components/Breadcrumbs.jsx','app/admin/(dashboard)/seo/page.jsx','app/admin/(dashboard)/redirects/page.jsx','app/admin/(dashboard)/taxonomies/page.jsx'];
let failed=false;for(const f of must){const ok=fs.existsSync(path.join(root,f));console.log(`${ok?'OK ':'MISS'} ${f}`);if(!ok)failed=true;}
console.log('Untenanted Heart CMS V5 SEO infrastructure audit');if(failed)process.exit(1);

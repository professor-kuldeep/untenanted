import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

function fail(message) {
  console.error(`\nPROJECT INTEGRITY CHECK FAILED: ${message}`);
  process.exit(1);
}

function readRequired(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`Required file is missing: ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

const critical = [
  'components/PageBlocks.jsx','components/MemberAuth.jsx','components/MemberPreferences.jsx','components/StoryCard.jsx','components/Breadcrumbs.jsx',
  'components/JsonLd.jsx','components/admin/ReportsModeration.jsx','components/admin/PostEditor.jsx','components/admin/SeoDashboard.jsx',
  'components/admin/RedirectManager.jsx','components/admin/TaxonomyManager.jsx','lib/content.js','lib/seo.js','lib/supabase/server.js',
  'app/[slug]/page.jsx','app/account/login/page.jsx','app/account/page.jsx','app/admin/(dashboard)/community/page.jsx',
  'app/admin/(dashboard)/seo/page.jsx','app/admin/(dashboard)/redirects/page.jsx','app/admin/(dashboard)/taxonomies/page.jsx','app/tag/[slug]/page.jsx',
  'app/admin.css','app/admin/layout.jsx','app/sitemap.js','app/robots.js','app/feed.xml/route.js','app/llms.txt/route.js','proxy.js','supabase/schema.sql'
];

const missingCritical = critical.filter(f => !fs.existsSync(path.join(root, f)));
if (missingCritical.length) {
  console.error('\nPROJECT INCOMPLETE: required runtime/source files are missing:');
  for (const f of missingCritical) console.error(` - ${f}`);
  process.exit(1);
}

if (fs.existsSync(path.join(root, 'middleware.js'))) {
  console.warn('Warning: middleware.js still exists. V4 uses proxy.js for Next.js 16.');
}

const sourceExts = new Set(['.js', '.jsx', '.mjs']);
const sourceFiles = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
    if (['node_modules','.next','.git'].includes(item.name)) continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else if (sourceExts.has(path.extname(item.name))) sourceFiles.push(full);
  }
}
walk(root);

function resolves(base) {
  return [
    base, `${base}.js`, `${base}.jsx`, `${base}.mjs`,
    path.join(base,'index.js'), path.join(base,'index.jsx'), path.join(base,'index.mjs')
  ].some(f => fs.existsSync(f));
}

const missingImports = [];
const importRe = /(?:from\s+|import\s*\(\s*|import\s*)['"]([^'"]+)['"]/g;
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(importRe)) {
    const spec = match[1];
    if (spec.startsWith('./') || spec.startsWith('../')) {
      const target = path.resolve(path.dirname(file), spec);
      if (!resolves(target)) missingImports.push(`${path.relative(root,file)} -> ${spec}`);
    }
  }
}
if (missingImports.length) {
  console.error('\nBROKEN LOCAL IMPORTS:');
  for (const item of missingImports) console.error(` - ${item}`);
  process.exit(1);
}

const aliasImports = sourceFiles.flatMap(file => {
  const text = fs.readFileSync(file, 'utf8');
  return /['"]@\//.test(text) ? [path.relative(root,file)] : [];
});
if (aliasImports.length) {
  console.error('\nUNSUPPORTED @/ ALIAS IMPORTS FOUND:');
  for (const item of aliasImports) console.error(` - ${item}`);
  process.exit(1);
}

// V4.0.3 deployment consistency checks. This verifier is manual and is not coupled to npm build.
const pkg = JSON.parse(readRequired('package.json'));
if (pkg.version !== '4.0.3') fail(`Expected package version 4.0.3, found ${pkg.version}`);
if (pkg.engines?.node !== '24.x') fail(`Expected Node 24.x, found ${pkg.engines?.node || 'unset'}`);
if (pkg.dependencies?.next !== '16.4.2') fail(`Expected Next.js 16.4.2, found ${pkg.dependencies?.next || 'unset'}`);
if (pkg.dependencies?.react !== '19.3.1' || pkg.dependencies?.['react-dom'] !== '19.3.1') {
  fail('Expected React and React DOM 19.3.1');
}

const sw = readRequired('public/sw.js');
if (!sw.includes('uh-v4-public')) fail('Service worker cache namespace is not V4.');
if (sw.includes('uh-v3-public')) fail('Stale V3 service-worker cache namespace found.');

const envCheck = readRequired('scripts/check-env.mjs');
if (!envCheck.includes('CMS V4.0.3')) fail('Environment checker still has a stale CMS version label.');

// Repository hygiene files are useful, but they are not runtime dependencies and
// must never make a Vercel production build fail if a Git/upload workflow omits them.
const gitignorePath = path.join(root, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignore.includes('.env*') || !gitignore.includes('!.env.example')) {
    console.warn('Warning: .gitignore exists but recommended secret-safe .env rules are incomplete.');
  }
} else {
  console.warn('Notice: .gitignore is not present in the build checkout. This does not affect the Vercel runtime build.');
}

if (!fs.existsSync(path.join(root, '.env.example'))) {
  console.warn('Notice: .env.example is not present. Vercel environment variables are still read from Project Settings.');
}

console.log(`Project integrity check passed: ${critical.length} critical files and ${sourceFiles.length} source files checked.`);

import {getPublishedPosts,getSeoSettings} from '../../lib/content';
export async function GET(){
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://example.com').replace(/\/$/,'');
 const [posts,settings]=await Promise.all([getPublishedPosts({limit:20}),getSeoSettings()]);
 const lines=[`# ${settings.seo_site_name||'Untenanted Heart'}`,settings.seo_default_description||'Words for the feelings you could not name.','',`Canonical site: ${base}`,'','## Core sections',`- Healing: ${base}/healing`,`- Relationships: ${base}/relationships`,`- Self-Worth: ${base}/self-worth`,`- Midnight Thoughts: ${base}/midnight-thoughts`,`- Letting Go: ${base}/letting-go`,`- Starting Again: ${base}/starting-again`,`- Letters: ${base}/letters`,`- Community: ${base}/community`,`- Stories: ${base}/stories`,'','## Recent published stories',...posts.filter(p=>!p.noindex).map(p=>`- ${p.title}: ${base}/stories/${p.slug}`),'','## Feeds',`- Sitemap: ${base}/sitemap.xml`,`- RSS: ${base}/feed.xml`];
 return new Response(lines.join('\n'),{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'}});
}

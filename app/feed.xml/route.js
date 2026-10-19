import {getPublishedPosts,getSeoSettings} from '../../lib/content';
function esc(v=''){return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
export async function GET(){
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://example.com').replace(/\/$/,'');
 const [posts,settings]=await Promise.all([getPublishedPosts({limit:30}),getSeoSettings()]);
 const title=settings.seo_site_name||'Untenanted Heart';
 const description=settings.seo_default_description||'Words for the feelings you could not name.';
 const items=posts.filter(p=>!p.noindex).map(p=>`<item><title>${esc(p.title)}</title><link>${base}/stories/${esc(p.slug)}</link><guid isPermaLink="true">${base}/stories/${esc(p.slug)}</guid><pubDate>${new Date(p.published_at||p.scheduled_at||p.created_at||Date.now()).toUTCString()}</pubDate><description>${esc(p.excerpt||'')}</description><category>${esc(p.category||'')}</category></item>`).join('');
 const xml=`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(title)}</title><link>${base}</link><description>${esc(description)}</description><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
 return new Response(xml,{headers:{'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=1800, stale-while-revalidate=86400'}});
}

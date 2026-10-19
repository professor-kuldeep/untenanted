import {createClient} from '@supabase/supabase-js';
import {getPublishedPosts,getTaxonomies} from '../lib/content';
import {absoluteUrl} from '../lib/seo';
export const dynamic='force-dynamic';
export default async function sitemap(){
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://example.com').replace(/\/$/,'');
 const posts=(await getPublishedPosts()).filter(p=>!p.noindex);
 let extras=[];
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(url&&key){
  const db=createClient(url,key,{auth:{persistSession:false}});
  const [{data:pages=[]},{data:collections=[]}]=await Promise.all([
   db.from('custom_pages').select('slug,updated_at,noindex').eq('status','published').is('deleted_at',null).eq('noindex',false),
   db.from('collections').select('slug,updated_at,noindex').eq('status','published').is('deleted_at',null).eq('noindex',false)
  ]);
  extras=[
   ...pages.map(x=>({url:`${base}/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:'monthly',priority:.6})),
   ...collections.map(x=>({url:`${base}/collections/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:'monthly',priority:.65}))
  ];
 }
 const emotions=(await getTaxonomies('emotion')).filter(x=>x.indexable).map(x=>({url:`${base}/emotion/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:'weekly',priority:.55}));
 const tags=(await getTaxonomies('tag')).filter(x=>x.indexable).map(x=>({url:`${base}/tag/${x.slug}`,lastModified:x.updated_at?new Date(x.updated_at):undefined,changeFrequency:'weekly',priority:.5}));
 const staticRoutes=[
  {path:'',changeFrequency:'weekly',priority:1},
  {path:'stories',changeFrequency:'daily',priority:.8},
  {path:'healing',changeFrequency:'weekly',priority:.7},
  {path:'relationships',changeFrequency:'weekly',priority:.7},
  {path:'self-worth',changeFrequency:'weekly',priority:.7},
  {path:'midnight-thoughts',changeFrequency:'weekly',priority:.7},
  {path:'letting-go',changeFrequency:'weekly',priority:.7},
  {path:'starting-again',changeFrequency:'weekly',priority:.7},
  {path:'letters',changeFrequency:'weekly',priority:.65},
  {path:'community',changeFrequency:'daily',priority:.65},
  {path:'daily',changeFrequency:'daily',priority:.65}
 ];
 return [
  ...staticRoutes.map(x=>({url:`${base}/${x.path}`,changeFrequency:x.changeFrequency,priority:x.priority})),
  ...posts.map(p=>({url:`${base}/stories/${p.slug}`,lastModified:p.updated_at||p.published_at?new Date(p.updated_at||p.published_at):undefined,changeFrequency:'monthly',priority:.8,images:(p.og_image||p.featured_image)?[absoluteUrl(p.og_image||p.featured_image)]:undefined})),
  ...extras,...emotions,...tags
 ];
}

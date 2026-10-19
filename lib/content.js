import {createClient} from '@supabase/supabase-js';
import {fallbackPosts,fallbackTopics,fallbackHomepage} from '../data/fallback';

function publicClient(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return null;
  return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
function settingValue(value){return typeof value==='object'&&value?.value!==undefined?value.value:value}

export async function getPublishedPosts({category,limit,emotion,tag}={}){
  const db=publicClient();
  if(!db){
    let rows=[...fallbackPosts].filter(x=>!x.deleted_at);
    if(category)rows=rows.filter(x=>x.category===category);
    if(emotion)rows=rows.filter(x=>(x.emotion_tags||[]).includes(emotion));
    if(tag)rows=rows.filter(x=>(x.tags||[]).includes(tag));
    return limit?rows.slice(0,limit):rows;
  }
  // Anonymous RLS exposes published posts and scheduled posts only after scheduled_at.
  let q=db.from('posts').select('*').in('status',['published','scheduled']).is('deleted_at',null).order('published_at',{ascending:false,nullsFirst:false}).order('scheduled_at',{ascending:false,nullsFirst:false});
  if(category)q=q.eq('category',category);
  if(emotion)q=q.contains('emotion_tags',[emotion]);
  if(tag)q=q.contains('tags',[tag]);
  if(limit)q=q.limit(limit);
  const {data,error}=await q;
  return error?[]:(data||[]);
}

export async function getPost(slug){
  const db=publicClient();
  if(!db)return fallbackPosts.find(x=>x.slug===slug&&!x.deleted_at)||null;
  const {data}=await db.from('posts').select('*').eq('slug',slug).in('status',['published','scheduled']).is('deleted_at',null).maybeSingle();
  return data||null;
}

export async function getRelatedPosts(post,limit=3){
  const all=await getPublishedPosts({limit:16});
  const tags=new Set(post?.emotion_tags||[]);
  return all.filter(x=>x.slug!==post.slug).map(x=>({x,score:(x.category===post.category?3:0)+(x.emotion_tags||[]).filter(t=>tags.has(t)).length})).sort((a,b)=>b.score-a.score).slice(0,limit).map(x=>x.x);
}

export async function searchPosts(term){
  const q=String(term||'').trim();
  if(!q)return [];
  const db=publicClient();
  if(!db){const needle=q.toLowerCase();return fallbackPosts.filter(p=>!p.deleted_at&&[p.title,p.excerpt,p.category,(p.emotion_tags||[]).join(' ')].join(' ').toLowerCase().includes(needle))}
  const safe=q.replace(/[,%().]/g,' ').slice(0,120);
  const {data,error}=await db.from('posts').select('*').in('status',['published','scheduled']).is('deleted_at',null).or(`title.ilike.%${safe}%,excerpt.ilike.%${safe}%,search_text.ilike.%${safe}%`).limit(30);
  return error?[]:(data||[]);
}

export async function getTopic(slug){
  const db=publicClient();
  if(!db)return fallbackTopics[slug]||null;
  const {data}=await db.from('pages').select('*').eq('slug',slug).eq('status','published').is('deleted_at',null).maybeSingle();
  if(!data)return fallbackTopics[slug]||null;
  return {...data,prompts:Array.isArray(data.prompts)?data.prompts:[]};
}

export async function getTaxonomy(type,slug){
  const db=publicClient();if(!db)return null;
  const {data}=await db.from('taxonomies').select('*').eq('taxonomy_type',type).eq('slug',slug).eq('enabled',true).maybeSingle();
  return data||null;
}
export async function getTaxonomies(type){
  const db=publicClient();if(!db)return [];
  let q=db.from('taxonomies').select('*').eq('enabled',true).order('sort_order').order('label');
  if(type)q=q.eq('taxonomy_type',type);
  const {data,error}=await q;return error?[]:(data||[]);
}

export async function getLetters(){
  const db=publicClient();if(!db)return [];
  const {data}=await db.from('letters').select('*').eq('status','published').order('sort_order');return data||[];
}
export async function getApprovedNotes(){
  const db=publicClient();if(!db)return [];
  const {data}=await db.from('community_notes').select('*').eq('status','approved').order('created_at',{ascending:false}).limit(40);return data||[];
}
export async function getHomepage(){
  const db=publicClient();if(!db)return fallbackHomepage;
  const [{data:sections,error:se},{data:items,error:ie}]=await Promise.all([db.from('homepage_sections').select('*').eq('enabled',true).order('sort_order'),db.from('homepage_items').select('*').eq('enabled',true).order('sort_order')]);
  if(se||ie||!sections?.length)return fallbackHomepage;return {sections:sections||[],items:items||[]};
}
export async function getHomeContent(){const db=publicClient();if(!db)return {};const {data}=await db.from('site_content').select('key,value');return Object.fromEntries((data||[]).map(x=>[x.key,x.value]));}

export async function getCustomPage(slug){
  const db=publicClient();if(!db)return null;
  const {data}=await db.from('custom_pages').select('*').eq('slug',slug).eq('status','published').is('deleted_at',null).maybeSingle();return data||null;
}

export async function getSiteChrome(){
  const db=publicClient();
  const fallback={nav:[{label:'Home',url:'/',sort_order:10},{label:'Healing',url:'/healing',sort_order:20},{label:'Relationships',url:'/relationships',sort_order:30},{label:'Self-Worth',url:'/self-worth',sort_order:40},{label:'Midnight Thoughts',url:'/midnight-thoughts',sort_order:50},{label:'Letters',url:'/letters',sort_order:60},{label:'Community',url:'/community',sort_order:70},{label:'Stories',url:'/stories',sort_order:80}],settings:{accent:'#743d45',background:'#f8f4ef',paper:'#fffdf9',tagline:'Words for feelings you could not name.',instagram:'https://www.instagram.com/untenanted_heart/',seo_site_name:'Untenanted Heart',seo_default_description:'Emotional reflections on healing, relationships, self-worth, letting go, overthinking and starting again.'}};
  if(!db)return fallback;
  const [{data:nav},{data:settings}]=await Promise.all([db.from('site_navigation').select('*').eq('enabled',true).order('sort_order'),db.from('site_settings').select('key,value')]);
  return {nav:nav?.length?nav:fallback.nav,settings:{...fallback.settings,...Object.fromEntries((settings||[]).map(x=>[x.key,settingValue(x.value)]))}};
}
export async function getSeoSettings(){return (await getSiteChrome()).settings}

export async function getCollection(slug){
  const db=publicClient();if(!db)return null;
  const {data:collection}=await db.from('collections').select('*').eq('slug',slug).eq('status','published').is('deleted_at',null).maybeSingle();
  if(!collection)return null;
  const {data:links}=await db.from('collection_posts').select('sort_order,posts(*)').eq('collection_id',collection.id).order('sort_order');
  return {...collection,posts:(links||[]).map(x=>x.posts).filter(x=>x&&!x.deleted_at)};
}
export async function getDailyReflection(){const db=publicClient();if(!db)return null;const today=new Date().toISOString().slice(0,10);const {data}=await db.from('daily_reflections').select('*').lte('publish_date',today).eq('status','published').order('publish_date',{ascending:false}).limit(1).maybeSingle();return data||null;}

const DEFAULT_SITE='Untenanted Heart';
const DEFAULT_DESC='Emotional reflections on healing, relationships, self-worth, letting go, overthinking and starting again.';

export function baseUrl(){return (process.env.NEXT_PUBLIC_SITE_URL||'https://example.com').replace(/\/$/,'')}
export function absoluteUrl(value=''){
  if(!value)return '';
  if(/^https?:\/\//i.test(value))return value;
  return `${baseUrl()}${value.startsWith('/')?'':'/'}${value}`;
}
export function cleanText(value=''){return String(value||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()}
export function blockPlainText(blocks=[]){return (Array.isArray(blocks)?blocks:[]).map(b=>[b.eyebrow,b.title,b.text,b.body,b.quote,b.caption,b.alt].filter(Boolean).join(' ')).join(' ').replace(/\s+/g,' ').trim()}
export function wordCount(record={}){const text=[record.title,record.excerpt,record.content,blockPlainText(record.content_blocks||record.blocks||[])].filter(Boolean).join(' ');return cleanText(text).split(/\s+/).filter(Boolean).length}
export function readingMinutes(record={}){return Math.max(1,Math.ceil(wordCount(record)/220))}

export function auditSeoRecord(record={},kind='post'){
  const title=cleanText(record.seo_title||record.title||'');
  const description=cleanText(record.seo_description||record.excerpt||record.description||'');
  const focus=cleanText(record.focus_keyword||'').toLowerCase();
  const body=cleanText([record.title,record.excerpt,record.content,blockPlainText(record.content_blocks||record.blocks||[])].join(' ')).toLowerCase();
  const issues=[];let score=100;
  const deduct=(points,message)=>{score-=points;issues.push(message)};
  if(!title)deduct(25,'Missing SEO title');
  else if(title.length<30||title.length>65)deduct(8,`SEO title is ${title.length} characters; aim for roughly 30–65`);
  if(!description)deduct(20,'Missing meta description');
  else if(description.length<110||description.length>170)deduct(8,`Meta description is ${description.length} characters; aim for roughly 110–170`);
  if(kind==='post'&&!record.featured_image)deduct(8,'Missing featured image');
  if(kind==='post'&&record.featured_image&&!cleanText(record.featured_image_alt))deduct(4,'Featured image is missing descriptive alt text');
  if(!(record.og_image||record.featured_image))deduct(6,'Missing social/OG image');
  if(focus){
    if(!title.toLowerCase().includes(focus))deduct(4,'Focus keyword is not reflected naturally in the SEO title');
    if(description&&!description.toLowerCase().includes(focus))deduct(3,'Focus keyword is not reflected naturally in the meta description');
    if(kind==='post'&&body&&!body.includes(focus))deduct(3,'Focus keyword does not appear in the article copy');
  }
  if(kind==='post'&&wordCount(record)<300)deduct(8,'Article is under 300 words; confirm that the page fully satisfies the reader intent');
  if(record.noindex)issues.push('Page is intentionally set to noindex');
  score=Math.max(0,Math.min(100,score));
  const grade=score>=90?'Excellent':score>=75?'Good':score>=60?'Needs work':'Poor';
  return {score,grade,issues,titleLength:title.length,descriptionLength:description.length,words:wordCount(record)};
}

export function buildMetadata(record={},options={}){
  const settings=options.settings||{};
  const siteName=settings.seo_site_name||settings.site_name||DEFAULT_SITE;
  const fallbackDesc=settings.seo_default_description||DEFAULT_DESC;
  const title=record.seo_title||record.title||settings.seo_default_title||siteName;
  const description=record.seo_description||record.excerpt||record.description||fallbackDesc;
  const canonical=absoluteUrl(record.canonical_url||options.path||'/');
  const ogImage=record.og_image||record.featured_image||settings.seo_default_og_image||'';
  const ogTitle=record.og_title||title;
  const ogDescription=record.og_description||description;
  const twitterImage=record.twitter_image||ogImage;
  return {
    title:title.toLowerCase().includes(String(siteName).toLowerCase())?{absolute:title}:title,
    description,
    alternates:{canonical},
    robots:{index:!record.noindex,follow:!record.nofollow},
    openGraph:{
      type:options.openGraphType||'website',
      siteName,
      url:canonical,
      title:ogTitle,
      description:ogDescription,
      images:ogImage?[{url:absoluteUrl(ogImage)}]:undefined
    },
    twitter:{
      card:twitterImage?'summary_large_image':'summary',
      title:record.twitter_title||ogTitle,
      description:record.twitter_description||ogDescription,
      images:twitterImage?[absoluteUrl(twitterImage)]:undefined,
      creator:settings.seo_twitter_handle||undefined
    }
  };
}

export function jsonLdString(data){return JSON.stringify(data).replace(/</g,'\\u003c')}

export function organizationJsonLd(settings={}){
  const name=settings.seo_organization_name||settings.seo_site_name||DEFAULT_SITE;
  const logo=settings.seo_organization_logo||'';
  const sameAs=[settings.instagram,settings.facebook,settings.youtube,settings.linkedin].filter(Boolean);
  return {'@context':'https://schema.org','@type':'Organization','@id':`${baseUrl()}/#organization`,name,url:baseUrl(),logo:logo?absoluteUrl(logo):undefined,sameAs:sameAs.length?sameAs:undefined};
}

export function websiteJsonLd(settings={}){
  const name=settings.seo_site_name||DEFAULT_SITE;
  return {'@context':'https://schema.org','@type':'WebSite','@id':`${baseUrl()}/#website`,url:baseUrl(),name,description:settings.seo_default_description||DEFAULT_DESC,publisher:{'@id':`${baseUrl()}/#organization`},potentialAction:{'@type':'SearchAction',target:{'@type':'EntryPoint',urlTemplate:`${baseUrl()}/search?q={search_term_string}`},'query-input':'required name=search_term_string'}};
}

export function breadcrumbsJsonLd(items=[]){
  return {'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map((x,i)=>({'@type':'ListItem',position:i+1,name:x.name,item:absoluteUrl(x.url)}))};
}

export function articleJsonLd(post={},settings={}){
  const url=absoluteUrl(post.canonical_url||`/stories/${post.slug}`);
  const image=post.og_image||post.featured_image||settings.seo_default_og_image||'';
  const authorName=post.author?.display_name||post.author_name||'';
  const author=authorName?{'@type':'Person',name:authorName}:{'@id':`${baseUrl()}/#organization`};
  const type=['Article','NewsArticle','BlogPosting'].includes(post.schema_type)?post.schema_type:'BlogPosting';
  return {'@context':'https://schema.org','@type':type,'@id':`${url}#article`,headline:post.title,description:post.seo_description||post.excerpt,url,mainEntityOfPage:url,datePublished:post.published_at||post.created_at,dateModified:post.updated_at||post.published_at||post.created_at,image:image?[absoluteUrl(image)]:undefined,author,publisher:{'@id':`${baseUrl()}/#organization`},keywords:[post.focus_keyword,...(post.secondary_keywords||[]),...(post.emotion_tags||[]),...(post.tags||[])].filter(Boolean).join(', ')||undefined,articleSection:post.category,wordCount:wordCount(post)};
}

export function collectionJsonLd(record={},path='/'){
  const url=absoluteUrl(record.canonical_url||path);
  return {'@context':'https://schema.org','@type':record.schema_type||'CollectionPage','@id':`${url}#webpage`,url,name:record.title,description:record.seo_description||record.description||record.excerpt||undefined};
}

export function faqJsonLd(items=[]){
  const valid=(Array.isArray(items)?items:[]).filter(x=>cleanText(x?.question)&&cleanText(x?.answer));
  if(!valid.length)return null;
  return {'@context':'https://schema.org','@type':'FAQPage',mainEntity:valid.map(x=>({'@type':'Question',name:cleanText(x.question),acceptedAnswer:{'@type':'Answer',text:cleanText(x.answer)}}))};
}

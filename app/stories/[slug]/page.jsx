import {getPost,getRelatedPosts,getSeoSettings} from '../../../lib/content';
import {notFound} from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import BlockRenderer from '../../../components/BlockRenderer';
import StoryCard from '../../../components/StoryCard';
import SaveButton from '../../../components/SaveButton';
import TrackView from '../../../components/TrackView';
import ReadingTools from '../../../components/ReadingTools';
import ReactionBar from '../../../components/ReactionBar';
import JsonLd from '../../../components/JsonLd';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {buildMetadata,articleJsonLd,breadcrumbsJsonLd,faqJsonLd,readingMinutes} from '../../../lib/seo';
export const dynamic='force-dynamic';

export async function generateMetadata({params}){
 const {slug}=await params,p=await getPost(slug);if(!p)return {};
 const settings=await getSeoSettings();
 return buildMetadata(p,{path:`/stories/${slug}`,settings,openGraphType:'article'});
}

export default async function Page({params}){
 const {slug}=await params,p=await getPost(slug);if(!p)notFound();
 const [related,settings]=await Promise.all([getRelatedPosts(p,3),getSeoSettings()]);
 const blocks=Array.isArray(p.content_blocks)?p.content_blocks:[];
 const faqs=Array.isArray(p.faq_items)?p.faq_items.filter(x=>x?.question&&x?.answer):[];
 const schemas=[articleJsonLd(p,settings),breadcrumbsJsonLd([{name:'Home',url:'/'},{name:'Stories',url:'/stories'},{name:p.breadcrumb_title||p.title,url:`/stories/${p.slug}`}]),faqJsonLd(faqs)];
 return <article className="articlePage"><JsonLd data={schemas}/><Breadcrumbs items={[{name:'Home',url:'/'},{name:'Stories',url:'/stories'},{name:p.breadcrumb_title||p.title,url:`/stories/${p.slug}`} ]}/><TrackView slug={p.slug} category={p.category}/><header className="articleHeader"><div className="articleKicker">{p.category}{p.emotion_tags?.length?` · ${p.emotion_tags.slice(0,2).join(' · ')}`:''} · {readingMinutes(p)} min read</div><h1>{p.title}</h1><p>{p.excerpt}</p>{p.tags?.length>0&&<div className="articleTags">{p.tags.map(tag=><Link key={tag} href={`/tag/${tag}`}>{tag.replaceAll('-',' ')}</Link>)}</div>}<SaveButton story={p}/><ReactionBar targetType="post" targetId={p.id}/><ReadingTools/><div className="articleRule"/></header>{p.featured_image&&<div className="articleHeroImage"><img src={p.featured_image} alt={p.featured_image_alt||p.title}/></div>}<div className="articleBody">{blocks.length?<BlockRenderer blocks={blocks}/>:<div className="markdown"><ReactMarkdown>{p.content||''}</ReactMarkdown></div>}{faqs.length>0&&<section className="articleFaq"><small>Questions readers ask</small><h2>Frequently asked questions</h2>{faqs.map((f,i)=><details key={i}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</section>}<div className="articleEnd"><small>Stay With The Feeling</small><h3>Let this be somewhere your heart can return to.</h3><Link href="/stories">More reflections →</Link></div></div>{related.length>0&&<section className="relatedSection"><div className="heading"><small>You May Also Need This</small><h2>Keep reading gently.</h2></div><div className="storyGrid">{related.map(x=><StoryCard key={x.id} story={x}/>)}</div></section>}</article>
}

import {notFound} from 'next/navigation';
import {getTaxonomy,getPublishedPosts,getSeoSettings} from '../../../lib/content';
import StoryCard from '../../../components/StoryCard';
import JsonLd from '../../../components/JsonLd';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {buildMetadata,collectionJsonLd,breadcrumbsJsonLd} from '../../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params,t=await getTaxonomy('tag',slug);if(!t)return {};const settings=await getSeoSettings();return buildMetadata({...t,title:t.seo_title||t.label,description:t.seo_description||t.description,noindex:!t.indexable},{path:`/tag/${slug}`,settings})}
export default async function Page({params}){const {slug}=await params,t=await getTaxonomy('tag',slug);if(!t)notFound();const posts=await getPublishedPosts({tag:slug});return <><JsonLd data={[collectionJsonLd({title:t.label,description:t.description,schema_type:'CollectionPage'},`/tag/${slug}`),breadcrumbsJsonLd([{name:'Home',url:'/'},{name:'Stories',url:'/stories'},{name:t.label,url:`/tag/${slug}`}])]}/><Breadcrumbs items={[{name:'Home',url:'/'},{name:'Stories',url:'/stories'},{name:t.label,url:`/tag/${slug}`} ]}/><section className="simpleHero"><small>Explore by topic</small><h1>{t.label}</h1><p>{t.description||`Reflections tagged ${t.label}.`}</p></section><section className="section"><div className="wrap"><div className="storyGrid">{posts.length?posts.map(p=><StoryCard key={p.id} story={p}/>):<div className="emptyState">No published reflections use this tag yet.</div>}</div></div></section></>}

import {getTaxonomy,getPublishedPosts,getSeoSettings} from '../../../lib/content';
import {notFound} from 'next/navigation';
import StoryCard from '../../../components/StoryCard';
import JsonLd from '../../../components/JsonLd';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {buildMetadata,collectionJsonLd,breadcrumbsJsonLd} from '../../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params,t=await getTaxonomy('emotion',slug);if(!t)return {};const settings=await getSeoSettings();return buildMetadata({...t,title:t.seo_title||t.label,description:t.seo_description||t.description,noindex:!t.indexable},{path:`/emotion/${slug}`,settings})}
export default async function Page({params}){const {slug}=await params,t=await getTaxonomy('emotion',slug);if(!t)notFound();const posts=await getPublishedPosts({emotion:slug});return <><JsonLd data={[collectionJsonLd({title:t.label,description:t.description,seo_description:t.seo_description,schema_type:'CollectionPage'},`/emotion/${slug}`),breadcrumbsJsonLd([{name:'Home',url:'/'},{name:t.label,url:`/emotion/${slug}`}])]}/><Breadcrumbs items={[{name:'Home',url:'/'},{name:t.label,url:`/emotion/${slug}`} ]}/><section className="simpleHero"><small>Explore by feeling</small><h1>{t.label}</h1><p>{t.description||`Reflections connected to ${t.label.toLowerCase()}.`}</p></section><section className="section"><div className="wrap"><div className="storyGrid">{posts.length?posts.map(p=><StoryCard key={p.id} story={p}/>):<div className="emptyState">More reflections are being written for this feeling.</div>}</div></div></section></>}

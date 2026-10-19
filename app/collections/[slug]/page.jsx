import {getCollection,getSeoSettings} from '../../../lib/content';
import {notFound} from 'next/navigation';
import StoryCard from '../../../components/StoryCard';
import JsonLd from '../../../components/JsonLd';
import Breadcrumbs from '../../../components/Breadcrumbs';
import {buildMetadata,collectionJsonLd,breadcrumbsJsonLd} from '../../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params,c=await getCollection(slug);if(!c)return {};const settings=await getSeoSettings();return buildMetadata(c,{path:`/collections/${slug}`,settings})}
export default async function Page({params}){const {slug}=await params,c=await getCollection(slug);if(!c)notFound();return <><JsonLd data={[collectionJsonLd(c,`/collections/${slug}`),breadcrumbsJsonLd([{name:'Home',url:'/'},{name:'Stories',url:'/stories'},{name:c.breadcrumb_title||c.title,url:`/collections/${slug}`}])]}/><Breadcrumbs items={[{name:'Home',url:'/'},{name:'Stories',url:'/stories'},{name:c.breadcrumb_title||c.title,url:`/collections/${slug}`} ]}/><section className="simpleHero"><small>Collection</small><h1>{c.title}</h1><p>{c.description}</p></section><section className="section"><div className="wrap"><div className="storyGrid">{c.posts.map(p=><StoryCard key={p.id} story={p}/>)}</div></div></section></>}

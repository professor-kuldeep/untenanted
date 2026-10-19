import {getCustomPage,getSeoSettings} from '../../lib/content';
import {notFound} from 'next/navigation';
import PageBlocks from '../../components/PageBlocks';
import JsonLd from '../../components/JsonLd';
import Breadcrumbs from '../../components/Breadcrumbs';
import {buildMetadata,collectionJsonLd,breadcrumbsJsonLd,faqJsonLd} from '../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata({params}){const {slug}=await params,p=await getCustomPage(slug);if(!p)return {};const settings=await getSeoSettings();return buildMetadata(p,{path:`/${slug}`,settings})}
export default async function Page({params}){const {slug}=await params,p=await getCustomPage(slug);if(!p)notFound();const faqs=Array.isArray(p.faq_items)?p.faq_items.filter(x=>x?.question&&x?.answer):[];return <><JsonLd data={[collectionJsonLd(p,`/${slug}`),breadcrumbsJsonLd([{name:'Home',url:'/'},{name:p.breadcrumb_title||p.title,url:`/${slug}`}]),faqJsonLd(faqs)]}/><Breadcrumbs items={[{name:'Home',url:'/'},{name:p.breadcrumb_title||p.title,url:`/${slug}`} ]}/><PageBlocks blocks={p.blocks||[]}/>{faqs.length>0&&<section className="section"><div className="wrap topicFaq"><div className="heading"><small>Frequently Asked</small><h2>Questions about {p.title}</h2></div>{faqs.map((f,i)=><details key={i}><summary>{f.question}</summary><p>{f.answer}</p></details>)}</div></section>}</>}

import {getSeoSettings} from '../lib/content';
export const dynamic='force-dynamic';
export default async function robots(){
 const base=(process.env.NEXT_PUBLIC_SITE_URL||'https://example.com').replace(/\/$/,'');
 const settings=await getSeoSettings();
 const disallow=['/admin/','/account/','/saved','/for-you','/report','/api/','/preview/'];
 if(!settings.seo_index_search)disallow.push('/search');
 return {rules:[{userAgent:'*',allow:'/',disallow}],sitemap:`${base}/sitemap.xml`,host:base};
}

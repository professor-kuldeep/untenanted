import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import JsonLd from '../components/JsonLd';
import VisitTracker from '../components/VisitTracker';
import ConsentBanner from '../components/ConsentBanner';
import AnalyticsIntegrations from '../components/AnalyticsIntegrations';
import {getSiteChrome} from '../lib/content';
import {organizationJsonLd,websiteJsonLd} from '../lib/seo';

export async function generateMetadata(){
  const {settings}=await getSiteChrome();
  const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||'https://example.com';
  const title=settings.seo_default_title||'Untenanted Heart | Words for feelings you could not name';
  const description=settings.seo_default_description||'Emotional reflections on healing, relationships, self-worth, letting go, overthinking and starting again.';
  const og=settings.seo_default_og_image||undefined;
  return {
    metadataBase:new URL(siteUrl),
    title:{default:title,template:'%s | Untenanted Heart'},
    description,
    applicationName:settings.seo_site_name||'Untenanted Heart',
    icons:{icon:'/favicon.png'},
    manifest:'/manifest.webmanifest',
    alternates:{types:{'application/rss+xml':'/feed.xml'}},
    openGraph:{type:'website',siteName:settings.seo_site_name||'Untenanted Heart',title,description,images:og?[og]:undefined},
    twitter:{card:og?'summary_large_image':'summary',title,description,images:og?[og]:undefined,creator:settings.seo_twitter_handle||undefined},
    verification:{google:settings.seo_google_verification||undefined,other:settings.seo_bing_verification?{'msvalidate.01':settings.seo_bing_verification}:undefined}
  };
}

export default async function RootLayout({children}){
  const {nav,settings}=await getSiteChrome();
  const style={'--accent':settings.accent||'#743d45','--bg':settings.background||'#f8f4ef','--paper':settings.paper||'#fffdf9'};
  const consentRequired=settings.analytics_consent_required!==false&&settings.analytics_consent_required!=='false';
  return <html lang="en"><body style={style}><JsonLd data={[organizationJsonLd(settings),websiteJsonLd(settings)]}/><AnalyticsIntegrations ga4Id={settings.analytics_ga4_measurement_id||''} consentRequired={consentRequired}/><VisitTracker consentRequired={consentRequired}/><Header navItems={nav} tagline={settings.tagline}/><main>{children}</main><Footer navItems={nav} tagline={settings.tagline} instagram={settings.instagram}/><ServiceWorkerRegister/><ConsentBanner required={consentRequired}/></body></html>;
}

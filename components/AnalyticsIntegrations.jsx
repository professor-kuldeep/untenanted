'use client';
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {getAnalyticsConsent} from '../lib/analytics';
export default function AnalyticsIntegrations({ga4Id='',consentRequired=true}){
 const loaded=useRef(false),pathname=usePathname();
 useEffect(()=>{
  const load=()=>{
   if(loaded.current||!ga4Id||pathname?.startsWith('/admin')||pathname?.startsWith('/account'))return;const consent=getAnalyticsConsent();if(consent==='denied'||(consentRequired&&consent!=='granted'))return;
   loaded.current=true;const s=document.createElement('script');s.async=true;s.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;document.head.appendChild(s);
   window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',ga4Id,{anonymize_ip:true,send_page_view:false});
  };
  load();window.addEventListener('uh-consent-change',load);return()=>window.removeEventListener('uh-consent-change',load);
 },[ga4Id,consentRequired,pathname]);return null;
}

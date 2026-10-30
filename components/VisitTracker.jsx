'use client';
import {useEffect,useRef} from 'react';
import {usePathname} from 'next/navigation';
import {getAnalyticsConsent,getAttribution,trackEvent} from '../lib/analytics';
function device(){if(typeof window==='undefined')return 'unknown';const w=window.innerWidth;return w<768?'mobile':w<1100?'tablet':'desktop'}
export default function VisitTracker({consentRequired=true}){
 const pathname=usePathname(),last=useRef('');
 useEffect(()=>{
  if(typeof window!=='undefined')window.__UH_ANALYTICS_CONSENT_REQUIRED__=consentRequired;
  if(!pathname||pathname.startsWith('/admin')||pathname.startsWith('/account')||pathname.startsWith('/auth'))return;
  const run=()=>{
   const consent=getAnalyticsConsent();if(consentRequired&&consent!=='granted')return;if(consent==='denied')return;
   const key=pathname+(typeof window!=='undefined'?window.location.search:'');if(last.current===key)return;last.current=key;
   const a=getAttribution();trackEvent('page_view',pathname,{...a,device:device(),title:document.title.slice(0,180)});if(typeof window.gtag==='function')window.gtag('event','page_view',{page_path:key,page_title:document.title});
  };
  run();window.addEventListener('uh-consent-change',run);return()=>window.removeEventListener('uh-consent-change',run);
 },[pathname,consentRequired]);
 return null;
}

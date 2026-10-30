'use client';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {getAnalyticsConsent,setAnalyticsConsent} from '../lib/analytics';
export default function ConsentBanner({required=true}){
 const [state,setState]=useState('loading'),pathname=usePathname();
 useEffect(()=>{setState(getAnalyticsConsent());const reset=()=>setState('unknown');window.addEventListener('uh-consent-reset',reset);return()=>window.removeEventListener('uh-consent-reset',reset)},[]);
 if(!required||state==='loading'||state!=='unknown'||pathname?.startsWith('/admin')||pathname?.startsWith('/account'))return null;
 function choose(v){setAnalyticsConsent(v);setState(v)}
 return <div className="consentBanner" role="dialog" aria-label="Analytics preferences"><div><b>Your privacy matters.</b><span>We use privacy-friendly first-party analytics to understand which reflections help readers. Optional Google Analytics only loads after you accept.</span></div><div className="consentActions"><button onClick={()=>choose('denied')}>Essential only</button><button className="primary" onClick={()=>choose('granted')}>Allow analytics</button></div></div>;
}

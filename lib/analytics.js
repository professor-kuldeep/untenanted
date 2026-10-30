export function getAnonymousId(){
  if(typeof window==='undefined')return '';
  const key='uh_anonymous_id';
  let id=localStorage.getItem(key);
  if(!id){id=(globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+Date.now().toString(36);localStorage.setItem(key,id)}
  return id;
}
export function getAnalyticsConsent(){
  if(typeof window==='undefined')return 'unknown';
  return localStorage.getItem('uh_analytics_consent')||'unknown';
}
export function setAnalyticsConsent(value){
  if(typeof window==='undefined')return;
  localStorage.setItem('uh_analytics_consent',value==='granted'?'granted':'denied');
  window.dispatchEvent(new CustomEvent('uh-consent-change',{detail:{value:getAnalyticsConsent()}}));
}
export function getAttribution(){
  if(typeof window==='undefined')return {};
  const key='uh_attribution';
  const q=new URLSearchParams(window.location.search);
  const hasCampaign=['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].some(k=>q.has(k));
  try{
    const saved=JSON.parse(sessionStorage.getItem(key)||'null');
    if(saved&&!hasCampaign)return saved;
  }catch{}
  let source=q.get('utm_source')||'';
  const medium=q.get('utm_medium')||'';
  const campaign=q.get('utm_campaign')||'';
  const term=q.get('utm_term')||'';
  const content=q.get('utm_content')||'';
  const referrer=document.referrer||'';
  if(!source&&referrer){try{const host=new URL(referrer).hostname.replace(/^www\./,'');if(host&&host!==window.location.hostname.replace(/^www\./,''))source=host}catch{}}
  if(!source)source='direct';
  const value={source,medium,campaign,term,content,referrer:referrer.slice(0,500),landing_page:(window.location.pathname+window.location.search).slice(0,500)};
  try{sessionStorage.setItem(key,JSON.stringify(value))}catch{}
  return value;
}
export async function trackEvent(event_type,event_value='',metadata={}){
  try{
    const consent=getAnalyticsConsent();const required=window.__UH_ANALYTICS_CONSENT_REQUIRED__!==false;if(consent==='denied'||(required&&consent!=='granted'))return;
    await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_type,event_value,metadata,anonymous_id:getAnonymousId()}),keepalive:true});
  }catch{}
}

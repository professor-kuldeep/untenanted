export function getAnonymousId(){
  if(typeof window==='undefined')return '';
  const key='uh_anonymous_id';
  let id=localStorage.getItem(key);
  if(!id){id=(globalThis.crypto?.randomUUID?.()||Math.random().toString(36).slice(2))+Date.now().toString(36);localStorage.setItem(key,id)}
  return id;
}
export async function trackEvent(event_type,event_value='',metadata={}){
  try{
    await fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event_type,event_value,metadata,anonymous_id:getAnonymousId()}),keepalive:true});
  }catch{}
}

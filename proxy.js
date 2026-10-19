import {createServerClient} from '@supabase/ssr';
import {NextResponse} from 'next/server';

async function findRedirect(request){
  if(!['GET','HEAD'].includes(request.method)) return null;
  const path=request.nextUrl.pathname;
  if(path.startsWith('/admin')||path.startsWith('/account')||path.startsWith('/api')||path.startsWith('/_next')) return null;
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) return null;
  try{
    const endpoint=`${url}/rest/v1/redirects?source_path=eq.${encodeURIComponent(path)}&enabled=eq.true&select=target_url,status_code&limit=1`;
    const r=await fetch(endpoint,{headers:{apikey:key,Authorization:`Bearer ${key}`},cache:'no-store'});
    if(!r.ok) return null;
    const rows=await r.json();
    return rows?.[0]||null;
  }catch{return null}
}

export async function proxy(request,event){
  const redirectRule=await findRedirect(request);
  if(redirectRule?.target_url){
    const rawTarget=String(redirectRule.target_url||'').trim();
    const isLocal=rawTarget.startsWith('/')&&!rawTarget.startsWith('//');
    const isHttp=/^https?:\/\//i.test(rawTarget);
    if(!isLocal&&!isHttp)return NextResponse.next({request});
    const target=new URL(rawTarget,request.url);
    if(target.origin===request.nextUrl.origin&&target.pathname===request.nextUrl.pathname&&target.search===request.nextUrl.search)return NextResponse.next({request});
    const status=[301,302,307,308].includes(Number(redirectRule.status_code))?Number(redirectRule.status_code):301;
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(url&&key&&event?.waitUntil){
      event.waitUntil(fetch(`${url}/rest/v1/rpc/record_redirect_hit`,{
        method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},
        body:JSON.stringify({p_source:request.nextUrl.pathname})
      }).catch(()=>null));
    }
    return NextResponse.redirect(target,status);
  }

  let response=NextResponse.next({request});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key)return response;
  const supabase=createServerClient(url,key,{cookies:{
    getAll(){return request.cookies.getAll()},
    setAll(items){
      items.forEach(({name,value})=>request.cookies.set(name,value));
      response=NextResponse.next({request});
      items.forEach(({name,value,options})=>response.cookies.set(name,value,options));
    }
  }});
  const {data:{user}}=await supabase.auth.getUser();
  if(request.nextUrl.pathname.startsWith('/admin')&&!request.nextUrl.pathname.startsWith('/admin/login')&&!user){
    const target=request.nextUrl.clone();target.pathname='/admin/login';return NextResponse.redirect(target);
  }
  return response;
}

export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)']};

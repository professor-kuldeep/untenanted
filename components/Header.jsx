'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {getBrowserSupabase} from '../lib/supabase/browser';

export default function Header({navItems=[],tagline='Words for feelings you could not name.'}){
 const path=usePathname(),[open,setOpen]=useState(false),[signed,setSigned]=useState(false);
 useEffect(()=>{const db=getBrowserSupabase();if(!db)return;db.auth.getUser().then(({data})=>setSigned(!!data.user));const {data:s}=db.auth.onAuthStateChange((_e,session)=>setSigned(!!session?.user));return()=>s.subscription.unsubscribe()},[]);
 if(path?.startsWith('/admin'))return null;
 const links=navItems.length?navItems:[{label:'Read',url:'/stories'},{label:'Healing',url:'/healing'},{label:'Relationships',url:'/relationships'},{label:'Letters',url:'/letters'},{label:'Community',url:'/community'}];
 return <>
  <div className="siteNotice"><div className="siteNoticeInner"><span>A quiet corner of the internet for things that are hard to say.</span><div><Link href="/daily">Today’s Reflection</Link><Link href="/search">Search</Link></div></div></div>
  <header className="siteHeader"><div className="headerInner">
    <Link className="brand" href="/"><span className="brandName">UNTENANTED HEART</span><small>{tagline}</small></Link>
    <button className="menuBtn" onClick={()=>setOpen(!open)} aria-label="Menu"><span/><span/></button>
    <nav className={open?'nav open':'nav'}>{links.slice(0,6).map((x,i)=><Link href={x.url} key={x.id||i} onClick={()=>setOpen(false)}>{x.label}</Link>)}<Link href="/for-you" onClick={()=>setOpen(false)}>For You</Link><Link className="navCta" href={signed?'/account':'/account/login'} onClick={()=>setOpen(false)}>{signed?'My Heart':'Sign In'}</Link></nav>
  </div></header>
 </>
}

'use client';
import {useState} from 'react';
import Link from 'next/link';
import {trackEvent} from '../lib/analytics';
import {getBrowserSupabase} from '../lib/supabase/browser';

const fallback=[
 {label:'Healing',title:'You do not have to heal all at once.',body:'Some healing happens quietly — in the boundaries you finally keep, the messages you no longer send, and the peace you begin choosing.',link_label:'Read what your heart needs →',link_url:'/healing',accent:'#f1dfe0'},
 {label:'Missing Someone',title:'Missing them does not mean you should return.',body:'You can remember what was beautiful without forgetting what made you leave.',link_label:'Read about letting go →',link_url:'/letting-go',accent:'#eadde8'},
 {label:'Overthinking',title:'Not every thought needs an answer tonight.',body:'Some questions become clearer after rest, not after another hour of thinking.',link_label:'Read midnight thoughts →',link_url:'/midnight-thoughts',accent:'#dde5eb'},
 {label:'Lonely',title:'Being alone does not mean you are unwanted.',body:'Loneliness is a feeling, not a measurement of your worth.',link_label:'Read for your self-worth →',link_url:'/self-worth',accent:'#e8dfd6'},
 {label:'Starting Again',title:'Starting over is not starting from nothing.',body:'You are entering the next chapter with lessons, boundaries and clearer instincts.',link_label:'Read about starting again →',link_url:'/starting-again',accent:'#dfe8dc'}
];
export default function HomeInteractive({section={},items=[]}){
 const moods=items.filter(x=>x.item_type==='mood'),ticker=items.filter(x=>x.item_type==='ticker');
 const list=moods.length?moods:fallback,[index,setIndex]=useState(0),m=list[index]||list[0];
 const tickerText=(ticker.length?ticker.map(x=>x.body):['Healing takes its own time','You are allowed to choose yourself','Some endings are beginnings in disguise','Your feelings deserve space']);
 const doubled=[...tickerText,...tickerText];
 const titleParts=String(m.title||'').split(/(?<=[.!?])\s+/),first=titleParts.shift()||m.title,rest=titleParts.join(' ');
 async function pick(i){setIndex(i);const label=list[i].label||'';trackEvent('mood_select',label,{link:list[i].link_url});const db=getBrowserSupabase();if(db){const {data:{user}}=await db.auth.getUser();if(user){const mood=label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');await db.from('member_preferences').upsert({user_id:user.id,preferred_mood:mood,updated_at:new Date().toISOString()},{onConflict:'user_id'})}}}
 return <>
  <section className="hero siteHero" style={{'--mood':m.accent||'#f1dfe0'}}><div className="siteHeroGrid">
    <div className="heroPrimary">
      <div className="mini">{section.eyebrow||'Start with how you feel'}</div>
      <h1>{first} {rest&&<em>{rest}</em>}</h1>
      <p className="heroCopy">{m.body}</p>
      <div className="actions"><Link className="btn primary" href={m.link_url||'/stories'} onClick={()=>trackEvent('cta_click','hero',{mood:m.label})}>{m.link_label||'Read what your heart needs →'}</Link><Link className="btn" href="/stories">Browse all reflections</Link></div>
      <div className="heroMoodLabel">How does your heart feel today?</div>
      <div className="moods">{list.map((x,i)=><button key={x.id||x.label} className={i===index?'mood active':'mood'} onClick={()=>pick(i)}>{x.label}</button>)}</div>
    </div>
    <aside className="heroPortal">
      <span className="portalEyebrow">BEGIN WHERE YOU ARE</span>
      <h2>A place to read, feel, save and return.</h2>
      <p>You do not need the perfect words before you enter. Choose whatever feels closest to what you are carrying.</p>
      <div className="portalLinks">
        <Link href="/daily"><b>01</b><span><strong>Today’s Reflection</strong><small>One thought for this day.</small></span><i>→</i></Link>
        <Link href="/for-you"><b>02</b><span><strong>For You</strong><small>Reading shaped around your heart.</small></span><i>→</i></Link>
        <Link href="/letters"><b>03</b><span><strong>Letters Never Sent</strong><small>Things that were easier to write.</small></span><i>→</i></Link>
        <Link href="/search"><b>04</b><span><strong>Find the Words</strong><small>Search by what you are feeling.</small></span><i>→</i></Link>
      </div>
    </aside>
  </div></section>
  <div className="ticker"><div className="tickerTrack">{doubled.map((x,i)=><div className="tickerItem" key={i}>{x}<b>✦</b></div>)}</div></div>
 </>
}

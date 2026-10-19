'use client';
import {useState} from 'react';
export default function GiveWords({section={},items=[]}){
 const words=items.map(x=>x.body).filter(Boolean),[i,setI]=useState(0);
 if(!words.length)return null;
 return <section className="section soft words"><div className="wrap"><div className="heading"><small>{section.eyebrow||'Need Something To Hold Onto?'}</small><h2>{section.settings?.heading||section.title||'Give me words.'}</h2>{section.intro&&<p>{section.intro}</p>}</div><div className="wordOutput">{words[i]}</div><button className="wordBtn" onClick={()=>setI((i+1)%words.length)}>Give Me Different Words ↻</button></div></section>
}

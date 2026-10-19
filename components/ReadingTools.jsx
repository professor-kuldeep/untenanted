'use client';
import {useEffect,useState} from 'react';
export default function ReadingTools(){
 const [night,setNight]=useState(false),[large,setLarge]=useState(false),[narrow,setNarrow]=useState(false);
 useEffect(()=>{try{const s=JSON.parse(localStorage.getItem('uh_reading_prefs')||'{}');setNight(!!s.night);setLarge(!!s.large);setNarrow(!!s.narrow)}catch{}},[]);
 useEffect(()=>{const el=document.querySelector('.articlePage');if(!el)return;el.classList.toggle('nightReading',night);el.classList.toggle('largeReading',large);el.classList.toggle('narrowReading',narrow);try{localStorage.setItem('uh_reading_prefs',JSON.stringify({night,large,narrow}))}catch{}},[night,large,narrow]);
 return <div className="readingTools" aria-label="Reading preferences"><span>Reading</span><button className={night?'active':''} onClick={()=>setNight(!night)}>☾ Night</button><button className={large?'active':''} onClick={()=>setLarge(!large)}>A+ Text</button><button className={narrow?'active':''} onClick={()=>setNarrow(!narrow)}>↔ Focus</button></div>
}

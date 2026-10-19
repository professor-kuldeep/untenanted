'use client';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {trackEvent} from '../lib/analytics';
export default function SearchForm({initial=''}){
 const [q,setQ]=useState(initial),router=useRouter();
 function submit(e){e.preventDefault();const term=q.trim();if(!term)return;trackEvent('search',term);router.push('/search?q='+encodeURIComponent(term))}
 return <form className="siteSearch" onSubmit={submit}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search what you are feeling…" aria-label="Search stories"/><button>Search</button></form>
}

'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';import {getBrowserSupabase} from '../../lib/supabase/browser';
const allowed=new Set(['posts','pages','letters','homepage_sections','homepage_items']);
export default function RevisionsManager({initial=[]}){
 const db=getBrowserSupabase(),router=useRouter(),[rows]=useState(initial),[msg,setMsg]=useState('');
 async function restore(r){if(!allowed.has(r.entity_type)||!confirm(`Restore this ${r.entity_type} revision?`))return;const snap={...r.snapshot};['id','created_at','author_id'].forEach(k=>delete snap[k]);snap.updated_at=new Date().toISOString();const {error}=await db.from(r.entity_type).update(snap).eq('id',r.entity_id);setMsg(error?error.message:'Revision restored.');if(!error)router.refresh()}
 return <>{msg&&<div className="adminMessage">{msg}</div>}<div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Date</th><th>Type</th><th>Previous Title</th><th>Changed By</th><th></th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{new Date(r.created_at).toLocaleString()}</td><td>{r.entity_type}</td><td>{r.snapshot?.title||r.snapshot?.headline||r.snapshot?.recipient||r.entity_id}</td><td>{r.profiles?.display_name||r.profiles?.email||'Unknown'}</td><td><button onClick={()=>restore(r)}>Restore</button></td></tr>)}</tbody></table></div></>
}

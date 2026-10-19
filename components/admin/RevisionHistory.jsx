'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';import {getBrowserSupabase} from '../../lib/supabase/browser';
export default function RevisionHistory({entityType='posts',entityId,revisions=[]}){
 const db=getBrowserSupabase(),router=useRouter(),[msg,setMsg]=useState('');
 async function restore(r){if(!confirm('Restore this revision? The current version will be saved as another revision first.'))return;const snap={...r.snapshot};['id','created_at','author_id'].forEach(k=>delete snap[k]);snap.updated_at=new Date().toISOString();const {error}=await db.from(entityType).update(snap).eq('id',entityId);setMsg(error?error.message:'Revision restored.');if(!error)router.refresh()}
 return <details className="adminDetails"><summary>Revision History ({revisions.length})</summary><div className="detailsBody revisionList">{revisions.length===0?<p>No previous revisions yet.</p>:revisions.map(r=><div className="revisionItem" key={r.id}><div><b>{new Date(r.created_at).toLocaleString()}</b><span>{r.snapshot?.title||r.snapshot?.headline||r.snapshot?.recipient||'Previous version'}</span></div><button type="button" onClick={()=>restore(r)}>Restore</button></div>)}{msg&&<div className="adminMessage">{msg}</div>}</div></details>
}

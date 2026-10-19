'use client';
import {useState} from 'react';
import {getBrowserSupabase} from '../../lib/supabase/browser';
export default function TrashManager({initial=[]}){
 const db=getBrowserSupabase(),[rows,setRows]=useState(initial),[msg,setMsg]=useState('');
 async function restore(id){const {error}=await db.from('posts').update({deleted_at:null,status:'draft',updated_at:new Date().toISOString()}).eq('id',id);if(error)setMsg(error.message);else{setRows(rows.filter(x=>x.id!==id));setMsg('Post restored as draft.')}}
 async function destroy(id){if(!confirm('Permanently delete this post? This cannot be undone.'))return;const {error}=await db.from('posts').delete().eq('id',id);if(error)setMsg(error.message);else{setRows(rows.filter(x=>x.id!==id));setMsg('Post permanently deleted.')}}
 return <><div className="adminPageHead"><div><h1>Trash</h1><p>Restore accidentally removed posts or permanently delete them.</p></div></div>{msg&&<div className="adminMessage">{msg}</div>}<div className="adminTableWrap"><table className="adminTable"><thead><tr><th>Title</th><th>Category</th><th>Deleted</th><th></th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td><b>{r.title}</b></td><td>{r.category}</td><td>{r.deleted_at?new Date(r.deleted_at).toLocaleString():'—'}</td><td><button onClick={()=>restore(r.id)}>Restore</button><button className="danger" onClick={()=>destroy(r.id)}>Delete Forever</button></td></tr>)}{!rows.length&&<tr><td colSpan="4">Trash is empty.</td></tr>}</tbody></table></div></>
}

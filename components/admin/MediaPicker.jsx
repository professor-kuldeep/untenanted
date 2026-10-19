'use client';
import {useEffect,useState} from 'react';
import {getBrowserSupabase} from '../../lib/supabase/browser';
export default function MediaPicker({open,onClose,onSelect}){
 const [rows,setRows]=useState([]),[q,setQ]=useState('');
 useEffect(()=>{if(!open)return;const db=getBrowserSupabase();if(!db)return;db.from('media').select('*').order('created_at',{ascending:false}).limit(100).then(({data})=>setRows(data||[]))},[open]);
 if(!open)return null;const filtered=rows.filter(x=>[x.filename,x.alt_text,x.caption].join(' ').toLowerCase().includes(q.toLowerCase()));
 return <div className="adminModalBackdrop" onMouseDown={onClose}><div className="adminModal" onMouseDown={e=>e.stopPropagation()}><div className="adminModalHead"><h2>Media Library</h2><button onClick={onClose}>×</button></div><input className="adminSearch" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search media…"/><div className="mediaPickerGrid">{filtered.map(m=><button type="button" className="mediaPick" key={m.id} onClick={()=>{onSelect(m);onClose()}}><img src={m.public_url} alt={m.alt_text||m.filename}/><span>{m.alt_text||m.filename}</span></button>)}</div></div></div>
}

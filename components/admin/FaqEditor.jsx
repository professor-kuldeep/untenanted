'use client';
export default function FaqEditor({value=[],onChange}){
  const rows=Array.isArray(value)?value:[];
  function add(){onChange([...rows,{question:'',answer:''}])}
  function patch(i,key,val){const next=[...rows];next[i]={...next[i],[key]:val};onChange(next)}
  function remove(i){onChange(rows.filter((_,x)=>x!==i))}
  return <div className="faqEditor"><div className="editorSectionTitle"><div><b>FAQ structured data</b><span>Only add FAQs that are visibly answered on the page.</span></div><button type="button" onClick={add}>Add FAQ</button></div>{rows.map((row,i)=><div className="faqRow" key={i}><input placeholder="Question" value={row.question||''} onChange={e=>patch(i,'question',e.target.value)}/><textarea className="short" placeholder="Answer" value={row.answer||''} onChange={e=>patch(i,'answer',e.target.value)}/><button type="button" className="danger" onClick={()=>remove(i)}>Remove</button></div>)}</div>
}

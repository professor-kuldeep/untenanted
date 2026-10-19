import Link from 'next/link';
export default function ReadThisWhen({section={},items=[]}){
 if(!items.length)return null;
 return <section className="section readWhenSection" id="read-this-when"><div className="wrap"><div className="sectionSplitHead"><div><small>{section.eyebrow||'Find your way in'}</small><h2>{section.settings?.heading||section.title||'Read this when...'}</h2></div><p>{section.intro||'Choose the thought that sounds most like the one following you today.'}</p></div><div className="pathGrid sitePathGrid">{items.map((c,i)=><Link className="pathCard sitePathCard" href={c.link_url||'/stories'} key={c.id||i}><span>{String(i+1).padStart(2,'0')}</span><div><small>{c.label||'A place to begin'}</small><h3>{c.title}</h3><p>{c.body}</p></div><b>{c.link_label||'Open this path'} <i>→</i></b></Link>)}</div></div></section>
}

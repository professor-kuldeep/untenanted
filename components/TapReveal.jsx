export default function TapReveal({section={},items=[]}){
 if(!items.length)return null;
 return <section className="section"><div className="wrap"><div className="heading"><small>{section.eyebrow||'Pause Here'}</small><h2>{section.settings?.heading||section.title||'Which thought has been following you lately?'}</h2><p>{section.intro||'Tap a card to reveal the words waiting underneath.'}</p></div><div className="revealGrid">{items.map((d,i)=><details className="revealCard" key={d.id||i}><summary><span className="revealNum">{d.label||String(i+1).padStart(2,'0')}</span><h3>{d.title}</h3><span className="revealTap">Tap to reveal →</span></summary><div className="revealAnswer">{d.body}</div></details>)}</div></div></section>
}

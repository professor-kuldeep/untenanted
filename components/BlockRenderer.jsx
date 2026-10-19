import Link from 'next/link';

function renderText(text=''){
  const parts=String(text).split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\)]+\))/g).filter(Boolean);
  return parts.map((part,i)=>{
    const bold=part.match(/^\*\*(.+)\*\*$/s);if(bold)return <strong key={i}>{bold[1]}</strong>;
    const italic=part.match(/^\*(.+)\*$/s);if(italic)return <em key={i}>{italic[1]}</em>;
    const link=part.match(/^\[([^\]]+)\]\(([^\)]+)\)$/s);if(link){const href=link[2].trim();if(href.startsWith('/'))return <Link key={i} href={href}>{link[1]}</Link>;if(/^https?:\/\//.test(href))return <a key={i} href={href} target="_blank" rel="noopener noreferrer">{link[1]}</a>;if(/^mailto:/.test(href))return <a key={i} href={href}>{link[1]}</a>;return link[1]}
    return part;
  });
}

export default function BlockRenderer({blocks=[]}){
  return <>{blocks.map((b,i)=>{
    const key=b.id||i;
    if(b.type==='h2')return <h2 key={key}>{renderText(b.text)}</h2>;
    if(b.type==='h3')return <h3 key={key}>{renderText(b.text)}</h3>;
    if(b.type==='quote')return <blockquote key={key}>{renderText(b.text)}</blockquote>;
    if(b.type==='callout')return <div className="carry" key={key}>{b.title&&<h2>{renderText(b.title)}</h2>}<p>{renderText(b.text)}</p></div>;
    if(b.type==='image')return <figure className="articleFigure" key={key}><img src={b.url} alt={b.alt||''}/>{b.caption&&<figcaption>{b.caption}</figcaption>}</figure>;
    if(b.type==='divider')return <hr className="articleDivider" key={key}/>;
    return <p key={key}>{renderText(b.text)}</p>;
  })}</>;
}

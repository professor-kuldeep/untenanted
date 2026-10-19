import Link from 'next/link';
export default function Breadcrumbs({items=[]}){
 const clean=(Array.isArray(items)?items:[]).filter(x=>x?.name&&x?.url);
 if(clean.length<2)return null;
 return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{clean.map((item,i)=><li key={`${item.url}-${i}`}>{i<clean.length-1?<Link href={item.url}>{item.name}</Link>:<span aria-current="page">{item.name}</span>}</li>)}</ol></nav>;
}

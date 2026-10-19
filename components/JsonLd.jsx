import {jsonLdString} from '../lib/seo';
export default function JsonLd({data}){
  if(!data)return null;
  const list=Array.isArray(data)?data.filter(Boolean):[data];
  if(!list.length)return null;
  return <>{list.map((item,i)=><script key={i} type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdString(item)}}/>)}</>;
}

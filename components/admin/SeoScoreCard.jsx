'use client';
import {auditSeoRecord} from '../../lib/seo';
export default function SeoScoreCard({record={},kind='post'}){
  const a=auditSeoRecord(record,kind);
  return <div className={'seoScoreCard score'+(a.score>=90?'Excellent':a.score>=75?'Good':a.score>=60?'Warn':'Poor')}>
    <div className="seoScoreNumber"><b>{a.score}</b><span>/100</span></div>
    <div><strong>{a.grade}</strong><p>{a.words} words · title {a.titleLength} chars · description {a.descriptionLength} chars</p>{a.issues.length>0?<ul>{a.issues.slice(0,6).map((x,i)=><li key={i}>{x}</li>)}</ul>:<p>No major on-page SEO issues detected.</p>}</div>
  </div>;
}

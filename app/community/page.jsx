import Link from 'next/link';
import {getApprovedNotes,getSeoSettings} from '../../lib/content';
import ReactionBar from '../../components/ReactionBar';
import {buildMetadata} from '../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata(){const settings=await getSeoSettings();return buildMetadata({title:'Community',seo_description:'Anonymous community notes, shared truths and gentle reminders from one heart to another.'},{path:'/community',settings})}
export default async function Page(){let notes=await getApprovedNotes();if(!notes.length)notes=[{id:null,pen_name:'Anonymous',note:'I hope you stop apologising for needing the kind of love you would have given without being asked.'}];return <><section className="simpleHero"><small>Community</small><h1>You are not the only one carrying something quietly.</h1><p>A space for short notes, shared truths and gentle reminders from one heart to another.</p></section><section className="section"><div className="wrap communityNotes">{notes.map((n,i)=><article className="communityNote" key={n.id||i}><p>{n.note}</p><span>— {n.pen_name||'Anonymous'}</span>{n.id&&<ReactionBar targetType="community_note" targetId={n.id}/>}</article>)}<div className="centerAction"><Link className="btn primary" href="/submit-message">Leave a Message</Link></div></div></section></>}

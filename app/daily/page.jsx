import {getDailyReflection,getSeoSettings} from '../../lib/content';
import {buildMetadata} from '../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata(){const settings=await getSeoSettings();return buildMetadata({title:'Daily Reflection',seo_description:'One gentle reflection for your heart today.'},{path:'/daily',settings})}
export default async function Page(){const d=await getDailyReflection();return <section className="dailyPage"><small>Today, For Your Heart</small><h1>{d?.title||'A gentle reminder for today.'}</h1><p>{d?.body||'You do not need to understand the whole journey to take one kind step toward yourself today.'}</p>{d?.emotion&&<span>{d.emotion}</span>}</section>}

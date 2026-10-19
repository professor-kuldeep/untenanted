import StoryCard from '../../components/StoryCard';
import SearchForm from '../../components/SearchForm';
import Link from 'next/link';
import {getPublishedPosts,getSeoSettings} from '../../lib/content';
import {buildMetadata} from '../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata(){const settings=await getSeoSettings();return buildMetadata({title:'Stories & Reflections',seo_description:'Read emotional reflections on healing, relationships, self-worth, letting go, overthinking and starting again.'},{path:'/stories',settings})}
export default async function Page(){const posts=await getPublishedPosts();return <><section className="simpleHero"><small>Stories & Reflections</small><h1>Words for the feelings that are difficult to explain.</h1><p>Healing, relationships, self-worth, midnight thoughts, letting go and beginning again.</p><SearchForm/><div className="storyUtilities"><Link href="/saved">♡ Saved Reflections</Link></div></section><section className="section"><div className="wrap"><div className="storyGrid">{posts.map(p=><StoryCard key={p.id} story={p}/>)}</div></div></section></>}

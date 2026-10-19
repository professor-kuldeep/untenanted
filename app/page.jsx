import Link from 'next/link';
import HomeInteractive from '../components/HomeInteractive';
import ReadThisWhen from '../components/ReadThisWhen';
import TapReveal from '../components/TapReveal';
import GiveWords from '../components/GiveWords';
import LettersCarousel from '../components/LettersCarousel';
import StoryCard from '../components/StoryCard';
import {getPublishedPosts,getLetters,getHomepage,getSeoSettings} from '../lib/content';
import {buildMetadata} from '../lib/seo';

export const dynamic='force-dynamic';
export async function generateMetadata(){const settings=await getSeoSettings();return buildMetadata({title:settings.seo_default_title||'Untenanted Heart',seo_description:settings.seo_default_description,og_image:settings.seo_default_og_image},{path:'/',settings})}

export default async function Home(){
 const [posts,letters,home]=await Promise.all([getPublishedPosts({limit:7}),getLetters(),getHomepage()]);
 const items=(slug)=>(home.items||[]).filter(x=>x.section_slug===slug && x.enabled!==false).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
 const ordered=(home.sections||[]).filter(x=>x.enabled!==false).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
 const wordItems=items('give_words');
 const sections=new Map(ordered.map(x=>[x.slug,x]));
 const latest=sections.get('latest')||{};
 return <>
   <HomeInteractive section={sections.get('hero')||{}} items={items('hero')}/>

   <section className="siteGateway"><div className="wrap"><div className="gatewayIntro"><small>UNTENANTED HEART</small><h2>Not everything needs advice. Sometimes it just needs somewhere to be understood.</h2><p>Explore reflections, letters and community notes built around the feelings people often carry quietly.</p></div><div className="gatewayGrid"><Link href="/healing"><span>01</span><b>Healing</b><p>For the days progress feels invisible.</p></Link><Link href="/letting-go"><span>02</span><b>Letting Go</b><p>For what still matters, but can no longer stay.</p></Link><Link href="/self-worth"><span>03</span><b>Self-Worth</b><p>For remembering who you are without their answer.</p></Link><Link href="/midnight-thoughts"><span>04</span><b>Midnight Thoughts</b><p>For the mind that becomes louder after dark.</p></Link><Link href="/relationships"><span>05</span><b>Relationships</b><p>For love, distance, boundaries and change.</p></Link><Link href="/starting-again"><span>06</span><b>Starting Again</b><p>For beginning without pretending nothing happened.</p></Link></div></div></section>

   <ReadThisWhen section={sections.get('read_this_when')||{}} items={items('read_this_when')}/>

   <section className="section editorialLatest"><div className="wrap"><div className="sectionSplitHead"><div><small>{latest.eyebrow||'Latest from the heart'}</small><h2>{latest.settings?.heading||latest.title||'Stories & reflections'}</h2></div><p>{latest.intro||'Quiet stories and thoughtful reflections for what is difficult to explain.'}</p></div>{posts.length>0&&<div className="editorialStories"><StoryCard story={posts[0]} featured/><div className="editorialSide">{posts.slice(1,3).map(p=><StoryCard key={p.id} story={p}/>)}</div></div>}<div className="storyStrip">{posts.slice(3,6).map(p=><StoryCard key={p.id} story={p}/>)}</div><div className="centerAction"><Link className="btn" href="/stories">Explore all reflections →</Link></div></div></section>

   <TapReveal section={sections.get('tap_reveal')||{}} items={items('tap_reveal')}/>
   <GiveWords section={sections.get('give_words')||{}} items={wordItems}/>
   <LettersCarousel letters={letters} section={sections.get('letters')||{}}/>

   <section className="communitySiteSection"><div className="wrap communitySiteGrid"><div><small>{sections.get('community')?.eyebrow||'Community notes'}</small><h2>{sections.get('community')?.settings?.heading||sections.get('community')?.title||'Something someone else wrote may be exactly what you needed today.'}</h2><p>{sections.get('community')?.intro||'Small anonymous truths, reminders and words left behind for another heart.'}</p><div className="actions leftActions"><Link className="btn primary" href="/community">Read Community Notes</Link><Link className="btn" href="/submit-message">Leave a Message</Link></div></div><aside className="communityPaper"><span>FROM ONE HEART TO ANOTHER</span><blockquote>“You are allowed to stop explaining why something hurt you to people committed to misunderstanding it.”</blockquote><small>— Anonymous community note</small></aside></div></section>

   <section className="siteTools"><div className="wrap"><div className="sectionSplitHead"><div><small>Make this place yours</small><h2>Come back to what helps.</h2></div><p>Save reflections, follow what you are feeling and build a quieter reading space around yourself.</p></div><div className="toolGrid"><Link href="/for-you"><b>For You</b><p>Personalised reading based on your interests and mood.</p><span>Open your feed →</span></Link><Link href="/saved"><b>Saved</b><p>Keep the reflections you want to return to later.</p><span>View saved stories →</span></Link><Link href="/daily"><b>Daily Reflection</b><p>One carefully chosen thought for today.</p><span>Read today’s reflection →</span></Link><Link href="/search"><b>Find the Words</b><p>Search by the feeling, question or thought you cannot shake.</p><span>Search the site →</span></Link></div></div></section>

   <section className="section submitCta siteSubmitCta"><div className="wrap submitCtaGrid"><div><small>{sections.get('submit_story')?.eyebrow||'Your story belongs somewhere'}</small><h2>{sections.get('submit_story')?.settings?.heading||sections.get('submit_story')?.title||'Some stories become lighter when they are finally spoken.'}</h2></div><div><p>{sections.get('submit_story')?.intro||'If you have lived through something that changed you, your experience may become the words another person has been searching for.'}</p><Link className="btn primary" href="/submit-story">Submit Your Story →</Link></div></div></section>
 </>;
}

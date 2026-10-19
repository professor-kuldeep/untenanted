import Link from 'next/link';
import SaveButton from './SaveButton';
export default function StoryCard({story,featured=false}){
 return <article className={featured?'storyCard editorialStoryCard featuredEditorial':'storyCard editorialStoryCard'}>{story.featured_image&&<Link href={'/stories/'+story.slug} className="storyImage"><img src={story.featured_image} alt={story.title}/></Link>}<div className="storyCardBody"><div className="storyTop"><div className="storyCategory">{story.category}</div><SaveButton story={story} compact/></div><h3><Link href={'/stories/'+story.slug}>{story.title}</Link></h3><p>{story.excerpt}</p>{story.emotion_tags?.length>0&&<div className="emotionTags">{story.emotion_tags.slice(0,3).map(x=><span key={x}>{x.replaceAll('-',' ')}</span>)}</div>}<Link className="readMore" href={'/stories/'+story.slug}>Read Reflection <i>→</i></Link></div></article>
}

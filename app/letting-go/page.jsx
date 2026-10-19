import TopicPage from '../../components/TopicPage';
import {getTopic,getSeoSettings} from '../../lib/content';
import {buildMetadata} from '../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata(){const t=await getTopic('letting-go');if(!t)return {};const settings=await getSeoSettings();return buildMetadata({...t,title:t.seo_title||t.title,description:t.seo_description||t.intro,featured_image:t.hero_image},{path:'/letting-go',settings})}
export default function Page(){return <TopicPage slug="letting-go"/>}

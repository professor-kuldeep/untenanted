import LettersCarousel from '../../components/LettersCarousel';
import {getLetters,getSeoSettings} from '../../lib/content';
import {buildMetadata} from '../../lib/seo';
export const dynamic='force-dynamic';
export async function generateMetadata(){const settings=await getSeoSettings();return buildMetadata({title:'Letters Never Sent',seo_description:'Read intimate letters for the words that were easier to write than to say.'},{path:'/letters',settings})}
export default async function Page(){return <LettersCarousel letters={await getLetters()}/>}

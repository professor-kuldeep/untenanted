import {notFound} from 'next/navigation';
import SeoRecordEditor from '../../../../../../components/admin/SeoRecordEditor';
import {requireAdmin} from '../../../../../../lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page({params}){
  const {id}=await params,{db}=await requireAdmin('seo');
  const {data:post}=await db.from('posts').select('*').eq('id',id).maybeSingle();
  if(!post)notFound();
  return <><div className="adminPageHead"><div><h1>Post SEO</h1><p>{post.title}</p></div></div><SeoRecordEditor record={post} entity="posts"/></>;
}

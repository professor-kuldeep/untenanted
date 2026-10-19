import {notFound} from 'next/navigation';
import SeoRecordEditor from '../../../../../../../components/admin/SeoRecordEditor';
import {requireAdmin} from '../../../../../../../lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page({params}){
  const {type,id}=await params;const allowed=['pages','custom_pages','collections'];if(!allowed.includes(type))notFound();
  const {db}=await requireAdmin('seo');const {data:record}=await db.from(type).select('*').eq('id',id).maybeSingle();if(!record)notFound();
  return <><div className="adminPageHead"><div><h1>Page SEO</h1><p>{record.title}</p></div></div><SeoRecordEditor record={record} entity={type}/></>;
}

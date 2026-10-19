import SeoDashboard from '../../../../components/admin/SeoDashboard';
import {requireAdmin} from '../../../../lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page(){
  const {db}=await requireAdmin('seo');
  const [{data:posts=[]},{data:pages=[]},{data:customPages=[]},{data:collections=[]},{data:taxonomies=[]},{data:settings=[]}]=await Promise.all([
    db.from('posts').select('*').is('deleted_at',null).order('updated_at',{ascending:false}),
    db.from('pages').select('*').is('deleted_at',null).order('title'),
    db.from('custom_pages').select('*').is('deleted_at',null).order('title'),
    db.from('collections').select('*').is('deleted_at',null).order('title'),
    db.from('taxonomies').select('*').eq('enabled',true).order('taxonomy_type').order('label'),
    db.from('site_settings').select('key,value')
  ]);
  const settingsMap=Object.fromEntries(settings.map(x=>[x.key,x.value]));
  return <SeoDashboard posts={posts} pages={pages} customPages={customPages} collections={collections} taxonomies={taxonomies} settings={settingsMap}/>;
}

import RedirectManager from '../../../../components/admin/RedirectManager';
import {requireAdmin} from '../../../../lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page(){const {db,profile}=await requireAdmin('redirects');const {data=[]}=await db.from('redirects').select('*').order('created_at',{ascending:false});return <RedirectManager initial={data} profile={profile}/>}

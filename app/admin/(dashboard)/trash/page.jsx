import TrashManager from '../../../../components/admin/TrashManager';
import {requireAdmin} from '../../../../lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page(){const {db}=await requireAdmin('trash');const {data=[]}=await db.from('posts').select('*').not('deleted_at','is',null).order('deleted_at',{ascending:false});return <TrashManager initial={data}/>}

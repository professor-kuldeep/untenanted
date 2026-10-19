import TaxonomyManager from '../../../../components/admin/TaxonomyManager';
import {requireAdmin} from '../../../../lib/admin-auth';
export const dynamic='force-dynamic';
export default async function Page(){const {db}=await requireAdmin('taxonomies');const {data=[]}=await db.from('taxonomies').select('*').order('taxonomy_type').order('sort_order').order('label');return <TaxonomyManager initial={data}/>}

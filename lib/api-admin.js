import {getServerSupabase} from './supabase/server';
import {can} from './roles';
export async function getApiAdmin(permission='dashboard'){
 const db=await getServerSupabase();
 if(!db)return {response:Response.json({error:'Supabase is not configured.'},{status:500})};
 const {data:{user},error}=await db.auth.getUser();
 if(error||!user)return {response:Response.json({error:'Unauthorized'},{status:401})};
 const {data:profile}=await db.from('profiles').select('*').eq('id',user.id).maybeSingle();
 if(!profile||!profile.active)return {response:Response.json({error:'Unauthorized'},{status:401})};
 if(permission&&!can(profile.role,permission))return {response:Response.json({error:'Forbidden'},{status:403})};
 return {db,user,profile};
}

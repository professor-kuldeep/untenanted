import {getServerSupabase} from './supabase/server';
export async function getMember(){
  const db=await getServerSupabase();
  if(!db)return {db:null,user:null,profile:null,preferences:null};
  const {data:{user}}=await db.auth.getUser();
  if(!user)return {db,user:null,profile:null,preferences:null};
  const [{data:profile},{data:preferences}]=await Promise.all([
    db.from('profiles').select('*').eq('id',user.id).maybeSingle(),
    db.from('member_preferences').select('*').eq('user_id',user.id).maybeSingle()
  ]);
  return {db,user,profile,preferences};
}

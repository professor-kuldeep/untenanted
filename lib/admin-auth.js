import {redirect} from 'next/navigation';
import {getServerSupabase} from './supabase/server';
import {can} from './roles';

export async function requireAdmin(permission='dashboard'){
  const db=await getServerSupabase();
  if(!db)redirect('/admin/login');
  const {data:{user}}=await db.auth.getUser();
  if(!user)redirect('/admin/login');
  const {data:profile}=await db.from('profiles').select('*').eq('id',user.id).maybeSingle();
  if(!profile||!profile.active)redirect('/admin/login');
  if(permission&&!can(profile.role,permission))redirect('/admin');
  return {db,user,profile};
}

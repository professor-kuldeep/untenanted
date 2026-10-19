import {createClient} from '@supabase/supabase-js';
import {getAdminSupabase} from '../../../../lib/supabase/admin';

export async function POST(req){
  try{
    const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const admin=getAdminSupabase();
    if(!token)return Response.json({error:'Unauthorized'},{status:401});
    if(!url||!anon||!admin)return Response.json({error:'Supabase admin environment is not configured.'},{status:500});
    const authClient=createClient(url,anon,{auth:{persistSession:false}});
    const {data:{user},error}=await authClient.auth.getUser(token);
    if(error||!user)return Response.json({error:'Unauthorized'},{status:401});
    const {data:profile}=await admin.from('profiles').select('role').eq('id',user.id).single();
    if(profile?.role!=='super_admin')return Response.json({error:'Super Admin permission required.'},{status:403});
    const {email,role='author'}=await req.json();
    const allowed=['super_admin','admin','editor','seo_manager','moderator','author','member'];
    if(!email||!allowed.includes(role))return Response.json({error:'Invalid email or role.'},{status:400});
    const {data,error:inviteError}=await admin.auth.admin.inviteUserByEmail(email,{data:{display_name:'Untenanted Heart Staff'}});
    if(inviteError)return Response.json({error:inviteError.message},{status:400});
    if(data?.user?.id)await admin.from('profiles').upsert({id:data.user.id,email,role,active:true},{onConflict:'id'});
    return Response.json({message:`Invitation sent to ${email}.`});
  }catch(e){return Response.json({error:'Unable to invite user.'},{status:500})}
}

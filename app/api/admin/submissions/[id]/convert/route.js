import {createClient} from '@supabase/supabase-js';import {getAdminSupabase} from '../../../../../../lib/supabase/admin';
function slugify(v=''){return v.toLowerCase().trim().replace(/['"]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
export async function POST(req,{params}){
 try{
  const {id}=await params,token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,admin=getAdminSupabase();if(!token||!url||!key||!admin)return Response.json({error:'Not configured or unauthorized.'},{status:401});
  const auth=createClient(url,key,{auth:{persistSession:false}});const {data:{user}}=await auth.auth.getUser(token);if(!user)return Response.json({error:'Unauthorized.'},{status:401});
  const {data:profile}=await admin.from('profiles').select('role').eq('id',user.id).single();if(!['super_admin','admin','editor','moderator'].includes(profile?.role))return Response.json({error:'Permission denied.'},{status:403});
  const {data:submission,error:sErr}=await admin.from('story_submissions').select('*').eq('id',id).single();if(sErr||!submission)return Response.json({error:'Submission not found.'},{status:404});if(submission.converted_post_id)return Response.json({post_id:submission.converted_post_id,message:'Already converted.'});
  const base=slugify(submission.title)||'submitted-story';let slug=base,n=1;while(true){const {data:existing}=await admin.from('posts').select('id').eq('slug',slug).maybeSingle();if(!existing)break;slug=`${base}-${++n}`}
  const blocks=String(submission.story||'').split(/\n\n+/).filter(Boolean).map((text,i)=>({id:`import-${i+1}`,type:'paragraph',text}));
  const {data:post,error:pErr}=await admin.from('posts').insert({title:submission.title,slug,excerpt:String(submission.story||'').replace(/\s+/g,' ').slice(0,220),content_blocks:blocks,search_text:[submission.title,submission.category,submission.story].join(' '),category:submission.category,status:'draft',author_id:user.id,updated_by:user.id}).select().single();if(pErr)return Response.json({error:pErr.message},{status:400});
  await admin.from('story_submissions').update({status:'converted',converted_post_id:post.id,updated_at:new Date().toISOString()}).eq('id',id);
  return Response.json({post_id:post.id,can_open:['super_admin','admin','editor'].includes(profile.role)});
 }catch(e){return Response.json({error:'Could not convert submission.'},{status:500})}
}

import Link from 'next/link';
import {requireAdmin} from '../../../lib/admin-auth';
import {can,ROLE_LABELS} from '../../../lib/roles';
export const dynamic='force-dynamic';
export default async function Dashboard(){
 const {db,profile}=await requireAdmin('dashboard');
 const live=(q)=>q.is('deleted_at',null);
 const queries=[
  live(db.from('posts').select('*',{count:'exact',head:true})),
  live(db.from('posts').select('*',{count:'exact',head:true}).eq('status','draft')),
  live(db.from('posts').select('*',{count:'exact',head:true}).eq('status','review')),
  live(db.from('posts').select('*',{count:'exact',head:true}).eq('status','scheduled')),
  can(profile.role,'moderate')?db.from('community_notes').select('*',{count:'exact',head:true}).eq('status','pending'):Promise.resolve({count:null}),
  can(profile.role,'moderate')?db.from('story_submissions').select('*',{count:'exact',head:true}).eq('status','pending'):Promise.resolve({count:null}),
  can(profile.role,'media')?db.from('media').select('*',{count:'exact',head:true}):Promise.resolve({count:null}),
  can(profile.role,'newsletter')?db.from('newsletter_subscribers').select('*',{count:'exact',head:true}).eq('status','active'):Promise.resolve({count:null}),
  profile.role==='super_admin'?db.from('profiles').select('*',{count:'exact',head:true}).eq('role','member'):Promise.resolve({count:null}),
  can(profile.role,'moderate')?db.from('content_reports').select('*',{count:'exact',head:true}).eq('status','open'):Promise.resolve({count:null}),
  can(profile.role,'redirects')?db.from('redirects').select('*',{count:'exact',head:true}).eq('enabled',true):Promise.resolve({count:null}),
  can(profile.role,'taxonomies')?db.from('taxonomies').select('*',{count:'exact',head:true}).eq('indexable',true).eq('enabled',true):Promise.resolve({count:null})
 ];
 const [postsR,draftsR,reviewR,scheduledR,notesR,storiesR,mediaR,newsletterR,membersR,reportsR,redirectsR,taxonomiesR]=await Promise.all(queries);
 let recent=[];if(can(profile.role,'audit')){const r=await db.from('audit_logs').select('*,profiles:actor_id(email,display_name)').order('created_at',{ascending:false}).limit(8);recent=r.data||[]}
 const stats=[['Live CMS Posts',postsR.count],['Drafts',draftsR.count],['In Review',reviewR.count],['Scheduled',scheduledR.count],['Pending Notes',notesR.count],['Story Submissions',storiesR.count],['Open Reports',reportsR.count],['Newsletter Members',newsletterR.count],['Reader Accounts',membersR.count],['Media Items',mediaR.count],['Active Redirects',redirectsR.count],['Indexable Taxonomies',taxonomiesR.count]].filter(x=>x[1]!==null&&x[1]!==undefined);
 return <><div className="adminPageHead"><div><h1>Dashboard</h1><p>{ROLE_LABELS[profile.role]} · editorial, SEO, membership and community overview</p></div>{can(profile.role,'posts')&&<Link className="adminPrimary" href="/admin/posts/new">New Post</Link>}</div><div className="statGrid dashboardStats">{stats.map(([label,count])=><div key={label}><b>{count||0}</b><span>{label}</span></div>)}</div><div className="dashboardQuick">{can(profile.role,'seo')&&<Link href="/admin/seo"><b>SEO Control Center</b><span>Audit metadata, schema, canonicals and indexability.</span></Link>}{can(profile.role,'redirects')&&<Link href="/admin/redirects"><b>Redirect Manager</b><span>Protect old URLs and review redirect hits.</span></Link>}{can(profile.role,'workflow')&&<Link href="/admin/workflow"><b>Editorial Workflow</b><span>Move work from idea to published.</span></Link>}{can(profile.role,'moderate')&&<Link href="/admin/community"><b>Community & Safety</b><span>Review notes and content reports.</span></Link>}{can(profile.role,'newsletter')&&<Link href="/admin/newsletter"><b>Newsletter Centre</b><span>Manage subscribers, interests and issues.</span></Link>}{can(profile.role,'custom_pages')&&<Link href="/admin/custom-pages"><b>Page Builder</b><span>Create new landing pages without code.</span></Link>}{can(profile.role,'analytics')&&<Link href="/admin/analytics"><b>Audience Insights</b><span>See what readers search, save and select by mood.</span></Link>}{can(profile.role,'posts')&&<Link href="/admin/calendar"><b>Editorial Calendar</b><span>Check scheduled and recently published content.</span></Link>}</div>{recent.length>0&&<div className="permissionPanel"><h2>Recent Activity</h2>{recent.map(x=><p key={x.id}><b>{x.profiles?.display_name||x.profiles?.email||'System'}</b> {x.action} {x.entity_type} <small>· {new Date(x.created_at).toLocaleString()}</small></p>)}<Link className="readMore" href="/admin/activity">View full activity log →</Link></div>}</>;
}

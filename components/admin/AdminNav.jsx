'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {getBrowserSupabase} from '../../lib/supabase/browser';
import {can,ROLE_LABELS} from '../../lib/roles';
export default function AdminNav({profile}){
 const router=useRouter(),role=profile.role;
 const items=[['Dashboard','/admin','dashboard'],['Posts','/admin/posts','posts'],['Workflow','/admin/workflow','workflow'],['Calendar','/admin/calendar','posts'],['SEO Control Center','/admin/seo','seo'],['Redirects','/admin/redirects','redirects'],['Taxonomies','/admin/taxonomies','taxonomies'],['Trash','/admin/trash','trash'],['Media Library','/admin/media','media'],['Letters','/admin/letters','letters'],['Topic Pages','/admin/pages','pages'],['Page Builder','/admin/custom-pages','custom_pages'],['Homepage Builder','/admin/homepage','homepage'],['Site Design','/admin/site','site_design'],['Collections','/admin/collections','collections'],['Daily Reflection','/admin/daily','daily'],['Community','/admin/community','moderate'],['Story Submissions','/admin/submissions','moderate'],['Newsletter','/admin/newsletter','newsletter'],['Audience Insights','/admin/analytics','analytics'],['Revisions','/admin/revisions','revisions'],['Activity Log','/admin/activity','audit'],['Users & Roles','/admin/users','users']];
 async function logout(){const db=getBrowserSupabase();if(db)await db.auth.signOut();router.push('/admin/login');router.refresh()}
 return <aside className="adminNav"><Link href="/" className="adminBrand">UNTENANTED HEART<small>CMS V4</small></Link><div className="adminUser"><b>{profile.display_name||profile.email}</b><span>{ROLE_LABELS[role]||role}</span></div><nav>{items.filter(x=>can(role,x[2])).map(x=><Link key={x[1]} href={x[1]}>{x[0]}</Link>)}</nav><button onClick={logout}>Sign Out</button></aside>
}

import {createSign} from 'crypto';
let cache={token:'',expires:0};
function b64(v){return Buffer.from(v).toString('base64url')}
function privateKey(){return String(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY||'').replace(/\\n/g,'\n')}
export function googleCredentialsConfigured(){return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL&&privateKey())}
export async function getGoogleAccessToken(){
 if(cache.token&&Date.now()<cache.expires-60000)return cache.token;
 const email=process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,key=privateKey();if(!email||!key)throw new Error('Google service account is not configured.');
 const now=Math.floor(Date.now()/1000),header=b64(JSON.stringify({alg:'RS256',typ:'JWT'})),payload=b64(JSON.stringify({iss:email,scope:'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
 const unsigned=`${header}.${payload}`,sign=createSign('RSA-SHA256');sign.update(unsigned);sign.end();const jwt=`${unsigned}.${sign.sign(key,'base64url')}`;
 const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt}),cache:'no-store'});const d=await r.json();if(!r.ok||!d.access_token)throw new Error(d.error_description||d.error||'Google authorization failed.');cache={token:d.access_token,expires:Date.now()+Number(d.expires_in||3600)*1000};return cache.token;
}
async function googleFetch(url,options={}){const token=await getGoogleAccessToken();const r=await fetch(url,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json',...(options.headers||{})},cache:'no-store'});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d?.error?.message||`Google API error ${r.status}`);return d}
function metric(row,i){return Number(row?.metricValues?.[i]?.value||0)}
export async function getGa4Overview(propertyId){
 if(!propertyId)return {configured:false};const property=String(propertyId).replace(/^properties\//,'');
 try{
  const summary=await googleFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(property)}:runReport`,{method:'POST',body:JSON.stringify({dateRanges:[{startDate:'30daysAgo',endDate:'today'}],metrics:[{name:'sessions'},{name:'totalUsers'},{name:'screenPageViews'},{name:'engagementRate'}]})});
  const pages=await googleFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(property)}:runReport`,{method:'POST',body:JSON.stringify({dateRanges:[{startDate:'30daysAgo',endDate:'today'}],dimensions:[{name:'pagePath'}],metrics:[{name:'screenPageViews'}],orderBys:[{metric:{metricName:'screenPageViews'},desc:true}],limit:10})});
  const channels=await googleFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(property)}:runReport`,{method:'POST',body:JSON.stringify({dateRanges:[{startDate:'30daysAgo',endDate:'today'}],dimensions:[{name:'sessionDefaultChannelGroup'}],metrics:[{name:'sessions'}],orderBys:[{metric:{metricName:'sessions'},desc:true}],limit:10})});
  const row=summary.rows?.[0];return {configured:true,ok:true,summary:{sessions:metric(row,0),users:metric(row,1),views:metric(row,2),engagementRate:metric(row,3)},pages:(pages.rows||[]).map(x=>({label:x.dimensionValues?.[0]?.value||'',value:metric(x,0)})),channels:(channels.rows||[]).map(x=>({label:x.dimensionValues?.[0]?.value||'',value:metric(x,0)}))};
 }catch(e){return {configured:true,ok:false,error:e.message}}
}
function ymd(d){return d.toISOString().slice(0,10)}
export async function getGscOverview(siteUrl){
 if(!siteUrl)return {configured:false};
 try{const end=new Date(),start=new Date(Date.now()-28*86400000);const base={startDate:ymd(start),endDate:ymd(end),rowLimit:10};
  const summary=await googleFetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,{method:'POST',body:JSON.stringify({...base,rowLimit:1})});
  const queries=await googleFetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,{method:'POST',body:JSON.stringify({...base,dimensions:['query']})});
  const pages=await googleFetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,{method:'POST',body:JSON.stringify({...base,dimensions:['page']})});
  const r=summary.rows?.[0]||{};return {configured:true,ok:true,summary:{clicks:Number(r.clicks||0),impressions:Number(r.impressions||0),ctr:Number(r.ctr||0),position:Number(r.position||0)},queries:(queries.rows||[]).map(x=>({label:x.keys?.[0]||'',clicks:x.clicks||0,impressions:x.impressions||0,position:x.position||0})),pages:(pages.rows||[]).map(x=>({label:x.keys?.[0]||'',clicks:x.clicks||0,impressions:x.impressions||0,position:x.position||0}))};
 }catch(e){return {configured:true,ok:false,error:e.message}}
}

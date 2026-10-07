#!/usr/bin/env node
// Google Search Console + GA4 Data API through a service account. No dependencies.
// Usage: node scripts/google.mjs <command> [--days N] [--limit N] [--url URL] [--dim NAME]
// Commands: check | gsc-sites | gsc-queries | gsc-pages | gsc-countries | gsc-devices | gsc-sitemaps |
//           gsc-submit-sitemap | gsc-inspect --url URL | ga4-channels | ga4-sources | ga4-pages |
//           ga4-events | ga4-countries | ga4-daily
import {createSign} from 'node:crypto';
import {existsSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const envFile=resolve(root,'config/.env');
if(existsSync(envFile))for(const line of readFileSync(envFile,'utf8').split('\n')){
 const m=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');
}
const cfg={sa:process.env.GOOGLE_SA_JSON||'config/service-account.json',site:process.env.GSC_SITE||'sc-domain:praxenai.ge',ga4:process.env.GA4_PROPERTY||''};
const args=process.argv.slice(2),cmd=args[0]||'check';
const opt=(name,def)=>{const i=args.indexOf('--'+name);return i>0?args[i+1]:def};
const days=+opt('days',28),limit=+opt('limit',25);
const fail=msg=>{console.error('Error: '+msg);process.exit(1)};

async function token(){
 const path=resolve(root,cfg.sa);
 if(!existsSync(path))fail(`service account key not found at ${path}. See config/README.md.`);
 const sa=JSON.parse(readFileSync(path,'utf8'));
 const now=Math.floor(Date.now()/1000);
 const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');
 const body=b64({alg:'RS256',typ:'JWT'})+'.'+b64({iss:sa.client_email,scope:'https://www.googleapis.com/auth/webmasters https://www.googleapis.com/auth/analytics.readonly',aud:sa.token_uri||'https://oauth2.googleapis.com/token',iat:now,exp:now+3600});
 const jwt=body+'.'+createSign('RSA-SHA256').update(body).sign(sa.private_key,'base64url');
 const r=await fetch(sa.token_uri||'https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt})});
 const j=await r.json();if(!j.access_token)fail('token: '+JSON.stringify(j));
 return {token:j.access_token,email:sa.client_email};
}
let auth;
async function api(method,url,body){
 auth??=await token();
 const r=await fetch(url,{method,headers:{Authorization:'Bearer '+auth.token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
 const text=await r.text();const j=text?JSON.parse(text):{};
 if(!r.ok)fail(`${r.status} ${j.error?.message||text}`);
 return j;
}
const ymd=d=>d.toISOString().slice(0,10);
const range=()=>{const end=new Date(Date.now()-864e5*2);return {startDate:ymd(new Date(end-864e5*(days-1))),endDate:ymd(end)}};
const tsv=(head,rows)=>{console.log(head.join('\t'));for(const r of rows.slice(0,limit))console.log(r.join('\t'));if(!rows.length)console.log('(no data)')};
const gsc='https://searchconsole.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(cfg.site);

async function gscReport(dim){
 const j=await api('POST',gsc+'/searchAnalytics/query',{...range(),dimensions:[dim],rowLimit:limit});
 tsv([dim,'clicks','impressions','ctr','position'],(j.rows||[]).map(r=>[r.keys[0],r.clicks,r.impressions,(r.ctr*100).toFixed(1)+'%',r.position.toFixed(1)]));
}
async function ga4(dims,metrics,orderBy){
 if(!cfg.ga4)fail('GA4_PROPERTY is not set (numeric property ID, GA4 Admin -> Property details).');
 const j=await api('POST',`https://analyticsdata.googleapis.com/v1beta/properties/${cfg.ga4}:runReport`,{dateRanges:[{startDate:days+'daysAgo',endDate:'today'}],dimensions:dims.map(name=>({name})),metrics:metrics.map(name=>({name})),orderBys:[{[orderBy==='dim'?'dimension':'metric']:orderBy==='dim'?{dimensionName:dims[0]}:{metricName:metrics[0]},desc:orderBy!=='dim'}],limit});
 tsv([...dims,...metrics],(j.rows||[]).map(r=>[...r.dimensionValues.map(v=>v.value),...r.metricValues.map(v=>v.value)]));
}

const commands={
 async check(){
  const a=await token();console.log('Service account: '+a.email);
  const s=await api('GET','https://searchconsole.googleapis.com/webmasters/v3/sites');
  const site=(s.siteEntry||[]).find(e=>e.siteUrl===cfg.site);
  console.log('Search Console '+cfg.site+': '+(site?site.permissionLevel:'NO ACCESS (add the service account as a user)'));
  if(cfg.ga4){const r=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${cfg.ga4}/metadata`,{headers:{Authorization:'Bearer '+auth.token}});console.log('GA4 property '+cfg.ga4+': '+(r.ok?'OK':'NO ACCESS ('+r.status+')'))}
  else console.log('GA4: GA4_PROPERTY not set');
 },
 async 'gsc-sites'(){const s=await api('GET','https://searchconsole.googleapis.com/webmasters/v3/sites');tsv(['site','permission'],(s.siteEntry||[]).map(e=>[e.siteUrl,e.permissionLevel]))},
 'gsc-queries':()=>gscReport('query'),
 'gsc-pages':()=>gscReport('page'),
 'gsc-countries':()=>gscReport('country'),
 'gsc-devices':()=>gscReport('device'),
 async 'gsc-sitemaps'(){const j=await api('GET',gsc+'/sitemaps');tsv(['sitemap','submitted','downloaded','errors','warnings','urls'],(j.sitemap||[]).map(s=>[s.path,s.lastSubmitted||'',s.lastDownloaded||'',s.errors||0,s.warnings||0,(s.contents||[]).map(c=>c.submitted).join('/')]))},
 async 'gsc-submit-sitemap'(){const url=opt('url','https://praxenai.ge/sitemap.xml');await api('PUT',gsc+'/sitemaps/'+encodeURIComponent(url));console.log('Submitted '+url)},
 async 'gsc-inspect'(){
  const url=opt('url');if(!url)fail('--url is required');
  const j=await api('POST','https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',{inspectionUrl:url,siteUrl:cfg.site,languageCode:'ru'});
  const i=j.inspectionResult?.indexStatusResult||{};
  for(const k of ['verdict','coverageState','indexingState','robotsTxtState','pageFetchState','lastCrawlTime','googleCanonical','userCanonical'])console.log(k+': '+(i[k]??''));
 },
 'ga4-channels':()=>ga4(['sessionDefaultChannelGroup'],['sessions','totalUsers','engagementRate','keyEvents']),
 'ga4-sources':()=>ga4(['sessionSource','sessionMedium'],['sessions','totalUsers','keyEvents']),
 'ga4-pages':()=>ga4(['pagePath'],['screenPageViews','sessions','userEngagementDuration']),
 'ga4-events':()=>ga4(['eventName'],['eventCount','keyEvents']),
 'ga4-countries':()=>ga4(['country','city'],['sessions','totalUsers']),
 'ga4-daily':()=>ga4(['date'],['sessions','totalUsers','keyEvents'],'dim'),
};
if(!commands[cmd])fail('unknown command. Use: '+Object.keys(commands).join(', '));
await commands[cmd]();

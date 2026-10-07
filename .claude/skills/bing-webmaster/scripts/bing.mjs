#!/usr/bin/env node
// Bing Webmaster Tools API (JSON, API key). No dependencies.
// Usage: node scripts/bing.mjs <command> [--limit N] [--url URL]
// Commands: check | sites | quota | submit-sitemap-urls | submit-url --url URL | queries | pages |
//           crawl | crawl-issues | sitemaps | add-sitemap [--url URL]
import {existsSync,readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const envFile=resolve(root,'config/.env');
if(existsSync(envFile))for(const line of readFileSync(envFile,'utf8').split('\n')){
 const m=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);if(m&&!process.env[m[1]])process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');
}
const key=process.env.BING_API_KEY,site=process.env.BING_SITE||'https://praxenai.ge/';
const args=process.argv.slice(2),cmd=args[0]||'check';
const opt=(name,def)=>{const i=args.indexOf('--'+name);return i>0?args[i+1]:def};
const limit=+opt('limit',25);
const fail=msg=>{console.error('Error: '+msg);process.exit(1)};
if(!key)fail('BING_API_KEY is not set. See config/README.md.');

const base='https://ssl.bing.com/webmaster/api.svc/json/';
async function api(method,params={},body){
 const url=base+method+'?'+new URLSearchParams({apikey:key,...params});
 const r=await fetch(url,{method:body?'POST':'GET',headers:{'Content-Type':'application/json; charset=utf-8'},body:body?JSON.stringify(body):undefined});
 const text=await r.text();let j;try{j=JSON.parse(text)}catch{j={}}
 if(!r.ok)fail(`${method}: ${r.status} ${j.Message||text.slice(0,300)}`);
 return j.d;
}
// Bing returns dates as "/Date(1696118400000)/".
const day=v=>{const m=String(v||'').match(/\d{10,}/);return m?new Date(+m[0]).toISOString().slice(0,10):''};
const tsv=(head,rows)=>{console.log(head.join('\t'));for(const r of rows.slice(0,limit))console.log(r.join('\t'));if(!rows.length)console.log('(no data)')};
// Query and page stats come per day; sum them per key.
const sum=(rows,keyName)=>{const m=new Map();for(const r of rows||[]){const k=r[keyName];const a=m.get(k)||{k,clicks:0,impr:0,pos:0,n:0};a.clicks+=r.Clicks;a.impr+=r.Impressions;a.pos+=r.AvgImpressionPosition||0;a.n++;m.set(k,a)}return [...m.values()].sort((a,b)=>b.impr-a.impr)};

const commands={
 async check(){
  const s=await api('GetUserSites');const mine=(s||[]).find(x=>x.Url===site);
  console.log('Site '+site+': '+(mine?(mine.IsVerified?'verified':'NOT verified'):'not in this account'));
  const q=await api('GetUrlSubmissionQuota',{siteUrl:site});console.log(`URL submission quota: ${q.DailyQuota}/day, ${q.MonthlyQuota}/month`);
 },
 async sites(){tsv(['site','verified'],(await api('GetUserSites')||[]).map(s=>[s.Url,s.IsVerified]))},
 async quota(){const q=await api('GetUrlSubmissionQuota',{siteUrl:site});console.log(`daily ${q.DailyQuota}, monthly ${q.MonthlyQuota}`)},
 async 'submit-url'(){const url=opt('url');if(!url)fail('--url is required');await api('SubmitUrl',{},{siteUrl:site,url});console.log('Submitted '+url)},
 async 'submit-sitemap-urls'(){
  const xml=await fetch(new URL('sitemap.xml',site)).then(r=>r.text());
  const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  const q=await api('GetUrlSubmissionQuota',{siteUrl:site});
  const batch=urls.slice(0,q.DailyQuota);
  for(let i=0;i<batch.length;i+=500)await api('SubmitUrlBatch',{},{siteUrl:site,urlList:batch.slice(i,i+500)});
  console.log(`Submitted ${batch.length} of ${urls.length} sitemap URLs (daily quota ${q.DailyQuota})`);
 },
 async queries(){tsv(['query','clicks','impressions','avg_position'],sum(await api('GetQueryStats',{siteUrl:site}),'Query').map(a=>[a.k,a.clicks,a.impr,(a.pos/a.n).toFixed(1)]))},
 async pages(){tsv(['page','clicks','impressions','avg_position'],sum(await api('GetPageStats',{siteUrl:site}),'Query').map(a=>[a.k,a.clicks,a.impr,(a.pos/a.n).toFixed(1)]))},
 async crawl(){tsv(['date','crawled','in_index','errors','blocked_robots'],(await api('GetCrawlStats',{siteUrl:site})||[]).reverse().map(r=>[day(r.Date),r.CrawledPages,r.InIndex,r.CrawlErrors,r.BlockedByRobotsTxt]))},
 async 'crawl-issues'(){tsv(['url','issue','http','in_links'],(await api('GetCrawlIssues',{siteUrl:site})||[]).map(r=>[r.Url,r.Issues,r.HttpCode,r.InLinks]))},
 async sitemaps(){tsv(['sitemap','status','last_crawled','urls'],(await api('GetFeeds',{siteUrl:site})||[]).map(f=>[f.Url,f.Status,day(f.LastCrawled),f.UrlCount]))},
 async 'add-sitemap'(){const url=opt('url',new URL('sitemap.xml',site).href);await api('SubmitFeed',{},{siteUrl:site,feedUrl:url});console.log('Submitted '+url)},
};
if(!commands[cmd])fail('unknown command. Use: '+Object.keys(commands).join(', '));
await commands[cmd]();

// Russian-language demand for the content plan: Google Ads volumes (12-month average) per country
// and keyword ideas from seeds. DATAFORSEO_AUTH = base64("login:password"), e.g. from .env.dataforseo.
//
//   node scripts/seo/cis-demand.mjs volumes docs/seo-data/keywords-cis-ru.txt [ru] [RU,KZ,...] -> docs/seo-data/volumes-<lang>-<cc>-<date>.csv
//   node scripts/seo/cis-demand.mjs volumes docs/seo-data/keywords-en-core.txt en UK
//   node scripts/seo/cis-demand.mjs ideas docs/seo-data/keywords-cis-seeds.txt [KZ] -> docs/seo-data/cis-ideas-<cc>-<date>.csv (no Google Ads data for RU, BY)
//   node scripts/seo/cis-demand.mjs serp "внедрение ии в бизнес" [RU] [ru]     -> questions and top domains
import {readFileSync,writeFileSync} from 'node:fs';

const auth=process.env.DATAFORSEO_AUTH;
if(!auth){console.error('Set DATAFORSEO_AUTH');process.exit(1)}
const countries={RU:2643,KZ:2398,BY:2112,UZ:2860,AM:2051,GE:2268,UK:2826,US:2840,AE:2784,IL:2376};
const [,,,,langArg='ru',ccArg='RU,KZ,BY,UZ,AM,GE']=process.argv;
const picked=Object.fromEntries(ccArg.split(',').map(c=>[c,countries[c]]));
const day=new Date().toISOString().slice(0,10);
let spent=0;

async function call(path,body){
 const res=await fetch('https://api.dataforseo.com/v3/'+path,{method:'POST',headers:{Authorization:'Basic '+auth,'Content-Type':'application/json'},body:JSON.stringify(body)});
 const data=await res.json();spent+=data.cost||0;
 const task=data.tasks?.[0];
 if(data.status_code!==20000||task?.status_code!==20000)throw new Error((task?.status_message||data.status_message)+' ('+path+')');
 return task.result||[];
}
const list=f=>readFileSync(f,'utf8').split('\n').map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
const csv=(rows,head)=>[head.join(','),...rows.map(r=>head.map(h=>{const v=r[h]??'';return /[",]/.test(String(v))?'"'+String(v).replace(/"/g,'""')+'"':v}).join(','))].join('\n')+'\n';

const [cmd,arg]=process.argv.slice(2);
if(cmd==='volumes'){
 const keywords=list(arg),rows=new Map(keywords.map(k=>[k,{keyword:k}]));
 for(const [cc,code] of Object.entries(picked)){
  try{
   const r=await call('keywords_data/google_ads/search_volume/live',[{location_code:code,language_code:langArg,keywords}]);
   for(const k of r){const row=rows.get(k.keyword)||rows.set(k.keyword,{keyword:k.keyword}).get(k.keyword);row[cc]=k.search_volume??'';if(cc===Object.keys(picked)[0]){row.competition=k.competition??'';row.cpc_usd=k.cpc??''}}
   console.error(cc,'ok');
  }catch(e){console.error(cc,'failed:',e.message)}
 }
 const out=[...rows.values()].map(r=>({...r,total:Object.keys(picked).reduce((s,c)=>s+(+r[c]||0),0)})).sort((a,b)=>b.total-a.total);
 const file=`docs/seo-data/volumes-${langArg}-${Object.keys(picked).join('-')}-${day}.csv`;
 writeFileSync(file,csv(out,['keyword','total',...Object.keys(picked),'competition','cpc_usd']));
 console.log(file);for(const r of out.slice(0,40))console.log(r.total,r.keyword);
}else if(cmd==='ideas'){
 const seeds=list(arg).slice(0,20);
 const loc=process.argv[4]||'KZ';
 const r=await call('keywords_data/google_ads/keywords_for_keywords/live',[{location_code:countries[loc],language_code:'ru',keywords:seeds}]);
 const out=r.filter(k=>k.search_volume>0).map(k=>({keyword:k.keyword,volume:k.search_volume,competition:k.competition??'',cpc_usd:k.cpc??''})).sort((a,b)=>b.volume-a.volume);
 const file=`docs/seo-data/cis-ideas-${loc}-${day}.csv`;
 writeFileSync(file,csv(out,['keyword','volume','competition','cpc_usd']));
 console.log(file,out.length,'ideas');for(const k of out.slice(0,40))console.log(k.volume,k.keyword);
}else if(cmd==='serp'){
 const [,,,,cc='RU',lang='ru']=process.argv;
 const [r]=await call('serp/google/organic/live/advanced',[{keyword:arg,location_code:countries[cc],language_code:lang,depth:10}]);
 console.log(JSON.stringify({features:r.item_types,top:r.items.filter(i=>i.type==='organic').map(i=>i.domain+' | '+i.title),
  questions:r.items.filter(i=>i.type==='people_also_ask').flatMap(i=>i.items.map(q=>q.title))},null,1));
}else{console.error('Commands: volumes <file> | ideas <file> | serp <keyword>');process.exit(1)}
console.error('cost $'+spent.toFixed(3));

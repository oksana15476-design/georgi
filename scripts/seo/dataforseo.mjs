// Repeatable DataForSEO checks for the semantic core and AI visibility.
// Credentials come from the environment only: DATAFORSEO_AUTH is base64("login:password").
//
//   node scripts/seo/dataforseo.mjs volume docs/seo-data/keywords.txt   Google Ads volumes, Georgia
//   node scripts/seo/dataforseo.mjs serp "WhatsApp chatbot" en           top 20 Google results, Georgia
//   node scripts/seo/dataforseo.mjs llm "Какие компании в Грузии внедряют ИИ?" [chat_gpt|perplexity|gemini]
//                                                                  AI answer with sources
//   node scripts/seo/dataforseo.mjs balance
//
// Output is JSON on stdout; the request cost is printed to stderr.
import {readFileSync} from 'node:fs';

const auth=process.env.DATAFORSEO_AUTH;
if(!auth){console.error('Set DATAFORSEO_AUTH to base64("login:password")');process.exit(1)}
const GEORGIA=2268;

async function call(path,body){
 const res=await fetch('https://api.dataforseo.com/v3/'+path,{method:body?'POST':'GET',headers:{Authorization:'Basic '+auth,'Content-Type':'application/json'},body:body&&JSON.stringify(body)});
 const data=await res.json();
 const task=data.tasks?.[0];
 if(data.status_code!==20000||task?.status_code!==20000)throw new Error((task?.status_message||data.status_message)+' ('+path+')');
 console.error('cost $'+data.cost);
 return task.result;
}

const [cmd,arg,lang='en']=process.argv.slice(2);
const out=v=>console.log(JSON.stringify(v,null,1));

if(cmd==='volume'){
 const keywords=readFileSync(arg,'utf8').split('\n').map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
 const r=await call('keywords_data/google_ads/search_volume/live',[{location_code:GEORGIA,keywords}]);
 out(r.map(k=>({keyword:k.keyword,volume:k.search_volume,competition:k.competition,cpc:k.cpc})).sort((a,b)=>(b.volume??-1)-(a.volume??-1)));
}else if(cmd==='serp'){
 const [r]=await call('serp/google/organic/live/advanced',[{keyword:arg,location_code:GEORGIA,language_code:lang,depth:20}]);
 out({features:r.item_types,organic:r.items.filter(i=>i.type==='organic').map(i=>({rank:i.rank_absolute,domain:i.domain,title:i.title,url:i.url})),
  questions:r.items.filter(i=>i.type==='people_also_ask').flatMap(i=>i.items.map(q=>q.title))});
}else if(cmd==='llm'){
 const engine=process.argv[4]||'chat_gpt';
 const models={chat_gpt:{model_name:'gpt-5-mini',web_search:true,web_search_country_iso_code:'GE'},perplexity:{model_name:'sonar'},gemini:{model_name:'gemini-2.5-flash',web_search:true}};
 if(!models[engine])throw new Error('Engines: '+Object.keys(models).join(', '));
 const [r]=await call('ai_optimization/'+engine+'/llm_responses/live',[{user_prompt:arg,max_output_tokens:1200,...models[engine]}]);
 const sections=(r.items||[]).flatMap(i=>i.sections||[]);
 out({answer:sections.map(s=>s.text).join('\n'),sources:[...new Set(sections.flatMap(s=>(s.annotations||[]).map(a=>a.url.replace(/\?utm_source=openai$/,''))))],
  mentionsPraxis:/praxis/i.test(sections.map(s=>s.text).join(' '))});
}else if(cmd==='balance'){
 const [r]=await call('appendix/user_data');
 out({login:r.login,balance:r.money?.balance});
}else{
 console.error('Commands: volume <file> | serp <keyword> [lang] | llm <prompt> [engine] | balance');process.exit(1);
}

// Meta ads changes made only on the owner's command (.github/workflows/meta-ads.yml, run by hand).
//   create <plan.json>       create the campaigns, ad sets, creatives and ads of a plan, all PAUSED, and the audiences
//   status <ACTIVE|PAUSED> <id,id…>   switch campaigns, ad sets or ads on or off
//   end <iso time> <adset id,…>       set the end time of ad sets
// Uses META_TOKEN (system user praxen-publisher). Prints the created ids; nothing secret goes to the log.
import {readFileSync} from 'node:fs';
const G='https://graph.facebook.com/v21.0',tok=process.env.META_TOKEN;
const hide=s=>String(s).replace(/access_token=[^&\s"]+/g,'access_token=…');
async function api(path,params={},method='POST'){
 const body=new URLSearchParams({...Object.fromEntries(Object.entries(params).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v):String(v)])),access_token:tok});
 const r=await fetch(G+path+(method==='GET'?'?'+body:''),method==='GET'?{}:{method,body});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||j.error)throw new Error(hide(path+' '+JSON.stringify(j.error||j).slice(0,500)));
 return j;
}
const [cmd,a1,a2]=process.argv.slice(2);
if(!tok){console.log('META_TOKEN is not set');process.exit(1);}

if(cmd==='status'){
 for(const id of a2.split(','))console.log(id,a1,JSON.stringify(await api('/'+id,{status:a1})));
}else if(cmd==='end'){
 for(const id of a2.split(','))console.log(id,'end',a1,JSON.stringify(await api('/'+id,{end_time:a1})));
}else if(cmd==='create'){
 const plan=JSON.parse(readFileSync(a1,'utf8')),act=plan.account,out={};
 for(const au of plan.audiences||[]){
  try{out[au.key]=(await api(`/${act}/customaudiences`,au.params)).id;console.log('audience',au.key,out[au.key]);}
  catch(e){console.log('ERROR audience',au.key,e.message);}
 }
 for(const c of plan.campaigns){
  try{
   const camp=(await api(`/${act}/campaigns`,{name:c.name,objective:c.objective,status:'PAUSED',special_ad_categories:[],is_adset_budget_sharing_enabled:false})).id;
   const adset=(await api(`/${act}/adsets`,{name:c.name,campaign_id:camp,status:'PAUSED',daily_budget:c.daily_budget,billing_event:'IMPRESSIONS',bid_strategy:'LOWEST_COST_WITHOUT_CAP',optimization_goal:c.optimization_goal,...(c.destination_type?{destination_type:c.destination_type}:{}),start_time:c.start_time,end_time:c.end_time,targeting:c.targeting})).id;
   const creative=(await api(`/${act}/adcreatives`,{name:c.name,object_story_spec:c.object_story_spec})).id;
   const ad=(await api(`/${act}/ads`,{name:c.name,adset_id:adset,creative:{creative_id:creative},status:'PAUSED'})).id;
   console.log('created',c.name,JSON.stringify({campaign:camp,adset,creative,ad}));
  }catch(e){console.log('ERROR',c.name,e.message);process.exitCode=1;}
 }
}else{console.log('Use: create <plan> | status <ACTIVE|PAUSED> <ids> | end <iso> <adset ids>');process.exit(1);}

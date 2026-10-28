// Meta ads changes made only on the owner's command (.github/workflows/meta-ads.yml, run by hand).
//   create <plan.json>       create the campaigns, ad sets, creatives and ads of a plan, all PAUSED, and the audiences;
//                            safe to run again: audiences and campaigns with the same name are reused, finished ones skipped
//   status <ACTIVE|PAUSED> <id,id…>   switch campaigns, ad sets or ads on or off
//   end <iso time> <adset id,…>       set the end time of ad sets
//   start <iso time> <adset id,…>     set the start time of ad sets (e.g. now, to start a scheduled one)
//   list                               campaigns and their ad sets with ids, status, end time and placements (no spend)
//   placements <adset id,…>           keep only Facebook and Instagram feeds, stories and reels (no WhatsApp, Threads, Messenger, Audience Network)
//   testimg <image url>                Instagram fetches the image into an unpublished container (nothing is posted)
//   diag <adset id,…>                 delivery state of ad sets and their ads: status, issues, learning, audience estimate (no spend)
//   scopes                             list the permissions of META_TOKEN (no secrets printed)
//   subscribe                          subscribe the Praxen AI page to the app's message webhooks (lib/dm-assistant.ts)
//   addads <plan.json>               add ads to an existing ad set (Instagram posts or reels by link, or an object_story_spec), ACTIVE,
//                                     then pause the ads listed in "pause"
//   ads                                every ad of every reachable ad account: status, campaign, and the Instagram post or reel it promotes (no spend)
//   delpost <text start> <post id|instagram link,…>   delete page or Instagram posts, only those whose text starts with <text start>
// Uses META_TOKEN (system user praxen-publisher). Prints the created ids; nothing secret goes to the log.
import {readFileSync} from 'node:fs';
const G='https://graph.facebook.com/v21.0',tok=process.env.META_TOKEN;
const hide=s=>String(s).replace(/access_token=[^&\s"]+/g,'access_token=…');
async function api(path,params={},method='POST'){
 const body=new URLSearchParams({...Object.fromEntries(Object.entries(params).map(([k,v])=>[k,typeof v==='object'?JSON.stringify(v):String(v)])),access_token:tok});
 const q=method==='GET'||method==='DELETE';
 const r=await fetch(G+path+(q?'?'+body:''),q?{method}:{method,body});
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
}else if(cmd==='start'){
 for(const id of a2.split(','))console.log(id,'start',a1,JSON.stringify(await api('/'+id,{start_time:a1})));
}else if(cmd==='list'){
 const act=a1||'act_1572744140745644';
 for(const c of (await api(`/${act}/campaigns`,{fields:'id,name,effective_status',limit:50},'GET')).data||[]){
  console.log('campaign',c.id,c.effective_status,c.name);
  for(const s of (await api(`/${c.id}/adsets`,{fields:'id,name,effective_status,end_time,targeting{publisher_platforms,facebook_positions,instagram_positions,messenger_positions,audience_network_positions,threads_positions,whatsapp_positions}',limit:50},'GET')).data||[])
   console.log('  adset',s.id,s.effective_status,'end',s.end_time||'-',JSON.stringify(s.targeting||{}));
 }
}else if(cmd==='placements'){
 for(const id of a1.split(',')){
  const t=(await api('/'+id,{fields:'targeting'},'GET')).targeting||{};
  for(const k of ['messenger_positions','audience_network_positions','threads_positions','whatsapp_positions','targeting_optimization'])delete t[k];
  Object.assign(t,{publisher_platforms:['facebook','instagram'],facebook_positions:['feed','story','facebook_reels'],instagram_positions:['stream','story','reels']});
  console.log(id,'placements',JSON.stringify(await api('/'+id,{targeting:t})));
 }
}else if(cmd==='testimg'){
 const pg=((await api('/me/accounts',{fields:'id,name,instagram_business_account'},'GET')).data||[]).find(x=>/praxen/i.test(x.name));
 const ig=pg?.instagram_business_account?.id;if(!ig){console.log('no instagram');process.exit(1);}
 const id=(await api(`/${ig}/media`,{image_url:a1,caption:'test, not published'})).id;
 for(let i=0;i<10;i++){const st=(await api('/'+id,{fields:'status_code'},'GET')).status_code;console.log('container',id,st);if(st!=='IN_PROGRESS')break;await new Promise(r=>setTimeout(r,3000));}
}else if(cmd==='diag'){
 for(const id of a1.split(',')){
  const s=await api('/'+id,{fields:'name,effective_status,configured_status,start_time,end_time,daily_budget,optimization_goal,billing_event,bid_strategy,destination_type,issues_info,learning_stage_info,recommendations'},'GET');
  console.log('adset',JSON.stringify(s).slice(0,1500));
  const est=await api(`/${id}/delivery_estimate`,{fields:'estimate_dau,estimate_mau_lower_bound,estimate_mau_upper_bound,estimate_ready'},'GET').catch(e=>({error:e.message}));
  console.log('estimate',JSON.stringify(est).slice(0,500));
  for(const ad of (await api(`/${id}/ads`,{fields:'name,effective_status,configured_status,issues_info,ad_review_feedback,recommendations'},'GET')).data||[])console.log('ad',JSON.stringify(ad).slice(0,1000));
 }
}else if(cmd==='scopes'){
 const d=(await api('/debug_token',{input_token:tok},'GET')).data||{};
 console.log('valid',d.is_valid,'type',d.type,'expires',d.expires_at,'app',d.app_id);
 console.log('scopes',(d.scopes||[]).join(','));
 for(const g of d.granular_scopes||[])console.log('granular',g.scope,(g.target_ids||[]).join(','));
}else if(cmd==='subscribe'){
 const pg=((await api('/me/accounts',{fields:'id,name,access_token'},'GET')).data||[]).find(x=>/praxen/i.test(x.name));
 if(!pg){console.log('page not found');process.exit(1);}
 const r=await fetch(`${G}/${pg.id}/subscribed_apps`,{method:'POST',body:new URLSearchParams({subscribed_fields:'messages,messaging_postbacks,message_echoes',access_token:pg.access_token})}).then(x=>x.json());
 console.log('subscribe',pg.id,JSON.stringify(r).slice(0,300));
 if(r.error)process.exitCode=1;
}else if(cmd==='delpost'){
 const pg=((await api('/me/accounts',{fields:'id,name,access_token,instagram_business_account'},'GET')).data||[]).find(x=>/praxen/i.test(x.name));
 if(!pg||!a1){console.log('page or text not found');process.exit(1);}
 const pt=tok=>(p,q={},m='POST')=>{const b=new URLSearchParams({...q,access_token:tok}),g=m!=='POST';return fetch(G+p+(g?'?'+b:''),g?{method:m}:{method:m,body:b}).then(r=>r.json());};
 const page=pt(pg.access_token),ig=pg.instagram_business_account?.id;
 for(const ref of a2.split(',')){
  let id=ref,text;
  if(/instagram\.com/.test(ref)){
   const code=ref.match(/\/(?:p|reel)\/([^/?]+)/)?.[1];
   const m=((await page(`/${ig}/media`,{fields:'id,caption,permalink',limit:'50'},'GET')).data||[]).find(x=>x.permalink?.includes('/'+code+'/'));
   id=m?.id;text=m?.caption;
  }else text=(await page('/'+id,{fields:'message'},'GET')).message;
  if(!id||!(text||'').startsWith(a1)){console.log('skip',ref,'text does not match:',JSON.stringify((text||'').slice(0,80)));process.exitCode=1;continue;}
  console.log('delete',ref,JSON.stringify(text.slice(0,80)),JSON.stringify(await page('/'+id,{},'DELETE')).slice(0,300));
 }
}else if(cmd==='ads'){
 const accs=(await api('/me/adaccounts',{fields:'id,name,account_status',limit:50},'GET')).data||[];
 for(const a of accs){
  console.log('account',a.id,a.account_status,a.name);
  const ads=(await api(`/${a.id}/ads`,{fields:'id,name,effective_status,configured_status,campaign{id,name,effective_status},adset{id,name},creative{id,effective_object_story_id,effective_instagram_media_id,instagram_permalink_url,source_instagram_media_id}',limit:200},'GET').catch(e=>({data:[],err:e.message}))).data||[];
  for(const ad of ads){const c=ad.creative||{};console.log(' ad',ad.id,ad.effective_status,'|',ad.name,'| campaign',ad.campaign?.id,ad.campaign?.effective_status,ad.campaign?.name,'| adset',ad.adset?.id,'| ig',c.instagram_permalink_url||'-',c.effective_instagram_media_id||c.source_instagram_media_id||'','| post',c.effective_object_story_id||'-');}
 }
}else if(cmd==='addads'){
 const plan=JSON.parse(readFileSync(a1,'utf8')),act=plan.account;
 const pg=((await api('/me/accounts',{fields:'id,name,access_token,instagram_business_account'},'GET')).data||[]).find(x=>/praxen/i.test(x.name));
 const ig=pg?.instagram_business_account?.id;
 const media=ig?((await fetch(`${G}/${ig}/media?`+new URLSearchParams({fields:'id,permalink',limit:'50',access_token:pg.access_token})).then(r=>r.json())).data||[]):[];
 let made=0;
 for(const it of plan.ads){
  try{
   let params;
   if(it.instagram_link){
    const code=it.instagram_link.match(/\/(?:p|reel)\/([^/?]+)/)?.[1],m=media.find(x=>x.permalink?.includes('/'+code+'/'));
    if(!m)throw new Error('instagram post not found: '+it.instagram_link);
    params={name:it.name,object_id:pg.id,instagram_user_id:ig,source_instagram_media_id:m.id,...(it.call_to_action?{call_to_action:it.call_to_action}:{})};
   }else params={name:it.name,object_story_spec:it.spec};
   const creative=(await api(`/${act}/adcreatives`,params)).id;
   const ad=(await api(`/${act}/ads`,{name:it.name,adset_id:plan.adset,creative:{creative_id:creative},status:'ACTIVE'})).id;
   console.log('added',it.name,JSON.stringify({creative,ad}));made++;
  }catch(e){console.log('ERROR',it.name,e.message);process.exitCode=1;}
 }
 if(made===plan.ads.length)for(const id of plan.pause||[])console.log(id,'PAUSED',JSON.stringify(await api('/'+id,{status:'PAUSED'})));
 else if(plan.pause?.length)console.log('not all ads were added, old ads left as they are');
}else if(cmd==='create'){
 const plan=JSON.parse(readFileSync(a1,'utf8')),act=plan.account,out={};
 const list=async edge=>(await api(`/${act}/${edge}`,{fields:'id,name',limit:200},'GET')).data||[];
 const audiences=await list('customaudiences').catch(()=>[]),campaigns=await list('campaigns');
 for(const au of plan.audiences||[]){
  const have=audiences.find(x=>x.name===au.params.name);
  if(have){console.log('audience',au.key,have.id,'(exists)');continue;}
  try{out[au.key]=(await api(`/${act}/customaudiences`,au.params)).id;console.log('audience',au.key,out[au.key]);}
  catch(e){console.log('ERROR audience',au.key,e.message);}
 }
 for(const c of plan.campaigns){
  try{
   let camp=campaigns.find(x=>x.name===c.name)?.id;
   if(camp&&((await api(`/${camp}/ads`,{fields:'id',limit:1},'GET')).data||[]).length){console.log('exists',c.name,camp);continue;}
   if(camp)for(const a of (await api(`/${camp}/adsets`,{fields:'id',limit:50},'GET')).data||[])await api('/'+a.id,{},'DELETE');
   camp??=(await api(`/${act}/campaigns`,{name:c.name,objective:c.objective,status:'PAUSED',special_ad_categories:[],is_adset_budget_sharing_enabled:false})).id;
   console.log('campaign',c.name,camp);
   const adset=(await api(`/${act}/adsets`,{name:c.name,campaign_id:camp,status:'PAUSED',daily_budget:c.daily_budget,billing_event:'IMPRESSIONS',bid_strategy:'LOWEST_COST_WITHOUT_CAP',optimization_goal:c.optimization_goal,...(c.destination_type?{destination_type:c.destination_type}:{}),...(c.promoted_object?{promoted_object:c.promoted_object}:{}),start_time:c.start_time,end_time:c.end_time,targeting:c.targeting})).id;
   // "ads": existing page posts as ads ({name, object_story_id}); otherwise one ad from "object_story_spec".
   const items=c.ads||[{name:c.name,spec:c.object_story_spec}],made=[];
   for(const it of items){
    const creative=(await api(`/${act}/adcreatives`,it.object_story_id?{name:it.name,object_story_id:it.object_story_id,...(c.instagram_user_id?{instagram_user_id:c.instagram_user_id}:{})}:{name:it.name,object_story_spec:it.spec})).id;
    const ad=(await api(`/${act}/ads`,{name:it.name,adset_id:adset,creative:{creative_id:creative},status:'PAUSED'})).id;
    made.push({creative,ad});
   }
   console.log('created',c.name,JSON.stringify({campaign:camp,adset,ads:made}));
  }catch(e){console.log('ERROR',c.name,e.message);process.exitCode=1;}
 }
}else{console.log('Use: create <plan> | status <ACTIVE|PAUSED> <ids> | end <iso> <adset ids> | start <iso> <adset ids> | subscribe | scopes | list | placements <adset ids>');process.exit(1);}

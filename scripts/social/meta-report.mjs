// Social and ads statistics from the same keys the publisher uses (.github/workflows/social-report.yml).
// Prints one JSON report: Facebook page and posts, Instagram account and posts, Threads, Telegram channel,
// Meta ad accounts with campaigns, ads (review status and problems) and the last 7 days of spend.
// The repository is public, so the workflow encrypts this output before it reaches the log.
//   node scripts/social/meta-report.mjs > report.json
const env=process.env,G='https://graph.facebook.com/v21.0',T='https://graph.threads.net/v1.0';
const hide=s=>String(s).replace(/access_token=[^&\s"]+/g,'access_token=…').replace(/bot\d+:[\w-]+/g,'bot…');
async function get(url,params={}){
 const r=await fetch(url+'?'+new URLSearchParams(params));const j=await r.json().catch(()=>({}));
 if(!r.ok||j.error)throw new Error(hide(JSON.stringify(j.error||j).slice(0,300)));
 return j;
}
const safe=async f=>{try{return await f()}catch(e){return {error:hide(e.message||e)}}};
const out={at:new Date().toISOString()};
const since=Math.floor(Date.now()/1000)-28*86400,until=Math.floor(Date.now()/1000);

let page=null;
if(env.META_TOKEN){
 const pages=await safe(()=>get(`${G}/me/accounts`,{fields:'id,name,access_token,instagram_business_account',access_token:env.META_TOKEN}));
 page=(pages.data||[]).find(p=>/praxen/i.test(p.name))||(pages.data||[])[0]||null;
 if(pages.error)out.meta_error=pages.error;
}
if(page){
 const pt=page.access_token;
 out.facebook={
  page:await safe(()=>get(`${G}/${page.id}`,{fields:'name,fan_count,followers_count,link',access_token:pt})),
  insights_28d:await safe(()=>get(`${G}/${page.id}/insights`,{metric:'page_impressions_unique,page_post_engagements,page_views_total,page_daily_follows_unique',period:'day',since,until,access_token:pt}).then(j=>Object.fromEntries((j.data||[]).map(m=>[m.name,m.values.reduce((s,v)=>s+(+v.value||0),0)])))),
  posts:await safe(()=>get(`${G}/${page.id}/posts`,{fields:'created_time,message,permalink_url,reactions.summary(true).limit(0),comments.summary(true).limit(0),shares',limit:15,access_token:pt}).then(j=>(j.data||[]).map(p=>({at:p.created_time,text:(p.message||'').slice(0,60),url:p.permalink_url,reactions:p.reactions?.summary?.total_count||0,comments:p.comments?.summary?.total_count||0,shares:p.shares?.count||0})))),
 };
 const ig=page.instagram_business_account?.id;
 if(ig)out.instagram={
  account:await safe(()=>get(`${G}/${ig}`,{fields:'username,followers_count,follows_count,media_count',access_token:pt})),
  insights_28d:await safe(()=>get(`${G}/${ig}/insights`,{metric:'reach,profile_views,website_clicks,accounts_engaged,total_interactions',period:'day',metric_type:'total_value',since,until,access_token:pt}).then(j=>Object.fromEntries((j.data||[]).map(m=>[m.name,m.total_value?.value??m.values?.reduce((s,v)=>s+(+v.value||0),0)])))),
  media:await safe(async()=>{const j=await get(`${G}/${ig}/media`,{fields:'id,timestamp,caption,media_type,media_product_type,permalink,like_count,comments_count',limit:15,access_token:pt});
   return Promise.all((j.data||[]).map(async m=>({at:m.timestamp,type:m.media_product_type||m.media_type,text:(m.caption||'').slice(0,60),url:m.permalink,likes:m.like_count,comments:m.comments_count,
    insights:await safe(()=>get(`${G}/${m.id}/insights`,{metric:m.media_product_type==='STORY'?'reach,replies,navigation':'reach,saved,shares,views',access_token:pt}).then(r=>Object.fromEntries((r.data||[]).map(x=>[x.name,x.values?.[0]?.value??x.total_value?.value]))))})));}),
 };
}
if(env.THREADS_TOKEN){
 out.threads={
  profile:await safe(()=>get(`${T}/me`,{fields:'id,username',access_token:env.THREADS_TOKEN})),
  insights_28d:await safe(()=>get(`${T}/me/threads_insights`,{metric:'views,likes,replies,reposts,followers_count',since,until,access_token:env.THREADS_TOKEN}).then(j=>Object.fromEntries((j.data||[]).map(m=>[m.name,m.total_value?.value??m.values?.reduce((s,v)=>s+(+v.value||0),0)])))),
  posts:await safe(()=>get(`${T}/me/threads`,{fields:'id,timestamp,text,permalink',limit:10,access_token:env.THREADS_TOKEN}).then(j=>(j.data||[]).map(p=>({at:p.timestamp,text:(p.text||'').slice(0,60),url:p.permalink})))),
 };
}
if(env.TELEGRAM_SOCIAL_BOT_TOKEN&&env.TELEGRAM_CHANNEL){
 const api=`https://api.telegram.org/bot${env.TELEGRAM_SOCIAL_BOT_TOKEN}`;
 out.telegram={members:await safe(()=>get(`${api}/getChatMemberCount`,{chat_id:env.TELEGRAM_CHANNEL}).then(j=>j.result))};
}
if(env.META_TOKEN){
 const tok=env.META_TOKEN;
 out.ads=await safe(async()=>{
  const accs=(await get(`${G}/me/adaccounts`,{fields:'id,name,account_status,disable_reason,currency,amount_spent,balance,spend_cap',access_token:tok})).data||[];
  return Promise.all(accs.map(async a=>({...a,
   campaigns:await safe(()=>get(`${G}/${a.id}/campaigns`,{fields:'name,objective,status,effective_status,daily_budget,lifetime_budget,start_time,stop_time',limit:50,access_token:tok}).then(j=>j.data)),
   ads:await safe(()=>get(`${G}/${a.id}/ads`,{fields:'name,status,effective_status,ad_review_feedback,issues_info,campaign{name,daily_budget},adset{name,daily_budget,targeting,end_time,optimization_goal},creative{name,object_type,call_to_action_type,url_tags,link_url,object_url,effective_object_story_id,object_story_spec,asset_feed_spec}',limit:50,access_token:tok}).then(j=>Promise.all((j.data||[]).map(async x=>({name:x.name,status:x.effective_status,campaign:x.campaign?.name,campaign_budget:x.campaign?.daily_budget,adset:x.adset?.name,daily_budget:x.adset?.daily_budget,end:x.adset?.end_time,optimization:x.adset?.optimization_goal,
    creative:x.creative&&{cta:x.creative.call_to_action_type,url_tags:x.creative.url_tags,links:[...new Set(JSON.stringify(x.creative).match(/https?:[^"\\]+/g)||[])].filter(u=>/praxenai/.test(u)),story:x.creative.effective_object_story_id},
    targeting:x.adset?.targeting&&{geo:x.adset.targeting.geo_locations?.countries,age:[x.adset.targeting.age_min,x.adset.targeting.age_max],locales:x.adset.targeting.locales,platforms:x.adset.targeting.publisher_platforms,advantage:x.adset.targeting.targeting_automation},
    review:x.ad_review_feedback,issues:x.issues_info,
    post_links:x.creative?.effective_object_story_id&&page?await safe(()=>get(`${G}/${x.creative.effective_object_story_id}`,{fields:'call_to_action,attachments{unshimmed_url,url}',access_token:page.access_token}).then(j=>[...new Set(JSON.stringify(j).match(/https?:[^"\\]+/g)||[])].map(decodeURIComponent).filter(u=>/praxenai|instagram\.com\/praxenai/.test(u)))):undefined}))))),
   insights_7d:await safe(()=>get(`${G}/${a.id}/insights`,{level:'ad',date_preset:'last_7d',fields:'ad_name,spend,impressions,reach,clicks,inline_link_clicks,ctr,cpc,actions',limit:50,access_token:tok}).then(j=>j.data)),
   insights_today:await safe(()=>get(`${G}/${a.id}/insights`,{level:'ad',date_preset:'today',fields:'ad_name,spend,impressions,inline_link_clicks,ctr,cpc',limit:50,access_token:tok}).then(j=>j.data)),
  })));
 });
}
console.log(JSON.stringify(out));

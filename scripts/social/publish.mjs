// Publishes due social posts on schedule (GitHub Actions, .github/workflows/social-publish.yml, every 15 minutes).
//
//   node scripts/social/publish.mjs                      publish everything that is due and not yet published
//   node scripts/social/publish.mjs --dry                show what would go out, call nothing
//   node scripts/social/publish.mjs --only w02-faq-routine --channel telegram   one post, one channel, ignoring the schedule
//   node scripts/social/publish.mjs --only 01-intro --channel facebook --replace  delete the earlier Facebook post and send it again
//
// Sources: the batches in BATCHES (dates and times are Tbilisi time), captions from content/social/out/<batch>/<post>/captions.md,
//   images from the public repository: raw.githubusercontent.com/…/content/social/out/<batch>/<post>/ru-N.jpg (nothing is copied to the site).
// State: content/social/published.json on the branch "social-state" (the workflow checks it out and pushes it back), so a post
// never goes out twice. A channel without its secrets is skipped silently; an error in one channel does not stop the others.
//
// Secrets (environment): META_TOKEN — a never-expiring system user token of the business portfolio with the page and
// Instagram assigned; the page token, page id and Instagram id are looked up from it (or set META_PAGE_TOKEN, META_PAGE_ID,
// META_IG_USER_ID directly);
// THREADS_TOKEN — Threads (long-lived, 60 days; the user id is looked up from it, or set THREADS_USER_ID); TELEGRAM_SOCIAL_BOT_TOKEN, TELEGRAM_CHANNEL — Telegram channel (@name or -100… id).
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
// Images are served from the public repository (raw GitHub), not from the site: nothing extra is deployed to praxenai.ge.
const SITE='https://raw.githubusercontent.com/oksana15476-design/georgi/main/content/social/out';
const G='https://graph.facebook.com/v21.0',T='https://graph.threads.net/v1.0';
// Which batches go out automatically and to which channels; the stories batch goes to Instagram and Facebook page stories.
export const BATCHES=[
 // From 28 October the workshop memes w03–w09 and the industry posts 08–13 are replaced by cases-2026-11 (owner: every post was about the same thing).
 {file:'workshop-2026-11.json',channels:['facebook','instagram','threads','telegram'],only:['w01-announce','w01b-agenda','w02-faq-routine']},
 {file:'2026-10.json',channels:['facebook','instagram','threads','telegram'],only:['01-intro']},
 {file:'cases-2026-11.json',channels:['facebook','instagram','threads','telegram']},
 {file:'stories-2026-11.json',channels:['instagram_story','facebook_story']},
 // Content plan of 27 October (docs/SMM-PLAN-2026-11.md): feed posts between the workshop posts, and Telegram's own texts and polls.
 {file:'feed-2026-11.json',channels:['facebook','instagram']},
 {file:'telegram-2026-11.json',channels:['telegram']},
 {file:'stories-2026-11b.json',channels:['instagram_story','facebook_story']},
 // Text-only threads (live voice between plan posts): content/social/threads-2026-11.json, captions written by hand.
 {file:'threads-2026-11.json',channels:['threads']},
];
const args=process.argv.slice(2),flag=k=>args.includes(k),opt=k=>{const i=args.indexOf(k);return i>=0?args[i+1]:''};
const DRY=flag('--dry'),ONLY=opt('--only'),ONLY_CH=opt('--channel'),REPLACE=flag('--replace');
const statePath=process.env.SOCIAL_STATE||join(root,'content/social/published.json');
const state=existsSync(statePath)?JSON.parse(readFileSync(statePath,'utf8')):{};
const env=process.env;

/** Sections of captions.md: "## facebook · …" → {facebook: text}; the Threads thread is split on "---". */
function captions(batch,id){
 const p=join(root,'content/social/out',batch,id,'captions.md');
 if(!existsSync(p))return {};
 const out={};let key='';
 for(const line of readFileSync(p,'utf8').split('\n')){
  if(line.startsWith('## ')){key=line.slice(3).split(/[ ·:]/)[0];if(out[key]!==undefined)key='_'+key;out[key]='';continue;}
  if(key)out[key]+=line+'\n';
 }
 for(const k of Object.keys(out))out[k]=out[k].trim();
 // Thread posts go out without the "1/4" numbering (owner, 26 October).
 if(out.threads)out.threadParts=out.threads.split(/\n+---\n+/).map(s=>s.trim().replace(/^\d+\/\d+\s+/,'')).filter(Boolean);
 return out;
}
const images=(batch,post)=>post.slides.map((_,i)=>`${SITE}/${batch.replace(/\.json$/,'')}/${post.id}/ru-${i+1}.jpg`);
// Facebook: the cover alone, without "1/3" and "Swipe" (render.mjs makes ru-fb.jpg for every carousel).
const fbImage=(batch,post)=>post.slides.length?`${SITE}/${batch.replace(/\.json$/,'')}/${post.id}/${post.slides.length>1?'ru-fb':'ru-1'}.jpg`:'';
const at=post=>Date.parse(`${post.date}T${post.time||'11:00'}:00+04:00`);
const due=post=>at(post)<=Date.now();
// A post more than two days late is not sent on schedule (a channel that comes back after a pause must not dump the backlog);
// it can still be sent by hand with --only.
const stale=post=>Date.now()-at(post)>2*864e5;

async function call(url,params,method='POST'){
 const q=method==='GET'||method==='DELETE';
 const r=await fetch(q?url+'?'+new URLSearchParams(params):url,q?{method}:{method,headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(params)});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||j.error||j.ok===false)throw new Error(`${new URL(url).host}${new URL(url).pathname} ${r.status}: ${JSON.stringify(j.error||j.description||j).slice(0,300)}`);
 return j;
}
const wait=ms=>new Promise(r=>setTimeout(r,ms));
// Instagram and Threads build media in the background; publishing before it is ready fails.
async function ready(base,id,token,field='status_code'){
 for(let i=0;i<30;i++){const j=await call(`${base}/${id}`,{fields:field,access_token:token},'GET');if(['FINISHED','PUBLISHED'].includes(j[field]))return;if(j[field]==='ERROR')throw new Error('media '+id+' failed');await wait(4000);}
 throw new Error('media '+id+' not ready');
}

// Facebook page and Instagram ids and the page token from one system user token (pages_show_list, pages_manage_posts,
// instagram_basic, instagram_content_publish, business_management).
async function metaSetup(){
 if(env.META_PAGE_TOKEN&&env.META_PAGE_ID)return;
 if(!env.META_TOKEN)return;
 const pages=(await call(`${G}/me/accounts`,{fields:'id,name,access_token,instagram_business_account',access_token:env.META_TOKEN},'GET')).data||[];
 const page=pages.find(p=>/praxen/i.test(p.name))||pages[0];
 if(!page)throw new Error('the Meta token sees no Facebook page');
 env.META_PAGE_ID||=page.id;env.META_PAGE_TOKEN||=page.access_token;env.META_IG_USER_ID||=page.instagram_business_account?.id||'';
 // The list may leave the Instagram account out; ask the page itself.
 if(!env.META_IG_USER_ID){const p=await call(`${G}/${env.META_PAGE_ID}`,{fields:'instagram_business_account,connected_instagram_account',access_token:env.META_PAGE_TOKEN},'GET');env.META_IG_USER_ID=p.instagram_business_account?.id||p.connected_instagram_account?.id||'';}
 if(DRY)log.push('meta permissions: '+((await call(`${G}/me/permissions`,{access_token:env.META_TOKEN},'GET').catch(()=>({}))).data||[]).filter(x=>x.status==='granted').map(x=>x.permission).join(', '));
}
const send={
 async facebook(imgs,c){
  if(!env.META_PAGE_TOKEN||!env.META_PAGE_ID)return 'skip';
  // Facebook crops several photos into a grid and the carousel cards get cut: the feed gets one cover, the story is in the text.
  const r=await call(`${G}/${env.META_PAGE_ID}/photos`,{url:c.fbImage||imgs[0],message:c.facebook||c.instagram||'',access_token:env.META_PAGE_TOKEN});
  return r.post_id||r.id;
 },
 async instagram(imgs,c){
  if(!env.META_PAGE_TOKEN||!env.META_IG_USER_ID)return 'skip';
  const tok=env.META_PAGE_TOKEN,u=env.META_IG_USER_ID;
  let creation;
  if(imgs.length===1)creation=(await call(`${G}/${u}/media`,{image_url:imgs[0],caption:c.instagram||'',access_token:tok})).id;
  else{const kids=[];for(const url of imgs.slice(0,10))kids.push((await call(`${G}/${u}/media`,{image_url:url,is_carousel_item:'true',access_token:tok})).id);
   for(const k of kids)await ready(G,k,tok);
   creation=(await call(`${G}/${u}/media`,{media_type:'CAROUSEL',children:kids.join(','),caption:c.instagram||'',access_token:tok})).id;}
  await ready(G,creation,tok);
  return (await call(`${G}/${u}/media_publish`,{creation_id:creation,access_token:tok})).id;
 },
 async instagram_story(imgs){
  if(!env.META_PAGE_TOKEN||!env.META_IG_USER_ID)return 'skip';
  const tok=env.META_PAGE_TOKEN,u=env.META_IG_USER_ID,ids=[];
  for(const url of imgs){const id=(await call(`${G}/${u}/media`,{image_url:url,media_type:'STORIES',access_token:tok})).id;await ready(G,id,tok);ids.push((await call(`${G}/${u}/media_publish`,{creation_id:id,access_token:tok})).id);}
  return ids.join(',');
 },
 // Facebook page story: the picture is uploaded unpublished, then posted as a story (pages_manage_posts).
 async facebook_story(imgs){
  if(!env.META_PAGE_TOKEN||!env.META_PAGE_ID)return 'skip';
  const ids=[];
  for(const url of imgs){const photo=(await call(`${G}/${env.META_PAGE_ID}/photos`,{url,published:'false',access_token:env.META_PAGE_TOKEN})).id;
   ids.push((await call(`${G}/${env.META_PAGE_ID}/photo_stories`,{photo_id:photo,access_token:env.META_PAGE_TOKEN})).post_id||photo);}
  return ids.join(',');
 },
 async threads(imgs,c){
  if(!env.THREADS_TOKEN||!env.THREADS_USER_ID)return 'skip';
  const tok=env.THREADS_TOKEN,u=env.THREADS_USER_ID,parts=c.threadParts||[c.threads||''];
  const kids=[];for(const url of imgs.slice(0,10))kids.push((await call(`${T}/${u}/threads`,{media_type:'IMAGE',image_url:url,is_carousel_item:'true',access_token:tok})).id);
  for(const k of kids)await ready(T,k,tok,'status');
  // A post without slides (threads-only batch) starts the thread with plain text.
  let id=(await call(`${T}/${u}/threads`,kids.length?{media_type:'CAROUSEL',children:kids.join(','),text:parts[0],access_token:tok}:{media_type:'TEXT',text:parts[0],access_token:tok})).id;
  await ready(T,id,tok,'status');
  let prev=(await call(`${T}/${u}/threads_publish`,{creation_id:id,access_token:tok})).id;const first=prev;
  // The first post is already out: a failed reply must not make the next run post the whole thread again (28 October,
  // "Invalid Link Attachment" on the link reply gave a duplicate). One retry after a pause, then the rest is reported and skipped.
  for(const text of parts.slice(1)){
   let done=false;
   for(let attempt=0;attempt<2&&!done;attempt++){
    try{
     if(attempt)await wait(15000);
     id=(await call(`${T}/${u}/threads`,{media_type:'TEXT',text,reply_to_id:prev,access_token:tok})).id;
     await ready(T,id,tok,'status');prev=(await call(`${T}/${u}/threads_publish`,{creation_id:id,access_token:tok})).id;done=true;
    }catch(e){if(attempt)console.log('ERROR threads reply after '+first+': '+String(e.message||e).replace(/access_token=[^&\s]+/g,'access_token=…'));}
   }
   if(!done)break;
  }
  return first;
 },
 async telegram(imgs,c){
  if(!env.TELEGRAM_SOCIAL_BOT_TOKEN||!env.TELEGRAM_CHANNEL)return 'skip';
  const api=`https://api.telegram.org/bot${env.TELEGRAM_SOCIAL_BOT_TOKEN}`,chat=env.TELEGRAM_CHANNEL;
  // One message (owner, 26 October): the Facebook cover with the text. Links show as praxenai.ge/… and keep the tracking.
  const esc=t=>t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const html=esc(c.telegram||'').replace(/https?:\/\/[^\s<]+/g,u=>{const x=new URL(u.replace(/&amp;/g,'&'));return `<a href="${esc(x.href)}">${esc(x.host+x.pathname.replace(/\/$/,''))}</a>`;});
  // A post with "poll" goes out as a native Telegram poll (anonymous, one answer).
  if(c.poll)return String((await call(`${api}/sendPoll`,{chat_id:chat,question:c.poll.question,options:JSON.stringify(c.poll.options.map(text=>({text}))),is_anonymous:'true'})).result.message_id);
  const img=c.fbImage||imgs[0];
  // A text-only post (no slides) goes as a plain message; Telegram shows the preview of its first link.
  // A photo caption holds 1 024 characters; a longer text goes as a message with the picture as a large preview above it.
  const r=!img?await call(`${api}/sendMessage`,{chat_id:chat,text:html,parse_mode:'HTML'})
   :html.replace(/<[^>]+>/g,'').length<=1024
   ?await call(`${api}/sendPhoto`,{chat_id:chat,photo:img,caption:html,parse_mode:'HTML'})
   :await call(`${api}/sendMessage`,{chat_id:chat,text:html,parse_mode:'HTML',link_preview_options:JSON.stringify({url:img,prefer_large_media:true,show_above_text:true})});
  return String(r.result.message_id);
 },
};

const log=[];
// Threads: the user id is looked up from the token when THREADS_USER_ID is not set.
if(env.THREADS_TOKEN&&!env.THREADS_USER_ID){try{env.THREADS_USER_ID=(await call(`${T}/me`,{fields:'id,username',access_token:env.THREADS_TOKEN},'GET')).id||''}catch(e){log.push('ERROR threads setup: '+String(e.message||e).replace(/access_token=[^&\s]+/g,'access_token=…'))}}
try{await metaSetup()}catch(e){log.push('ERROR meta setup: '+String(e.message||e).replace(/access_token=[^&\s]+/g,'access_token=…'))}
// Dry run: can the Meta system user token also reach Threads (graph.threads.net)?
if(DRY&&!env.THREADS_TOKEN&&env.META_TOKEN)log.push('threads via META_TOKEN: '+await call(`${T}/me`,{fields:'id,username',access_token:env.META_TOKEN},'GET').then(j=>JSON.stringify(j)).catch(e=>String(e.message||e).replace(/access_token=[^&\s]+/g,'access_token=…').slice(0,200)));
if(DRY)log.push(`meta: page ${env.META_PAGE_ID||'none'}, instagram ${env.META_IG_USER_ID||'none'}; threads ${env.THREADS_TOKEN?'set':'none'}; telegram ${env.TELEGRAM_SOCIAL_BOT_TOKEN?'set':'none'}`);
for(const b of BATCHES){
 const batch=JSON.parse(readFileSync(join(root,'content/social',b.file),'utf8')),name=b.file.replace(/\.json$/,'');
 for(const post of batch.posts){
  if(b.only&&!b.only.includes(post.id))continue;
  if(ONLY?post.id!==ONLY:!due(post)||stale(post))continue;
  const c={...captions(name,post.id),fbImage:fbImage(name,post),poll:post.poll},imgs=images(name,post);
  for(const ch of b.channels){
   if(ONLY_CH&&ch!==ONLY_CH)continue;
   // A post can leave out channels of its batch: "skip":["telegram"] (memes and tools stay off the Telegram channel, which has its own plan).
   if((post.skip||[]).includes(ch))continue;
   const key=`${name}/${post.id}/${ch}`;
   if(state[key]&&!ONLY)continue;
   // --replace (with --only): remove the earlier Facebook post first, then send the new one.
   // --replace for Telegram: delete the earlier message(s); posts from before 26 October were an album plus a text (ids id-n … id).
   if(REPLACE&&ONLY&&ch==='telegram'&&state[key]&&!DRY){const last=Number(state[key].id),ids=state[key].ids||(state[key].at<'2026-10-26T07:20'?Array.from({length:Math.min(imgs.length,10)+1},(_,k)=>last-k):[last]);
    try{await call(`https://api.telegram.org/bot${env.TELEGRAM_SOCIAL_BOT_TOKEN}/deleteMessages`,{chat_id:env.TELEGRAM_CHANNEL,message_ids:JSON.stringify(ids)});log.push(`deleted ${key} ${ids.join(',')}`);}catch(e){log.push(`ERROR delete ${key}: ${String(e.message||e).replace(/bot\d+:[\w-]+/g,'bot…')}`);continue;}}
   if(REPLACE&&ONLY&&ch==='facebook'&&state[key]&&!DRY){try{await call(`${G}/${state[key].id}`,{access_token:env.META_PAGE_TOKEN},'DELETE');log.push(`deleted ${key} ${state[key].id}`);}catch(e){log.push(`ERROR delete ${key}: ${String(e.message||e).replace(/access_token=[^&\s]+/g,'access_token=…')}`);continue;}}
   if(DRY){log.push(`would publish ${key} (${imgs.length} images)`);continue;}
   try{const id=await send[ch](imgs,c);if(id==='skip'){log.push(`skip ${key}: no secrets`);continue;}
    state[key]={id,at:new Date().toISOString()};log.push(`published ${key} → ${id}`);}
   catch(e){log.push(`ERROR ${key}: ${String(e.message||e).replace(/bot\d+:[\w-]+/g,'bot…').replace(/access_token=[^&\s]+/g,'access_token=…')}`);}
  }
 }
}
if(!DRY)writeFileSync(statePath,JSON.stringify(state,null,1)+'\n');
console.log(log.join('\n')||'nothing due');
if(log.some(l=>l.startsWith('ERROR')))process.exitCode=1;

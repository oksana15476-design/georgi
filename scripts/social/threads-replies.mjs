// Replies in other people's Threads (owner, 27 October: "писать в чужих ветках будешь сам").
// Run by hand through .github/workflows/threads-replies.yml; uses THREADS_TOKEN (needs threads_keyword_search and threads_manage_replies).
//   check                          who the token is and whether keyword search and replies are allowed (nothing secret printed)
//   search "<q1>|<q2>|…" [days]    recent posts for the queries, as JSON on stdout (the workflow encrypts it: the repository is public)
//   reply <base64 JSON>            [{"to":"<post id>","text":"…"}, …]: posts each reply unless we already replied to that post
const T='https://graph.threads.net/v1.0',tok=process.env.THREADS_TOKEN;
const hide=s=>String(s).replace(/access_token=[^&\s"]+/g,'access_token=…');
async function api(path,params={},method='GET'){
 const q=new URLSearchParams({...params,access_token:tok});
 const r=await fetch(T+path+(method==='GET'?'?'+q:''),method==='GET'?{}:{method,body:q});
 const j=await r.json().catch(()=>({}));
 if(!r.ok||j.error)throw new Error(hide(path+' '+JSON.stringify(j.error||j).slice(0,400)));
 return j;
}
const [cmd,a1,a2]=process.argv.slice(2);
if(!tok){console.log('THREADS_TOKEN is not set');process.exit(1);}
const me=await api('/me',{fields:'id,username'});
if(cmd==='check'){
 console.log('account',me.username);
 for(const [name,fn] of [
  ['keyword_search',()=>api('/keyword_search',{q:'ИИ',search_type:'RECENT',fields:'id,username',limit:'5'})],
  ['own replies',()=>api(`/${me.id}/replies`,{fields:'id',limit:'1'})],
 ]){try{const j=await fn();const n=(j.data||[]).length,others=(j.data||[]).filter(x=>x.username&&x.username!==me.username).length;console.log(name,'ok',n,'results',name==='keyword_search'?`(${others} from other accounts)`:'');}catch(e){console.log(name,'ERROR',e.message);}}
}else if(cmd==='search'){
 const since=Date.now()-(Number(a2)||2)*864e5,out=[],seen=new Set();
 for(const q of a1.split('|').map(s=>s.trim()).filter(Boolean)){
  try{
   const j=await api('/keyword_search',{q,search_type:'RECENT',fields:'id,text,username,permalink,timestamp,is_reply,has_replies',limit:'25'});
   for(const p of j.data||[]){if(seen.has(p.id)||p.username===me.username||Date.parse(p.timestamp)<since)continue;seen.add(p.id);out.push({q,...p});}
  }catch(e){out.push({q,error:e.message});}
 }
 console.log(JSON.stringify(out));
}else if(cmd==='reply'){
 const list=JSON.parse(Buffer.from(a1,'base64').toString('utf8'));
 const done=new Set(((await api(`/${me.id}/replies`,{fields:'id,replied_to',limit:'100'})).data||[]).map(x=>x.replied_to?.id).filter(Boolean));
 for(const r of list){
  if(done.has(r.to)){console.log('skip',r.to,'already replied');continue;}
  if(!r.text||r.text.length>500){console.log('skip',r.to,'text empty or over 500');continue;}
  try{
   const c=(await api(`/${me.id}/threads`,{media_type:'TEXT',text:r.text,reply_to_id:r.to},'POST')).id;
   await new Promise(s=>setTimeout(s,3000));
   const id=(await api(`/${me.id}/threads_publish`,{creation_id:c},'POST')).id;
   console.log('replied',r.to,'→',id);
  }catch(e){console.log('ERROR',r.to,e.message);process.exitCode=1;}
 }
}else{console.log('Use: check | search "<q>|<q>" [days] | reply <base64 json>');process.exit(1);}

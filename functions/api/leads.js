// Cloudflare Pages Function for the lead form (POST /api/leads). Same checks as the Docker
// server (server/index.mjs): same-origin request, body size, honeypot, a per-IP limit and a
// global limit. The limits live in this isolate's memory, so they are best effort; add a
// Cloudflare rate limiting rule for /api/leads for a hard limit.
import {MAX_BODY,deliverLead,parseLead} from '../../lib/lead-delivery.mjs';

const hits=new Map(),recent=[];
function limited(ip,now){
 const list=(hits.get(ip)||[]).filter(t=>now-t<600000);
 if(list.length>=5){hits.set(ip,list);return true}
 list.push(now);hits.set(ip,list);
 if(hits.size>5000)for(const [k,v] of hits)if(now-v[v.length-1]>600000)hits.delete(k);
 return false;
}
function globallyLimited(now){
 while(recent.length&&now-recent[0]>60000)recent.shift();
 if(recent.length>=30)return true;
 recent.push(now);return false;
}
const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});

export async function onRequestPost({request,env}){
 if(request.headers.get('origin')!==new URL(request.url).origin)return json({error:'origin'},403);
 if(Number(request.headers.get('content-length')||0)>MAX_BODY)return json({error:'size'},413);
 const now=Date.now(),ip=request.headers.get('cf-connecting-ip')||'';
 if(limited(ip,now)||globallyLimited(now))return json({error:'rate'},429);
 const raw=await request.text();
 if(raw.length>MAX_BODY)return json({error:'size'},413);
 const {lead,error}=parseLead(raw);
 if(!lead)return json({error},400);
 const result=await deliverLead(lead,env);
 if(result.errors.length)console.error('lead delivery errors:',result.errors.join('; '));
 if(result.status==='ok')return json({ok:true});
 return json({error:result.status==='unavailable'?'unavailable':'delivery'},result.status==='unavailable'?503:502);
}

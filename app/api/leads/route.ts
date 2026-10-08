import {env} from 'cloudflare:workers';
import {MAX_BODY,deliverLead,parseLead} from '@/lib/lead-delivery.mjs';

// Cloudflare Workers entry for the lead form; the Docker build uses server/index.mjs instead.
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>MAX_BODY)return Response.json({error:'size'},{status:413});
 const raw=await request.text();
 if(raw.length>MAX_BODY)return Response.json({error:'size'},{status:413});
 const {lead,error}=parseLead(raw);
 if(!lead)return Response.json({error},{status:400});
 // Full page address, so the lead shows which site (praxenai.ge or praxenai.com) it came from.
 if(lead.page.startsWith('/'))lead.page=new URL(request.url).origin+lead.page;
 const result=await deliverLead(lead,env as unknown as Record<string,string|undefined>);
 if(result.status==='ok')return Response.json({ok:true});
 // Channel errors (e.g. "telegram 400") go to the Workers log and the response; they never contain secrets.
 if(result.errors.length)console.error('lead delivery failed',result.errors);
 return Response.json({error:result.status==='unavailable'?'unavailable':'delivery',channels:result.errors},{status:result.status==='unavailable'?503:502});
}

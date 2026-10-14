import {env} from 'cloudflare:workers';
import {MAX_BODY,deliverLead} from '@/lib/lead-delivery.mjs';
import {parseOrder} from '@/lib/webinar-offer-order.mjs';

// Orders from the offer page after the workshop (lib/webinar-offer-order.mjs). The amount is computed on the server.
// Online payment is not connected yet, so the order reaches the team like a lead; the Docker build uses server/index.mjs.
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>MAX_BODY)return Response.json({error:'size'},{status:413});
 const raw=await request.text();
 if(raw.length>MAX_BODY)return Response.json({error:'size'},{status:413});
 const {lead,amount,error}=parseOrder(raw,Date.now());
 if(!lead)return Response.json({error},{status:400});
 if(lead.page.startsWith('/'))lead.page=new URL(request.url).origin+lead.page;
 const result=await deliverLead(lead,env as unknown as Record<string,string|undefined>);
 if(result.status==='ok')return Response.json({ok:true,amount,payment:'manual'});
 if(result.errors.length)console.error('order delivery failed',result.errors);
 return Response.json({error:result.status==='unavailable'?'unavailable':'delivery'},{status:result.status==='unavailable'?503:502});
}

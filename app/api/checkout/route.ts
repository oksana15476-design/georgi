import {env} from 'cloudflare:workers';
import {MAX_BODY} from '@/lib/lead-delivery.mjs';
import {createCheckout} from '@/lib/checkout-handlers.mjs';

// Orders from the workshop offer page (lib/checkout-handlers.mjs). The amount is computed on the server; with Flitt keys
// (FLITT_MERCHANT_ID, FLITT_SECRET_KEY) the buyer is sent to the bank's payment page. The Docker build uses server/index.mjs.
export async function POST(request:Request){
 const origin=new URL(request.url).origin;
 if(request.headers.get('origin')!==origin)return Response.json({error:'origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>MAX_BODY)return Response.json({error:'size'},{status:413});
 const raw=await request.text();
 if(raw.length>MAX_BODY)return Response.json({error:'size'},{status:413});
 const {status,body}=await createCheckout(raw,origin,env as unknown as Record<string,string|undefined>,Date.now());
 return Response.json(body,{status});
}

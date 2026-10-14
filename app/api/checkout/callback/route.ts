import {env} from 'cloudflare:workers';
import {MAX_BODY} from '@/lib/lead-delivery.mjs';
import {checkoutCallback} from '@/lib/checkout-handlers.mjs';

// Flitt's server-to-server payment notice; only a correctly signed notice marks an order as paid.
export async function POST(request:Request){
 const raw=(await request.text()).slice(0,MAX_BODY*4);
 const {status,text}=await checkoutCallback(raw,request.headers.get('content-type')||'',env as unknown as Record<string,string|undefined>);
 return new Response(text,{status});
}

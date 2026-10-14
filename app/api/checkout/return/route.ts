import {env} from 'cloudflare:workers';
import {MAX_BODY} from '@/lib/lead-delivery.mjs';
import {checkoutReturn} from '@/lib/checkout-handlers.mjs';

// Where Flitt sends the buyer back after the payment page: redirect to the offer page with the result.
async function back(request:Request,raw:string,type:string){
 const url=new URL(request.url);
 const to=await checkoutReturn(raw,type,env as unknown as Record<string,string|undefined>);
 return Response.redirect(url.origin+to,303);
}
export async function POST(request:Request){return back(request,(await request.text()).slice(0,MAX_BODY*4),request.headers.get('content-type')||'')}
export async function GET(request:Request){return back(request,new URL(request.url).search.slice(1),'application/x-www-form-urlencoded')}

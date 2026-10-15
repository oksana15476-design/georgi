import {env} from 'cloudflare:workers';
import {getSales} from '@/lib/sales-switch.mjs';

// State of the «open sales» switch for the workshop pages (lib/sales-switch.mjs). Polled by the landing and the offer page.
export async function GET(){
 const state=await getSales(env as unknown as Record<string,string|undefined>);
 return Response.json({state},{headers:{'Cache-Control':'no-store'}});
}

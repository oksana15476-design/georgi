import {env} from 'cloudflare:workers';
import {getSales,salesReason} from '@/lib/sales-switch.mjs';

// State of the «open sales» switch for the workshop pages (lib/sales-switch.mjs). Polled by the landing and the offer page.
export async function GET(){
 const state=await getSales(env as unknown as Record<string,string|undefined>);
 const e=env as unknown as Record<string,string|undefined>;
 // reason and admin help diagnose setup (no secret values): why the state is unknown, and whether the admin key is set.
 return Response.json({state,...(state==='unknown'?{reason:salesReason()}:{}),admin:(e.SALES_ADMIN_KEY||'').length>=16?'ready':'no-key'},{headers:{'Cache-Control':'no-store'}});
}

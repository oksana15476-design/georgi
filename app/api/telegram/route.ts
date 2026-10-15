import {env} from 'cloudflare:workers';
import {telegramUpdate,webhookSecret} from '@/lib/funnel-admin.mjs';

// Webhook of the lead bot: button presses under orders in the team chat (lib/funnel-admin.mjs).
// Connected from the control page; Telegram signs each call with the secret derived from SALES_ADMIN_KEY.
const E=()=>env as unknown as Record<string,string|undefined>;
export async function POST(request:Request){
 const secret=await webhookSecret(E());
 if(!secret||request.headers.get('x-telegram-bot-api-secret-token')!==secret)return new Response('Not found',{status:404});
 const update=await request.json().catch(()=>null);
 try{await telegramUpdate(E(),update)}catch(e){console.error('telegram webhook',e)}
 return new Response('OK');
}

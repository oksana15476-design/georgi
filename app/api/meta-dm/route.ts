import {env} from 'cloudflare:workers';
import {handleWebhook,signatureOk,status} from '@/lib/dm-assistant';

// Webhook for direct messages to Praxen AI on Instagram and the Facebook page (lib/dm-assistant.ts).
// GET: Meta's one-time check when the callback URL is saved in the app (the verify token below is entered there);
// ?check=<verify token> shows which settings are in place, without their values.
// POST: messages; each call is signed with the app secret, unsigned calls are refused.
const E=()=>env as unknown as Record<string,string|undefined>;
const VERIFY_TOKEN='praxen-dm-2026';

export async function GET(request:Request){
 const q=new URL(request.url).searchParams;
 if(q.get('hub.mode')==='subscribe'&&q.get('hub.verify_token')===VERIFY_TOKEN)return new Response(q.get('hub.challenge')||'');
 if(q.get('check')===VERIFY_TOKEN)return Response.json(await status(E()));
 return new Response('Not found',{status:404});
}

export async function POST(request:Request){
 const raw=await request.text();
 if(!await signatureOk(E(),raw,request.headers.get('x-hub-signature-256')))return new Response('Not found',{status:404});
 const body=JSON.parse(raw||'{}');
 await handleWebhook(E(),body);
 return new Response('OK');
}

import {llmsText} from '@/lib/llms';

// /llms.txt for the site this Worker is built for (lib/llms.ts). It is generated, not kept in public/:
// Cloudflare serves public/ files before the Worker, so a static file would be the same on both sites.
export const dynamic='force-static';

export function GET(){
 return new Response(llmsText(),{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'public, max-age=3600'}});
}

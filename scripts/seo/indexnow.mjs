// Submits every URL from the live sitemap to IndexNow (Bing, Yandex, Seznam, Naver and others).
// The key file public/<key>.txt must already be deployed. Usage: node scripts/seo/indexnow.mjs
import {readdirSync} from 'node:fs';

const site=(process.env.NEXT_PUBLIC_SITE_URL||'https://praxenai.ge').replace(/\/$/,'');
const key=readdirSync('public').map(f=>f.match(/^([0-9a-f]{32})\.txt$/)?.[1]).find(Boolean);
if(!key)throw new Error('IndexNow key file public/<32 hex>.txt not found');

const keyLive=await fetch(`${site}/${key}.txt`).then(r=>r.ok?r.text():'');
if(keyLive.trim()!==key)throw new Error(`Key file is not live at ${site}/${key}.txt yet; deploy first`);

const sitemap=await fetch(`${site}/sitemap.xml`).then(r=>r.text());
const urlList=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if(!urlList.length)throw new Error('No URLs in sitemap');

const res=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},
 body:JSON.stringify({host:new URL(site).host,key,keyLocation:`${site}/${key}.txt`,urlList})});
console.log(`IndexNow: ${urlList.length} URLs -> HTTP ${res.status} ${res.statusText}`,await res.text());

// SEO guard for the live sites (see CLAUDE.md and docs/HANDOFF.md, owner rule 10).
// Run after every deploy: node scripts/qa/live-check.mjs [https://praxenai.ge https://praxenai.com]
// The sitemap lists each address once with reciprocal hreflang; every sitemap URL must answer 200 with a canonical pointing to itself, no noindex, one <title> and an <h1>;
// titles must be unique; robots.txt must not block the site and must list the sitemap; llms.txt must
// answer 200 and an unknown address 404. Exit code 1 when anything fails.
const sites=process.argv.slice(2).length?process.argv.slice(2):['https://praxenai.ge','https://praxenai.com'];
let fail=0;
const bad=(m)=>{fail++;console.log('FAIL '+m)};
const get=async(u)=>{for(let i=0;i<3;i++){try{const r=await fetch(u,{redirect:'manual',headers:{'user-agent':'praxen-live-check'}});return {status:r.status,text:await r.text()}}catch(e){if(i===2)return {status:0,text:String(e)}}}};
const norm=(u)=>u.replace(/\/$/,'');

for(const site of sites){
 const robots=await get(site+'/robots.txt');
 if(robots.status!==200)bad(`${site}/robots.txt answers ${robots.status}`);
 else{
  if(/User-Agent:\s*\*\s*\n(?:[^\n]*\n)*?Disallow:\s*\/\s*(\n|$)/i.test(robots.text))bad(`${site}/robots.txt blocks the whole site`);
  if(!/Sitemap:\s*https?:\/\//i.test(robots.text))bad(`${site}/robots.txt has no Sitemap line`);
 }
 for(const p of ['/llms.txt']){const r=await get(site+p);if(r.status!==200)bad(`${site}${p} answers ${r.status}`)}
 const missing=await get(site+'/no-such-page-'+Date.now());
 if(missing.status!==404)bad(`${site} unknown address answers ${missing.status}, expected 404`);
 const sm=await get(site+'/sitemap.xml');
 const all=[...sm.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 const urls=[...new Set(all)];
 if(sm.status!==200||!urls.length){bad(`${site}/sitemap.xml answers ${sm.status} with ${urls.length} URLs`);continue}
 // Each address once; hreflang alternates stay inside the sitemap and point back to each other.
 if(all.length!==urls.length)bad(`${site}/sitemap.xml lists ${all.length-urls.length} addresses more than once`);
 const entries=[...sm.text.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(m=>({loc:m[1].match(/<loc>([^<]+)/)?.[1],alts:[...m[1].matchAll(/hreflang="[^"]+" href="([^"]+)"/g)].map(x=>x[1])}));
 const byLoc=new Map(entries.map(e=>[e.loc,e]));
 for(const e of entries)for(const u of e.alts){const o=byLoc.get(u);if(!o)bad(`${e.loc}: hreflang points outside the sitemap (${u})`);else if(!o.alts.includes(e.loc))bad(`${e.loc} and ${u}: hreflang is not reciprocal`)}
 const titles=new Map();let i=0;
 const worker=async()=>{while(i<urls.length){const u=urls[i++];const r=await get(u);
  if(r.status!==200){bad(`${u} answers ${r.status}`);continue}
  const h=r.text;
  const canon=h.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i)?.[1]||h.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i)?.[1];
  if(!canon)bad(`${u} has no canonical`);else if(norm(canon)!==norm(u))bad(`${u} canonical points to ${canon}`);
  if(/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(h))bad(`${u} has noindex`);
  const t=h.match(/<title>([^<]*)<\/title>/i)?.[1];
  if(!t)bad(`${u} has no <title>`);else titles.set(t,[...(titles.get(t)||[]),u]);
  if(!/<h1[\s>]/i.test(h))bad(`${u} has no <h1>`);
 }};
 await Promise.all(Array.from({length:6},worker));
 for(const [t,us] of titles)if(us.length>1)bad(`same title on ${us.length} pages: "${t}" (${us.slice(0,3).join(', ')})`);
 console.log(`${site}: ${urls.length} sitemap URLs checked`);
}
console.log(fail?`${fail} problems`:'all checks passed');
process.exit(fail?1:0);

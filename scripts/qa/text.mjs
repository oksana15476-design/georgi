// QA helper (see docs/HANDOFF.md).
const {chromium}=await import('/opt/node-tools/node_modules/playwright/index.mjs');
import fs from 'node:fs';
const [,,base,root,out]=process.argv;
const sm=fs.readFileSync(root+'/sitemap.xml','utf8');
const paths=[...sm.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
const b=await chromium.launch();const pg=await b.newPage();const res={};
for(const p of paths){await pg.goto(base+p,{waitUntil:'domcontentloaded'});
 // open every FAQ answer and tab panel text is included via textContent
 res[p]=await pg.evaluate(()=>{const m=document.querySelector('main');m.querySelectorAll('[hidden]').forEach(e=>e.removeAttribute('hidden'));return {title:document.title,desc:document.querySelector('meta[name=description]')?.content||'',text:m.innerText}});}
fs.writeFileSync(out,JSON.stringify(res,null,1));await b.close();console.log(paths.length);

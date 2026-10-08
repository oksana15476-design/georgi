// QA helper (see docs/HANDOFF.md).
const {chromium}=await import('/opt/node-tools/node_modules/playwright/index.mjs');
import fs from 'node:fs';
const [,,site,base,root,out]=process.argv; // site: ge|intl
fs.mkdirSync(out,{recursive:true});
const sm=fs.readFileSync(root+'/sitemap.xml','utf8');
const paths=[...sm.matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map(m=>m[1]||'/');
const b=await chromium.launch();
const rows=[];const links=new Map();
for(const p of paths){
 const r={path:p,errors:[]};
 for(const [w,h] of [[1440,900],[390,844]]){
  const pg=await b.newPage({viewport:{width:w,height:h}});
  pg.on('pageerror',e=>r.errors.push(w+' '+e.message.slice(0,120)));
  pg.on('console',m=>{if(m.type()==='error'&&!/CERT|Failed to load resource/.test(m.text()))r.errors.push(w+' console '+m.text().slice(0,120))});
  await pg.emulateMedia({reducedMotion:'reduce'});
  try{await pg.goto(base+p,{waitUntil:'networkidle',timeout:30000})}catch(e){r.errors.push('load '+e.message.slice(0,80))}
  await pg.addStyleTag({content:'.cookie{display:none!important}'});
  const ow=await pg.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
  if(ow>0)r.errors.push(w+' overflow '+ow+'px');
  // elements wider than viewport
  if(w===390){
   const wide=await pg.evaluate(()=>[...document.querySelectorAll('main *')].filter(e=>{const b=e.getBoundingClientRect();return b.right>window.innerWidth+1&&getComputedStyle(e).position!=='fixed'&&b.width>0}).slice(0,3).map(e=>e.tagName+'.'+String(e.className).slice(0,40)));
   if(wide.length)r.errors.push('390 wide: '+wide.join(', '));
  }
  if(w===1440){
   Object.assign(r,await pg.evaluate(()=>{
    const q=s=>document.querySelector(s);
    const main=q('main');
    const lds=[...document.querySelectorAll('script[type="application/ld+json"]')];let ldOk=true,types=[];
    for(const s of lds){try{const j=JSON.parse(s.textContent);(j['@graph']||[j]).forEach(g=>types.push(g['@type']))}catch{ldOk=false}}
    return {title:document.title,tlen:document.title.length,desc:(q('meta[name=description]')?.content||''),canon:q('link[rel=canonical]')?.href||'',robots:q('meta[name=robots]')?.content||'',h1:document.querySelectorAll('h1').length,h1t:q('h1')?.innerText.replace(/\s+/g,' ').slice(0,80)||'',words:(main?.innerText||'').split(/\s+/).filter(Boolean).length,ld:ldOk?types.join(','):'INVALID',
     imgNoAlt:[...document.querySelectorAll('img:not([alt])')].length,
     links:[...document.querySelectorAll('a[href]')].map(a=>[a.getAttribute('href'),a.closest('header')?'header':a.closest('footer')?'footer':'main'])};
   }));
   r.dlen=r.desc.length;
   for(const [h,where] of r.links){if(!links.has(h))links.set(h,new Set());links.get(h).add(where)}
   delete r.links;
   // tabs
   const tabs=await pg.$$('[role=tab]');let tabFail=0;
   for(const t of tabs){try{await t.click({timeout:2000});await pg.waitForTimeout(120)}catch{tabFail++}}
   r.tabs=tabs.length+(tabFail?' ('+tabFail+' failed)':'');
   // dropdowns in header
   const drops=await pg.$$('header button[aria-haspopup], header .nav-item button');let menuLinks=0;
   for(const d of drops){try{await d.click({timeout:2000});await pg.waitForTimeout(250);menuLinks+=await pg.evaluate(()=>[...document.querySelectorAll('header a[href]')].length);await d.click({timeout:2000})}catch{}}
   const ml=await pg.evaluate(()=>[...document.querySelectorAll('header a[href]')].map(a=>a.getAttribute('href')));
   r.drops=drops.length;
   await pg.screenshot({path:out+'/'+(p.replace(/\W+/g,'_')||'home')+'_d.png'});
  }else{
   // burger and accordion
   const burger=await pg.$('header .burger');
   if(burger){await burger.click();await pg.waitForTimeout(300);
    const acc=await pg.$$('header .mobile-menu button[aria-expanded]');for(const a of acc){try{await a.click({timeout:1500});await pg.waitForTimeout(150)}catch{}}
    const mob=await pg.evaluate(()=>[...document.querySelectorAll('header .mobile-menu a[href]')].map(a=>a.getAttribute('href')));
    for(const h of mob){if(!links.has(h))links.set(h,new Set());links.get(h).add('mobile-menu')}
    r.mobileLinks=mob.length;await burger.click()}
   await pg.screenshot({path:out+'/'+(p.replace(/\W+/g,'_')||'home')+'_m.png'});
  }
  await pg.close();
 }
 rows.push(r);process.stdout.write('.');
}
// link check
const bad=[];
for(const [h,where] of links){
 if(/^(mailto:|tel:|https?:\/\/(wa\.me|cal\.com|t\.me))/.test(h))continue;
 if(h.startsWith('#'))continue;
 let u=h.startsWith('http')?h:base+h;
 if(h.startsWith('http')&&!/praxenai/.test(h))continue;
 u=u.replace(/https:\/\/praxenai\.(ge|com)/,base);
 const res=await fetch(u.split('#')[0]).catch(()=>({status:0}));
 if(res.status!==200)bad.push(res.status+' '+h+' ['+[...where].join(',')+']');
}
await b.close();
fs.writeFileSync(out+'/report.json',JSON.stringify({rows,bad,linkCount:links.size},null,1));
console.log('\npages',rows.length,'links',links.size,'broken',bad.length);

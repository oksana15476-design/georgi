// QA helper (see docs/HANDOFF.md).
import {createRequire} from 'module';
const require=createRequire('/usr/lib/node_modules/');
let pw;try{pw=require('playwright')}catch{pw=await import('/opt/node-tools/node_modules/playwright/index.mjs')}
const {chromium}=pw;
const [,,out,...pages]=process.argv;
const b=await chromium.launch();
const errs=[];
for(const spec of pages){
 const [path,w]=spec.split('@');const width=+(w||1440);
 const p=await b.newPage({viewport:{width,height:900}});
 p.on('pageerror',e=>errs.push(path+': '+e.message));
 p.on('console',m=>{if(m.type()==='error')errs.push(path+' console: '+m.text())});
 await p.emulateMedia({reducedMotion:'reduce'});
 await p.goto((process.env.BASE||'http://127.0.0.1:4173')+path,{waitUntil:'load'});
 await p.waitForTimeout(1200);
 const name=path.replace(/\W+/g,'_')+'_'+width+'.png';
 const H=await p.evaluate(()=>document.documentElement.scrollHeight);
 const step=width<600?1400:1000;
 for(let y=0,i=0;y<H;y+=step,i++){await p.screenshot({path:out+'/'+name.replace('.png','_'+String(i).padStart(2,'0')+'.png'),fullPage:true,clip:{x:0,y,width,height:Math.min(step,H-y)}})}
 const ow=await p.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
 if(ow>0)errs.push(path+'@'+width+' horizontal overflow '+ow+'px');
 console.log(name);
 await p.close();
}
await b.close();
console.log(errs.join('\n')||'no errors');

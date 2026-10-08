// QA helper (see docs/HANDOFF.md).
const {chromium}=await import('/opt/node-tools/node_modules/playwright/index.mjs');
// usage: node el.mjs outdir base path@width "label1,label2"
const [,,out,base,spec,labels]=process.argv;const [path,w]=spec.split('@');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:+(w||1440),height:900}});
await p.emulateMedia({reducedMotion:'reduce'});
await p.goto(base+path,{waitUntil:'load'});await p.waitForTimeout(1000);
await p.evaluate(()=>{document.querySelectorAll('.cookie,[class*=cookie],[class*=consent]').forEach(e=>e.remove())});
for(const l of labels.split(',')){const el=p.locator(`[data-screen-label="${l}"]`).first();
 if(await el.count()){await el.scrollIntoViewIfNeeded();await p.waitForTimeout(300);await el.screenshot({path:`${out}/${(path.replace(/\W+/g,'_')||'home')}_${l.replace(/\W+/g,'_')}_${w}.png`})}else console.log('missing',l)}
await b.close();

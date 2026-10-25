// Copies the images of the auto-published batches into public/social/ so Meta, Threads and Telegram can fetch them
// from https://praxenai.ge/social/<batch>/<post>/ru-N.jpg. Run after rendering a batch, then commit and deploy.
//   node scripts/social/stage-public.mjs
import {readFileSync,mkdirSync,copyFileSync,existsSync,rmSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
// Same list as in publish.mjs (kept here without importing it: publish.mjs runs on import).
const BATCHES=[{file:'workshop-2026-11.json'},{file:'2026-10.json',only:['01-intro','05-process','08-real-estate','09-restaurants','10-quiz','11-wholesale','12-audit-prep','13-training']},{file:'stories-2026-11.json'}];
rmSync(join(root,'public/social'),{recursive:true,force:true});
let n=0;
for(const b of BATCHES){
 const name=b.file.replace(/\.json$/,''),batch=JSON.parse(readFileSync(join(root,'content/social',b.file),'utf8'));
 for(const post of batch.posts){
  if(b.only&&!b.only.includes(post.id))continue;
  const dir=join(root,'public/social',name,post.id);mkdirSync(dir,{recursive:true});
  post.slides.forEach((_,i)=>{const src=join(root,'content/social/out',name,post.id,`ru-${i+1}.jpg`);
   if(!existsSync(src))throw new Error('missing '+src);copyFileSync(src,join(dir,`ru-${i+1}.jpg`));n++;});
 }
}
console.log(`public/social: ${n} images`);

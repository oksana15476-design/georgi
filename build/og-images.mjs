// Share cards (Open Graph, 1200×630 PNG) for blog articles and commercial pages, drawn during `vite build`
// (plan 2.7, 12 November 2026). The page list and texts come from lib/og-cards.ts; the files go to
// public/og/pages/ (ignored by git), so every build, including Cloudflare Workers Builds, draws the cards of the
// articles it contains: a new article gets its card with no manual step. The look follows the "article" template
// of scripts/social/render.mjs (16:9 Telegram format).
//
// Drawing uses satori (layout to SVG) and resvg (SVG to PNG, WebAssembly), the engine of next/og: no browser is
// needed, so it runs anywhere Node runs, and no fonts are fetched from the network. Nothing of it goes into the
// Worker: the site serves the finished PNG files as static assets.
// If drawing fails, the build goes on and pages keep the site-wide picture (lib/og-image.ts).
//
// Check without a full build:  node build/og-images.mjs [out dir]   (NEXT_PUBLIC_MARKET=intl for praxenai.com)
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {mkdirSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {availableParallelism} from 'node:os';
import {Worker,isMainThread,parentPort,workerData} from 'node:worker_threads';

const here=dirname(fileURLToPath(import.meta.url));
const root=resolve(here,'..');
const W=1200,H=630;

// Manrope and Noto Sans Georgian from app/fonts, as static 700 and 800 TTF instances (satori reads no WOFF2 or
// variable fonts). Licence: build/og-fonts/OFL.txt. Each subset gets its own family name: satori keeps one font per
// name and weight and takes a missing glyph from the next family of the list.
const fontFiles=[['Manrope','manrope-latin'],['Manrope Cyrillic','manrope-cyrillic'],['Manrope Ext','manrope-latin-ext'],['Noto Sans Georgian','noto-sans-georgian-georgian']];
const family=fontFiles.map(([name])=>name).join(', ');
const fonts=()=>fontFiles.flatMap(([name,file])=>[700,800].map(weight=>({name,weight,style:'normal',data:readFileSync(join(here,'og-fonts',`${file}-${weight}.ttf`))})));

const ui={
 blog:{ru:'Статья в блоге',en:'Blog article',ka:'ბლოგის სტატია'},
 min:{ru:'мин чтения',en:'min read',ka:'წთ კითხვა'},
};

const dataUri=svg=>'data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
const logoWhite=readFileSync(join(root,'brand/praxen-logo-white.svg'),'utf8');
// On the blue gradient the blue square of the mark disappears: it goes translucent white (as in render.mjs).
const logoOnGrad=logoWhite.replace(/fill="#7b95ff"/g,'fill="#ffffffb3"');
const arrow=color=>dataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`);

// satori takes React-like element objects; no JSX here, so the script runs in plain Node.
const h=(type,style,...children)=>{const c=children.flat().filter(x=>x!==null&&x!==undefined&&x!==false);return {type,props:{style,children:c.length>1?c:c[0]}}};
const img=(src,style)=>({type:'img',props:{src,style,width:style.width,height:style.height}});

// Title size: the largest that fits in 3 lines of the 1056 px column (4 or 5 lines in smaller type for long titles). Widths are estimated
// per script (Georgian and Cyrillic run wider than Latin) and rounded up, so a line never overflows.
function titleSize(title){
 const em=ch=>/[Ⴀ-ჿᲐ-Ჿ]/.test(ch)?.66:/[Ѐ-ӿ]/.test(ch)?.62:/[A-Z0-9£€$₾%]/.test(ch)?.66:/[mwMW]/.test(ch)?.85:/[ .,:;'’!|ilj-]/.test(ch)?.3:.56;
 const words=title.split(/\s+/);
 const lines=fs=>{let n=1,x=0;for(const w of words){const ww=[...w].reduce((s,ch)=>s+em(ch)*fs,0),sp=.28*fs;if(x&&x+sp+ww>1056){n++;x=ww}else x+=(x?sp:0)+ww}return n};
 for(const [max,from,to] of [[3,68,50],[4,54,40],[5,44,34]])for(let fs=from;fs>=to;fs-=2)if(lines(fs)<=max)return fs;
 return 34;
}

export function cardElement(card){
 const article=card.kind==='article',l=card.lang;
 const ink=article; // articles: dark ink as the social article preview; commercial pages: the brand gradient
 const fs=titleSize(card.title);
 const muted=ink?'#c9d1e3':'#e6e9ff';
 return h('div',{width:W,height:H,display:'flex',flexDirection:'column',position:'relative',padding:'52px 72px 48px',color:'#fff',fontFamily:family,
   backgroundColor:ink?'#121a2b':'#2755ec',backgroundImage:ink?'radial-gradient(circle at 100% 0%, #24346b 0%, #121a2b 60%)':'linear-gradient(115deg, #2755ec 0%, #5268f5 48%, #7960e8 100%)'},
  // The logo mark drawn large behind the text (the bar and the square), as in render.mjs.
  h('div',{position:'absolute',left:932,top:-37,width:122,height:315,backgroundColor:ink?'#315bf5':'#ffffff',opacity:ink?.22:.12}),
  h('div',{position:'absolute',left:1090,top:-37,width:158,height:158,backgroundColor:ink?'#7b95ff':'#ffffff',opacity:ink?.22:.12}),
  h('div',{display:'flex',justifyContent:'space-between',alignItems:'center',height:40},
   img(dataUri(ink?logoWhite:logoOnGrad),{width:155,height:38}),
   article?h('div',{display:'flex',alignItems:'center',gap:16,fontSize:18,fontWeight:700,letterSpacing:1,textTransform:'uppercase',color:muted},
    h('div',{display:'flex',border:'2px solid #ffffff59',borderRadius:999,padding:'6px 18px'},ui.blog[l]),
    card.minutes?h('div',{display:'flex',color:'#a9b3c6'},`${card.minutes} ${ui.min[l]}`):null):null),
  h('div',{display:'flex',flexDirection:'column',justifyContent:'center',flexGrow:1,minHeight:0},
   h('div',{display:'flex',alignSelf:'flex-start',backgroundColor:ink?'#ffd166':'#ffffff',color:'#121a2b',borderRadius:999,fontSize:19,fontWeight:800,letterSpacing:1.3,textTransform:'uppercase',padding:'9px 20px',marginBottom:26},card.rubric),
   h('div',{display:'flex',fontSize:fs,fontWeight:800,letterSpacing:-.035*fs,lineHeight:1.06,maxWidth:1056},card.title)),
  h('div',{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'2px solid #ffffff26',paddingTop:22},
   h('div',{display:'flex',fontSize:28,fontWeight:800,letterSpacing:-.3},card.domain),
   h('div',{display:'flex',alignItems:'center',gap:10,backgroundColor:'#ffd166',color:'#121a2b',borderRadius:999,fontSize:22,fontWeight:800,padding:'12px 24px'},
    card.cta,img(arrow('#121a2b'),{width:24,height:24}))));
}

// Hash of the drawing itself: this file, the fonts and the logo. Any change of the look changes every file name,
// so messengers fetch the new cards instead of showing the cached ones.
const template=(()=>{
 const h=createHash('sha1').update(readFileSync(fileURLToPath(import.meta.url))).update(readFileSync(join(root,'brand/praxen-logo-white.svg')));
 for(const [,file] of fontFiles)for(const w of [700,800])h.update(readFileSync(join(here,'og-fonts',`${file}-${w}.ttf`)));
 return h.digest('hex');
})();
// Content hash of a card: changes with its texts (button included) or the drawing.
export const cardHash=card=>createHash('sha1').update(JSON.stringify([template,card])).digest('hex').slice(0,10);

let engine;
async function load(){
 const {default:satori}=await import('satori');
 const resvg=await import('@resvg/resvg-wasm');
 await resvg.initWasm(readFileSync(createRequire(import.meta.url).resolve('@resvg/resvg-wasm/index_bg.wasm')));
 return {satori,Resvg:resvg.Resvg,fonts:fonts()};
}
export async function renderCard(card){
 const {satori,Resvg,fonts}=await (engine??=load());
 const svg=await satori(cardElement(card),{width:W,height:H,fonts});
 const r=new Resvg(svg,{fitTo:{mode:'width',value:W}}),png=r.render(),buf=Buffer.from(png.asPng());
 png.free();r.free();
 return buf;
}

async function drawSome(cards,outDir){
 const drawn={},errors=[];
 for(const card of cards){
  const hash=cardHash(card),file=join(outDir,`${card.key}-${hash}.png`);
  // The folder is made only for a drawn card: a failed one leaves no empty folders behind.
  try{const png=await renderCard(card);mkdirSync(dirname(file),{recursive:true});writeFileSync(file,png);drawn[card.key]=hash}
  catch(e){errors.push(`${card.key}: ${e?.message||e}`)}
 }
 return {drawn,errors};
}

// Draws every card of the market being built into outDir; returns {card key: hash} for the cards that were drawn.
// Up to 4 worker threads share the work (one card takes about 0.3 s, mostly the PNG of the gradient).
export async function drawCards(cards,outDir,log=console.log){
 rmSync(outDir,{recursive:true,force:true});
 const n=Math.max(1,Math.min(4,availableParallelism(),Math.ceil(cards.length/24)));
 const parts=n===1?[await drawSome(cards,outDir)]:await Promise.all(Array.from({length:n},(_,i)=>cards.filter((_,j)=>j%n===i)).map(chunk=>new Promise(done=>{
  const w=new Worker(new URL(import.meta.url),{workerData:{ogCards:chunk,outDir}});
  const fail=e=>done({drawn:{},errors:chunk.map(c=>`${c.key}: ${e?.message||e}`)});
  w.once('message',done);w.once('error',fail);w.once('exit',code=>{if(code)fail(`worker exited with ${code}`)});
 })));
 const drawn=Object.assign({},...parts.map(p=>p.drawn)),errors=parts.flatMap(p=>p.errors);
 for(const e of errors.slice(0,5))log(`[og] ${e}`);
 if(errors.length>5)log(`[og] … and ${errors.length-5} more`);
 return {drawn,failed:cards.length-Object.keys(drawn).length};
}

// Loads lib/og-cards.ts (TypeScript with @/ imports) through Vite's module runner.
export async function loadCards(){
 const {runnerImport}=await import('vite');
 const {module}=await runnerImport(join(root,'lib/og-cards.ts'),{root,configFile:false,logLevel:'error',resolve:{alias:{'@':root}}});
 return module.ogCards();
}

// Vite plugin: draws the cards once per build, before the bundles, and passes the drawn list to the code as
// __PRAXEN_OG__. `vinext build`, `npm run build` and `npm run build:static` all go through it.
export function ogImages(){
 return {
  name:'praxen:og-images',
  apply:'build',
  async config(){
   const market=process.env.NEXT_PUBLIC_MARKET==='intl'?'intl':'ge';
   const memo=globalThis.__praxenOg??={};
   memo[market]??=(async()=>{
    const started=Date.now();
    try{
     const cards=await loadCards();
     const {drawn,failed}=await drawCards(cards,join(root,'public/og/pages'));
     console.log(`[og] ${Object.keys(drawn).length} share cards (${market}) in ${((Date.now()-started)/1000).toFixed(1)} s${failed?`, ${failed} failed (they keep the site picture)`:''}`);
     return drawn;
    }catch(e){
     console.warn(`[og] share cards skipped, pages keep the site picture: ${e?.stack||e}`);
     return {};
    }
   })();
   return {define:{__PRAXEN_OG__:JSON.stringify(await memo[market])}};
  },
 };
}

// CLI: draw the cards of the current market into a folder for a look (default: public/og/pages).
if(isMainThread&&import.meta.url===pathToFileURL(process.argv[1]||'').href){
 const out=resolve(process.argv[2]||join(root,'public/og/pages'));
 const cards=await loadCards();
 const started=Date.now();
 const {drawn,failed}=await drawCards(cards,out);
 console.log(`${Object.keys(drawn).length} cards, ${failed} failed, ${((Date.now()-started)/1000).toFixed(1)} s → ${out}`);
}

// A worker thread of drawCards.
if(!isMainThread&&workerData?.ogCards)parentPort.postMessage(await drawSome(workerData.ogCards,workerData.outDir));

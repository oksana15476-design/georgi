// Renders social post cards (1080×1350, Facebook and Instagram feed) from content/social/*.json.
//
//   node scripts/social/render.mjs content/social/2026-10.json            all posts, all languages
//   node scripts/social/render.mjs content/social/2026-10.json w1-2 ka    one post, one language
//
// Output: content/social/out/<batch>/<post id>/<lang>-<slide>.jpg and captions.md next to them.
// Links in captions carry utm_source=facebook; set UTM_SOURCE=instagram (linkedin, telegram…) for other channels.
// Playwright is taken from the project or from the global install (npm root -g).
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {join,dirname,basename,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const [batchPath,onlyId,onlyLang]=process.argv.slice(2);
if(!batchPath){console.error('Usage: node scripts/social/render.mjs <batch.json> [post id] [ka|ru|en]');process.exit(1);}
const batch=JSON.parse(readFileSync(resolve(batchPath),'utf8'));
const langs=(onlyLang?[onlyLang]:batch.langs||['ka','ru','en']);
// A batch for praxenai.com sets "site" and "contacts"; praxenai.ge batches keep the defaults.
const siteName=batch.site||'praxenai.ge',contactsLine=batch.contacts||'WhatsApp +995 557 125 497 · praxenai.ge';
const outDir=join(root,'content/social/out',basename(batchPath,'.json'));

async function loadPlaywright(){
 try{return await import('playwright');}catch{}
 const globalRoot=execSync('npm root -g').toString().trim();
 return import(pathToFileURL(join(globalRoot,'playwright/index.mjs')).href);
}

const svg=f=>readFileSync(join(root,'brand',f),'utf8');
const logoWhite=svg('praxen-logo-white.svg'), logoDark=svg('praxen-logo.svg');
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
// Text fields are {ka,ru,en} or a plain string shared by all languages. *word* marks the accent colour.
const tr=(v,l)=>v==null?'':typeof v==='string'?v:(v[l]??v.en??'');
// Numbers stay whole (1 900 ₾) and hyphenated words (23:40-ზე, WhatsApp-ში) never split at the hyphen.
const rich=(v,l)=>esc(tr(v,l)).replace(/(\d) (?=\d{3}|₾)/g,'$1\u00a0')
 .replace(/([^\s*]+-[^\s*]+)/g,'<span class="nw">$1</span>')
 .replace(/\*([^*]+)\*/g,'<em>$1</em>').replace(/\n/g,'<br>');

const ui={
 example:{ka:'სცენარის მაგალითი',ru:'Пример сценария',en:'Example scenario'},
 client:{ka:'კლიენტი',ru:'Клиент',en:'Client'},
 bot:{ka:'AI ასისტენტი',ru:'ИИ-ассистент',en:'AI assistant'},
 before:{ka:'ახლა',ru:'Сейчас',en:'Now'},
 after:{ka:'AI-ით',ru:'С ИИ',en:'With AI'},
 swipe:{ka:'გადაფურცლეთ →',ru:'Листайте →',en:'Swipe →'},
};

function slideHtml(s,l,i,n){
 const dark=['cover','number','cta'].includes(s.layout);
 const body={
  cover:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}
   <h1 class="fit">${rich(s.title,l)}</h1>${s.sub?`<p class="sub">${rich(s.sub,l)}</p>`:''}`,
  list:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<h2>${rich(s.title,l)}</h2>
   <ol class="list fit">${(s.items||[]).map((it,k)=>`<li><b>${String(k+1).padStart(2,'0')}</b><span>${rich(it,l)}</span></li>`).join('')}</ol>`,
  number:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<div class="big">${rich(s.value,l)}</div>
   <p class="label fit">${rich(s.label,l)}</p>${s.note?`<p class="note">${rich(s.note,l)}</p>`:''}`,
  dialog:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<h2>${rich(s.title,l)}</h2>
   <div class="chat fit">${(s.messages||[]).map(m=>`<div class="msg ${m.from}"><small>${m.time?esc(m.time)+' · ':''}${esc(tr(ui[m.from==='bot'?'bot':'client'],l))}</small>${rich(m.text,l)}</div>`).join('')}</div>`,
  compare:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<h2>${rich(s.title,l)}</h2>
   <div class="cmp fit"><div><h3>${esc(tr(s.beforeLabel||ui.before,l))}</h3>${(s.before||[]).map(x=>`<p>${rich(x,l)}</p>`).join('')}</div>
   <div class="after"><h3>${esc(tr(s.afterLabel||ui.after,l))}</h3>${(s.after||[]).map(x=>`<p>${rich(x,l)}</p>`).join('')}</div></div>`,
  cta:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<h1 class="fit">${rich(s.title,l)}</h1>
   ${s.sub?`<p class="sub">${rich(s.sub,l)}</p>`:''}<div class="button">${rich(s.button,l)}</div>
   <p class="contacts">${esc(contactsLine)}</p>`,
 }[s.layout];
 if(!body) throw new Error(`Unknown layout "${s.layout}"`);
 return `<section class="slide ${s.layout} ${dark?'dark':'light'}">
  <header><div class="logo">${dark?logoWhite:logoDark}</div>
   <div class="meta">${s.example?`<span class="tag">${esc(tr(ui.example,l))}</span>`:''}${n>1?`<span>${i+1}/${n}</span>`:''}</div></header>
  <main>${body()}</main>
  <footer><span>${esc(siteName)}</span>${n>1&&i<n-1?`<span>${esc(tr(ui.swipe,l))}</span>`:''}</footer></section>`;
}

const css=`
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1350px;font-family:Manrope,'Noto Sans Georgian',sans-serif;-webkit-font-smoothing:antialiased}
.slide{width:1080px;height:1350px;padding:72px 84px 64px;display:flex;flex-direction:column;position:relative;overflow:hidden}
.dark{background:radial-gradient(120% 80% at 100% 0%,#24346b 0%,#121a2b 55%);color:#fff}
.light{background:#f5f7fb;color:#121a2b}
header{display:flex;justify-content:space-between;align-items:center;height:56px}
.logo svg{height:44px;width:auto;display:block}
.meta{display:flex;gap:18px;align-items:center;font-size:24px;font-weight:600;opacity:.75}
.tag{border:2px solid currentColor;border-radius:999px;padding:6px 16px;font-size:20px}
main{flex:1;display:flex;flex-direction:column;justify-content:center;min-height:0}
footer{display:flex;justify-content:space-between;font-size:26px;font-weight:600;opacity:.6}
.nw{white-space:nowrap}
em{font-style:normal;color:#315bf5}.dark em{color:#7b95ff}
.kicker{font-size:28px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#315bf5;margin-bottom:32px}
.dark .kicker{color:#7b95ff}
h1{font-size:96px;line-height:1.04;font-weight:700;letter-spacing:-.035em;overflow:hidden}
h2{font-size:70px;line-height:1.08;font-weight:700;letter-spacing:-.03em;margin-bottom:44px}
.sub{font-size:38px;line-height:1.35;color:#c9d1e3;margin-top:40px;max-width:880px}
.list{list-style:none;display:flex;flex-direction:column;gap:30px;overflow:hidden}
.list li{display:flex;gap:28px;font-size:42px;line-height:1.3;font-weight:500}
.list b{color:#315bf5;font-weight:800;min-width:58px}
.big{font-size:200px;line-height:1;font-weight:800;letter-spacing:-.05em;color:#7b95ff}
.label{font-size:48px;line-height:1.2;font-weight:600;margin-top:36px;overflow:hidden}
.note{font-size:28px;line-height:1.4;color:#a9b3c6;margin-top:36px}
.chat{display:flex;flex-direction:column;gap:22px;overflow:hidden}
.msg{max-width:780px;padding:22px 28px;border-radius:28px;font-size:33px;line-height:1.35;background:#fff;box-shadow:0 8px 24px -16px #121a2b60}
.msg small{display:block;font-size:21px;font-weight:700;opacity:.55;margin-bottom:6px}
.msg.bot{align-self:flex-end;background:#315bf5;color:#fff;border-bottom-right-radius:8px}
.msg.client{border-bottom-left-radius:8px}
.cmp{display:grid;grid-template-columns:1fr 1fr;gap:24px;overflow:hidden}
.cmp>div{background:#fff;border-radius:28px;padding:36px 32px;display:flex;flex-direction:column;gap:22px}
.cmp .after{background:#121a2b;color:#fff}
.cmp h3{font-size:28px;letter-spacing:.06em;text-transform:uppercase;color:#5d6779}
.cmp .after h3{color:#7b95ff}
.cmp p{font-size:36px;line-height:1.3;font-weight:500}
.button{align-self:flex-start;margin-top:56px;background:#315bf5;color:#fff;font-size:38px;font-weight:700;padding:28px 44px;border-radius:18px}
.button em{color:#fff}
.contacts{font-size:28px;color:#a9b3c6;margin-top:36px}
`;

const page=(slides,l)=>`<!doctype html><html lang="${l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Georgian:wght@400;500;600;700;800&display=swap">
<style>${css}</style></head><body>${slides}</body></html>`;

// Shrinks text marked .fit until the slide content fits; Georgian runs longer than Russian or English.
const fitScript=()=>{
 for(const el of document.querySelectorAll('.fit')){
  const main=el.closest('main');let guard=40;
  while(main.scrollHeight>main.clientHeight+1&&guard--){
   for(const t of [el,...el.querySelectorAll('li,.msg,p')]){
    const fs=parseFloat(getComputedStyle(t).fontSize);t.style.fontSize=(fs*0.95)+'px';
   }
  }
 }
};

const {chromium}=await loadPlaywright();
const browser=await chromium.launch();
const ctx=await browser.newContext({viewport:{width:1080,height:1350},deviceScaleFactor:1});
const pageObj=await ctx.newPage();
const posts=batch.posts.filter(p=>!onlyId||p.id===onlyId);
for(const post of posts){
 const dir=join(outDir,post.id);
 if(!onlyLang) rmSync(dir,{recursive:true,force:true});
 mkdirSync(dir,{recursive:true});
 for(const l of langs){
  for(const [i,s] of post.slides.entries()){
   await pageObj.setContent(page(slideHtml(s,l,i,post.slides.length),l),{waitUntil:'networkidle'});
   await pageObj.evaluate(()=>document.fonts.ready);
   await pageObj.evaluate(fitScript);
   await pageObj.screenshot({path:join(dir,`${l}-${i+1}.jpg`),type:'jpeg',quality:90});
  }
 }
 // Captions with the tracked link, ready to paste.
 const link=(l)=>{const u=new URL(post.link||'https://'+siteName+'/'+l);if(!post.link) u.pathname='/'+l;else u.pathname=u.pathname.replace(/^\/(ka|ru|en)/,'/'+l);
  u.searchParams.set('utm_source',process.env.UTM_SOURCE||'facebook');u.searchParams.set('utm_medium','social');u.searchParams.set('utm_campaign',batch.campaign||'organic');u.searchParams.set('utm_content',post.id);return u.toString();};
 const md=[`# ${post.id} · ${post.date} · ${post.pillar}`,''];
 for(const l of langs) md.push(`## ${l}`,'',tr(post.text,l).replace('{link}',link(l)),'');
 // Facebook page default: Georgian slides, one caption in Georgian then Russian (tracked link in the Georgian part, plain praxenai.ge/ru in the Russian).
 if(langs.includes('ka')&&langs.includes('ru')) md.push('## facebook: ka + ru','',tr(post.text,'ka').replace('{link}',link('ka')),'','—','',tr(post.text,'ru').replace('{link}','praxenai.ge/ru'),'');
 writeFileSync(join(dir,'captions.md'),md.join('\n'));
 console.log(`${post.id}: ${post.slides.length} slide(s) × ${langs.length} lang`);
}
await browser.close();

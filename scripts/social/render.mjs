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
// "theme":"workshop" draws every slide in the workshop landing style (white, yellow strip with "strip" text, uppercase headings).
const theme=batch.theme||'',strip=batch.strip||'';
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

// Workshop theme: a slide may set "bg" (white|ink|grad|yellow); cover, number and cta slides take the post's "accent".
// "info" ([label, value] pairs) adds the landing's date/time/price table to a cover or cta slide.
// Workshop covers can carry a "visual": chat | clock | paper | flow | versus | bubbles | calendar — the eye-catching half of the card.
const icon={msg:'<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.7A8.4 8.4 0 1 1 21 11.5z"/>',bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 17h5"/>',crm:'<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>'};
const ico=(k,cls='')=>`<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${icon[k]}</svg>`;
const visualHtml=(v,l)=>{if(!v)return '';const t=x=>rich(x,l);return {
 chat:()=>`<div class="vis v-chat"><div class="ph-head">${ico('msg')}<span>WhatsApp</span></div>${(v.messages||[]).map(m=>`<div class="msg ${m.from}"><small>${esc(m.time||'')}</small>${t(m.text)}</div>`).join('')}${v.badge?`<span class="v-badge">${t(v.badge)}</span>`:''}</div>`,
 clock:()=>`<div class="vis v-clock"><div class="tile"><small>${t(v.from[1])}</small><b>${esc(v.from[0])}</b></div>${ico('arrow','v-arrow')}<div class="tile late"><small>${t(v.to[1])}</small><b>${esc(v.to[0])}</b></div></div>`,
 paper:()=>`<div class="vis v-paper"><div class="p-head">${t(v.title)}</div>${(v.items||[]).map((x,k)=>`<div class="p-row"><span class="box${k<(v.checked??2)?' on':''}">${k<(v.checked??2)?ico('check'):''}</span><span>${t(x)}</span></div>`).join('')}</div>`,
 flow:()=>`<div class="vis v-flow">${(v.steps||[]).map((x,k)=>`${k?ico('arrow','v-arrow'):''}<div class="step"><span class="dot">${ico(['msg','bot','crm','user'][k%4])}</span><span>${t(x)}</span></div>`).join('')}</div>`,
 versus:()=>`<div class="vis v-versus"><div class="side"><span class="dot">${ico('bot')}</span><b>${t(v.left[0])}</b><p>${t(v.left[1])}</p></div><span class="vs">vs</span><div class="side right"><span class="dot">${ico('user')}</span><b>${t(v.right[0])}</b><p>${t(v.right[1])}</p></div></div>`,
 bubbles:()=>`<div class="vis v-bubbles">${(v.items||[]).map((x,k)=>`<span class="bub b${k}">${t(x)}</span>`).join('')}</div>`,
 calendar:()=>`<div class="vis v-cal"><div class="cal"><div class="c-head">${t(v.month)}</div><b>${esc(v.day)}</b><div class="c-foot">${t(v.foot)}</div></div>${v.side?`<div class="c-side">${[].concat(v.side).map(t).join('<br>')}</div>`:''}</div>`,
}[v.type]?.()||'';};
const infoHtml=(s,l)=>s.info?`<dl class="info">${s.info.map(([k,v])=>`<div><dt>${esc(tr(k,l))}</dt><dd>${esc(tr(v,l))}</dd></div>`).join('')}</dl>`:'';
function slideHtml(s,l,i,n,accent){
 const bg=theme==='workshop'?(s.bg||(['cover','number','cta'].includes(s.layout)&&accent)||'white'):'';
 const dark=theme==='workshop'?['ink','grad'].includes(bg):['cover','number','cta'].includes(s.layout);
 const body={
  cover:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}
   <h1 class="fit">${rich(s.title,l)}</h1>${s.sub?`<p class="sub">${rich(s.sub,l)}</p>`:''}${infoHtml(s,l)}${visualHtml(s.visual,l)}`,
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
   ${s.sub?`<p class="sub">${rich(s.sub,l)}</p>`:''}${infoHtml(s,l)}<div class="button">${rich(s.button,l)}</div>
   <p class="contacts">${esc(contactsLine)}</p>`,
 }[s.layout];
 if(!body) throw new Error(`Unknown layout "${s.layout}"`);
 return `<section class="slide ${s.layout} ${dark?'dark':'light'}${bg?' bg-'+bg:''}${s.visual?' has-vis':''}">${theme==='workshop'&&strip?`<div class="strip">${esc(strip)}</div>`:''}
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

// Workshop landing style (components/praxen/webinar.tsx, docs/direct-kz/creatives): one look for all slides.
const workshopCss=`
.slide{background:#fff;color:#121a2b;padding-top:120px}
.strip{position:absolute;top:0;left:0;right:0;height:60px;display:flex;align-items:center;padding:0 84px;background:#ffd166;border-bottom:3px solid #121a2b;font-size:22px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden}
h1{font-size:88px;line-height:1;font-weight:800;text-transform:uppercase;letter-spacing:-.035em}
h2{font-size:60px;line-height:1.04;font-weight:800;text-transform:uppercase;letter-spacing:-.03em}
em,.dark em{background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.kicker,.dark .kicker{align-self:flex-start;display:inline-flex;align-items:center;gap:14px;background:#121a2b;color:#fff;border-radius:999px;padding:12px 26px;font-size:22px;font-weight:800;letter-spacing:.08em}
.kicker:before{content:'';width:14px;height:14px;border-radius:50%;background:#ff5a5f;box-shadow:0 0 0 5px #ff5a5f44}
.sub{color:#3c4658;font-weight:600}
.list li{font-weight:600;align-items:flex-start}
.list b{flex:none;min-width:72px;text-align:center;background:#ffd166;border:3px solid #121a2b;border-radius:14px;color:#121a2b;font-size:30px;line-height:52px}
.big{font-size:230px;background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.label{color:#121a2b;font-weight:800;text-transform:uppercase;letter-spacing:-.02em}
.note{color:#5d6779;font-weight:600}
.chat{background:#efeae2;border-radius:32px;padding:32px;border:3px solid #121a2b}
.msg{background:#fff;color:#111b21;box-shadow:none}
.msg.bot{background:#d9fdd3;color:#111b21}
.cmp>div{background:#fff;border:3px solid #121a2b}
.cmp .after{background:#ffd166;color:#121a2b}
.cmp h3,.cmp .after h3{color:#3c4658}
.button{border-radius:999px;background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%);text-transform:uppercase;font-weight:800;letter-spacing:.04em;padding:30px 56px;box-shadow:0 18px 40px -12px #4f66f080}
.contacts{color:#5d6779}
.tag{color:#121a2b}
footer{color:#121a2b}
.has-vis h1{font-size:72px}.has-vis .sub{font-size:32px;margin-top:24px}
.vis{margin-top:52px;color:#121a2b;position:relative}
.ico{width:1em;height:1em;flex:none}
.v-chat{background:#efeae2;border:3px solid #121a2b;border-radius:36px;padding:0 30px 30px;box-shadow:14px 14px 0 #121a2b;display:flex;flex-direction:column;gap:18px;overflow:hidden}
.v-chat .ph-head{display:flex;align-items:center;gap:14px;margin:0 -30px 6px;padding:20px 30px;background:#075e54;color:#fff;font-size:28px;font-weight:800}
.v-chat .msg{font-size:34px;padding:18px 24px;max-width:84%;background:#fff;color:#111b21;box-shadow:none}.v-chat .msg.bot{background:#d9fdd3}
.v-badge{position:absolute;right:-6px;top:84px;transform:rotate(4deg);background:#ff5a5f;color:#fff;font-size:26px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:14px 22px;border-radius:14px;border:3px solid #121a2b}
.v-clock{display:flex;align-items:center;gap:22px}
.v-clock .tile{flex:1;background:#fff;border:3px solid #121a2b;border-radius:28px;padding:26px 30px;box-shadow:12px 12px 0 #121a2b}
.v-clock small{display:block;font-size:22px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}
.v-clock b{display:block;margin-top:10px;font-size:150px;font-weight:800;letter-spacing:-.05em;line-height:1}
.v-clock .late b{color:#ff5a5f}.v-arrow{font-size:64px;color:#ffd166}
.v-paper{align-self:flex-start;width:88%;background:#fff;border:3px solid #121a2b;border-radius:24px;padding:34px 40px;transform:rotate(-2.5deg);box-shadow:14px 14px 0 #121a2b;display:flex;flex-direction:column;gap:22px}
.v-paper .p-head{font-size:24px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}
.p-row{display:flex;align-items:center;gap:22px;font-size:37px;font-weight:600;line-height:1.25}
.box{flex:none;width:46px;height:46px;border:3px solid #121a2b;border-radius:10px;display:grid;place-items:center;font-size:34px}.box.on{background:#ffd166}
.v-flow{display:flex;align-items:flex-start;justify-content:space-between;gap:6px}
.v-flow .step{display:flex;flex-direction:column;align-items:center;gap:18px;width:200px;text-align:center;font-size:29px;font-weight:800;line-height:1.15;color:inherit}
.dot{width:136px;height:136px;border-radius:50%;background:#fff;color:#2755ec;border:3px solid #121a2b;display:grid;place-items:center;font-size:64px;box-shadow:8px 8px 0 #121a2b}
.v-flow .v-arrow{margin-top:36px;font-size:44px}
.v-versus{display:flex;align-items:stretch;gap:18px}
.v-versus .side{flex:1;background:#fff;border:3px solid #121a2b;border-radius:28px;padding:30px;box-shadow:12px 12px 0 #121a2b}
.v-versus .right{background:#ffd166}
.v-versus .side b{display:block;margin-top:22px;font-size:40px;font-weight:800;text-transform:uppercase;letter-spacing:-.02em}
.v-versus .side p{margin-top:10px;font-size:34px;line-height:1.3;font-weight:600}
.v-versus .dot{width:96px;height:96px;font-size:46px;box-shadow:none}
.vs{align-self:center;font-size:40px;font-weight:800;color:#ffd166;text-transform:uppercase}
.v-bubbles{height:520px}
.bub{position:absolute;background:#fff;border:3px solid #121a2b;border-radius:30px;padding:26px 34px;font-size:39px;font-weight:700;box-shadow:10px 10px 0 #121a2b;white-space:nowrap}
.bub.b0{left:0;top:0;transform:rotate(-3deg)}.bub.b1{right:0;top:120px;transform:rotate(3deg);background:#ffd166}
.bub.b2{left:30px;top:250px;transform:rotate(2deg)}.bub.b3{right:20px;top:385px;transform:rotate(-2deg);background:#121a2b;color:#fff}
.v-cal{display:flex;align-items:center;gap:44px}
.cal{width:420px;flex:none;background:#fff;border:3px solid #121a2b;border-radius:32px;overflow:hidden;box-shadow:14px 14px 0 #121a2b;text-align:center;color:#121a2b}
.c-head{background:#ff5a5f;color:#fff;font-size:34px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:18px}
.cal b{display:block;font-size:240px;font-weight:800;letter-spacing:-.06em;line-height:1.05}
.c-foot{font-size:28px;font-weight:800;padding:0 0 26px;color:#3c4658}
.c-side{font-size:46px;font-weight:800;line-height:1.25;text-transform:uppercase}
.bg-ink .c-side,.bg-grad .c-side{color:#fff}
.info{display:flex;align-self:flex-start;margin-top:48px;border:3px solid #121a2b;border-radius:24px;overflow:hidden;background:#fff;color:#121a2b}
.info>div{padding:20px 26px}.info>div+div{border-left:3px solid #121a2b}.info>div:last-child{background:#ffd166}
.info dt{font-size:18px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}
.info dd{margin-top:8px;font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1;white-space:nowrap}
.bg-ink{background:#121a2b;color:#fff}
.bg-grad{background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%);color:#fff}
.bg-yellow{background:#ffd166;color:#121a2b}
.bg-ink em,.bg-grad em{background:none;-webkit-background-clip:border-box;background-clip:border-box;color:#ffd166}
.bg-ink .big,.bg-grad .big{background:none;color:#ffd166}
.bg-ink .label,.bg-grad .label,.bg-ink footer,.bg-grad footer,.bg-ink .tag,.bg-grad .tag{color:#fff}
.bg-ink .sub,.bg-grad .sub,.bg-ink .note,.bg-grad .note,.bg-ink .contacts,.bg-grad .contacts{color:#ffffffd9}
.bg-ink .kicker{background:#fff;color:#121a2b}
.bg-grad .kicker{background:#ffd166;color:#121a2b;border-radius:12px;transform:rotate(-2deg)}
.bg-grad .kicker:before{display:none}
.bg-ink .button,.bg-grad .button{background:#ffd166;color:#121a2b;box-shadow:none}
.bg-ink .button em,.bg-grad .button em{color:#121a2b}
.bg-yellow .strip{background:#121a2b;color:#ffd166;border-bottom-color:#121a2b}
.bg-yellow .sub,.bg-yellow .note{color:#3c4658}
.bg-yellow .info>div:last-child{background:#121a2b;color:#fff}.bg-yellow .info>div:last-child dt{color:#ffd166}
`;

const page=(slides,l)=>`<!doctype html><html lang="${l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Georgian:wght@400;500;600;700;800&display=swap">
<style>${css}${theme==='workshop'?workshopCss:''}</style></head><body>${slides}</body></html>`;

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
   await pageObj.setContent(page(slideHtml(s,l,i,post.slides.length,post.accent),l),{waitUntil:'networkidle'});
   await pageObj.evaluate(()=>document.fonts.ready);
   await pageObj.evaluate(fitScript);
   await pageObj.screenshot({path:join(dir,`${l}-${i+1}.jpg`),type:'jpeg',quality:90});
  }
 }
 // Captions with the tracked link, ready to paste.
 const link=(l)=>{const u=new URL(post.link||'https://'+siteName+'/'+l);if(!post.link) u.pathname=l==='en'?'/':'/'+l;else u.pathname=u.pathname.replace(/^\/(ka|ru|en)(?=\/|$)/,l==='en'?'':'/'+l)||'/';
  u.searchParams.set('utm_source',process.env.UTM_SOURCE||'facebook');u.searchParams.set('utm_medium','social');u.searchParams.set('utm_campaign',batch.campaign||'organic');u.searchParams.set('utm_content',post.id);return u.toString();};
 const md=[`# ${post.id} · ${post.date} · ${post.pillar}`,''];
 for(const l of langs) md.push(`## ${l}`,'',tr(post.text,l).replace('{link}',link(l)),'');
 // Facebook page default: Georgian slides, one caption in Georgian then Russian (tracked link in the Georgian part, plain praxenai.ge/ru in the Russian).
  // "channels": one ready caption per network, each with its own utm_source. Instagram captions have no clickable links,
 // Threads takes the short "threads" text (500 characters with the link), Telegram goes without hashtags.
 if(batch.channels) for(const ch of batch.channels){
  const l=langs[0],url=link(l).replace(/utm_source=[^&]+/,'utm_source='+ch),full=tr(post.text,l);
  const tags=full.match(/\n\n(#[^\n]+)\s*$/),body=tags?full.slice(0,tags.index):full;
  const t=ch==='instagram'?full.replace('{link}','ссылка в шапке профиля'):ch==='threads'?tr(post.threads||post.text,l).replace('{link}',url):ch==='telegram'?body.replace('{link}',url):ch==='linkedin'?body.replace('{link}',url)+(tags?'\n\n'+tags[1].split(' ').slice(0,3).join(' '):''):full.replace('{link}',url);
  if(ch==='threads'&&t.length>500) throw new Error(post.id+': Threads text '+t.length+' > 500');
  md.push(`## ${ch}`+(post.time?` · ${post.date} ${post.time} (Тбилиси)`:''),'',t,'');
 }
 if(langs.includes('ka')&&langs.includes('ru')) md.push('## facebook: ka + ru','',tr(post.text,'ka').replace('{link}',link('ka')),'','—','',tr(post.text,'ru').replace('{link}','praxenai.ge/ru'),'');
 writeFileSync(join(dir,'captions.md'),md.join('\n'));
 console.log(`${post.id}: ${post.slides.length} slide(s) × ${langs.length} lang`);
}
await browser.close();

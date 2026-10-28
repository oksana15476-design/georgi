// Renders social post cards (1080×1350, Facebook and Instagram feed) from content/social/*.json.
//
//   node scripts/social/render.mjs content/social/2026-10.json            all posts, all languages
//   node scripts/social/render.mjs content/social/2026-10.json w1-2 ka    one post, one language
//
// Output: content/social/out/<batch>/<post id>/<lang>-<slide>.jpg, <lang>-fb.jpg (Facebook cover) and captions.md next to them.
// Links in captions carry utm_source=facebook; set UTM_SOURCE=instagram (linkedin, telegram…) for other channels.
// Playwright is taken from the project or from the global install (npm root -g).
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {join,dirname,basename,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const [batchPath,onlyId,onlyLang]=process.argv.slice(2);
// COVER_ONLY=1 renders just the Facebook covers (<lang>-fb.jpg) and leaves the slides and captions as they are.
const coverOnly=!!process.env.COVER_ONLY;
if(!batchPath){console.error('Usage: node scripts/social/render.mjs <batch.json> [post id] [ka|ru|en]');process.exit(1);}
const batch=JSON.parse(readFileSync(resolve(batchPath),'utf8'));
const langs=(onlyLang?[onlyLang]:batch.langs||['ka','ru','en']);
// A batch for praxenai.com sets "site" and "contacts"; praxenai.ge batches keep the defaults.
// "theme":"workshop" draws every slide in the workshop landing style (white, yellow strip with "strip" text, uppercase headings).
const theme=batch.theme||'',strip=batch.strip||'';
// "size":"story" renders 1080×1920 (stories, Instagram highlights) instead of the 1080×1350 feed card.
const [W,H]=batch.size==='story'?[1080,1920]:[1080,1350];
const siteName=batch.site||'praxenai.ge',contactsLine=batch.contacts||'WhatsApp +995 557 125 497 · praxenai.ge';
const outDir=join(root,'content/social/out',basename(batchPath,'.json'));

async function loadPlaywright(){
 try{return await import('playwright');}catch{}
 const globalRoot=execSync('npm root -g').toString().trim();
 return import(pathToFileURL(join(globalRoot,'playwright/index.mjs')).href);
}

const svg=f=>readFileSync(join(root,'brand',f),'utf8');
const logoWhite=svg('praxen-logo-white.svg'), logoDark=svg('praxen-logo.svg');
// The logo mark alone (white), for the round avatar of the "post" style.
const logoMark='<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="18" fill="#fff"/><rect x="12" y="3" width="9" height="9" fill="#ffffff99"/></svg>';
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
// Famous meme templates (content/social/memes/*.jpg, blank versions from imgflip) with our captions placed over them.
// Boxes are in % of the image: [x, y, w, h, style, rotation]; style "plain" = black text on the template's white area, "pill" = label.
const MEMES={
 drake:{f:'drake.jpg',r:1,boxes:[[51,2,47,46,'plain'],[51,52,47,46,'plain']]},
 boyfriend:{f:'boyfriend.jpg',r:1.5,boxes:[[50,16,30,18,'pill'],[0,56,36,18,'pill'],[66,40,33,18,'pill']]},
 buttons:{f:'buttons.jpg',r:600/908,boxes:[[6,6,38,12,'pill',-12],[48,3,38,12,'pill',-12],[4,84,92,13,'pill']]},
 changemind:{f:'changemind.jpg',r:482/361,boxes:[[40,40,48,30,'pill',-3]]},
 brain:{f:'brain.jpg',r:857/1202,boxes:[[1,1,46,23,'plain'],[1,26,46,23,'plain'],[1,51,46,23,'plain'],[1,76,46,23,'plain']]},
 thisfine:{f:'thisfine.jpg',r:580/282,boxes:[[2,4,44,24,'pill'],[54,74,44,22,'pill']]},
 yellcat:{f:'yellcat.jpg',r:680/438,boxes:[[2,3,46,22,'pill'],[52,3,46,22,'pill']]},
 pikachu:{f:'pikachu.jpg',r:1,boxes:[[3,1,94,30,'plain']]},
 harold:{f:'harold.jpg',r:480/601,boxes:[[3,38,94,10,'pill'],[3,88,94,10,'pill']]},
 gru:{f:'gru.jpg',r:700/449,boxes:[[28,10,19,38,'plain'],[78,10,20,38,'plain'],[28,58,19,38,'plain'],[78,58,20,38,'plain']]},
 monkey:{f:'monkey.jpg',r:907/506,boxes:[[2,78,96,18,'pill']]},
 leo:{f:'leo.jpg',r:1.5,boxes:[[3,4,62,18,'pill'],[3,78,94,18,'pill']]},
 pigeon:{f:'pigeon.jpg',r:1587/1425,boxes:[[64,6,34,14,'pill'],[4,56,40,12,'pill'],[6,84,88,12,'pill']]},
};
const memeSrc={};
// Cover photos (CC0, content/social/photos/SOURCES.md), embedded like the memes.
const photoSrc=f=>`data:image/jpeg;base64,${readFileSync(join(root,'content/social/photos',f)).toString('base64')}`;
const memeImg=f=>memeSrc[f]??=`data:image/jpeg;base64,${readFileSync(join(root,'content/social/memes',f)).toString('base64')}`;
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
function slideHtml(s,l,i,n,accent,fb,sty,post){
 const bg=theme==='workshop'?(s.bg||((i===0||['cover','number','cta'].includes(s.layout))&&accent)||'white'):'';
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
  // Own memes in the site style (no third-party images): chat, expect (ожидание / реальность), buttons, levels.
  meme:()=>{const m=s.meme||{};const t=x=>rich(x,l);return `${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}${s.title?`<h2 class="meme-top">${rich(s.title,l)}</h2>`:''}${{
   chat:()=>`<div class="vis v-chat">${(m.messages||[]).map(x=>`<div class="msg ${x.from}"><small>${esc(x.time||'')}${x.who?' · '+esc(tr(x.who,l)):''}</small>${t(x.text)}</div>`).join('')}</div>`,
   expect:()=>`<div class="m-expect"><div><span>${t(m.aLabel||{ru:'Ожидание',ka:'მოლოდინი',en:'Expectation'})}</span><p>${t(m.a)}</p></div><div class="real"><span>${t(m.bLabel||{ru:'Реальность',ka:'რეალობა',en:'Reality'})}</span><p>${t(m.b)}</p></div></div>`,
   buttons:()=>`<div class="m-buttons"><div class="btn2"><i></i><p>${t(m.a)}</p></div><div class="btn2"><i></i><p>${t(m.b)}</p></div></div>${m.face?`<div class="m-face">${esc(m.face)}</div>`:''}${m.under?`<p class="m-under">${t(m.under)}</p>`:''}`,
   // Recognisable famous formats rebuilt with open-licence emoji (Noto Color Emoji) and our captions; no original photos or film stills.
   drake:()=>`<div class="m-drake"><div class="row"><span class="em">${esc(m.noEmoji||'🙅')}</span><p>${t(m.no)}</p></div><div class="row yes"><span class="em">${esc(m.yesEmoji||'👉')}</span><p>${t(m.yes)}</p></div></div>`,
   thisfine:()=>`<div class="m-fine"><div class="fires">🔥🔥🔥🔥🔥🔥</div><div class="room"><span class="say">${t(m.say||{ru:'Всё нормально',ka:'ყველაფერი რიგზეა',en:'This is fine'})}</span><span class="dog">🐶</span><span class="cup">☕</span>${m.badge?`<span class="v-badge">${t(m.badge)}</span>`:''}</div><div class="fires">🔥🔥🔥🔥🔥🔥</div></div>`,
   brain:()=>`<div class="m-brain">${(m.items||[]).map((x,k,a)=>`<div class="br br${k}"><p>${t(x)}</p><span style="font-size:${56+k*30}px">🧠</span></div>`).join('')}</div>`,
   changemind:()=>`<div class="m-mind"><div class="sign">${t(m.sign)}<b>${t(m.cta||{ru:'Переубедите меня',ka:'დამარწმუნეთ საპირისპიროში',en:'Change my mind'})}</b></div><div class="desk"><span>☕</span></div></div>`,
   yell:()=>`<div class="m-yell"><div class="side"><span class="em">${esc(m.leftEmoji||'😫')}</span><p>${t(m.left)}</p></div><div class="side cat"><span class="em">${esc(m.rightEmoji||'😾')}</span><p>${t(m.right)}</p></div></div>`,
   img:()=>{const T=MEMES[m.tpl];const w=Math.min(912,(fb?Math.min(m.maxH||760,590):m.maxH||760)*T.r);return `<div class="m-img" style="width:${w}px;height:${w/T.r}px"><img src="${memeImg(T.f)}">${T.boxes.map((b,k)=>m.labels?.[k]?`<div class="mb ${b[4]} fitbox" style="left:${b[0]}%;top:${b[1]}%;width:${b[2]}%;height:${b[3]}%;${b[5]?`transform:rotate(${b[5]}deg);`:''}font-size:${m.size||Math.round(w/(b[4]==='plain'?14:20))}px"><span>${t(m.labels[k])}</span></div>`:'').join('')}</div>`},
   reaction:()=>`<div class="m-react"><span class="em">${esc(m.emoji||'😴')}</span><p>${t(m.text)}</p></div>`,
   levels:()=>`<div class="m-levels">${(m.items||[]).map((x,k)=>`<div class="lv lv${k}"><b>${k+1}</b><p>${t(x)}</p></div>`).join('')}</div>`,
  }[m.type]?.()||''}${s.bottom?`<p class="meme-bottom">${rich(s.bottom,l)}</p>`:''}`},
  // A ready-to-copy prompt for ChatGPT or Claude: the card people save. "prompt" is the text, "note" a short how-to line.
  prompt:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<h2>${rich(s.title,l)}</h2>
   <div class="pr-card fit"><span class="pr-tag">${esc(tr({ru:'Скопируйте',ka:'დააკოპირეთ',en:'Copy'},l))}</span><p>${rich(s.prompt,l)}</p></div>${s.note?`<p class="pr-note">${rich(s.note,l)}</p>`:''}`,
  cta:()=>`${s.kicker?`<div class="kicker">${rich(s.kicker,l)}</div>`:''}<h1 class="fit">${rich(s.title,l)}</h1>
   ${s.sub?`<p class="sub">${rich(s.sub,l)}</p>`:''}${infoHtml(s,l)}<div class="button">${rich(s.button,l)}</div>
   <p class="contacts">${esc(contactsLine)}</p>`,
 }[s.layout];
 if(!body) throw new Error(`Unknown layout "${s.layout}"`);
 return `<section class="slide ${s.layout} ${dark?'dark':'light'}${fb?' fb':''}${bg?' bg-'+bg:''}${s.visual?' has-vis':''}${sty?` sty sty-${sty}${i===0?' first':''}${i===0&&post?.tone?' tone-'+post.tone:''}${i===0&&post?.photo?' has-photo':''}`:''}"${i===0&&post?.photo?` style="background-image:url(${photoSrc(post.photo)})"`:''}>${theme==='workshop'&&strip&&!sty?`<div class="strip">${esc(strip)}</div>`:''}${sty?chromeHtml(sty,l,i,n):''}
  <header><div class="logo">${(sty?['terminal','memeblack'].includes(sty)||(sty==='poster'&&bg==='ink')||(sty==='editorial'&&(i===0&&post?.tone?(post.photo||['dark','olive'].includes(post.tone)):(bg==='ink'||(i===0&&post?.photo)))):dark)?logoWhite:logoDark}</div>
   <div class="meta">${s.example?`<span class="tag">${esc(tr(ui.example,l))}</span>`:''}${n>1?`<span>${i+1}/${n}</span>`:''}</div></header>
  <main>${body()}</main>${fb&&batch.fbCta?`<div class="fb-cta"><b>${rich(batch.fbCta.title,l)}</b>${batch.fbCta.sub?`<span>${rich(batch.fbCta.sub,l)}</span>`:''}</div>`:''}
  <footer><span>${esc(siteName)}</span>${n>1&&i<n-1&&batch.size!=='story'?`<span>${esc(tr(ui.swipe,l))}</span>`:''}</footer></section>`;
}

const css=`
*{box-sizing:border-box;margin:0;padding:0}
body{width:${W}px;height:${H}px;font-family:Manrope,'Noto Sans Georgian',sans-serif;-webkit-font-smoothing:antialiased}
.slide{width:${W}px;height:${H}px;padding:72px 84px 64px;display:flex;flex-direction:column;position:relative;overflow:hidden}
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
.meme-top{font-size:56px;margin-bottom:36px}
/* Facebook cover (<lang>-fb.jpg): bigger headline and the batch "fbCta" block (what, when, where to sign up) under the picture. */
.fb .meme-top{font-size:68px;margin-bottom:32px}
.fb-cta{margin-top:36px;background:#121a2b;color:#fff;border-radius:28px;padding:30px 40px;display:flex;flex-direction:column;gap:8px}
.fb-cta b{font-size:40px;font-weight:800;line-height:1.1;text-transform:uppercase;letter-spacing:-.01em}.fb-cta b em{color:#ffd166}
.fb-cta span{font-size:28px;font-weight:600;color:#c9d1e3}
.dark .fb-cta{background:#ffd166;color:#121a2b}.dark .fb-cta span{color:#3a4257}.dark .fb-cta b em{color:#315bf5}
.fb footer{display:none}.meme .v-chat{padding-top:30px}.meme-bottom{margin-top:40px;font-size:40px;font-weight:800;line-height:1.2}
.m-expect{display:grid;grid-template-rows:1fr 1fr;gap:24px}
.m-expect>div{background:#fff;border:3px solid #121a2b;border-radius:28px;padding:30px 34px;box-shadow:12px 12px 0 #121a2b}.m-expect .real{background:#ffd166}
.m-expect span{font-size:24px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}.m-expect p{margin-top:12px;font-size:40px;font-weight:700;line-height:1.25;color:#121a2b}
.m-buttons{display:flex;gap:36px;justify-content:center}
.btn2{flex:1;text-align:center}.btn2 i{display:block;margin:0 auto 22px;width:200px;height:120px;border-radius:50%/40%;background:#ff5a5f;border:4px solid #121a2b;box-shadow:0 18px 0 #b8383c,0 18px 0 4px #121a2b}
.btn2 p{background:#fff;border:3px solid #121a2b;border-radius:20px;padding:22px;font-size:34px;font-weight:800;line-height:1.2;box-shadow:10px 10px 0 #121a2b}
.m-under{margin-top:28px;text-align:center;font-size:40px;font-weight:800}
.m-img{position:relative;align-self:center;border:3px solid #121a2b;border-radius:24px;overflow:hidden;box-shadow:14px 14px 0 #121a2b;flex:none}
.m-img img{width:100%;height:100%;display:block;object-fit:cover}
.mb{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;font-weight:800;line-height:1.12;color:#121a2b}
.mb.pill span{background:#fff;border:3px solid #121a2b;border-radius:14px;padding:.25em .45em;box-shadow:5px 5px 0 #121a2b}
.mb.plain{padding:4%}
.m-face{margin-top:30px;text-align:center;font-size:150px;line-height:1}
.m-drake{display:flex;flex-direction:column;border:3px solid #121a2b;border-radius:28px;overflow:hidden;box-shadow:14px 14px 0 #121a2b;background:#fff}
.m-drake .row{display:flex;align-items:center;min-height:250px}.m-drake .row+.row{border-top:3px solid #121a2b}
.m-drake .em{flex:none;width:250px;align-self:stretch;display:grid;place-items:center;font-size:150px;background:#efeae2;border-right:3px solid #121a2b}
.m-drake .yes .em{background:#ffd166}.m-drake p{padding:28px 34px;font-size:40px;font-weight:800;line-height:1.2;color:#121a2b}
.m-fine{border:3px solid #121a2b;border-radius:28px;overflow:hidden;box-shadow:14px 14px 0 #121a2b;background:#ffb24a}
.m-fine .fires{font-size:96px;line-height:1.1;letter-spacing:-12px;white-space:nowrap;overflow:hidden;padding:0 10px}
.m-fine .room{position:relative;height:300px;background:#ffd59a;border-top:3px solid #121a2b;border-bottom:3px solid #121a2b}
.m-fine .dog{position:absolute;left:250px;bottom:20px;font-size:190px;line-height:1}.m-fine .cup{position:absolute;left:470px;bottom:30px;font-size:100px}
.m-fine .say{position:absolute;left:40px;top:26px;background:#fff;border:3px solid #121a2b;border-radius:24px;padding:14px 24px;font-size:40px;font-weight:800;color:#121a2b}
.m-fine .v-badge{top:30px;right:24px}
.m-brain{display:flex;flex-direction:column;gap:14px}
.br{display:flex;align-items:center;justify-content:space-between;gap:20px;border:3px solid #121a2b;border-radius:24px;padding:14px 28px;background:#fff;box-shadow:10px 10px 0 #121a2b;min-height:120px}
.br p{font-size:34px;font-weight:700;line-height:1.2;color:#121a2b}.br span{line-height:1;flex:none}
.br:last-child{background:#121a2b}.br:last-child p{color:#ffd166;font-weight:800}.br:last-child span{filter:drop-shadow(0 0 22px #7b95ff) drop-shadow(0 0 40px #ffd166)}
.m-mind{display:flex;flex-direction:column;align-items:center}
.m-mind .sign{width:92%;background:#fff;border:4px solid #121a2b;border-radius:16px;padding:40px 44px;font-size:44px;font-weight:800;line-height:1.2;text-align:center;color:#121a2b;box-shadow:12px 12px 0 #121a2b;transform:rotate(-1.5deg)}
.m-mind .sign b{display:block;margin-top:22px;font-size:34px;color:#ff5a5f;text-transform:uppercase;letter-spacing:.04em}
.m-mind .desk{width:100%;height:110px;margin-top:-14px;background:#8a5a33;border:3px solid #121a2b;border-radius:14px;position:relative}.m-mind .desk span{position:absolute;right:60px;top:-70px;font-size:90px}
.m-yell{display:flex;gap:18px}
.m-yell .side{flex:1;border:3px solid #121a2b;border-radius:28px;background:#fff;box-shadow:12px 12px 0 #121a2b;padding:28px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:18px}
.m-yell .cat{background:#ffd166}.m-yell .em{font-size:170px;line-height:1}.m-yell p{font-size:36px;font-weight:800;line-height:1.2;color:#121a2b}
.m-react{display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}.m-react .em{font-size:280px;line-height:1}.m-react p{font-size:46px;font-weight:800;line-height:1.2}
.m-levels{display:flex;flex-direction:column;gap:18px}
.lv{display:flex;align-items:center;gap:26px;border:3px solid #121a2b;border-radius:24px;padding:22px 28px;background:#fff;box-shadow:10px 10px 0 #121a2b}
.lv b{flex:none;width:64px;height:64px;border-radius:16px;display:grid;place-items:center;background:#121a2b;color:#fff;font-size:34px}
.lv p{font-size:36px;font-weight:700;line-height:1.2;color:#121a2b}.lv:last-child{background:#ffd166}.lv:last-child p{font-weight:800}
.bg-ink .meme-bottom,.bg-grad .meme-bottom,.bg-ink .m-under,.bg-grad .m-under{color:#fff}
.info{display:flex;align-self:flex-start;margin-top:48px;border:3px solid #121a2b;border-radius:24px;overflow:hidden;background:#fff;color:#121a2b}
.info>div{padding:20px 26px}.info>div+div{border-left:3px solid #121a2b}.info>div:last-child{background:#ffd166}
.info dt{font-size:18px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}
.info dd{margin-top:8px;font-size:44px;font-weight:800;letter-spacing:-.03em;line-height:1;white-space:nowrap}
.pr-card{position:relative;background:#121a2b;color:#eef1ff;border:3px solid #121a2b;border-radius:28px;padding:64px 48px 44px;box-shadow:10px 10px 0 #ffd166;overflow:hidden}
.pr-card p{font-family:'DejaVu Sans Mono','Noto Sans Mono',monospace;font-size:34px;line-height:1.45;font-weight:500}
.pr-card em{color:#ffd166}
.pr-tag{position:absolute;top:18px;left:48px;font-size:20px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ffd166}
.pr-note{margin-top:36px;font-size:32px;line-height:1.35;font-weight:600;color:#3c4658}
.bg-ink .pr-card,.bg-grad .pr-card{background:#fff;color:#121a2b;border-color:#fff}.bg-ink .pr-card em,.bg-grad .pr-card em{color:#315bf5}.bg-ink .pr-tag,.bg-grad .pr-tag{color:#315bf5}.bg-ink .pr-note,.bg-grad .pr-note{color:#ffffffd9}
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

// Post "style": a whole look of its own so neighbouring posts in the grid differ (owner 28 October: "all look the same").
// notes (phone notes app) | post (a Threads post screenshot) | poster (bold poster) | report (research page, serif)
// | terminal (code editor, for prompts) | memeblack (classic black meme) | notebook (handwriting on squared paper) | chat (WhatsApp screen).
// Fonts are local (content/social/fonts, SIL OFL).
const fontsDir=join(root,'content/social/fonts');
const fontFaces=JSON.parse(readFileSync(join(fontsDir,'fonts.json'),'utf8')).map(f=>`@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight||'100 900'};src:url(data:font/woff2;base64,${readFileSync(join(fontsDir,f.file)).toString('base64')}) format('woff2');unicode-range:${f.range}}`).join('\n');
const chromeHtml=(sty,l,i,n)=>({
 notes:`<div class="ch-notes"><span>‹ ${esc(tr({ru:'Заметки',ka:'ჩანაწერები',en:'Notes'},l))}</span><span>${esc(tr({ru:'Готово',ka:'მზადაა',en:'Done'},l))}</span></div>`,
 post:`<div class="ch-post"><span class="av">${logoMark}</span><span class="nm"><b>praxenai</b><small>Praxen AI</small></span><span class="dots">···</span></div><div class="ch-post-foot"><span>♡</span><span>💬</span><span>↻</span><span>➤</span></div>`,
 report:`<div class="ch-report"><span>Praxen AI · ${esc(tr({ru:'Разбор исследования',ka:'კვლევის განხილვა',en:'Research brief'},l))}</span>${n>1?`<span>${i+1} / ${n}</span>`:''}</div>`,
 terminal:`<div class="ch-term"><i></i><i></i><i></i><span>prompts.txt</span></div>`,
 news:`<div class="ch-news"><b>${esc(tr({ru:'Истории ИИ',ka:'AI ისტორიები',en:'AI stories'},l))}</b><span>Praxen AI${n>1?` · ${i+1}/${n}`:''}</span></div>`,
 chat:`<div class="ch-chat"><span class="bk">‹</span><span class="av">${esc(tr({ru:'К',ka:'კ',en:'C'},l))}</span><span class="nm"><b>${esc(tr(ui.client,l))}</b><small>${esc(tr({ru:'в сети',ka:'ონლაინ',en:'online'},l))}</small></span></div>`,
}[sty]||'');
const skinCss=`
.sty .strip{display:none}
.ch-post .nm b,.ch-chat .nm b{background:none!important;border:0!important;padding:0!important;min-width:0!important;width:auto!important;height:auto!important;text-align:left!important;line-height:1.2!important;font-size:36px!important}.ch-post .nm b{color:#121a2b!important}.ch-chat .nm b{color:#fff!important}
.sty-poster .vis{color:inherit}
.sty main{justify-content:center}
/* notes */
.sty-notes.slide{background:#ffffff!important;color:#121a2b;font-family:Manrope,'Noto Sans Manropen',sans-serif;padding-top:150px}
.ch-notes{position:absolute;top:48px;left:60px;right:60px;display:flex;justify-content:space-between;font:600 36px Manrope,sans-serif;color:#315bf5}
.sty-notes header{display:none}
.sty-notes h1,.sty-notes h2,.sty-notes .meme-top{font-family:Manrope,sans-serif;text-transform:none;letter-spacing:-.025em;color:#121a2b;font-weight:800}
.sty-notes h1{font-size:80px}.sty-notes h2{font-size:60px}
.sty-notes em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#315bf5!important}
.sty-notes .kicker{background:none!important;color:#5d6779!important;padding:0;transform:none;font:600 26px Manrope,sans-serif;letter-spacing:.02em;text-transform:none}
.sty-notes .kicker:before{display:none}
.sty-notes .sub,.sty-notes .note,.sty-notes .pr-note{color:#3c4658!important;font-weight:500}
.sty-notes .list li{border-bottom:2px solid #dfe5ee;padding-bottom:26px;font-weight:500}
.sty-notes .list b{font-size:0;min-width:46px;width:46px;height:46px;margin-top:4px;border-radius:50%;border:3px solid #315bf5;background:none}
.sty-notes .vis *,.sty-notes .msg,.sty-notes .cmp>div,.sty-notes .pr-card,.sty-notes .lv,.sty-notes .m-expect>div,.sty-notes .chat{box-shadow:none!important}
.sty-notes .v-paper,.sty-notes .cmp>div,.sty-notes .pr-card,.sty-notes .m-expect>div,.sty-notes .lv,.sty-notes .v-clock .tile,.sty-notes .cal,.sty-notes .v-versus .side{border:0!important;background:#f6f8fb!important;color:#121a2b!important;transform:none!important;border-radius:22px}
.sty-notes .m-expect .real,.sty-notes .cmp .after,.sty-notes .lv:last-child{background:#fff1c7!important}
.sty-notes .pr-tag{color:#315bf5!important}
.sty-notes .box{border-radius:50%;border-color:#315bf5}.sty-notes .box.on{background:#315bf5;color:#fff}
.sty-notes .big{background:none!important;color:#315bf5!important;font-family:Manrope,sans-serif}
.sty-notes .label{text-transform:none;color:#121a2b!important}
.sty-notes .button{background:#315bf5!important;color:#fff!important;text-transform:none;box-shadow:none;letter-spacing:0}
.sty-notes footer{color:#5d6779!important;opacity:1}
.sty-notes .fb-cta{background:#f6f8fb;color:#121a2b;border:0;box-shadow:none}
/* post: a Threads post */
.sty-post.slide{background:#fff!important;color:#121a2b;font-family:Manrope,'Noto Sans Manropen',sans-serif;padding:200px 84px 150px}
.sty-post header{display:none}
.ch-post{position:absolute;top:60px;left:84px;right:84px;display:flex;align-items:center;gap:24px}
.ch-post .av{width:96px;height:96px;border-radius:50%;background:#121a2b;display:grid;place-items:center}.ch-post .av svg{width:46px;height:46px}
.ch-post .nm{display:flex;flex-direction:column;font:700 36px Manrope,sans-serif}.ch-post .nm small{font-weight:500;font-size:28px;color:#5d6779}
.ch-post .dots{margin-left:auto;font-size:44px;color:#5d6779}
.ch-post-foot{position:absolute;left:84px;bottom:70px;display:flex;gap:44px;font-size:44px;color:#3c4658;filter:grayscale(1)}
.sty-post footer{display:none}
.sty-post main{justify-content:center}
.ch-post .nm b{background:none;border:0;color:#121a2b;font-size:36px;padding:0;min-width:0;text-align:left;line-height:1.2}
.sty-post .bub,.sty-notes .bub{position:static;display:inline-block;margin:0 14px 18px 0;transform:none!important;box-shadow:none!important;border:0!important;background:#eef3ff!important;color:#121a2b!important;font-weight:600;border-radius:999px}
.sty-post .v-bubbles,.sty-notes .v-bubbles{height:auto}
.sty-post .fb-cta span{color:#3c4658}
.sty-post h1,.sty-post h2,.sty-post .meme-top{font-family:Manrope,sans-serif;text-transform:none;font-weight:600;letter-spacing:-.015em;color:#121a2b;line-height:1.18}
.sty-post h1{font-size:74px}.sty-post h2,.sty-post .meme-top{font-size:60px;margin-bottom:40px}
.sty-post .list li{font-size:46px}
.sty-post em{background:linear-gradient(transparent 58%,#ffd166 58%)!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#121a2b!important}
.sty-post .kicker{background:none!important;color:#5d6779!important;padding:0;font:500 30px Manrope,sans-serif;letter-spacing:0;text-transform:none;transform:none}
.sty-post .kicker:before{display:none}
.sty-post .m-img{border-radius:28px;overflow:hidden;border:2px solid #dfe5ee;box-shadow:none!important}
.sty-post .vis,.sty-post .cmp>div,.sty-post .msg,.sty-post .pr-card,.sty-post .m-expect>div,.sty-post .lv{box-shadow:none!important}
.sty-post .v-chat,.sty-post .cmp>div,.sty-post .m-expect>div,.sty-post .v-paper,.sty-post .lv,.sty-post .chat{border:2px solid #dfe5ee!important;transform:none!important}
.sty-post .sub,.sty-post .note,.sty-post .label{color:#3c4658!important;text-transform:none;font-weight:500}
.sty-post .list li{font-weight:500}.sty-post .list b{background:none;border:0;color:#5d6779;font-weight:600;text-align:left;min-width:56px}
.sty-post .big{background:none!important;color:#121a2b!important;font-family:Manrope,sans-serif}
.sty-post .button{background:#121a2b!important;color:#fff!important;text-transform:none;letter-spacing:0;box-shadow:none;border-radius:999px}
.sty-post .fb-cta{background:#f6f8fb;border:0;box-shadow:none;color:#121a2b}
/* poster */
.sty-poster.slide{font-family:Manrope,'Noto Sans Manropen',sans-serif;background:#f6f8fb!important;color:#121a2b!important}
.sty-poster.first,.sty-poster.bg-grad,.sty-poster.bg-yellow{background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%)!important;color:#fff!important}
.sty-poster.bg-ink{background:#121a2b!important;color:#f6f8fb!important}
.sty-poster h1,.sty-poster h2,.sty-poster .meme-top{font-family:Manrope,sans-serif;font-weight:800;text-transform:uppercase;letter-spacing:-.04em;line-height:.98;color:inherit}
.sty-poster h1{font-size:88px;overflow-wrap:anywhere}.sty-poster h2{font-size:64px}
.sty-poster em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#ffd166!important}
.sty-poster:not(.first):not(.bg-grad):not(.bg-yellow):not(.bg-ink) em{color:#315bf5!important}
.sty-poster .kicker{background:#ffd166!important;color:#121a2b!important;border-radius:0;transform:none;font-family:Manrope,sans-serif;font-weight:600}
.sty-poster.bg-ink .kicker{background:#ffd166!important;color:#121a2b!important}
.sty-poster .kicker:before{display:none}
.sty-poster .sub,.sty-poster .note,.sty-poster .label,.sty-poster footer,.sty-poster .tag,.sty-poster .contacts{color:inherit!important}
.sty-poster .sub,.sty-poster .note{font-family:Manrope,sans-serif;font-weight:600}
.sty-poster .vis,.sty-poster .v-chat,.sty-poster .v-paper,.sty-poster .tile,.sty-poster .cal,.sty-poster .dot,.sty-poster .side,.sty-poster .bub,.sty-poster .cmp>div,.sty-poster .lv,.sty-poster .info>div,.sty-poster .m-expect>div{box-shadow:none!important;border-radius:0!important;border-width:5px!important;border-color:#121a2b!important;transform:none!important}
.sty-poster .cal,.sty-poster .tile,.sty-poster .dot,.sty-poster .side{background:#f6f8fb!important;color:#121a2b!important}
.sty-poster .c-head{background:#121a2b;border-radius:0}
.sty-poster .c-side,.sty-poster .v-flow .step{font-family:Manrope,sans-serif;color:inherit}
.sty-poster .big{font-family:Manrope,sans-serif;background:none!important;color:inherit!important;font-size:260px}
.sty-poster .list li{font-family:Manrope,sans-serif;font-weight:700}
.sty-poster .list b{border-radius:0;background:#121a2b;color:#f6f8fb;border-color:#121a2b}
.sty-poster .button{background:#121a2b!important;color:#f6f8fb!important;border-radius:0;box-shadow:none;font-family:Manrope,sans-serif}
.sty-poster.bg-ink .button,.sty-poster.first .button,.sty-poster.bg-grad .button,.sty-poster.bg-yellow .button{background:#ffd166!important;color:#121a2b!important}
.sty-poster .logo svg path{fill:currentColor}
.sty-poster .fb-cta{background:#121a2b;color:#f6f8fb;border-radius:0;border:0;box-shadow:none}
/* report: research page */
.sty-report.slide{background:#f6f8fb!important;color:#121a2b!important;font-family:Manrope,'Noto Sans Manropen',sans-serif;padding-top:150px}
.sty-report header{display:none}
.ch-report{position:absolute;top:60px;left:84px;right:84px;display:flex;justify-content:space-between;border-bottom:2px solid #121a2b;padding-bottom:18px;font:600 24px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.sty-report h1,.sty-report h2,.sty-report .meme-top{font-family:Manrope,sans-serif;font-weight:700;text-transform:none;letter-spacing:-.01em;color:#121a2b;line-height:1.08}
.sty-report h1{font-size:90px}.sty-report h2{font-size:64px}
.sty-report em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#315bf5!important;font-style:italic}
.sty-report .kicker{background:none!important;color:#315bf5!important;padding:0;font:700 26px Manrope,sans-serif;letter-spacing:.1em;transform:none}
.sty-report .kicker:before{display:none}
.sty-report .big{font-family:Manrope,sans-serif;background:none!important;color:#315bf5!important;font-size:250px;letter-spacing:-.03em}
.sty-report .label{font-family:Manrope,sans-serif;font-weight:400;text-transform:none;color:#121a2b!important;font-size:50px;line-height:1.25}
.sty-report .note{font-family:Manrope,sans-serif;font-size:24px;color:#5d6779!important;border-top:2px solid #1d1d1b33;padding-top:18px}
.sty-report .sub{font-family:Manrope,sans-serif;font-style:italic;color:#3c4658!important;font-weight:400}
.sty-report .list li{font-family:Manrope,sans-serif;font-weight:400;font-size:42px}
.sty-report .list b{background:none;border:0;color:#315bf5;font-family:Manrope,sans-serif;font-size:42px;line-height:1.3;text-align:left;min-width:60px}
.sty-report .tile,.sty-report .v-paper,.sty-report .cmp>div{background:transparent!important;border:0!important;border-top:5px solid #121a2b!important;border-radius:0!important;box-shadow:none!important;transform:none!important}
.sty-report .v-clock b{font-family:Manrope,sans-serif;color:#121a2b}.sty-report .v-clock .late b{color:#315bf5}
.sty-report .v-arrow{color:#121a2b}
.sty-report .button{background:#121a2b!important;color:#f6f8fb!important;text-transform:none;box-shadow:none;border-radius:6px;font-family:Manrope,sans-serif;letter-spacing:0}
.sty-report footer{color:#5d6779!important;font-family:Manrope,sans-serif}
.sty-report .contacts{color:#5d6779!important}
.sty-report .fb-cta{background:#121a2b;color:#f6f8fb;border:0;border-radius:6px;box-shadow:none}
/* terminal: prompts */
.sty-terminal.slide{background:#121a2b!important;color:#eef2fa!important;font-family:Manrope,sans-serif;padding-top:160px}
.sty-terminal header{display:none}
.ch-term{position:absolute;top:0;left:0;right:0;height:92px;background:#1b2540;border-bottom:2px solid #2c3a5e;display:flex;align-items:center;gap:16px;padding:0 40px}
.ch-term i{width:26px;height:26px;border-radius:50%;background:#ff5f57}.ch-term i:nth-child(2){background:#febc2e}.ch-term i:nth-child(3){background:#28c840}
.ch-term span{margin-left:auto;margin-right:auto;font:500 28px 'JetBrains Mono',monospace;color:#a9b3c6;transform:translateX(-60px)}
.sty-terminal h1,.sty-terminal h2,.sty-terminal .meme-top{font-family:Manrope,sans-serif;text-transform:none;font-weight:800;letter-spacing:-.025em;color:#fff}
.sty-terminal h1{font-size:92px}.sty-terminal h2{font-size:66px}
.sty-terminal .pr-card p{font-size:37px}
.sty-terminal em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#ffd166!important}
.sty-terminal .kicker{background:none!important;color:#a9b3c6!important;padding:0;font:500 30px 'JetBrains Mono',monospace;letter-spacing:0;text-transform:lowercase;transform:none}
.sty-terminal .kicker:before{content:'// ';width:auto;height:auto;background:none;box-shadow:none;border-radius:0;display:inline}
.sty-terminal .pr-card,.sty-terminal .lv,.sty-terminal .v-paper{background:#1b2540!important;border:2px solid #2c3a5e!important;box-shadow:none!important;color:#eef2fa!important;border-radius:16px;transform:none!important}
.sty-terminal .pr-card p{font-family:'JetBrains Mono',monospace;color:#eef2fa}
.sty-terminal .pr-card p:before{content:'> ';color:#ffd166}
.sty-terminal .pr-tag{color:#ffd166!important;font-family:'JetBrains Mono',monospace}
.sty-terminal .pr-note,.sty-terminal .sub,.sty-terminal .note,.sty-terminal .contacts{color:#a9b3c6!important;font-family:'JetBrains Mono',monospace;font-weight:500}
.sty-terminal .lv p{color:#eef2fa;font-family:'JetBrains Mono',monospace;font-weight:500}.sty-terminal .lv b{background:#315bf5;color:#fff}
.sty-terminal .lv:last-child{background:#2b2a1f!important;border-color:#ffd166!important}.sty-terminal .lv:last-child p{color:#ffd166}
.sty-terminal .list b{background:none;border:0;color:#ffd166;font-family:'JetBrains Mono',monospace;text-align:left}
.sty-terminal .button{background:#315bf5!important;color:#fff!important;border-radius:12px;text-transform:none;letter-spacing:0;box-shadow:none;font-family:'JetBrains Mono',monospace}
.sty-terminal .button em{color:#fff!important}
.sty-terminal footer{color:#a9b3c6!important;font-family:'JetBrains Mono',monospace}
.sty-terminal .meme-bottom{color:#eef2fa!important;font-family:'JetBrains Mono',monospace;font-weight:500;font-size:34px}
.sty-terminal .fb-cta{background:#1b2540;color:#eef2fa;border:2px solid #2c3a5e;box-shadow:none}.sty-terminal .fb-cta em{color:#ffd166!important}
/* memeblack */
.sty-memeblack.slide{background:#121a2b!important;color:#fff!important;font-family:Manrope,sans-serif}
.sty-memeblack .strip{display:none}
.sty-memeblack .logo svg,.sty-poster.bg-ink .logo svg,.sty-editorial.tone-dark .logo svg,.sty-editorial.tone-olive .logo svg,.sty-editorial.bg-ink:not(.tone-light) .logo svg,.sty-editorial.has-photo .logo svg{filter:brightness(0) invert(1)}
.sty-memeblack h1,.sty-memeblack h2,.sty-memeblack .meme-top{font-family:Manrope,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:-.01em;color:#fff;text-align:center;line-height:1.05}
.sty-memeblack .meme-top{font-size:62px}
.sty-memeblack em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#ffd166!important}
.sty-memeblack .m-img{margin:0 auto;border:0!important;border-radius:0!important;box-shadow:none!important}
.sty-memeblack .meme-bottom{text-align:center;color:#fff!important;font-weight:800}
.sty-memeblack .kicker{background:#ffd166!important;color:#121a2b!important;transform:none}.sty-memeblack .kicker:before{display:none}
.sty-memeblack .sub,.sty-memeblack .note,.sty-memeblack .label,.sty-memeblack footer,.sty-memeblack .contacts,.sty-memeblack .tag{color:#fff!important}
.sty-memeblack .msg{box-shadow:none}
.sty-memeblack .vis{color:#fff}
.sty-memeblack .chat,.sty-memeblack .cmp>div{border:0!important}
.sty-memeblack .list b{background:#ffd166;border:0;color:#121a2b}
.sty-memeblack .button{background:#ffd166!important;color:#121a2b!important;box-shadow:none}
.sty-memeblack .button em{color:#121a2b!important}
.sty-memeblack .fb-cta{background:#ffd166;color:#121a2b;border:0;box-shadow:none}
/* notebook: handwriting on squared paper */
.sty-notebook.slide{background-color:#ffffff!important;background-image:linear-gradient(#e6ebf5 2px,transparent 2px),linear-gradient(90deg,#e6ebf5 2px,transparent 2px)!important;background-size:60px 60px!important;color:#121a2b!important;font-family:Manrope,'Noto Sans Manropen',sans-serif}
.sty-notebook h1,.sty-notebook h2,.sty-notebook .meme-top{font-family:Manrope,sans-serif;font-weight:700;text-transform:none;letter-spacing:0;color:#121a2b;line-height:1}
.sty-notebook h1{font-size:84px}.sty-notebook h2,.sty-notebook .meme-top{font-size:60px}
.sty-notebook em{background:linear-gradient(transparent 52%,#ffd166 52%)!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#121a2b!important}
.sty-notebook .kicker{background:none!important;color:#315bf5!important;padding:0;font:800 26px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;transform:none}
.sty-notebook .kicker:before{display:none}
.sty-notebook .list li{font-family:Manrope,sans-serif;font-size:40px;font-weight:600;line-height:1.3}
.sty-notebook .list b{background:none;border:3px solid #315bf5;border-radius:50%;color:#315bf5;width:56px;min-width:56px;height:56px;line-height:50px;font-family:Manrope,sans-serif;font-size:26px;font-weight:800}
.sty-notebook .sub,.sty-notebook .note,.sty-notebook .label{font-family:Manrope,sans-serif;color:#121a2b!important;font-weight:600;text-transform:none;font-size:36px}
.sty-notebook .big{font-family:Manrope,sans-serif;background:none!important;color:#315bf5!important;font-size:240px;font-weight:800}
.sty-notebook .v-paper,.sty-notebook .m-img,.sty-notebook .msg,.sty-notebook .cmp>div,.sty-notebook .m-react{background:#fff1c7!important;border:0!important;box-shadow:0 18px 30px -18px #00000066!important;border-radius:4px!important}
.sty-notebook .v-paper{transform:rotate(-3deg)}.sty-notebook .p-row{font-family:Manrope,sans-serif;font-size:38px;font-weight:600}.sty-notebook .p-head{font-family:Manrope,sans-serif;font-size:24px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#315bf5}
.sty-notebook .box{border-color:#121a2b;border-radius:6px}
.sty-notebook .m-img{padding:18px;background:#fff!important;transform:rotate(2deg)}
.sty-notebook .m-react{padding:30px 40px;transform:rotate(-2deg)}.sty-notebook .m-react p{font-family:Manrope,sans-serif;font-size:38px;font-weight:600;color:#121a2b}
.sty-notebook .button{background:#121a2b!important;color:#fff!important;border-radius:14px;text-transform:none;box-shadow:none;font-family:Manrope,sans-serif;font-size:36px;letter-spacing:0}
.sty-notebook footer,.sty-notebook .contacts{color:#121a2b!important;font-family:Manrope,sans-serif}
.sty-notebook .fb-cta{background:#121a2b;color:#fff;border:0;box-shadow:none}
/* news: real AI stories as a newspaper page */
.sty-news.slide{background:#ffffff!important;color:#121a2b!important;font-family:Manrope,'Noto Sans Manropen',sans-serif;padding-top:170px}
.sty-news header{display:none}
.ch-news{position:absolute;top:56px;left:84px;right:84px;display:flex;justify-content:space-between;align-items:flex-end;border-bottom:6px double #121a2b;padding-bottom:14px}
.ch-news b{background:none!important;border:0!important;padding:0!important;min-width:0!important;width:auto!important;height:auto!important;color:#121a2b!important;line-height:1!important;font:800 46px Manrope,sans-serif!important;letter-spacing:-.03em;text-transform:uppercase}.ch-news span{font:600 24px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#5d6779}
.sty-news h1,.sty-news h2,.sty-news .meme-top{font-family:Manrope,sans-serif;font-weight:700;text-transform:none;letter-spacing:-.015em;color:#121a2b;line-height:1.05}
.sty-news h1{font-size:92px}.sty-news h2{font-size:66px}
.sty-news em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#121a2b!important;box-shadow:inset 0 -.32em 0 #ffd166}
.sty-news .kicker{background:none!important;color:#ff5a5f!important;padding:0;border:0;font:700 26px Manrope,sans-serif;letter-spacing:.12em;transform:none}
.sty-news .kicker:before{display:none}
.sty-news .sub{font-family:Manrope,sans-serif;font-style:italic;color:#3c4658!important;font-weight:400;font-size:40px}
.sty-news .list{gap:34px}
.sty-news .list li{font-family:Manrope,sans-serif;font-weight:400;font-size:41px;line-height:1.3;border-top:2px solid #121a2b;padding-top:22px}
.sty-news .list b{background:none;border:0;color:#ff5a5f;font:700 30px Manrope,sans-serif;min-width:64px;text-align:left;line-height:1.7}
.sty-news .note{font-family:Manrope,sans-serif;font-size:24px;color:#5d6779!important}
.sty-news .big{font-family:Manrope,sans-serif;background:none!important;color:#ff5a5f!important}
.sty-news .label{font-family:Manrope,sans-serif;text-transform:none;font-weight:400;color:#121a2b!important}
.sty-news .button{background:#121a2b!important;color:#ffffff!important;text-transform:none;letter-spacing:0;box-shadow:none;border-radius:4px;font-family:Manrope,sans-serif}
.sty-news .button em{color:#ffffff!important;box-shadow:none}
.sty-news footer,.sty-news .contacts{color:#5d6779!important;font-family:Manrope,sans-serif}
.sty-news .fb-cta{background:#121a2b;color:#ffffff;border:0;border-radius:4px;box-shadow:none}.sty-news .fb-cta em{color:#ffffff!important;box-shadow:none}
/* editorial: one calm look for the whole grid (owner 28 October: "симпатично, органично и эстетично").
   Warm cream, warm ink and olive tiles, Lora headings in sentence case, Inter text, terracotta italic accents, no frames or shadows.
   The cover tone comes from the post's "tone" (light | dark | olive), a "photo" (content/social/photos) fills the cover. */
.sty-editorial.slide{--bg:#f3eee6;--fg:#23211e;--mut:#6f685f;--acc:#b5523b;--card:#faf7f2;--line:#23211e1f;background:var(--bg)!important;color:var(--fg)!important;font-family:Inter,'Noto Sans Georgian',sans-serif;padding:150px 96px 84px}
.sty-editorial.slide.bg-ink{--bg:#23211e;--fg:#f3eee6;--mut:#b9b0a4;--acc:#e0a383;--card:#2f2c28;--line:#f3eee61f}
.sty-editorial.slide.tone-light{--bg:#f3eee6;--fg:#23211e;--mut:#6f685f;--acc:#b5523b;--card:#faf7f2;--line:#23211e1f}
.sty-editorial.slide.tone-dark{--bg:#23211e;--fg:#f3eee6;--mut:#b9b0a4;--acc:#e0a383;--card:#2f2c28;--line:#f3eee61f}
.sty-editorial.slide.tone-olive{--bg:#46503f;--fg:#f3eee6;--mut:#cfd3c4;--acc:#f0c9a8;--card:#525d4a;--line:#f3eee624}
.sty-editorial header{position:absolute;top:64px;left:96px;right:96px;height:auto}
.sty-editorial .logo svg{height:34px}
.sty-editorial .meta{color:var(--mut);opacity:1;font-size:22px;font-weight:500;letter-spacing:.06em}
.sty-editorial .meta .tag{border:0;padding:0;color:var(--mut)!important;font-size:20px;letter-spacing:.1em;text-transform:uppercase}
.sty-editorial footer{color:var(--mut)!important;opacity:1;font-size:22px;font-weight:500;letter-spacing:.04em}
.sty-editorial h1,.sty-editorial h2,.sty-editorial .meme-top{font-family:Lora,'PT Serif',serif;font-weight:500;text-transform:none;letter-spacing:-.015em;color:var(--fg)!important;line-height:1.12}
.sty-editorial h1{font-size:84px}.sty-editorial h2,.sty-editorial .meme-top{font-size:60px;margin-bottom:40px}
.sty-editorial.has-vis h1{font-size:72px}
.sty-editorial em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:var(--acc)!important;font-style:italic;box-shadow:none!important}
.sty-editorial .kicker{align-self:flex-start;display:flex;align-items:center;gap:18px;background:none!important;color:var(--mut)!important;padding:0;border:0;border-radius:0;transform:none;font:600 22px Inter,sans-serif;letter-spacing:.16em;text-transform:uppercase;margin-bottom:34px}
.sty-editorial .kicker:before{content:'';display:block;width:48px;height:2px;border-radius:0;background:var(--acc);box-shadow:none}
.sty-editorial .sub,.sty-editorial .note,.sty-editorial .pr-note,.sty-editorial .contacts,.sty-editorial .label{color:var(--mut)!important;font-weight:400;text-transform:none}
.sty-editorial .sub{font-size:36px;line-height:1.4;margin-top:34px}
.sty-editorial .label{font-family:Lora,serif;font-size:46px;line-height:1.3;color:var(--fg)!important}
.sty-editorial .note{font-size:24px;border-top:1px solid var(--line);padding-top:18px}
.sty-editorial .big{font-family:Lora,serif;font-weight:500;background:none!important;color:var(--acc)!important;font-size:220px;letter-spacing:-.03em}
.sty-editorial .list{gap:0}
.sty-editorial .list li{font-weight:400;font-size:38px;line-height:1.38;color:var(--fg);border-top:1px solid var(--line);padding:26px 0}
.sty-editorial .list li:last-child{border-bottom:1px solid var(--line)}
.sty-editorial .list b{background:none;border:0;border-radius:0;color:var(--acc);font:italic 500 30px Lora,serif;min-width:64px;text-align:left;line-height:1.75}
/* cards and visuals: soft paper, no frames */
.sty-editorial .vis{color:var(--fg)}
.sty-editorial .v-chat,.sty-editorial .chat,.sty-editorial .v-paper,.sty-editorial .pr-card,.sty-editorial .cmp>div,.sty-editorial .m-expect>div,.sty-editorial .lv,.sty-editorial .tile,.sty-editorial .cal,.sty-editorial .side,.sty-editorial .info>div{background:var(--card)!important;color:var(--fg)!important;border:0!important;box-shadow:none!important;transform:none!important;border-radius:28px}
.sty-editorial .v-chat .ph-head{background:transparent;color:var(--mut);border-bottom:1px solid var(--line);font-weight:600}
.sty-editorial .msg{box-shadow:none;background:var(--bg);color:var(--fg)}.sty-editorial .msg.bot{background:#dfe6d6;color:#23211e}
.sty-editorial .v-badge{background:var(--acc);border:0;transform:rotate(0);border-radius:999px;font-size:22px}
.sty-editorial .bub{position:static;display:inline-block;margin:0 14px 18px 0;transform:none!important;box-shadow:none!important;border:1px solid var(--line)!important;background:transparent!important;color:var(--fg)!important;font-weight:500;border-radius:999px}
.sty-editorial .v-bubbles{height:auto}
.sty-editorial .p-head,.sty-editorial .v-clock small,.sty-editorial .cmp h3,.sty-editorial .m-expect span{color:var(--mut)!important}
.sty-editorial .box{border:1.5px solid var(--mut);border-radius:50%}.sty-editorial .box.on{background:var(--acc);border-color:var(--acc);color:#fff}
.sty-editorial .v-clock b,.sty-editorial .cal b{font-family:Lora,serif;font-weight:500}.sty-editorial .v-clock .late b{color:var(--acc)}
.sty-editorial .v-arrow{color:var(--acc)}
.sty-editorial .cal b,.sty-editorial .c-foot{color:var(--fg)!important}.sty-editorial .c-foot{color:var(--mut)!important}
.sty-editorial .c-head{color:#fff;background:var(--acc);font-family:Inter,sans-serif;letter-spacing:.14em}
.sty-editorial .c-side{font-family:Lora,serif;font-weight:500;text-transform:none;color:var(--fg)}
.sty-editorial .dot{background:var(--card);border:0;box-shadow:none;color:var(--acc)}
.sty-editorial .v-flow .step{font-weight:500}
.sty-editorial .vs{color:var(--acc)}
.sty-editorial .cmp .after,.sty-editorial .m-expect .real,.sty-editorial .lv:last-child{background:#e9d9c8!important;color:#23211e!important}
.sty-editorial .lv b{background:var(--fg);color:var(--bg)}.sty-editorial .lv p{color:inherit;font-weight:500}
.sty-editorial .pr-card p{font-family:'JetBrains Mono',monospace;font-size:31px;color:var(--fg)}.sty-editorial .pr-tag{color:var(--acc)!important}
.sty-editorial .info dt{color:var(--mut)}
.sty-editorial .m-img{border:0!important;border-radius:22px!important;overflow:hidden;box-shadow:none!important;margin:0 auto}
.sty-editorial .mb.pill{box-shadow:none}
.sty-editorial .m-react{background:var(--card);border-radius:28px;padding:44px}.sty-editorial .m-react .em{font-size:84px!important}.sty-editorial .m-react p{font-family:Lora,serif;font-style:italic;font-weight:400;font-size:44px;color:var(--fg)}
.sty-editorial .meme-bottom{color:var(--fg)!important;font-family:Lora,serif;font-weight:500}
.sty-editorial .m-buttons .btn2 p{font-family:Inter,sans-serif}
.sty-editorial .button{background:var(--fg)!important;color:var(--bg)!important;border-radius:999px;text-transform:none;letter-spacing:0;font-weight:600;box-shadow:none;font-family:Inter,sans-serif}
.sty-editorial .button em{color:var(--bg)!important;font-style:normal}
.sty-editorial .fb-cta{background:var(--card);color:var(--fg);border:0;box-shadow:none;border-radius:24px}
.sty-editorial .fb-cta em{font-style:italic}
/* photo cover */
.sty-editorial.has-photo{background-size:cover!important;background-position:center!important}
.sty-editorial.has-photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,#00000040 0%,#0000 30%,#0000 42%,#1a1714d9 100%);z-index:0}
.sty-editorial.has-photo>*{position:relative;z-index:1}.sty-editorial.has-photo header{position:absolute}
.sty-editorial.has-photo{--fg:#f6f1ea;--mut:#e7dfd4;--acc:#f2c7a5}
.sty-editorial.has-photo main{justify-content:flex-end}
/* chat: a WhatsApp screen */
.sty-chat.slide{background-color:#efeae2!important;background-image:radial-gradient(#00000010 2px,transparent 2px)!important;background-size:40px 40px!important;color:#111b21!important;font-family:Manrope,sans-serif;padding-top:200px}
.sty-chat header{display:none}
.ch-chat{position:absolute;top:0;left:0;right:0;height:140px;background:#121a2b;color:#fff;display:flex;align-items:center;gap:22px;padding:0 40px}
.ch-chat .bk{font-size:64px;line-height:1}.ch-chat .av{width:84px;height:84px;border-radius:50%;background:#dfe5e7;color:#54656f;display:grid;place-items:center;font:700 38px Manrope,sans-serif}
.ch-chat .nm{display:flex;flex-direction:column;font:700 36px Manrope,sans-serif}.ch-chat .nm small{font-weight:500;font-size:26px;opacity:.8}
.sty-chat h1,.sty-chat h2,.sty-chat .meme-top{font-family:Manrope,sans-serif;text-transform:none;font-weight:700;letter-spacing:-.01em;color:#111b21;align-self:flex-start;background:#fff;padding:26px 34px;border-radius:0 28px 28px 28px;box-shadow:0 2px 0 #0000001a;max-width:92%;line-height:1.2}
.sty-chat h1{font-size:62px}.sty-chat h2,.sty-chat .meme-top{font-size:48px}
.sty-chat em{background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#315bf5!important}
.sty-chat .kicker{align-self:center;background:#ffffffd0!important;color:#54656f!important;transform:none;border-radius:14px;font:600 24px Manrope,sans-serif;letter-spacing:.04em;padding:10px 22px}
.sty-chat .kicker:before{display:none}
.sty-chat h1,.sty-chat h2{max-width:100%}
.sty-notes .c-side,.sty-post .c-side{color:#121a2b!important}
.sty-chat .m-react{align-self:flex-end;background:#d9fdd3;padding:28px 34px;border-radius:28px 0 28px 28px;box-shadow:0 2px 0 #0000001a;max-width:88%}
.sty-chat .m-react p{color:#111b21}
.sty-chat .chat,.sty-chat .v-chat{background:transparent!important;border:0!important;box-shadow:none!important;padding:0}
.sty-chat .v-chat .ph-head{display:none}
.sty-chat .msg{box-shadow:0 2px 0 #0000001a}
.sty-chat .sub,.sty-chat .note,.sty-chat .label{color:#3b4a54!important;text-transform:none}
.sty-chat .list{background:#fff;border-radius:28px;padding:34px}
.sty-chat .list b{background:#315bf5;border:0;color:#fff;border-radius:50%}
.sty-chat .button{background:#315bf5!important;color:#fff!important;text-transform:none;box-shadow:none;letter-spacing:0}
.sty-chat .button em{color:#fff!important}
.sty-chat footer{color:#54656f!important}
.sty-chat .fb-cta{background:#121a2b;color:#fff;border:0;box-shadow:none}.sty-chat .fb-cta em{color:#d9fdd3!important}

/* Praxen palette and type for all the styles (owner 28 October: the site and workshop colours, Manrope) */
.sty:not(.sty-editorial).slide{font-family:Manrope,'Noto Sans Georgian',sans-serif}
.sty:not(.sty-editorial) h1,.sty:not(.sty-editorial) h2,.sty:not(.sty-editorial) .meme-top{font-family:Manrope,'Noto Sans Georgian',sans-serif;font-weight:800;letter-spacing:-.03em}
.sty:not(.sty-editorial) .big,.sty:not(.sty-editorial) .label,.sty:not(.sty-editorial) .list li,.sty:not(.sty-editorial) .sub{font-family:Manrope,'Noto Sans Georgian',sans-serif}
.sty-report em,.sty-news em,.sty-news .sub,.sty-report .sub{font-style:normal}
.sty-report .big{font-weight:800}
`;

// Stories: Instagram covers the top ~250 px and the bottom ~340 px with its interface.
const storyCss=`.slide{padding:250px 84px 330px}.strip{top:180px}
.sty.slide{padding-top:400px!important;padding-bottom:360px!important}
.ch-notes,.ch-post,.ch-report,.ch-news{top:200px}.sty-editorial header{top:190px!important}.ch-term,.ch-chat{top:150px}.ch-post-foot{bottom:270px}.sty header{margin-top:-140px}
.sty.slide h1{font-size:108px}.sty.slide h2,.sty.slide .meme-top{font-size:88px}
.sty-poster.slide h1{font-size:100px}.sty-poster.slide h2{font-size:84px}
.sty-chat.slide h1{font-size:80px}.sty-notebook.slide h1{font-size:108px}.sty-notebook.slide h2,.sty-notebook.slide .meme-top{font-size:88px}
.sty.slide .sub,.sty.slide .pr-note{font-size:46px}.sty.slide .bub{font-size:46px}.sty.slide .pr-card p{font-size:44px}
.sty.slide .msg,.sty.slide .v-chat .msg{font-size:42px}.sty.slide .m-react p{font-size:52px}.sty.slide .list li{font-size:50px}`;

const page=(slides,l)=>`<!doctype html><html lang="${l}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Georgian:wght@400;500;600;700;800&display=swap">
<style>${fontFaces}${css}${theme==='workshop'?workshopCss:''}${skinCss}${batch.size==='story'?storyCss:''}</style></head><body>${slides}</body></html>`;

// Shrinks text marked .fit until the slide content fits; Georgian runs longer than Russian or English.
const fitScript=()=>{
 for(const el of document.querySelectorAll('.fitbox')){let g=30;while((el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1)&&g--){el.style.fontSize=(parseFloat(getComputedStyle(el).fontSize)*0.92)+'px'}}
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
const ctx=await browser.newContext({viewport:{width:W,height:H},deviceScaleFactor:1});
const pageObj=await ctx.newPage();
const posts=batch.posts.filter(p=>!onlyId||p.id===onlyId);
for(const post of posts){
 const dir=join(outDir,post.id);
 if(!onlyLang&&!coverOnly) rmSync(dir,{recursive:true,force:true});
 mkdirSync(dir,{recursive:true});
 for(const l of langs){
  // Facebook gets the cover alone (several photos are cropped into a grid): <lang>-fb.jpg, without "1/3" and "Swipe".
  if(batch.size!=='story'&&post.slides.length>1){
   await pageObj.setContent(page(slideHtml(post.slides[0],l,0,1,post.accent,true,post.style,post),l),{waitUntil:'networkidle'});
   await pageObj.evaluate(()=>document.fonts.ready);
   await pageObj.evaluate(fitScript);
   await pageObj.screenshot({path:join(dir,`${l}-fb.jpg`),type:'jpeg',quality:90});
  }
  if(coverOnly) continue;
  for(const [i,s] of post.slides.entries()){
   await pageObj.setContent(page(slideHtml(s,l,i,post.slides.length,post.accent,false,post.style,post),l),{waitUntil:'networkidle'});
   await pageObj.evaluate(()=>document.fonts.ready);
   await pageObj.evaluate(fitScript);
   await pageObj.screenshot({path:join(dir,`${l}-${i+1}.jpg`),type:'jpeg',quality:90});
  }
 }
 if(coverOnly){console.log(`${post.id}: Facebook cover`);continue;}
 // Captions with the tracked link, ready to paste.
 const link=(l)=>{const u=new URL(post.link||'https://'+siteName+'/'+l);if(!post.link) u.pathname=l==='en'?'/':'/'+l;else u.pathname=u.pathname.replace(/^\/(ka|ru|en)(?=\/|$)/,l==='en'?'':'/'+l)||'/';
  u.searchParams.set('utm_source',process.env.UTM_SOURCE||'facebook');u.searchParams.set('utm_medium','social');u.searchParams.set('utm_campaign',batch.campaign||'organic');u.searchParams.set('utm_content',post.id);return u.toString();};
 const md=[`# ${post.id} · ${post.date} · ${post.pillar}`,''];
 for(const l of langs) md.push(`## ${l}`,'',tr(post.text,l).replace('{link}',link(l)),'');
 // Facebook page default: Georgian slides, one caption in Georgian then Russian (tracked link in the Georgian part, plain praxenai.ge/ru in the Russian).
  // "channels": one ready caption per network, each with its own utm_source. Instagram captions have no clickable links,
 // Threads takes the short "threads" text (500 characters with the link), Telegram goes without hashtags.
 if(batch.channels) for(const ch of batch.channels){
  const l=batch.channelLang||langs[0],url=link(l).replace(/utm_source=[^&]+/,'utm_source='+ch),full=tr(post.text,l);
  const tags=full.match(/\n\n(#[^\n]+)\s*$/),body=tags?full.slice(0,tags.index):full;
  // Threads: a thread of 3–6 posts (not numbered, owner 26 October), each ≤500 characters; the link goes where {link} stands (the last post).
  const thread=Array.isArray(post.threads)?post.threads:null;
  if(ch==='threads'&&thread){const parts=thread.map(x=>tr(x,l).replace('{link}',url));
   parts.forEach((x,k)=>{if(x.length>500)throw new Error(`${post.id}: Threads ${k+1} is ${x.length} > 500`)});
   md.push(`## threads · ветка из ${parts.length}`+(post.time?` · ${post.date} ${post.time} (Тбилиси)`:''),'',parts.join('\n\n---\n\n'),'');continue;}
  const t=ch==='instagram'?full.replace('{link}','ссылка в шапке профиля'):ch==='threads'?tr(post.threads||post.text,l).replace('{link}',url):ch==='telegram'?body.replace('{link}',url):ch==='linkedin'?body.replace('{link}',url)+(tags?'\n\n'+tags[1].split(' ').slice(0,3).join(' '):''):full.replace('{link}',url);
  if(ch==='threads'&&t.length>500) throw new Error(post.id+': Threads text '+t.length+' > 500');
  md.push(`## ${ch}`+(post.time?` · ${post.date} ${post.time} (Тбилиси)`:''),'',t,'');
 }
 if(langs.includes('ka')&&langs.includes('ru')) md.push('## facebook: ka + ru','',tr(post.text,'ka').replace('{link}',link('ka')),'','—','',tr(post.text,'ru').replace('{link}','praxenai.ge/ru'),'');
 writeFileSync(join(dir,'captions.md'),md.join('\n'));
 console.log(`${post.id}: ${post.slides.length} slide(s) × ${langs.length} lang`);
}
await browser.close();

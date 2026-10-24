import {chromium} from '/opt/node-tools/node_modules/playwright/index.mjs';
import {writeFileSync,mkdirSync} from 'node:fs';
const DIR=new URL('.',import.meta.url).pathname,OUT=DIR+'out/';mkdirSync(OUT,{recursive:true});
const F=DIR+'node_modules/@fontsource/manrope/files/';
const face=w=>['cyrillic','latin'].map(s=>`@font-face{font-family:M;font-weight:${w};src:url(file://${F}manrope-${s}-${w}-normal.woff2)}`).join('');
const SIZES={sq:[1080,1080],wide:[1920,1080],tall:[1080,1440],land:[1440,1080]};
const mark=(dark)=>`<svg viewBox="0 0 22 24" style="height:1em;width:auto;display:block"><rect width="8" height="24" fill="${dark?'#fff':'#121a2b'}"/><rect x="10" width="12" height="12" fill="${dark?'#7b95ff':'#315bf5'}"/></svg>`;
const logo=(dark)=>`<div class="logo">${mark(dark)}<span>praxen<i>ai</i></span></div>`;
const info=`<dl class="info"><div><dt>Дата</dt><dd>12.11</dd></div><div><dt>Астана</dt><dd>20:00</dd></div><div class="y"><dt>Вход</dt><dd>Бесплатно</dd></div></dl>`;
const cta=(t='Занять место')=>`<span class="cta">${t}<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const base=(W,H)=>{const u=Math.min(W,H)/100;return `${face(500)}${face(700)}${face(800)}
*{box-sizing:border-box;margin:0;padding:0}body{width:${W}px;height:${H}px;overflow:hidden;font-family:M,sans-serif;color:#121a2b;-webkit-font-smoothing:antialiased}
:root{--u:${u}px;--y:#ffd166;--ink:#121a2b;--grad:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%)}
.logo{display:flex;align-items:center;gap:calc(var(--u)*1.1);font-size:calc(var(--u)*3.6);font-weight:800;letter-spacing:-.02em}.logo i{font-style:normal;font-weight:500;opacity:.55;margin-left:.08em}
.badge{display:inline-flex;align-items:center;gap:calc(var(--u)*1.2);padding:calc(var(--u)*1.1) calc(var(--u)*2.2);border-radius:999px;background:var(--ink);color:#fff;font-size:calc(var(--u)*2.1);font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.badge:before{content:'';width:calc(var(--u)*1.3);height:calc(var(--u)*1.3);border-radius:50%;background:#ff5a5f;box-shadow:0 0 0 calc(var(--u)*.5) #ff5a5f44}
.grad{background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent}
.info{display:flex;border:calc(var(--u)*.3) solid var(--ink);border-radius:calc(var(--u)*2.2);overflow:hidden;background:#fff;color:var(--ink)}
.info>div{padding:calc(var(--u)*1.8) calc(var(--u)*2.6)}.info>div+div{border-left:calc(var(--u)*.3) solid var(--ink)}.info .y{background:var(--y)}
.info dt{font-size:calc(var(--u)*1.6);font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}.info .y dt{color:#3c4658}
.info dd{margin-top:calc(var(--u)*.8);font-size:calc(var(--u)*4.4);font-weight:800;letter-spacing:-.03em;line-height:1;white-space:nowrap}
.cta{display:inline-flex;align-items:center;gap:calc(var(--u)*1.4);height:calc(var(--u)*9.5);padding:0 calc(var(--u)*5);border-radius:999px;background:var(--grad);color:#fff;font-size:calc(var(--u)*2.9);font-weight:800;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 calc(var(--u)*1.6) calc(var(--u)*4) #4f66f04d;white-space:nowrap}
.cta svg{width:1.1em;height:1.1em}
.strip{position:absolute;left:0;right:0;top:0;height:calc(var(--u)*5.6);display:flex;align-items:center;gap:calc(var(--u)*2);padding:0 calc(var(--u)*5);background:var(--y);border-bottom:calc(var(--u)*.3) solid var(--ink);font-size:calc(var(--u)*2);font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden}
`};
const wide=(W,H)=>W/H>1.5;
// A — заголовок лендинга
function A(W,H){const w=wide(W,H),tall=H>W;return `<style>${base(W,H)}
body{background:#fff}.wrap{position:absolute;inset:calc(var(--u)*5.6) 0 0 0;padding:${tall?'calc(var(--u)*7) calc(var(--u)*7)':'calc(var(--u)*5) calc(var(--u)*7)'};display:flex;flex-direction:column;justify-content:space-between}
h1{font-size:calc(var(--u)*${w?8.6:tall?10.6:9.4});line-height:.98;font-weight:800;letter-spacing:-.035em;text-transform:uppercase;margin:calc(var(--u)*3) 0}
.row{display:flex;${w?'align-items:center;gap:calc(var(--u)*4)':'flex-direction:column;align-items:flex-start;gap:calc(var(--u)*3.4)'}}</style>
<div class="strip">Бесплатный воркшоп ● 12 ноября ● 20:00 по Астане ● 45 минут онлайн ● ИИ в отделе продаж ● Бесплатный воркшоп</div>
<div class="wrap">${logo()}<div><span class="badge">Бесплатный онлайн-воркшоп</span><h1>Как перестать терять заявки <span class="grad">ночью и в выходные</span></h1></div><div class="row">${info}${cta()}</div></div>`}
// B — переписка и CRM
function B(W,H){const w=wide(W,H),tall=H>W;return `<style>${base(W,H)}
body{background:var(--grad);color:#fff}.wrap{position:absolute;inset:0;padding:calc(var(--u)*6.5) calc(var(--u)*7);display:${w?'grid;grid-template-columns:1.05fr 1fr;gap:calc(var(--u)*6);align-items:center':'flex;flex-direction:column;justify-content:space-between'}}
.st{display:inline-block;transform:rotate(-3deg);padding:calc(var(--u)*1) calc(var(--u)*2);border-radius:calc(var(--u)*1);background:var(--y);color:var(--ink);font-size:calc(var(--u)*2.1);font-weight:800;letter-spacing:.08em;text-transform:uppercase}
h2{font-size:calc(var(--u)*${w?7.6:tall?8.6:7.4});line-height:1;font-weight:800;letter-spacing:-.035em;text-transform:uppercase;margin:calc(var(--u)*2.6) 0 calc(var(--u)*2.4)}
.when{font-size:calc(var(--u)*2.9);font-weight:700;opacity:.95}.when b{color:var(--y)}
.phone{position:relative;background:#efeae2;border-radius:calc(var(--u)*3);overflow:visible;color:#111b21;box-shadow:0 calc(var(--u)*3) calc(var(--u)*7) #0b145333;${w?'':'margin:calc(var(--u)*3) 0'}}
.ph{display:flex;align-items:center;gap:calc(var(--u)*1.4);padding:calc(var(--u)*1.8) calc(var(--u)*2.4);background:#075e54;color:#fff;border-radius:calc(var(--u)*3) calc(var(--u)*3) 0 0;font-size:calc(var(--u)*2.3);font-weight:800}
.ph small{display:block;font-size:calc(var(--u)*1.6);font-weight:500;opacity:.85}.ph .dot{width:calc(var(--u)*4.4);height:calc(var(--u)*4.4);border-radius:50%;background:#25d366;display:grid;place-items:center;font-size:calc(var(--u)*2.2)}
.msgs{padding:calc(var(--u)*2.4);display:flex;flex-direction:column;gap:calc(var(--u)*1.3);padding-bottom:calc(var(--u)*${w?13:12})}
.m{max-width:82%;padding:calc(var(--u)*1.3) calc(var(--u)*1.8);border-radius:calc(var(--u)*1.6);background:#fff;font-size:calc(var(--u)*2.2);font-weight:500;line-height:1.35}.m.o{align-self:flex-end;background:#d9fdd3}
.m i{display:block;text-align:right;font-style:normal;font-size:calc(var(--u)*1.4);color:#667781;margin-top:calc(var(--u)*.4)}
.crm{position:absolute;right:calc(var(--u)*-2.4);bottom:calc(var(--u)*-3);width:62%;background:#fff;border-radius:calc(var(--u)*2);padding:calc(var(--u)*2) calc(var(--u)*2.4);box-shadow:0 calc(var(--u)*2) calc(var(--u)*5) #0b145340;color:var(--ink)}
.crm b{display:block;color:#2755ec;font-size:calc(var(--u)*2);font-weight:800;margin-bottom:calc(var(--u)*1)}.crm p{font-size:calc(var(--u)*1.9);font-weight:700;line-height:1.5}.crm span{color:#5d6779;font-weight:500}
.bottom{display:flex;align-items:center;justify-content:space-between;gap:calc(var(--u)*3)}.cta{background:var(--y);color:var(--ink);box-shadow:none}</style>
<div class="wrap"><div>${logo(true)}<div style="margin-top:calc(var(--u)*${w?5:4})"><span class="st">Покажем вживую на воркшопе</span><h2>Ответ за секунды. Сделка — уже в CRM.</h2><p class="when">Бесплатно · 12 ноября · <b>20:00 по Астане</b></p></div>${w?`<div style="margin-top:calc(var(--u)*5)">${cta()}</div>`:''}</div>
<div class="phone"><div class="ph"><span class="dot">✓</span><div>WhatsApp<small>ассистент на связи</small></div></div><div class="msgs">
<div class="m">Здравствуйте! Сколько стоит ремонт кухни 12 м²?<i>23:40</i></div><div class="m o">Здравствуйте! Подскажу. Какой у вас бюджет и к какому сроку нужно закончить?<i>23:40</i></div></div>
<div class="crm"><b>Новая сделка в CRM</b><p><span>Клиент:</span> Анна, WhatsApp<br><span>Задача:</span> ремонт кухни<br><span>Шаг:</span> позвонить утром</p></div></div>
${w||!tall?'':`<div class="bottom">${cta()}</div>`}</div>`}
// C — 23:40 / 09:30
function C(W,H){const w=wide(W,H),tall=H>W;return `<style>${base(W,H)}
body{background:var(--ink);color:#fff}.wrap{position:absolute;inset:0;padding:calc(var(--u)*7);display:flex;flex-direction:column;justify-content:space-between}
p.big{font-size:calc(var(--u)*${w?8.4:tall?8.6:7.6});line-height:1.08;font-weight:800;letter-spacing:-.03em;max-width:${w?'80%':'100%'}}
.yy{color:var(--y)}.rr{color:#ff6b6b}.mut{color:#ffffffb3}
.foot{display:flex;${w?'align-items:flex-end;justify-content:space-between':'flex-direction:column;align-items:flex-start;gap:calc(var(--u)*3.2)'};gap:calc(var(--u)*3)}
.foot h3{font-size:calc(var(--u)*3.6);font-weight:800;letter-spacing:-.02em;margin:calc(var(--u)*2) 0 calc(var(--u)*1)}.foot .t{font-size:calc(var(--u)*2.8);font-weight:700;color:#ffffffd9}.foot .t b{color:var(--y)}
.badge{background:#fff;color:var(--ink)}.foot .cta{background:var(--y);color:var(--ink);box-shadow:none}</style>
<div class="wrap">${logo(true)}<p class="big">Клиент написал в <span class="yy">23:40.</span> Вы ответили в <span class="rr">09:30.</span> <span class="mut">За это время он уже написал конкурентам.</span></p>
<div class="foot"><div><span class="badge">Бесплатный онлайн-воркшоп</span><h3>ИИ в отделе продаж: отвечаем ночью и в выходные</h3><p class="t">12 ноября · <b>20:00 по Астане</b> · 45 минут</p></div>${cta()}</div></div>`}
const b=await chromium.launch();const pg=await b.newPage();
for(const [cn,fn] of Object.entries({A,B,C}))for(const [sn,[W,H]] of Object.entries(SIZES)){
 await pg.setViewportSize({width:W,height:H});const f=`${DIR}tmp.html`;writeFileSync(f,`<!doctype html><meta charset="utf-8">${fn(W,H)}`);
 await pg.goto('file://'+f);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(150);
 const over=await pg.evaluate(()=>[...document.querySelectorAll('body *')].some(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1||r.bottom>innerHeight+1})&&'overflow');
 await pg.screenshot({path:`${OUT}KZ_${cn}_${sn}_${W}x${H}.png`});console.log(cn,sn,W,H,over||'');
}
await b.close();

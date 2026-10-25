// Profile kit for the workshop period (25 Oct – 12 Nov 2026) in the workshop landing style:
// Facebook and LinkedIn covers, Instagram highlight covers, stories, Telegram pinned post image.
//
//   node scripts/social/profile-kit.mjs            → brand/social-2026-11/*.png
//
// Texts and where each file goes: docs/SOCIAL-PROFILES.md. Playwright is taken from the project or the global install.
import {readFileSync,mkdirSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const out=join(root,'brand/social-2026-11');mkdirSync(out,{recursive:true});
const svg=f=>readFileSync(join(root,'brand',f),'utf8');
const logoDark=svg('praxen-logo.svg'),logoWhite=svg('praxen-logo-white.svg'),markWhite=svg('praxen-mark-white.svg');
async function loadPlaywright(){try{return await import('playwright');}catch{}const g=execSync('npm root -g').toString().trim();return import(pathToFileURL(join(g,'playwright/index.mjs')).href);}

const strip='Бесплатный воркшоп ● 12 ноября ● 19:00 Тбилиси ● 20:00 Астана ● 18:00 Москва ● 45 минут онлайн ● ИИ в отделе продаж ●';
const icon={msg:'<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.7A8.4 8.4 0 1 1 21 11.5z"/>',bot:'<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9.5 17h5"/>',
 steps:'<path d="M4 6h16M4 12h10M4 18h6"/>',tag:'<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.5"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5h.01"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'};
const ico=(k)=>`<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icon[k]}</svg>`;

const css=`*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Manrope,sans-serif;-webkit-font-smoothing:antialiased;color:#121a2b;overflow:hidden}
.c{position:relative;overflow:hidden;background:#fff}
.strip{position:absolute;left:0;right:0;top:0;display:flex;align-items:center;background:#ffd166;border-bottom:3px solid #121a2b;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden}
.grad{background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%)}
.gt{background:linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.ink{background:#121a2b;color:#fff}.yel{background:#ffd166}
h1{font-weight:800;text-transform:uppercase;letter-spacing:-.035em;line-height:.98}
.badge{display:inline-flex;align-items:center;gap:.6em;background:#121a2b;color:#fff;border-radius:999px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.badge:before{content:'';width:.6em;height:.6em;border-radius:50%;background:#ff5a5f;box-shadow:0 0 0 .25em #ff5a5f44}
.info{display:inline-flex;border:3px solid #121a2b;border-radius:20px;overflow:hidden;background:#fff;color:#121a2b}
.info>div{padding:.45em .7em}.info>div+div{border-left:3px solid #121a2b}.info>div:last-child{background:#ffd166}
.info dt{font-size:.36em;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#5d6779}.info dd{font-size:1em;font-weight:800;letter-spacing:-.03em;line-height:1;margin-top:.15em;white-space:nowrap}
.cal{flex:none;background:#fff;border:3px solid #121a2b;border-radius:28px;overflow:hidden;box-shadow:12px 12px 0 #121a2b;text-align:center;color:#121a2b}
.cal .h{background:#ff5a5f;color:#fff;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.cal b{display:block;font-weight:800;letter-spacing:-.06em;line-height:1.05}.cal .f{font-weight:800;color:#3c4658}
.ico{width:1em;height:1em}
.logo svg{height:100%;width:auto;display:block}`;
const info=`<dl class="info"><div><dt>Дата</dt><dd>12.11</dd></div><div><dt>Тбилиси</dt><dd>19:00</dd></div><div><dt>Астана</dt><dd>20:00</dd></div><div><dt>Вход</dt><dd>Бесплатно</dd></div></dl>`;
const cal=(sz,foot='четверг · онлайн')=>`<div class="cal" style="width:${sz}px"><div class="h" style="font-size:${sz*.09}px;padding:${sz*.045}px">Ноябрь</div><b style="font-size:${sz*.56}px">12</b><div class="f" style="font-size:${sz*.07}px;padding-bottom:${sz*.07}px">${foot}</div></div>`;

const items={
 // Facebook page cover: mobile crops the sides and the page photo covers the bottom centre, so everything sits in the top middle.
 'facebook-cover-1640x624':[1640,624,`<div class="c" style="width:1640px;height:624px">
  <div class="strip" style="height:54px;padding-left:40px;font-size:22px">${strip} ${strip}</div>
  <div style="position:absolute;left:250px;right:250px;top:96px;display:flex;align-items:center;justify-content:space-between;gap:40px">
   <div><span class="badge" style="font-size:20px;padding:10px 20px">Бесплатный онлайн-воркшоп</span>
    <h1 style="font-size:66px;margin-top:20px">Как перестать терять заявки <span class="gt">ночью и в выходные</span></h1>
    <div style="font-size:40px;margin-top:26px">${info}</div></div>
   ${cal(250)}</div></div>`],
 // LinkedIn company page: the logo covers the left part, text goes right.
 'linkedin-company-cover-1128x191':[1128,191,`<div class="c grad" style="width:1128px;height:191px;color:#fff">
  <div style="position:absolute;right:48px;top:0;bottom:0;display:flex;align-items:center;gap:30px">
   <div style="text-align:right"><div style="font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#ffd166">Бесплатный воркшоп · 12 ноября · онлайн</div>
    <h1 style="font-size:38px;margin-top:8px;color:#fff">ИИ в отделе продаж</h1>
    <div style="font-size:17px;font-weight:700;margin-top:8px;opacity:.9">19:00 Тбилиси · 20:00 Астана · 18:00 Москва · praxenai.ge</div></div></div></div>`],
 // LinkedIn personal profile: the photo sits bottom left, text goes right.
 'linkedin-profile-banner-1584x396':[1584,396,`<div class="c" style="width:1584px;height:396px">
  <div class="strip" style="height:46px;padding-left:30px;font-size:18px">${strip} ${strip}</div>
  <div style="position:absolute;right:70px;top:80px;bottom:30px;display:flex;align-items:center;gap:44px">
   <div><span class="badge" style="font-size:17px;padding:9px 18px">Евгений Будников · основатель Praxen AI</span>
    <h1 style="font-size:58px;margin-top:18px">ИИ отвечает клиентам <span class="gt">за секунды</span><br>и сам заполняет CRM</h1></div>
   ${cal(200,'воркшоп · онлайн')}</div></div>`],
 // Telegram channel pinned post and link preview (16:9).
 'telegram-pinned-1280x720':[1280,720,`<div class="c ink" style="width:1280px;height:720px">
  <div class="strip" style="height:56px;padding-left:40px;font-size:22px;color:#121a2b">${strip} ${strip}</div>
  <div style="position:absolute;left:70px;right:70px;top:120px;bottom:60px;display:flex;align-items:center;justify-content:space-between;gap:50px">
   <div><span class="badge" style="font-size:20px;padding:10px 20px;background:#fff;color:#121a2b">Бесплатный онлайн-воркшоп</span>
    <h1 style="font-size:70px;margin-top:22px;color:#fff">Как перестать терять заявки <span style="color:#ffd166">ночью и в выходные</span></h1>
    <div style="font-size:40px;margin-top:30px">${info}</div></div>
   ${cal(300)}</div></div>`],
};
// Instagram highlight covers: the icon must sit inside the centre circle.
const hl=[['hl-workshop','cal','Воркшоп','grad'],['hl-how','steps','Как работаем','ink'],['hl-solutions','bot','Решения','yel'],['hl-prices','tag','Цены','grad'],['hl-faq','help','Вопросы','ink'],['hl-contacts','phone','Контакты','yel']];
for(const [id,k,label,bg] of hl) items['instagram-'+id+'-1080x1920']=[1080,1920,`<div class="c ${bg}" style="width:1080px;height:1920px;display:flex;align-items:center;justify-content:center">
  <div style="width:560px;height:560px;border-radius:50%;background:${bg==='yel'?'#121a2b':'#fff'};color:${bg==='yel'?'#ffd166':'#2755ec'};display:grid;place-items:center;font-size:300px;border:6px solid #121a2b">${ico(k)}</div>
  <div style="position:absolute;bottom:420px;left:0;right:0;text-align:center;font-size:64px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:${bg==='yel'?'#121a2b':'#fff'}">${label}</div></div>`];
// Stories: nothing important in the top 250 px and the bottom 340 px (Instagram UI).
const story=(id,bg,kicker,title,sub,extra='')=>items['story-'+id+'-1080x1920']=[1080,1920,`<div class="c ${bg}" style="width:1080px;height:1920px;${bg==='ink'||bg==='grad'?'color:#fff':''}">
  <div class="strip" style="top:250px;height:64px;padding-left:40px;font-size:24px;color:#121a2b">${strip} ${strip}</div>
  <div style="position:absolute;left:80px;right:80px;top:400px;bottom:360px;display:flex;flex-direction:column;justify-content:center;gap:40px">
   <div style="height:56px" class="logo">${bg==='ink'||bg==='grad'?logoWhite:logoDark}</div>
   <span class="badge" style="align-self:flex-start;font-size:28px;padding:14px 28px;${bg!=='white'?'background:#fff;color:#121a2b':''}">${kicker}</span>
   <h1 style="font-size:112px">${title}</h1>
   <div style="font-size:44px;font-weight:700;line-height:1.3">${sub}</div>${extra}</div></div>`];
story('today','grad','Сегодня, 12 ноября','Воркшоп <span style="color:#ffd166">«ИИ в отделе продаж»</span>','19:00 Тбилиси · 20:00 Астана · 18:00 Москва<br>Последний шанс записаться',`<div style="margin-top:20px">${cal(380,'сегодня · онлайн')}</div>`);
story('30min','ink','Через 30 минут','Начинаем <span style="color:#ffd166">в 19:00</span>','Ссылка на эфир — в нашем Telegram-боте',`<div style="font-size:300px;font-weight:800;color:#ffd166;line-height:1;letter-spacing:-.05em">30:00</div>`);
story('new-post','white','Новый пост','Где ваш отдел продаж <span class="gt">теряет заявки?</span>','Ночью, в переписке, на одних и тех же вопросах. Разбираем в новом посте — листайте ленту',`<div style="font-size:44px">${info}</div>`);
story('checklist','yel','Подарок за регистрацию','Чек-лист <span class="gt">«10 вопросов»</span>','Покажет, где ваш отдел продаж теряет заявки.<br>Придёт в Telegram сразу после записи');

const page=b=>`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap"><style>${css}</style></head><body>${b}</body></html>`;
const {chromium}=await loadPlaywright();
const browser=await chromium.launch();const pg=await browser.newPage();
for(const [name,[w,h,html]] of Object.entries(items)){
 await pg.setViewportSize({width:w,height:h});await pg.setContent(page(html),{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
 const over=await pg.evaluate(()=>[...document.querySelectorAll('h1,.info,.cal')].some(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+1||r.bottom>innerHeight+1||r.left<-1}));
 await pg.screenshot({path:join(out,name+'.png')});console.log(name,over?'OVERFLOW':'');
}
await browser.close();

// Link preview images of the workshop landing (1200×630): public/webinar/og-ru.png, og-en.png, og-ka.png.
// The texts (marquee, badge, headline, date table, button) come from lib/webinar.ts, so a new date there means a re-run here.
//
//   npx tsx scripts/social/webinar-og.mjs
//
// Style: the landing hero (components/praxen/webinar.tsx). Playwright is taken from the project or from the global install.
import {readFileSync} from 'node:fs';
import {join,dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {execSync} from 'node:child_process';
import {webinarCopy} from '../../lib/webinar.ts';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
async function loadPlaywright(){try{return await import('playwright');}catch{}const g=execSync('npm root -g').toString().trim();return import(pathToFileURL(join(g,'playwright/index.mjs')).href);}
const logo=readFileSync(join(root,'brand/praxen-logo.svg'),'utf8');
const fontsDir=join(root,'content/social/fonts');
const fonts=JSON.parse(readFileSync(join(fontsDir,'fonts.json'),'utf8')).filter(f=>f.family==='Manrope')
 .map(f=>`@font-face{font-family:'Manrope';font-weight:${f.weight||'100 900'};src:url(data:font/woff2;base64,${readFileSync(join(fontsDir,f.file)).toString('base64')}) format('woff2');unicode-range:${f.range}}`).join('\n');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const grad='linear-gradient(115deg,#2755ec 0%,#5268f5 48%,#7960e8 100%)';
const css=`${fonts}*{box-sizing:border-box;margin:0;padding:0}
body{width:1200px;height:630px;overflow:hidden;background:#fff;color:#121a2b;font-family:Manrope,'Noto Sans Georgian',sans-serif;-webkit-font-smoothing:antialiased}
.strip{position:absolute;left:0;right:0;top:0;height:38px;display:flex;align-items:center;background:#ffd166;border-bottom:2px solid #121a2b;font-size:15px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap;overflow:hidden}
.logo{position:absolute;left:72px;top:62px;height:24px}.logo svg{height:100%;width:auto;display:block}
.hero{position:absolute;left:72px;right:72px;top:150px;bottom:66px;display:flex;flex-direction:column;justify-content:flex-end}
.badge{align-self:flex-start;display:inline-flex;align-items:center;gap:10px;background:#121a2b;color:#fff;border-radius:999px;padding:8px 16px;font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
.badge:before{content:'';width:10px;height:10px;border-radius:50%;background:#ff5a5f;box-shadow:0 0 0 4px #ff5a5f44}
h1{margin-top:26px;font-size:76px;line-height:.98;font-weight:800;letter-spacing:-.035em;text-transform:uppercase}
h1 span{background:${grad};-webkit-background-clip:text;background-clip:text;color:transparent}
.row{display:flex;align-items:center;gap:34px;margin-top:34px}
.info{display:flex;border:2px solid #121a2b;border-radius:16px;overflow:hidden}
.info>div{padding:12px 22px}.info>div+div{border-left:2px solid #121a2b}.info>div:last-child{background:#ffd166}
.info dt{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#3c4658}
.info dd{margin-top:4px;font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1;white-space:nowrap}
.btn{background:${grad};color:#fff;border-radius:999px;padding:24px 44px;font-size:19px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;box-shadow:0 18px 40px -12px #4f66f080;white-space:nowrap}`;
const page=c=>`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@600;700;800&display=swap"><style>${css}</style></head><body>
<div class="strip">${esc((c.marquee.join(' ● ')+' ● ').repeat(3))}</div>
<div class="logo">${logo}</div>
<div class="hero"><span class="badge">${esc(c.hero.badge)}</span>
 <h1>${esc(c.hero.h1)} <span>${esc(c.hero.h1Grad)}</span></h1>
 <div class="row"><dl class="info">${c.hero.info.map(([k,v])=>`<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><span class="btn">${esc(c.hero.cta)} →</span></div></div>
</body></html>`;

const {chromium}=await loadPlaywright();
const browser=await chromium.launch();
const pg=await browser.newPage({viewport:{width:1200,height:630}});
for(const [lang,c] of Object.entries(webinarCopy)){
 await pg.setContent(page(c),{waitUntil:'networkidle'});await pg.evaluate(()=>document.fonts.ready);
 // Long headlines (Georgian) shrink until the hero fits under the logo and the row stays on the canvas.
 const size=await pg.evaluate(()=>{const h=document.querySelector('h1'),hero=document.querySelector('.hero');let g=40;
  while((hero.scrollHeight>hero.clientHeight+1||document.querySelector('.row').scrollWidth>hero.clientWidth+1)&&g--)h.style.fontSize=(parseFloat(getComputedStyle(h).fontSize)*0.95)+'px';
  return Math.round(parseFloat(getComputedStyle(h).fontSize));});
 await pg.screenshot({path:join(root,'public/webinar',`og-${lang}.png`)});
 console.log(`og-${lang}.png  h1 ${size}px`);
}
await browser.close();

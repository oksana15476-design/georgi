// Turns the static export in dist/client into a GitHub Pages site in out/.
// vinext's export does not apply a basePath to framework assets, so /_next/ URLs are prefixed here.
import {cpSync,existsSync,readdirSync,readFileSync,rmSync,statSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const base=process.env.PAGES_BASE_PATH??(process.env.GITHUB_PAGES==='1'?'/georgi':'');
const src='dist/client',out='out';
if(!existsSync(join(src,'en.html')))throw new Error('Run GITHUB_PAGES=1 vinext build first');
rmSync(out,{recursive:true,force:true});
cpSync(src,out,{recursive:true});
for(const f of ['_headers','.vite','.assetsignore'])rmSync(join(out,f),{recursive:true,force:true});

const walk=dir=>readdirSync(dir).flatMap(f=>{const p=join(dir,f);return statSync(p).isDirectory()?walk(p):[p]});
let files=0,preload=0;
for(const file of walk(out)){
 if(file.endsWith('.js')){
  // Vite's modulepreload helper resolves chunk paths against "/".
  const text=readFileSync(file,'utf8'),next=text.replace(/(`modulepreload`,\w+=function\((\w+)\)\{return`)\/(`\+\2\})/g,'$1'+base+'/$3');
  if(next!==text){writeFileSync(file,next);preload++}
  continue;
 }
 if(!/\.(html|rsc)$/.test(file))continue;
 const text=readFileSync(file,'utf8'),next=text.replace(/(["'(=]|\\")\/_next\//g,'$1'+base+'/_next/');
 if(next!==text){writeFileSync(file,next);files++}
}

// vinext's export skips generated metadata routes, so the sitemap is rebuilt from each page's
// canonical and hreflang links, and robots.txt points to it.
const pages=walk(out).filter(f=>f.endsWith('.html')&&!f.endsWith('404.html'));
const today=new Date().toISOString().slice(0,10);
const entries=[],info=new Map();
const decode=v=>v.replace(/&amp;/g,'&').replace(/&#x27;|&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
for(const file of pages){
 const html=readFileSync(file,'utf8');
 const canonical=/<link rel="canonical" href="([^"]+)"/.exec(html);
 if(!canonical)continue;
 const alts=[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map(m=>`<xhtml:link rel="alternate" hreflang="${m[1]}" href="${m[2]}"/>`);
 entries.push([canonical[1],`<url><loc>${canonical[1]}</loc>${alts.join('')}<lastmod>${today}</lastmod><changefreq>monthly</changefreq></url>`]);
 info.set(canonical[1],{title:decode(/<title>([^<]*)<\/title>/.exec(html)?.[1]||''),description:decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1]||'')});
}
entries.sort((a,b)=>a[0].localeCompare(b[0]));
writeFileSync(join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.map(e=>e[1]).join('\n')+'\n</urlset>\n');
const siteUrl=entries.length?entries[0][0].replace(/\/(en|ka|ru)(\/.*)?$/,''):'';

// AI search and assistant crawlers are named explicitly so the policy stays clear if rules for
// other bots are added later. Lead submissions are not content.
const aiBots=['OAI-SearchBot','ChatGPT-User','GPTBot','PerplexityBot','Perplexity-User','Claude-SearchBot','Claude-User','ClaudeBot','Google-Extended','Applebot-Extended','Bingbot'];
// Same Clean-param as app/robots.ts.
const cleanParam=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','yclid','ysclid','popup'];
// The international site (NEXT_PUBLIC_MARKET=intl) stays closed to robots until NEXT_PUBLIC_INTL_LIVE=1, as in app/robots.ts.
const closed=process.env.NEXT_PUBLIC_MARKET==='intl'&&process.env.NEXT_PUBLIC_INTL_LIVE!=='1';
if(closed)writeFileSync(join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
else writeFileSync(join(out,'robots.txt'),`User-agent: *\nAllow: /\nDisallow: /api/\n${cleanParam.map(p=>`Clean-param: ${p}\n`).join('')}\n${aiBots.map(b=>`User-agent: ${b}`).join('\n')}\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

// llms.txt: a short plain-text guide for language models, built from the English pages' titles
// and descriptions, with links to the Georgian and Russian versions.
const page=path=>{const u=siteUrl+'/en'+path,i=info.get(u);return i?`- [${i.title.replace(/ — Praxen AI$/,'')}](${u}): ${i.description}`:null};
const group=prefix=>entries.map(e=>e[0]).filter(u=>u.startsWith(siteUrl+'/en'+prefix+'/')).map(u=>page(u.slice((siteUrl+'/en').length))).filter(Boolean);
const llms=`# Praxen AI

> Praxen AI is an AI implementation company based in Batumi, Georgia, working with businesses in Tbilisi and across the country. It builds AI chatbots for WhatsApp, Telegram and websites, deploys AI agents that update CRM and process documents, and trains teams to use AI. Solutions work in Georgian, English and Russian.

Key facts:
- Services and starting prices: team AI training from 1,900 GEL (about $700); implementation of AI tools for a specific process from 3,200 GEL ($1,200), a 2–4 week pilot; custom AI development from 6,700 GEL ($2,500); additional ongoing maintenance from 550 GEL ($200) per month.
- Solutions run on the client's own accounts and servers; AI tokens and infrastructure are paid directly to the providers.
- Every project starts with a free process audit; the pilot price is fixed before work begins. A typical pilot covers one workflow on real requests in about 2 weeks.
- Integrations via API where available, for example amoCRM, Bitrix24, HubSpot, 1C, Google Workspace, hotel PMS (Opera, Cloudbeds, Bnovo, TravelLine), WhatsApp and Telegram.
- Uses enterprise APIs (OpenAI, Anthropic) that do not train on customer data; on-premise deployment is available.
- AI does not make final decisions: review points and escalation to staff are agreed for every workflow.
- Contact: phone and WhatsApp +995 557 125 497, Telegram https://t.me/zheniazikinzik, form at ${siteUrl}/en#contact

## Main pages
${['','/solutions','/training','/cases','/partners'].map(page).filter(Boolean).join('\n')}

## AI by department
${[page('/departments'),...group('/departments')].filter(Boolean).join('\n')}

## AI by industry
${[page('/industries'),...group('/industries')].filter(Boolean).join('\n')}

## Other languages
- [Georgian version](${siteUrl}/ka)
- [Russian version](${siteUrl}/ru)

## Optional
- [Privacy policy](${siteUrl}/en/privacy)
`;
writeFileSync(join(out,'llms.txt'),llms);
// The Cloudflare Worker build serves public/ as is and does not run this script, so keep a copy there.
// Only the Georgian build refreshes it; the international site will get its own.
if(!base&&process.env.NEXT_PUBLIC_MARKET!=='intl')writeFileSync('public/llms.txt',llms);

// The bare root has no page; send visitors to the default language.
writeFileSync(join(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>Praxen AI</title><meta http-equiv="refresh" content="0;url=${base}/en"><link rel="canonical" href="${base}/en"><script>location.replace('${base}/en')</script><a href="${base}/en">Praxen AI</a>`);
// Cloudflare Pages (CF_PAGES is set in its build): the security and cache headers the Docker
// server sends, and a real redirect from the bare root to the default language.
if(process.env.CF_PAGES){
 writeFileSync(join(out,'_headers'),`/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`);
 writeFileSync(join(out,'_redirects'),'/ /en 302\n');
 // vinext also writes a redirected Wrangler config for the Workers build; Pages must not pick it up.
 rmSync('.wrangler/deploy/config.json',{force:true});
}
// Without this file GitHub Pages runs Jekyll, which drops the _next directory.
writeFileSync(join(out,'.nojekyll'),'');
if(!process.env.NEXT_PUBLIC_SITE_URL)console.warn('Note: NEXT_PUBLIC_SITE_URL is not set; canonical URLs use the default '+siteUrl);
if(base&&!preload)console.warn('Warning: Vite preload helper not found; chunk preloads may 404');
console.log(`Sitemap: ${entries.length} URLs`);
console.log(`Pages site written to ${out}/ (${files} pages and ${preload} scripts rewritten for ${base})`);

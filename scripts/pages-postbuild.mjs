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
const entries=[];
for(const file of pages){
 const html=readFileSync(file,'utf8');
 const canonical=/<link rel="canonical" href="([^"]+)"/.exec(html);
 if(!canonical)continue;
 const alts=[...html.matchAll(/<link rel="alternate" hrefLang="([^"]+)" href="([^"]+)"/g)].map(m=>`<xhtml:link rel="alternate" hreflang="${m[1]}" href="${m[2]}"/>`);
 entries.push([canonical[1],`<url><loc>${canonical[1]}</loc>${alts.join('')}<changefreq>monthly</changefreq></url>`]);
}
entries.sort((a,b)=>a[0].localeCompare(b[0]));
writeFileSync(join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'+entries.map(e=>e[1]).join('\n')+'\n</urlset>\n');
const siteUrl=entries.length?entries[0][0].replace(/\/(en|ka|ru)(\/.*)?$/,''):'';
writeFileSync(join(out,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

// The bare root has no page; send visitors to the default language.
writeFileSync(join(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>Praxis AI</title><meta http-equiv="refresh" content="0;url=${base}/en"><link rel="canonical" href="${base}/en"><script>location.replace('${base}/en')</script><a href="${base}/en">Praxis AI</a>`);
// Without this file GitHub Pages runs Jekyll, which drops the _next directory.
writeFileSync(join(out,'.nojekyll'),'');
if(siteUrl.includes('chatgpt.site'))console.warn('Warning: canonical URLs point to the old chatgpt.site address; set NEXT_PUBLIC_SITE_URL to the real domain');
if(base&&!preload)console.warn('Warning: Vite preload helper not found; chunk preloads may 404');
console.log(`Sitemap: ${entries.length} URLs`);
console.log(`Pages site written to ${out}/ (${files} pages and ${preload} scripts rewritten for ${base})`);

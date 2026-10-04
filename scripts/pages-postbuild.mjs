// Turns the static export in dist/client into a GitHub Pages site in out/.
// vinext's export does not apply a basePath to framework assets, so /_next/ URLs are prefixed here.
import {cpSync,existsSync,readdirSync,readFileSync,rmSync,statSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';

const base=process.env.PAGES_BASE_PATH??'/georgi';
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

// The bare root has no page; send visitors to the default language.
writeFileSync(join(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>Praxis AI</title><meta http-equiv="refresh" content="0;url=${base}/en"><link rel="canonical" href="${base}/en"><script>location.replace('${base}/en')</script><a href="${base}/en">Praxis AI</a>`);
// Without this file GitHub Pages runs Jekyll, which drops the _next directory.
writeFileSync(join(out,'.nojekyll'),'');
if(!preload)console.warn('Warning: Vite preload helper not found; chunk preloads may 404');
console.log(`Pages site written to ${out}/ (${files} pages and ${preload} scripts rewritten for ${base})`);

// Blog check for both sites (see .claude/skills/praxen-blog/SKILL.md).
// Run: npx tsx scripts/qa/blog-check.ts   (exit code 1 when something must be fixed)
// Checks: title and description length, internal links, missing languages, "not X but Y" antitheses
// (max 1 per article) and sentences repeated word for word between articles (none allowed).
import {posts} from '../../lib/intl-blog';
import {blogSlugs,departments as comDepts,industries as comInds,services,servicePath} from '../../lib/intl';
import {geArticles} from '../../lib/ge-blog';
import {departments as geDepts,industries as geInds} from '../../lib/content';

type P={title:string;description:string;answer:string;blocks:{h:string;p?:string[];list?:string[];table?:string[][]}[];faq:[string,string][];links:[string,string][]};
let fail=0;
const bad=(msg:string)=>{fail++;console.log('FIX  '+msg)};
const warn=(msg:string)=>console.log('WARN '+msg);

// praxenai.com: the page title is "<title> | Praxen AI" and should fit in 65 characters.
const comOk=new Set(['solutions','training','cases','about','security','services','industries','departments','blog',...services.map(s=>servicePath(s.slug)),...comInds.map(i=>'industries/'+i.slug),...comDepts.map(d=>'departments/'+d.slug),...posts.map(p=>'blog/'+p.slug)]);
for(const p of posts){
 if(!blogSlugs.includes(p.slug))bad(`com/${p.slug}: add the slug to blogSlugs in lib/intl.ts`);
 if((p.title+' | Praxen AI').length>65)bad(`com/${p.slug}: title is ${p.title.length} characters, keep it within 53`);
 if(p.description.length>160||p.description.length<120)warn(`com/${p.slug}: description is ${p.description.length} characters (aim for 140–160)`);
 for(const [h] of p.links)if(!comOk.has(h)||h==='blog/'+p.slug)bad(`com/${p.slug}: link ${h} does not exist`);
}
// praxenai.ge: ru, en and ka for every article; " — Praxen AI" is added only to titles up to 50 characters.
const geOk=new Set(['solutions','training','cases','about','security','industries','departments','blog',...geInds.map(i=>'industries/'+i.slug),...geDepts.map(d=>'departments/'+d.slug),...geArticles.map(a=>'blog/'+a.slug)]);
for(const a of geArticles)for(const l of ['ru','en','ka'] as const){
 const p=a.langs[l];if(!p){bad(`ge/${a.slug}: no ${l} version`);continue}
 if(p.title.length>70)bad(`ge/${a.slug}/${l}: title is ${p.title.length} characters, keep it within 70`);
 if(p.description.length>165)bad(`ge/${a.slug}/${l}: description is ${p.description.length} characters, keep it within 165`);
 for(const [h] of p.links)if(!geOk.has(h)||h==='blog/'+a.slug)bad(`ge/${a.slug}/${l}: link ${h} does not exist`);
}

// Style: sentences over 40 characters must not repeat between articles; antitheses at most 1 per article.
const texts:{id:string;lang:string;s:string[]}[]=[];
const sents=(p:P)=>[p.answer,...p.blocks.flatMap(b=>[...(b.p||[]),...(b.list||[])]),...p.faq.map(f=>f[1])].flatMap(t=>t.split(/(?<=[.!?])\s+/)).map(x=>x.trim()).filter(x=>x.length>40);
for(const p of posts)texts.push({id:'com/'+p.slug,lang:'en-com',s:sents(p as P)});
for(const a of geArticles)for(const l of ['ru','en','ka'] as const)if(a.langs[l])texts.push({id:'ge/'+a.slug+'/'+l,lang:l,s:sents(a.langs[l] as P)});
const anti=/\bnot\b[^.]{1,60},? (but|it’s|they’re)\b|не [^.,]{1,40}, а |, а не |rather than/i;
for(const t of texts){const n=t.s.filter(x=>anti.test(x));if(n.length>1)bad(`${t.id}: ${n.length} antitheses, rewrite as plain statements: ${n.map(x=>x.slice(0,80)).join(' | ')}`)}
const norm=(x:string)=>x.toLowerCase().replace(/[^\p{L}\p{N} ]/gu,'').replace(/\s+/g,' ');
const seen=new Map<string,string[]>();
for(const t of texts)for(const x of t.s){const k=t.lang+'|'+norm(x);seen.set(k,[...(seen.get(k)||[]),t.id])}
for(const [k,ids] of seen){const u=[...new Set(ids)];if(u.length>1)bad(`same sentence in ${u.join(', ')}: "${k.split('|')[1].slice(0,100)}"`)}

console.log(`${posts.length} articles on praxenai.com, ${geArticles.length} on praxenai.ge; ${fail?fail+' to fix':'all checks passed'}`);
process.exit(fail?1:0);

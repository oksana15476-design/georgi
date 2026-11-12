// The share cards build/og-images.mjs draws during the build (see lib/og-image.ts): every blog article and every
// commercial page of the site being built, in each language it exists in. Only the build script imports this file.
// The home page keeps the designed site picture (public/og/og-*.png), legal pages the site picture too;
// the webinar landing has its own (public/webinar/og-*.png).
import {languages,t,departments,industries,type Lang} from '@/lib/content';
import {isIntl} from '@/lib/market';
import {allPaths,detailTitle} from '@/lib/seo';
import {sectionMeta} from '@/lib/section-meta';
import {sectionLabel,copyFn} from '@/lib/site-copy';
import {geArticles} from '@/lib/ge-blog';
import {posts} from '@/lib/intl-blog';
import {ctaAudit,intlPaths,resolveIntl,sectionName} from '@/lib/intl';
import {intlPageMeta} from '@/lib/intl-seo';
import {ogKey} from '@/lib/og-image';

export type OgCard={
 key:string; // ogKey(lang, path): the file name under public/og/pages/
 lang:Lang;
 kind:'article'|'page'; // an article card says «Blog article» and «Read the article»
 rubric:string; // the article category, or the section of a commercial page
 title:string; // the article title, or the page's search title without « — Praxen AI»
 minutes?:number; // reading time of an article
 cta:string; // the button: «Read the article» on articles, the free audit on commercial pages
 domain:string;
};

const skip=new Set(['','/privacy','/terms']);
const geRead:Record<Lang,string>={ru:'Читать статью',en:'Read the article',ka:'წაიკითხეთ'};
const brandless=(s:string)=>s.replace(/\s*(?:—|–|\||-)\s*Praxen AI$/,'').trim();

function geCards():OgCard[]{
 const cards:OgCard[]=[];
 for(const a of geArticles)for(const [lang,p] of Object.entries(a.langs) as [Lang,NonNullable<(typeof a.langs)[Lang]>][]){
  cards.push({key:ogKey(lang,'/blog/'+a.slug),lang,kind:'article',rubric:p.cat,title:p.title,minutes:p.minutes,cta:geRead[lang],domain:'praxenai.ge'});
 }
 for(const path of allPaths){
  if(skip.has(path))continue;
  const [section,slug]=path.slice(1).split('/');
  for(const lang of languages){
   const c=copyFn(lang);
   const rubric=({chatbot:c('Чат-бот для бизнеса','Chatbot for business','ჩატბოტი ბიზნესისთვის'),about:c('О нас','About','ჩვენ შესახებ'),security:c('Безопасность и данные','Security and data','უსაფრთხოება და მონაცემები'),partners:c('Партнёрам','Partners','პარტნიორებს')} as Record<string,string>)[section]||sectionLabel(c,section);
   let title:string;
   if(slug){
    const e=(section==='industries'?industries:departments).find(x=>x.slug===slug);
    if(!e)continue;
    title=detailTitle(slug,lang,t(e.name,lang));
   }else{
    const m=sectionMeta[section];
    if(!m)continue;
    title=t(m.title,lang);
   }
   cards.push({key:ogKey(lang,path),lang,kind:'page',rubric,title:brandless(title),cta:c('Бесплатный аудит','Free AI audit','უფასო აუდიტი'),domain:'praxenai.ge'});
  }
 }
 return cards;
}

function intlCards():OgCard[]{
 const cards:OgCard[]=[];
 for(const path of intlPaths){
  if(skip.has(path))continue;
  const r=resolveIntl(path.slice(1).split('/'));
  if(!r)continue;
  const post=r.page==='blog'&&r.slug?posts.find(p=>p.slug===r.slug):undefined;
  if(post){cards.push({key:ogKey('en',path),lang:'en',kind:'article',rubric:post.cat,title:post.title,minutes:post.minutes,cta:'Read the article',domain:'praxenai.com'});continue;}
  cards.push({key:ogKey('en',path),lang:'en',kind:'page',rubric:sectionName[r.page]||'Praxen AI',title:brandless(intlPageMeta(r).title),cta:ctaAudit,domain:'praxenai.com'});
 }
 return cards;
}

export const ogCards=():OgCard[]=>isIntl?intlCards():geCards();

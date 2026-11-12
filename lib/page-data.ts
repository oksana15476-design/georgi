import type {Copy,Lang} from './content';
import {departments,industries,t} from './content';
import {pageCopy,type PageCopy} from './page-copy';
import {headlines,profiles,type Profile} from './page-profiles';
import {detailAnswers} from './detail-answers';
import {geArticle,geArticles,type GePost} from './ge-blog';
import {geRelated,type RelatedArticle} from './related-articles';
import {modifiedOf,newestOf} from './dates';
import {chatbotPage} from './chatbot-page';

// One card of the blog list: an article in this language, or in Russian and English when it has no version here.
export type GeBlogCard={slug:string;l:Lang;cat:string;title:string;excerpt:string;dateLabel:string;minutes:number};

// The slice of page texts one page needs. Server routes compute it and pass it to the client
// Site component, so the browser does not download the copy of all 20 pages in three languages.
export type PageData={
 ov?:PageCopy;
 profile?:Profile;
 headline?:Copy;
 answer?:{q:Copy;a:Copy;cost:Copy};
 // Scenarios of the related industries, already in the page language: [title, body].
 related?:Record<string,[string,string][]>;
 examples?:Record<string,Profile['scenarios'][number]>;
 // Blog (lib/ge-blog.ts holds every article in three languages; the browser gets only what the page shows).
 // An article: the post, its dates, the languages it exists in and the two «read also» links.
 post?:GePost;
 postDate?:string;
 postModified?:string;
 postUpdated?:string;
 postLangs?:Lang[];
 postMore?:[string,string][];
 // The blog list: cards, newest first, and the newest date for JSON-LD.
 cards?:GeBlogCard[];
 newest?:string;
 // «Статьи по теме» on department, industry and chatbot pages.
 articles?:RelatedArticle[];
 chatbot?:typeof chatbotPage;
};

export function pageData(lang:Lang,section:string,slug?:string):PageData{
 const d:PageData={};
 if(section==='blog'){
  if(slug){
   const a=geArticle(slug),post=a?.langs[lang];
   if(a&&post){
    d.post=post;d.postDate=a.date;d.postModified=modifiedOf(a);
    if(a.updated&&a.updated>a.date)d.postUpdated=a.updated;
    d.postLangs=(Object.keys(a.langs) as Lang[]).filter(l=>a.langs[l]);
    // Two more articles in this language (the next ones in the list) that the post does not already link to.
    const i=geArticles.indexOf(a),seen=new Set(post.links.map(([h])=>h));
    d.postMore=[...geArticles.slice(i+1),...geArticles.slice(0,Math.max(i,0))].filter(x=>x.langs[lang]&&!seen.has('blog/'+x.slug)).slice(0,2).map(x=>['blog/'+x.slug,x.langs[lang]!.title]);
   }
  }else{
   // Newest article first (owner, 2 November); articles of the same day: the one added last comes first.
   // A language without its own version lists the other languages' versions, marked by language.
   const newest=geArticles.map((a,i)=>({a,i})).sort((p,q)=>q.a.date.localeCompare(p.a.date)||q.i-p.i).map(x=>x.a);
   d.cards=newest.flatMap(a=>{
    const own=a.langs[lang];
    const ls:Lang[]=own?[lang]:(['ru','en'] as Lang[]).filter(l=>a.langs[l]);
    return ls.map(l=>{const p=a.langs[l]!;return {slug:a.slug,l,cat:p.cat,title:p.title,excerpt:p.excerpt,dateLabel:p.dateLabel,minutes:p.minutes}});
   });
   d.newest=newestOf(geArticles);
  }
  return d;
 }
 if(section==='chatbot'){
  d.chatbot=chatbotPage;
  d.articles=geRelated(geArticles,'chatbot',lang,chatbotPage.links.map(l=>l.href.replace(/^\/blog\//,'')));
  return d;
 }
 if(slug){
  d.articles=geRelated(geArticles,section+'/'+slug,lang);
  d.ov=pageCopy[slug]?.[lang];
  d.profile=profiles[slug];
  d.headline=headlines[slug];
  d.answer=detailAnswers[slug];
  if(departments.some(x=>x.slug===slug))d.related=Object.fromEntries(industries.filter(i=>i.departments.includes(slug)).map(i=>[i.slug,pageCopy[i.slug]?.[lang]?.sc||(profiles[i.slug]?.scenarios||[]).map(q=>[t(q.title,lang),t(q.body,lang)] as [string,string])]));
 }else if(section==='solutions'){
  d.examples=Object.fromEntries(['sales','support','operations'].filter(k=>profiles[k]).map(k=>[k,profiles[k].scenarios[0]]));
 }
 return d;
}

import type {Copy,Lang} from './content';
import {departments,industries,t} from './content';
import {pageCopy,type PageCopy} from './page-copy';
import {headlines,profiles,type Profile} from './page-profiles';
import {detailAnswers} from './detail-answers';

// The slice of page texts one page needs. Server routes compute it and pass it to the client
// Site component, so the browser does not download the copy of all 20 pages in three languages.
export type PageData={
 ov?:PageCopy;
 profile?:Profile;
 headline?:Copy;
 answer?:{q:Copy;a:Copy};
 // Scenarios of the related industries, already in the page language: [title, body].
 related?:Record<string,[string,string][]>;
 examples?:Record<string,Profile['scenarios'][number]>;
};

export function pageData(lang:Lang,section:string,slug?:string):PageData{
 const d:PageData={};
 if(slug){
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

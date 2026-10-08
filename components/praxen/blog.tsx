'use client';
// praxenai.ge blog: the list (in every language) and an article (Russian and English for now).
// The article layout reuses the praxenai.com article classes in globals.css.
import {base,homeHref,pageHref} from '@/lib/base';
import {geArticles,type GePost} from '@/lib/ge-blog';
import type {Lang} from '@/lib/content';
import {Icon} from './icon';
import type {X} from './types';

export const blogLabel=(x:X)=>x.c('Блог','Blog','ბლოგი');
const langName:Record<Lang,string>={ru:'Русский',en:'English',ka:'ქართული'};

export function BlogList({x}:{x:X}){
 const {c,lang}=x;
 // A language without its own version lists the other languages' versions, marked by language.
 const items=geArticles.flatMap(a=>{const own=a.langs[lang];if(own)return [{a,post:own,l:lang}];return (['ru','en'] as Lang[]).filter(l=>a.langs[l]).map(l=>({a,post:a.langs[l]!,l}))});
 return (<>
  <section data-screen-label="Inner hero" className="inner-hero">
   <div className="wrap inner-pad">
    <nav aria-label="Breadcrumb" className="crumbs"><a href={homeHref(lang)}>{x.s.home}</a><span aria-hidden="true">/</span><span aria-current="page">{blogLabel(x)}</span></nav>
    <div className="min0 mw860">
     <h1 data-reveal="" className="inner-h1">{c('ИИ для бизнеса в Грузии: цены, примеры и разборы.','AI for business in Georgia: prices, examples and how-tos.','AI ბიზნესისთვის საქართველოში: ფასები, მაგალითები და განხილვები.')}</h1>
     <div data-reveal="" className="inner-lead"><p>{c('Пишем о том, что видим на проектах: сколько стоит, сколько занимает и с чего начать.','We write about what we see on projects: what it costs, how long it takes and where to start.','ვწერთ იმაზე, რასაც პროექტებზე ვხედავთ. სტატიები ჯერჯერობით რუსულ და ინგლისურ ენებზეა.')}</p></div>
    </div>
   </div>
  </section>
  <section data-screen-label="Blog list" className="wrap sec">
   <div className="ix-cards" data-stagger="">{items.map(({a,post,l})=><a key={a.slug+l} href={pageHref(l,'blog/'+a.slug)} hrefLang={l} className="card ix-card-lift ix-post">
    <span className="ix-post-cat">{post.cat}{l!==lang?' · '+langName[l]:''}</span>
    <h2 lang={l}>{post.title}</h2>
    <p lang={l}>{post.excerpt}</p>
    <small>{post.dateLabel} · {post.minutes} {c('мин чтения','min read','წთ')}</small>
   </a>)}</div>
  </section>
 </>);
}

const anchor=(h:string,i:number)=>'s'+(i+1);
export function GeArticle({x,post}:{x:X;post:GePost}){
 const {c,lang,link}=x;
 return (
  <article data-screen-label="Article" className="ix-article">
   <header className="inner-hero">
    <div className="wrap inner-pad">
     <nav aria-label="Breadcrumb" className="crumbs"><a href={homeHref(lang)}>{x.s.home}</a><span aria-hidden="true">/</span><a href={link('blog')}>{blogLabel(x)}</a><span aria-hidden="true">/</span><span aria-current="page">{post.cat}</span></nav>
     <div className="ix-article-head">
      <p className="hero-eyebrow">{post.cat}</p>
      <h1 className="inner-h1 mt14">{post.title}</h1>
      <div className="inner-lead"><p>{post.description}</p></div>
      <div className="ix-author">
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={base+'/team/evgeny.jpg'} alt="" width={40} height={40}/>
       <span><b>{c('Евгений Будников','Evgeny Budnikov','ევგენი ბუდნიკოვი')}</b>{c('Основатель Praxen AI','Founder, Praxen AI','Praxen AI-ის დამფუძნებელი')} · {post.dateLabel} · {post.minutes} {c('мин чтения','min read','წთ')}</span>
      </div>
     </div>
    </div>
   </header>
   <div className="wrap sec ix-article-grid">
    <nav aria-label={c('Содержание','Contents','შინაარსი')} className="ix-toc"><small>{c('Содержание','Contents','შინაარსი')}</small>{post.blocks.map((b,i)=><a key={b.h} href={'#'+anchor(b.h,i)}>{b.h}</a>)}</nav>
    <div className="ix-article-body">
     <div className="ix-answer-box"><b>{c('Коротко','Short answer','მოკლედ')}</b><p>{post.answer}</p></div>
     {post.blocks.map((b,i)=><section key={b.h} id={anchor(b.h,i)}>
      <h2>{b.h}</h2>
      {b.p?.map(t=><p key={t}>{t}</p>)}
      {b.list&&<ul>{b.list.map(t=><li key={t}>{t}</li>)}</ul>}
      {b.table&&<div className="ix-article-table"><table><thead><tr>{b.table[0].map((h,k)=><th key={k}>{h}</th>)}</tr></thead><tbody>{b.table.slice(1).map(r=><tr key={r[0]}>{r.map((v,k)=>k?<td key={k}>{v}</td>:<th key={k}>{v}</th>)}</tr>)}</tbody></table></div>}
     </section>)}
     <aside className="ix-article-cta"><b>{c('Хотите такой расчёт для своего бизнеса?','Want these numbers for your business?','გსურთ ასეთი გათვლა თქვენი ბიზნესისთვის?')}</b><p>{c('Бесплатный аудит покажет, сколько часов освободит ИИ и сколько будет стоить пилот.','A free audit shows how many hours AI frees up and what a pilot costs.','უფასო აუდიტი გაჩვენებთ, რამდენ საათს გაათავისუფლებს AI და რა ეღირება პილოტი.')}</p><button type="button" onClick={()=>x.go(post.cat)} className="btn btn-primary">{x.s.action}<Icon name="arrow-right" size={16}/></button></aside>
     <div className="ix-article-links"><b>{c('Читайте также','Related pages','ასევე წაიკითხეთ')}</b>{post.links.map(([h,l])=><a key={h} href={link(h)} className="ulink">{l}<Icon name="arrow-right" size={16}/></a>)}</div>
    </div>
   </div>
  </article>
 );
}

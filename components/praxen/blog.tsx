'use client';
// praxenai.ge blog: the list (in every language) and an article (Russian and English for now).
// The article layout reuses the praxenai.com article classes in globals.css.
import {base,homeHref,pageHref} from '@/lib/base';
import {ArticleBlock} from '@/components/article-blocks';
import type {GePost} from '@/lib/ge-blog';
import {dateLabelOf} from '@/lib/dates';
import {contacts} from '@/lib/contacts';
import type {Lang} from '@/lib/content';
import {Icon} from './icon';
import type {X} from './types';

export const blogLabel=(x:X)=>x.c('Блог','Blog','ბლოგი');
const langName:Record<Lang,string>={ru:'Русский',en:'English',ka:'ქართული'};

export function BlogList({x}:{x:X}){
 const {c,lang}=x;
 // The cards come from the server (lib/page-data.ts): newest first; a language without its own version
 // lists the other languages' versions, marked by language.
 const items=x.data.cards||[];
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
   <div className="ix-cards" data-stagger="">{items.map(post=>{const l=post.l;return <a key={post.slug+l} href={pageHref(l,'blog/'+post.slug)} hrefLang={l} className="card ix-card-lift ix-post">
    <span className="ix-post-cat">{post.cat}{l!==lang?' · '+langName[l]:''}</span>
    <h2 lang={l}>{post.title}</h2>
    <p lang={l}>{post.excerpt}</p>
    <small>{post.dateLabel} · {post.minutes} {c('мин чтения','min read','წთ')}</small>
   </a>})}</div>
  </section>
 </>);
}

const anchor=(h:string,i:number)=>'s'+(i+1);
export function GeArticle({x,post}:{x:X;post:GePost}){
 const {c,lang,link}=x;
 // Two more articles in this language that the post does not already link to, and the revision date
 // (shown only when the article was revised after publication); both from the server (lib/page-data.ts).
 const related=x.data.postMore||[],updated=x.data.postUpdated||'';
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
       <span><b>{c('Евгений Будников','Evgeny Budnikov','ევგენი ბუდნიკოვი')}</b>{c('Основатель Praxen AI','Founder, Praxen AI','Praxen AI-ის დამფუძნებელი')} · {post.dateLabel}{updated&&<> · <span className="nowrap">{c('Обновлено','Updated','განახლდა')} <time dateTime={updated}>{dateLabelOf(updated,lang)}</time></span></>} · {post.minutes} {c('мин чтения','min read','წთ')}</span>
      </div>
     </div>
    </div>
   </header>
   <div className="wrap sec ix-article-grid">
    <nav aria-label={c('Содержание','Contents','შინაარსი')} className="ix-toc"><small>{c('Содержание','Contents','შინაარსი')}</small>{post.blocks.map((b,i)=><a key={b.h} href={'#'+anchor(b.h,i)}>{b.h}</a>)}</nav>
    <div className="ix-article-body">
     <div className="ix-answer-box"><b>{c('Коротко','Short answer','მოკლედ')}</b><p>{post.answer}</p></div>
     <div className="ix-article-ask"><p>{c('Бесплатный аудит за 30 минут: покажем, что передать ИИ и сколько это сэкономит.','A free 30-minute audit: what to hand over to AI and what it saves.','უფასო აუდიტი 30 წუთში: რა გადავცეთ AI-ს და რამდენს დაზოგავს.')}</p><button type="button" onClick={()=>x.go(post.cat)} className="btn btn-primary btn-sm">{x.s.actionHeader}<Icon name="arrow-right" size={16}/></button></div>
     {post.blocks.map((b,i)=><section key={b.h} id={anchor(b.h,i)}>
      <ArticleBlock b={b}/>
     </section>)}
     <aside className="ix-article-cta"><b>{c('Хотите такой расчёт для своего бизнеса?','Want these numbers for your business?','გსურთ ასეთი გათვლა თქვენი ბიზნესისთვის?')}</b><p>{c('Бесплатный аудит покажет, сколько часов освободит ИИ и сколько будет стоить пилот.','A free audit shows how many hours AI frees up and what a pilot costs.','უფასო აუდიტი გაჩვენებთ, რამდენ საათს გაათავისუფლებს AI და რა ეღირება პილოტი.')}</p><button type="button" onClick={()=>x.go(post.cat)} className="btn btn-primary">{x.s.action}<Icon name="arrow-right" size={16}/></button></aside>
     <div className="ix-article-links"><b>{c('Читайте также','Related pages','ასევე წაიკითხეთ')}</b>{[...post.links,...related].map(([h,l])=><a key={h} href={link(h)} className="ulink">{l}<Icon name="arrow-right" size={16}/></a>)}</div>
    </div>
    {/* Wide screens only: the empty right column holds the audit and WhatsApp; phones have the bottom bar. */}
    <aside aria-label={c('Бесплатный аудит, 30 минут','Free audit, 30 minutes','უფასო აუდიტი, 30 წუთი')} className="ix-article-side">
     <b>{c('Бесплатный аудит, 30 минут','Free audit, 30 minutes','უფასო აუდიტი, 30 წუთი')}</b>
     <button type="button" onClick={()=>x.go(post.cat)} className="btn btn-primary btn-block">{c('Записаться на аудит','Book an audit','აუდიტზე ჩაწერა')}<Icon name="arrow-right" size={16}/></button>
     <a href={contacts.whatsapp+'?text='+encodeURIComponent(x.s.heroWhatsAppText)} target="_blank" rel="noopener" className="btn btn-ghost btn-block ix-side-wa"><Icon name="whatsapp" size={18}/>WhatsApp</a>
     <p>{c('Напишите в WhatsApp — подскажем, с чего начать.','Message us on WhatsApp and we will suggest where to start.','მოგვწერეთ WhatsApp-ში — გეტყვით, საიდან დაიწყოთ.')}</p>
    </aside>
   </div>
  </article>
 );
}

// «Статьи по теме» on department and industry pages (lib/related-articles.ts, picked on the server in lib/page-data.ts):
// articles in this language that link to the page come first. `extra` is a plain link line under the cards
// (the chatbot page on sales, support, hotels, clinics, restaurants and retail).
export function RelatedArticles({x,extra}:{x:X;extra?:[string,string]}){
 const {c,link}=x;
 const items=x.data.articles||[];
 if(!items.length&&!extra)return null;
 return (
  <section data-screen-label="Related articles" className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">{c('Статьи по теме','Related articles','სტატიები ამ თემაზე')}</h2></div></div>
   {items.length>0&&<div className="ix-cards" data-stagger="">{items.map(p=><a key={p.slug} href={link('blog/'+p.slug)} className="card ix-card-lift ix-post">
    <span className="ix-post-cat">{p.cat}</span>
    <h3>{p.title}</h3>
    <p>{p.excerpt}</p>
    <small>{p.dateLabel} · {p.minutes} {c('мин чтения','min read','წთ')}</small>
   </a>)}</div>}
   {extra&&<a href={link(extra[0])} className="ulink mt24">{extra[1]}<Icon name="arrow-right" size={16}/></a>}
  </section>
 );
}

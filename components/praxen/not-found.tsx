'use client';
// praxenai.ge 404: the page language comes from the address (/ka/..., /ru/..., English without a prefix),
// so the text, the buttons and the site header match the section the visitor came from.
import {useState} from 'react';
import {usePathname} from 'next/navigation';
import {homeHref,pageHref} from '@/lib/base';
import type {Lang} from '@/lib/content';
import {contacts} from '@/lib/contacts';
import {copyFn,siteCopy} from '@/lib/site-copy';
import {Header} from './header';

const langOf=(path:string):Lang=>{const m=/^\/(ka|ru)(\/|$)/.exec(path);return m?m[1] as Lang:'en'};

export function GeNotFound(){
 const lang=langOf(usePathname()||'/');
 const c=copyFn(lang),s=siteCopy(c);
 const [menu,setMenu]=useState(false);
 // There is no contact form on this page: the header buttons lead to the form on the home page.
 const toContact=(e?:React.MouseEvent)=>{e?.preventDefault();setMenu(false);window.location.assign(homeHref(lang)+'#contact')};
 // Same short labels as the header menu (components/praxen/header.tsx).
 const links:[string,string][]=[
  [homeHref(lang),s.home],
  [pageHref(lang,'solutions'),c('Решения','Solutions','გადაწყვეტები')],
  [pageHref(lang,'industries'),c('Отрасли','Industries','ინდუსტრიები')],
  [pageHref(lang,'cases'),c('Кейсы','Cases','ქეისები')],
 ];
 return (
  <div className="site">
   <Header lang={lang} c={c} s={s} page="" rest="" toContact={toContact} menu={menu} setMenu={setMenu}/>
   <main id="main" className="wrap sec">
    <p className="hero-eyebrow">404</p>
    <h1 className="h1 mt14">{c('Страница не найдена.','Page not found.','გვერდი ვერ მოიძებნა.')}</h1>
    <p className="lead">{c('Возможно, ссылка устарела или в ней опечатка. Выберите один из основных разделов.','The link may be old or mistyped. Choose one of the main pages.','ბმული შეიძლება მოძველებული ან არასწორი იყოს. აირჩიეთ ერთ-ერთი მთავარი გვერდი.')}</p>
    <div className="btn-row mt28">{links.map(([h,l],i)=><a key={h} href={h} className={'btn '+(i===0?'btn-primary':'btn-ghost')}>{l}</a>)}</div>
    <p className="lead lead-muted">WhatsApp: <a href={contacts.whatsapp} className="ix-inline">{contacts.phoneLabel}</a></p>
   </main>
  </div>
 );
}

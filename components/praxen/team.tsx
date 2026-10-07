'use client';
import {base} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {Icon} from './icon';
import type {X} from './types';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);

// Who implements: the founder and how he works. No biographical facts by the founder's request.
export function Team({x}:{x:X}){
 const {c}=x;
 const points=[['target',c('Начинаем с выручки, а не с технологии','Revenue first, technology second','ჯერ შემოსავალი, შემდეგ ტექნოლოგია'),c('Сначала считаем, где ИИ даст эффект в деньгах и часах, и только потом выбираем инструмент.','We first work out where AI pays off in money and hours, then pick the tool.','ჯერ ვითვლით, სად მოიტანს AI ეფექტს ფულსა და საათებში, შემდეგ ვირჩევთ ინსტრუმენტს.')],['user-check',c('Один ответственный','One accountable lead','ერთი პასუხისმგებელი'),c('От аудита до запуска с вами работает один человек, который отвечает за результат.','One person works with you from audit to launch and owns the result.','აუდიტიდან გაშვებამდე თქვენთან ერთი ადამიანი მუშაობს, რომელიც შედეგზე პასუხობს.')],['message-circle',c('На связи напрямую','Direct line','პირდაპირი კავშირი'),c('Вопросы — в Telegram или WhatsApp, без менеджеров-посредников.','Questions go straight to Telegram or WhatsApp, no middlemen.','კითხვები — პირდაპირ Telegram-ში ან WhatsApp-ში, შუამავლების გარეშე.')]];
 return (
  <section className="wrap sec" data-screen-label="Team">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">{c('Кто внедряет.','Who builds it.','ვინ ნერგავს.')}</h2><p className="lead">{c('Вы работаете не с «нейросетью», а с человеком, который отвечает за результат.','You work with a person who owns the result, not a faceless “neural network”.','თქვენ მუშაობთ არა „ნეირონულ ქსელთან“, არამედ ადამიანთან, რომელიც შედეგზე პასუხობს.')}</p></div></div>
   <article data-reveal="" style={rd(100)} className="founder">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={base+'/team/evgeny.jpg'} alt={c('Евгений Будников','Evgeny Budnikov','ევგენი ბუდნიკოვი')} width={400} height={400} loading="lazy" decoding="async" className="founder-photo"/>
    <div className="founder-body">
     <span className="over">{c('Основатель Praxen AI','Founder, Praxen AI','Praxen AI-ის დამფუძნებელი')}</span>
     <h3>{c('Евгений Будников','Evgeny Budnikov','ევგენი ბუდნიკოვი')}</h3>
     <p className="founder-bio">{c('Отвечает за то, чтобы ИИ приносил бизнесу измеримый результат: разбирает процессы, считает эффект и ведёт внедрение от аудита до запуска.','Makes sure AI brings measurable results: maps your processes, estimates the impact and leads implementation from audit to launch.','პასუხობს იმაზე, რომ AI-მ ბიზნესს გაზომვადი შედეგი მოუტანოს: აანალიზებს პროცესებს, ითვლის ეფექტს და უძღვება დანერგვას აუდიტიდან გაშვებამდე.')}</p>
     <ul className="founder-points">{points.map(([icon,t,d])=><li key={t}><span className="tile-icon"><Icon name={icon} size={18}/></span><div><b>{t}</b><span>{d}</span></div></li>)}</ul>
     <div className="founder-foot">
      <a href={contacts.whatsapp} target="_blank" rel="noopener" className="ulink"><Icon name="whatsapp" size={15}/>WhatsApp</a>
      {contacts.telegram?<a href={contacts.telegram} target="_blank" rel="noopener" className="ulink"><Icon name="send" size={15}/>{c('Написать Евгению','Message Evgeny','მისწერეთ ევგენის')}</a>:<a href={'mailto:'+contacts.email} className="ulink"><Icon name="mail" size={15}/>{c('Написать Евгению','Email Evgeny','მისწერეთ ევგენის')}</a>}
     </div>
    </div>
   </article>
  </section>
 );
}

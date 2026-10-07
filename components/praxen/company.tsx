'use client';
// praxenai.ge "About" and "Security and data" pages (the .com site has the same pair).
// Every statement repeats what the site already says elsewhere: Batumi, three languages,
// enterprise APIs, deployment in the client's own environment, Georgian personal data law.
import {homeHref} from '@/lib/base';
import {Icon} from './icon';
import type {X} from './types';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);

function Hero({x,label,h1,lead,facts}:{x:X;label:string;h1:string;lead:string;facts:[string,string][]}){
 const {s}=x;
 return (
  <section data-screen-label="Inner hero" className="inner-hero">
   <div className="wrap inner-pad">
    <nav aria-label="Breadcrumb" className="crumbs"><a href={homeHref(x.lang)}>{s.home}</a><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav>
    <div className="inner-grid">
     <div className="min0 mw860">
      <h1 data-reveal="" className="inner-h1">{h1}</h1>
      <div data-reveal="" style={rd(140)} className="inner-lead"><p>{lead}</p><button type="button" onClick={()=>x.go(label)} className="btn btn-primary mt24">{s.action}<Icon name="arrow-right" size={16}/></button></div>
     </div>
     <ul data-reveal="" style={rd(220)} className="facts">{facts.map(([icon,t])=><li key={t}><span className="tile-icon"><Icon name={icon} size={19}/></span>{t}</li>)}</ul>
    </div>
   </div>
  </section>
 );
}

export const aboutLabel=(x:X)=>x.c('О нас','About','ჩვენ შესახებ');
export const securityLabel=(x:X)=>x.c('Безопасность и данные','Security and data','უსაფრთხოება და მონაცემები');

export function About({x}:{x:X}){
 const {c}=x;
 return (<>
  <Hero x={x} label={aboutLabel(x)}
   h1={c('Небольшая команда, которая сама внедряет то, что советует.','A small team that builds what it recommends.','პატარა გუნდი, რომელიც თავად ნერგავს იმას, რასაც გირჩევთ.')}
   lead={c('Praxen AI помогает компаниям в Грузии передать ИИ рутину: ответы клиентам, заявки, документы и отчёты. Мы в Батуми и работаем с клиентами по всей стране, на грузинском, английском и русском.','Praxen AI helps companies in Georgia hand routine work to AI: customer replies, enquiries, documents and reports. We are in Batumi and work with clients across the country in Georgian, English and Russian.','Praxen AI ეხმარება საქართველოში კომპანიებს, რუტინული სამუშაო AI-ს გადასცენ: კლიენტებთან პასუხები, მოთხოვნები, დოკუმენტები და ანგარიშები. ვართ ბათუმში და ვმუშაობთ კლიენტებთან მთელ ქვეყანაში, ქართულ, ინგლისურ და რუსულ ენებზე.')}
   facts={[['map-pin',c('Батуми · вся Грузия, очно и удалённо','Batumi · all of Georgia, on site and remote','ბათუმი · მთელი საქართველო, ადგილზე და დისტანციურად')],['languages',c('Грузинский, английский, русский','Georgian, English, Russian','ქართული, ინგლისური, რუსული')],['user-round',c('Один ответственный от аудита до запуска','One accountable lead from audit to launch','ერთი პასუხისმგებელი აუდიტიდან გაშვებამდე')]]}/>
  <section data-screen-label="About story" className="wrap sec">
   <div className="split">
    <h2 data-reveal="" className="h2">{c('Зачем мы это делаем.','Why we do this.','რატომ ვაკეთებთ ამას.')}</h2>
    <div className="privacy-body company-body">
     <p>{c('Компаниям нужно, чтобы клиент быстро получил ответ, заявка попала в CRM, а документы были готовы без лишних часов работы. Под эти задачи мы и делаем решения.','Companies need customers to get a quick answer, enquiries to land in the CRM and documents to be ready without extra hours of work. That is what we build for.','კომპანიებს სჭირდებათ, რომ კლიენტმა სწრაფად მიიღოს პასუხი, მოთხოვნა CRM-ში მოხვდეს და დოკუმენტები ზედმეტი საათების გარეშე მომზადდეს. სწორედ ამისთვის ვქმნით გადაწყვეტილებებს.')}</p>
     <p>{c('Начинаем с бесплатного аудита и одного процесса. Цену пилота фиксируем до старта, а результат измеряем по метрике, о которой договорились заранее. Если ИИ не подходит для задачи, говорим об этом сразу.','We start with a free audit and one workflow. The pilot price is fixed before work starts, and the result is measured against a metric agreed upfront. If AI is not the right tool for the job, we say so straight away.','ვიწყებთ უფასო აუდიტით და ერთი პროცესით. პილოტის ფასს სამუშაოს დაწყებამდე ვაფიქსირებთ, შედეგს კი წინასწარ შეთანხმებული მეტრიკით ვზომავთ. თუ AI ამოცანისთვის არ გამოდგება, ამას მაშინვე გეუბნებით.')}</p>
    </div>
   </div>
  </section>
 </>);
}

export function Security({x}:{x:X}){
 const {c}=x;
 const items:[string,string,string][]=[
  ['lock',c('Enterprise API','Enterprise APIs','Enterprise API'),c('Работаем через корпоративные API OpenAI и Anthropic: ваши данные не используются для обучения публичных моделей.','We use the OpenAI and Anthropic enterprise APIs: your data is not used to train public models.','ვმუშაობთ OpenAI-სა და Anthropic-ის კორპორაციული API-ით: თქვენი მონაცემები საჯარო მოდელების სწავლებისთვის არ გამოიყენება.')],
  ['server',c('Ваш контур','Your own environment','თქვენი გარემო'),c('Если данные не должны покидать компанию, разворачиваем решение на ваших серверах, при необходимости с поставкой GPU-серверов.','If data must stay inside the company, we deploy the solution on your servers, with GPU servers supplied if needed.','თუ მონაცემები კომპანიის გარეთ არ უნდა გავიდეს, გადაწყვეტილებას თქვენს სერვერებზე ვნერგავთ, საჭიროების შემთხვევაში GPU სერვერების მიწოდებით.')],
  ['key-round',c('Доступы','Access','წვდომა'),c('ИИ получает доступ только к нужным системам и данным, по ролям. После передачи проекта наши доступы отзываются.','AI gets access only to the systems and data it needs, by role. Our access is removed after handover.','AI იღებს წვდომას მხოლოდ საჭირო სისტემებსა და მონაცემებზე, როლების მიხედვით. პროექტის გადაცემის შემდეგ ჩვენი წვდომა უქმდება.')],
  ['scroll-text',c('Журнал действий','Action log','მოქმედებების ჟურნალი'),c('Каждое действие ИИ записывается вместе с источником: видно, что произошло и почему.','Every AI action is logged with its source, so you can see what happened and why.','AI-ს ყოველი მოქმედება წყაროსთან ერთად იწერება: ჩანს, რა მოხდა და რატომ.')],
  ['file-signature',c('Персональные данные','Personal data','პერსონალური მონაცემები'),c('Работаем по Закону Грузии «О защите персональных данных» и оформляем условия обработки данных до старта работ.','We work under the Law of Georgia on Personal Data Protection and agree the data processing terms before work starts.','ვმუშაობთ საქართველოს კანონით „პერსონალურ მონაცემთა დაცვის შესახებ“ და მონაცემთა დამუშავების პირობებს სამუშაოს დაწყებამდე ვაფორმებთ.')],
  ['trash-2',c('Хранение','Retention','შენახვა'),c('Сколько хранить переписку, записи и документы, решаете вы. После этого срока данные удаляются.','You decide how long conversations, recordings and documents are kept. After that they are deleted.','რამდენ ხანს შეინახება მიმოწერა, ჩანაწერები და დოკუმენტები, თქვენ წყვეტთ. ამ ვადის შემდეგ მონაცემები იშლება.')],
 ];
 return (<>
  <Hero x={x} label={securityLabel(x)}
   h1={c('Ваши данные остаются под вашим контролем.','Your data stays under your control.','თქვენი მონაცემები თქვენს კონტროლქვეშ რჩება.')}
   lead={c('Работаем через корпоративные API, которые не обучаются на ваших данных, или разворачиваем решение в вашем контуре. Ниже — как мы обращаемся с данными и доступами.','We use enterprise APIs that do not train on your data, or deploy the solution in your own environment. Here is how we handle data and access.','ვიყენებთ კორპორაციულ API-ს, რომელიც თქვენს მონაცემებზე არ სწავლობს, ან გადაწყვეტილებას თქვენს გარემოში ვნერგავთ. ქვემოთ — როგორ ვმუშაობთ მონაცემებსა და წვდომებთან.')}
   facts={[['lock',c('Данные не обучают публичные модели','Data never trains public models','მონაცემები საჯარო მოდელებს არ ასწავლის')],['server',c('Развёртывание в вашем контуре','Deployment in your environment','თქვენს გარემოში განთავსება')],['scroll-text',c('Журнал каждого действия ИИ','A log of every AI action','AI-ს ყოველი მოქმედების ჟურნალი')]]}/>
  <section data-screen-label="Security" className="wrap sec">
   <div className="grid-c3w" data-stagger="">{items.map(([ic,t,d])=><article key={t} className="card partner-card"><span className="tile-icon"><Icon name={ic} size={20}/></span><h3>{t}</h3><p>{d}</p></article>)}</div>
   <p className="sec-sources">{c('Источники: ','Sources: ','წყაროები: ')}<a href="https://matsne.gov.ge/en/document/view/5827307" target="_blank" rel="noopener">{c('Закон Грузии «О защите персональных данных»','Law of Georgia on Personal Data Protection','საქართველოს კანონი „პერსონალურ მონაცემთა დაცვის შესახებ“')}</a> · <a href="https://openai.com/enterprise-privacy/" target="_blank" rel="noopener">{c('OpenAI: данные бизнес-клиентов','OpenAI: business data','OpenAI: ბიზნეს მონაცემები')}</a> · <a href="https://www.anthropic.com/legal/commercial-terms" target="_blank" rel="noopener">{c('Anthropic: коммерческие условия','Anthropic: commercial terms','Anthropic: კომერციული პირობები')}</a></p>
  </section>
 </>);
}

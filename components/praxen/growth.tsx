'use client';
import {useState} from 'react';
import {prices} from '@/lib/pricing';
import {track} from '@/components/analytics';
import {Icon} from './icon';
import type {X} from './types';

const rd=(ms:number)=>({'--rd':ms+'ms'} as React.CSSProperties);
const fmt=(n:number)=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const usdPerGel=prices.implementation.usd/prices.implementation.gel;

// Savings calculator: hours and lari freed per month, revenue from leads that are lost today
// (one in five assumed to convert, stated on screen) and payback of the implementation tier.
export function Calculator({x}:{x:X}){
 const {c}=x;
 const [req,setReq]=useState(1500),[min,setMin]=useState(8),[cost,setCost]=useState(12),[share,setShare]=useState(60),[lost,setLost]=useState(10),[check,setCheck]=useState(300);
 const hours=req*min/60*share/100,money=hours*cost,revenue=lost*check*0.2,net=money+revenue-prices.support.gel;
 const payback=net>0?prices.implementation.gel/net:0;
 const touched=(set:(n:number)=>void)=>(e:React.ChangeEvent<HTMLInputElement>)=>set(+e.target.value);
 const fields:[string,number,(n:number)=>void,number,number,number,string][]=[
  [c('Обращений или документов в месяц','Requests or documents per month','მოთხოვნები ან დოკუმენტები თვეში'),req,setReq,50,5000,50,''],
  [c('Минут сотрудника на одно','Staff minutes per item','თანამშრომლის წუთები ერთზე'),min,setMin,1,30,1,c(' мин',' min',' წთ')],
  [c('Стоимость часа сотрудника','Cost of one staff hour','თანამშრომლის საათის ღირებულება'),cost,setCost,5,60,1,' ₾'],
  [c('Доля, которую берёт ИИ','Share handled by AI','AI-ს წილი'),share,setShare,20,80,5,'%'],
  [c('Заявок теряется в месяц','Leads lost per month','დაკარგული მოთხოვნები თვეში'),lost,setLost,0,100,1,''],
  [c('Средний чек клиента','Average deal value','საშუალო ჩეკი'),check,setCheck,50,5000,50,' ₾'],
 ];
 const paybackText=payback<=0?c('при таком объёме выгоднее начать с обучения команды','at this volume, start with team training','ასეთი მოცულობით უმჯობესია გუნდის სწავლებით დაწყება'):payback<1?c('меньше месяца','under a month','თვეზე ნაკლები'):c('≈ '+payback.toFixed(1).replace('.',',')+' мес.','≈ '+payback.toFixed(1)+' months','≈ '+payback.toFixed(1)+' თვე');
 return (
  <section id="calculator" className="wrap sec" data-screen-label="Calculator">
   <div className="sec-head"><div data-reveal="" style={rd(80)}><h2 className="h2 mw820">{c('Сколько вы сэкономите и заработаете?','How much could you save and earn?','რამდენს დაზოგავთ და გამოიმუშავებთ?')}</h2><p className="lead">{c('Подставьте свои цифры — увидите часы и лари, которые освободит ИИ, выручку с заявок, которые сейчас теряются, и срок окупаемости.','Enter your numbers to see the hours and lari AI could free up, the revenue from leads you lose today and how fast it pays back.','შეიყვანეთ თქვენი რიცხვები და ნახეთ, რამდენ საათსა და ლარს გაათავისუფლებს AI, შემოსავალს დღეს დაკარგული მოთხოვნებიდან და ანაზღაურების ვადას.')}</p></div></div>
   <div data-reveal="" className="calc">
    <div className="calc-inputs">
     {fields.map(([lb,v,set,mn,mx,st,unit],i)=><label key={lb} className={'calc-field'+(i===4?' calc-field-sep':'')}>
      <span className="calc-label"><span>{lb}</span><b>{fmt(v)}{unit}</b></span>
      <input type="range" min={mn} max={mx} step={st} value={v} onChange={touched(set)} onPointerUp={()=>track('calculator_use')} style={{'--p':((v-mn)/(mx-mn)*100)+'%'} as React.CSSProperties}/>
     </label>)}
    </div>
    <div className="calc-result" aria-live="polite">
     <div><small>{c('Освобождается в месяц','Freed up per month','თავისუფლდება თვეში')}</small><b className="calc-big">{fmt(hours)} {c('ч','h','სთ')}</b></div>
     <div><small>{c('Экономия в месяц','Savings per month','დანაზოგი თვეში')}</small><b className="calc-big">{fmt(money)} ₾</b><span className="calc-usd">≈ ${fmt(money*usdPerGel)}</span></div>
     <div><small>{c('Выручка с потерянных заявок','Revenue from lost leads','შემოსავალი დაკარგული მოთხოვნებიდან')}</small><b className="calc-big">+{fmt(revenue)} ₾</b><span className="calc-usd">{c('если каждая пятая станет клиентом','if one in five becomes a customer','თუ ყოველი მეხუთე კლიენტად იქცევა')}</span></div>
     <div className="calc-payback"><Icon name="trending-up" size={18}/><span>{c('Окупаемость внедрения от ','Implementation from ','დანერგვა ')+fmt(prices.implementation.gel)+' ₾'+c(' даже с дополнительным ведением: ',' pays back, even with ongoing maintenance, in: ','-დან, დამატებითი მომსახურების ჩათვლითაც, ანაზღაურდება: ')}<b>{paybackText}</b></span></div>
     <button type="button" onClick={()=>x.go(c('Расчёт: ','Estimate: ','გათვლა: ')+fmt(req)+' × '+min+c(' мин, ИИ ',' min, AI ',' წთ, AI ')+share+'% ≈ '+fmt(money)+' ₾; '+lost+c(' заявок × ',' leads × ',' მოთხოვნა × ')+fmt(check)+' ₾')} className="btn btn-primary">{c('Обсудить мой расчёт','Discuss my estimate','ჩემი გათვლის განხილვა')}<Icon name="arrow-right" size={16}/></button>
     <p className="calc-note">{c('Оценка по вашим вводным. Реальный эффект измеряем на пилоте.','An estimate based on your inputs. We measure the real effect in a pilot.','შეფასება თქვენი მონაცემებით. რეალურ ეფექტს პილოტზე ვზომავთ.')}</p>
    </div>
   </div>
  </section>
 );
}

// What the free audit delivers, with an illustrative report.
export function AuditReport({x}:{x:X}){
 const {c}=x;
 const gets=[['git-branch',c('Карта процессов','Process map','პროცესების რუკა'),c('Где теряется время: обращения, документы, отчёты — с оценкой часов в месяц.','Where time goes — enquiries, documents, reports — with hours per month.','სად იკარგება დრო: მოთხოვნები, დოკუმენტები, ანგარიშები — საათების შეფასებით.')],['bar-chart-3',c('Расчёт эффекта','Impact estimate','ეფექტის გათვლა'),c('Сколько часов и лари освободит ИИ в каждом процессе и что важнее начать первым.','Hours and lari AI could free in each process and what to start with.','რამდენ საათსა და ლარს გაათავისუფლებს AI თითოეულ პროცესში და რით დავიწყოთ.')],['rocket',c('План и цена пилота','Pilot plan and price','პილოტის გეგმა და ფასი'),c('Один процесс, метрика успеха, сроки и фиксированная цена — до начала работ.','One process, a success metric, timeline and a fixed price — before any work starts.','ერთი პროცესი, წარმატების მეტრიკა, ვადები და ფიქსირებული ფასი — სამუშაოს დაწყებამდე.')]];
 const heads=[c('Процесс','Process','პროცესი'),c('Сейчас, ч/мес','Now, h/mo','ახლა, სთ/თვე'),c('С ИИ','With AI','AI‑ით'),'₾/'+c('мес','mo','თვე'),c('Приоритет','Priority','პრიორიტეტი')];
 const rows=[[c('Ответы гостям в WhatsApp','Guest replies on WhatsApp','სტუმრების პასუხები WhatsApp-ში'),'120','40','1 600',c('Высокий','High','მაღალი'),'hi'],[c('Бронирования и предоплаты','Bookings and deposits','ჯავშნები და წინასწარი გადახდა'),'60','25','700',c('Средний','Medium','საშუალო'),'mid'],[c('Отзывы и репутация','Reviews and reputation','შეფასებები და რეპუტაცია'),'20','6','280',c('Низкий','Low','დაბალი'),'lo']];
 return (
  <section className="band-soft" data-screen-label="Audit report">
   <div className="wrap sec audit">
    <div>
     <div data-reveal=""><h2 className="h2">{c('Что даёт бесплатный аудит.','What the free audit gives you.','რას გაძლევთ უფასო აუდიტი.')}</h2><p className="lead">{c('Не презентацию, а рабочий документ: что автоматизировать, сколько это даст и сколько стоит пилот.','Not a sales deck but a working document: what to automate, what it yields and what the pilot costs.','არა პრეზენტაცია, არამედ სამუშაო დოკუმენტი: რა ავტომატიზდეს, რას მოგცემთ და რა ღირს პილოტი.')}</p></div>
     <ul className="audit-gets">{gets.map(([icon,t,d],i)=><li key={t} data-reveal="" style={rd(i*90)}><span className="tile-icon"><Icon name={icon} size={19}/></span><div><b>{t}</b><span>{d}</span></div></li>)}</ul>
     <a href="#contact" onClick={x.toContact} className="btn btn-primary mt28">{x.s.action}<Icon name="arrow-right" size={16}/></a>
    </div>
    <div data-reveal="" style={rd(150)} className="report" aria-label={c('Пример отчёта','Sample report','ანგარიშის ნიმუში')}>
     <div className="report-head"><span><Icon name="file-text" size={16}/>{c('Аудит процессов','Process audit','პროცესების აუდიტი')}</span><small>{c('Пример · сеть из 4 отелей','Sample · 4-hotel network','ნიმუში · 4 სასტუმროს ქსელი')}</small></div>
     <table>
      <thead><tr>{heads.map(h=><th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map(([p,now,ai,m,pr,cls])=><tr key={p}><th scope="row">{p}</th><td data-label={heads[1]}>{now}</td><td data-label={heads[2]}>{ai}</td><td data-label={heads[3]} className="num">{m}</td><td data-label={heads[4]}><span className={'prio prio-'+cls}>{pr}</span></td></tr>)}</tbody>
     </table>
     <div className="report-foot"><Icon name="rocket" size={15}/><span><b>{c('Рекомендуемый пилот:','Recommended pilot:','რეკომენდებული პილოტი:')}</b> {c('ассистент WhatsApp · 2–4 недели · 3 200 ₾','WhatsApp assistant · 2–4 weeks · 3,200 ₾','WhatsApp ასისტენტი · 2–4 კვირა · 3 200 ₾')}</span></div>
     <p className="report-note">{c('Данные условные, для иллюстрации.','Illustrative figures.','მონაცემები პირობითია.')}</p>
    </div>
   </div>
  </section>
 );
}

// Partner programme page body.
export function Partners({x}:{x:X}){
 const {c,s}=x;
 const who=[['plug',c('Интеграторы 1С и CRM','1C and CRM integrators','1C და CRM ინტეგრატორები'),c('Добавьте ИИ к своим внедрениям amoCRM, Bitrix24 и 1С.','Add AI to your amoCRM, Bitrix24 and 1C projects.','დაამატეთ AI თქვენს amoCRM, Bitrix24 და 1C პროექტებს.')],['calculator',c('Бухгалтерские и юридические фирмы','Accounting and law firms','საბუღალტრო და იურიდიული ფირმები'),c('Клиентам с горой документов — автоматизация первички и сверок.','For clients buried in paperwork — automated documents and reconciliations.','კლიენტებისთვის, ვისაც ბევრი დოკუმენტი აქვს — პირველადი დოკუმენტების ავტომატიზაცია.')],['megaphone',c('Маркетинговые и digital-агентства','Marketing and digital agencies','მარკეტინგული და ციფრული სააგენტოები'),c('Чат-боты, обработка лидов и контент для ваших клиентов.','Chatbots, lead handling and content for your clients.','ჩატბოტები, ლიდების დამუშავება და კონტენტი თქვენი კლიენტებისთვის.')],['briefcase',c('Бизнес-консультанты','Business consultants','ბიზნეს-კონსულტანტები'),c('Предложите клиенту измеримую автоматизацию после диагностики.','Offer clients measurable automation after your diagnostics.','შესთავაზეთ კლიენტს გაზომვადი ავტომატიზაცია დიაგნოსტიკის შემდეგ.')]];
 const perks=[['wallet',c('Вознаграждение с каждого проекта','A reward on every project','ანაზღაურება ყოველ პროექტზე'),c('Процент с оплаченного проекта и ведения. Размер обсуждаем индивидуально.','A share of each paid project and support plan. We agree the rate individually.','პროცენტი ყოველი გადახდილი პროექტიდან და მხარდაჭერიდან. ოდენობას ინდივიდუალურად ვათანხმებთ.')],['handshake',c('Совместные продажи','Joint sales','ერთობლივი გაყიდვები'),c('Выходим к клиенту вместе или работаем под вашим брендом.','We meet clients together or deliver under your brand.','კლიენტთან ერთად გავდივართ ან თქვენი ბრენდით ვმუშაობთ.')],['graduation-cap',c('Обучение и материалы','Training and materials','სწავლება და მასალები'),c('Демо, кейсы и презентации на трёх языках для ваших продаж.','Demos, case studies and decks in three languages for your sales.','დემოები, ქეისები და პრეზენტაციები სამ ენაზე.')]];
 const steps=[c('Вы рекомендуете клиента или приводите его на встречу.','You refer a client or bring them to a meeting.','თქვენ გვირჩევთ კლიენტს ან მოგყავთ შეხვედრაზე.'),c('Мы проводим бесплатный аудит и запускаем пилот.','We run the free audit and launch a pilot.','ვატარებთ უფასო აუდიტს და ვიწყებთ პილოტს.'),c('Вы получаете вознаграждение после оплаты клиентом.','You are paid once the client pays.','ანაზღაურებას იღებთ კლიენტის გადახდის შემდეგ.')];
 return (<>
  <section className="inner-hero">
   <div className="wrap inner-pad">
    <nav aria-label="Breadcrumb" className="crumbs"><a href={x.link('').replace(/\/$/,'')}>{s.home}</a><span aria-hidden="true">/</span><span aria-current="page">{c('Партнёрам','Partners','პარტნიორებს')}</span></nav>
    <div className="inner-grid">
     <div className="min0 mw860">
      <h1 data-reveal="" className="inner-h1">{c('Зарабатывайте на ИИ вместе с нами.','Earn from AI with us.','გამოიმუშავეთ AI-ით ჩვენთან ერთად.')}</h1>
      <div data-reveal="" style={rd(140)} className="inner-lead"><p>{c('Партнёрская программа для тех, у кого уже есть клиенты в Грузии: вы приводите компанию, мы внедряем ИИ, вы получаете вознаграждение.','A partner programme for anyone who already serves companies in Georgia: you bring the client, we implement AI, you earn a reward.','პარტნიორული პროგრამა მათთვის, ვისაც უკვე ჰყავს კლიენტები საქართველოში: თქვენ მოგყავთ კომპანია, ჩვენ ვნერგავთ AI-ს, თქვენ იღებთ ანაზღაურებას.')}</p><button type="button" onClick={()=>x.go(c('Партнёрство','Partnership','პარტნიორობა'))} className="btn btn-primary mt24">{c('Стать партнёром','Become a partner','გახდით პარტნიორი')}<Icon name="arrow-right" size={16}/></button></div>
     </div>
     <ul data-reveal="" style={rd(220)} className="facts">{perks.map(([icon,t])=><li key={t}><span className="tile-icon"><Icon name={icon} size={19}/></span>{t}</li>)}</ul>
    </div>
   </div>
  </section>
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">{c('Кому подходит.','Who it is for.','ვისთვისაა.')}</h2></div></div>
   <div className="grid-c4" data-stagger="">{who.map(([icon,t,d])=><article key={t} className="card partner-card"><span className="tile-icon"><Icon name={icon} size={20}/></span><h3>{t}</h3><p>{d}</p></article>)}</div>
  </section>
  <section className="band-white bordered">
   <div className="wrap sec split">
    <div data-reveal=""><h2 className="h2">{c('Что вы получаете.','What you get.','რას იღებთ.')}</h2></div>
    <div className="grid-c3">{perks.map(([icon,t,d],i)=><div key={t} data-reveal="" style={rd(i*90)} className="trust-point"><span className="tile-icon"><Icon name={icon} size={19}/></span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div>
   </div>
  </section>
  <section className="wrap sec">
   <div className="sec-head"><div data-reveal=""><h2 className="h2 mw820">{c('Как это работает.','How it works.','როგორ მუშაობს.')}</h2></div></div>
   <div data-reveal="line" aria-hidden="true" className="process-line"/>
   <ol className="process process-3">{steps.map((st,i)=><li key={st}><div data-reveal="" style={rd(i*110)}><span className="step-num">{'0'+(i+1)}</span><p className="partner-step">{st}</p></div></li>)}</ol>
  </section>
 </>);
}

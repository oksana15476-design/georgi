'use client';
import {contacts} from '@/lib/contacts';
import {setConsent} from '@/components/analytics';
import type {X} from './types';

// Privacy policy. Legal entity details are filled in once the company provides them; have a lawyer
// review the final text before running paid campaigns.
type Block=[string,string[]];
const updated='2026-10-04';

export function Privacy({x}:{x:X}){
 const {c,s}=x;
 const blocks:Block[]=[
  [c('Кто обрабатывает данные','Who processes your data','ვინ ამუშავებს მონაცემებს'),[
   c('Оператор данных — Praxen AI (Грузия). По вопросам о данных пишите в Telegram или звоните: ','The data controller is Praxen AI (Georgia). For any data question, message us on Telegram or call: ','მონაცემთა დამმუშავებელია Praxen AI (საქართველო). მონაცემებთან დაკავშირებით მოგვწერეთ Telegram-ში ან დაგვირეკეთ: ')+contacts.phoneLabel+'.',
   c('Мы соблюдаем Закон Грузии «О защите персональных данных».','We comply with the Law of Georgia on Personal Data Protection.','ვიცავთ საქართველოს კანონს „პერსონალურ მონაცემთა დაცვის შესახებ“.')]],
  [c('Какие данные мы получаем','What data we collect','რა მონაცემებს ვიღებთ'),[
   c('Из формы заявки: контакт (Telegram или телефон), выбранные варианты, текст задачи, страница, с которой отправлена заявка, и источник перехода (например, метки UTM).','From the enquiry form: your contact (Telegram or phone), the options you chose, your message, the page you sent it from and the traffic source (such as UTM tags).','განაცხადის ფორმიდან: კონტაქტი (Telegram ან ტელეფონი), არჩეული ვარიანტები, ამოცანის ტექსტი, გვერდი, საიდანაც გაიგზავნა, და გადმოსვლის წყარო (მაგალითად, UTM ნიშნები).'),
   c('С вашего согласия — обезличенные данные о посещении: страницы, устройство, нажатия кнопок (Google Analytics, Яндекс Метрика, пиксель Meta, Google Ads).','With your consent, anonymous usage data: pages viewed, device and button clicks (Google Analytics, Yandex Metrica, Meta Pixel, Google Ads).','თქვენი თანხმობით — ვიზიტის ანონიმური მონაცემები: გვერდები, მოწყობილობა, ღილაკებზე დაჭერა (Google Analytics, Yandex Metrica, Meta Pixel, Google Ads).')]],
  [c('Зачем','Why we use it','რისთვის'),[
   c('Чтобы ответить на заявку, уточнить задачу и подготовить оценку проекта. Основание — ваш запрос и действия до заключения договора.','To reply to your enquiry, clarify the task and prepare an estimate. The basis is your request and steps taken before a contract.','რომ ვუპასუხოთ განაცხადს, დავაზუსტოთ ამოცანა და მოვამზადოთ შეფასება. საფუძველია თქვენი მოთხოვნა და ხელშეკრულებამდე ქმედებები.'),
   c('Чтобы понимать, какие страницы и каналы полезны, и улучшать сайт. Основание — ваше согласие, которое можно отозвать в любой момент.','To learn which pages and channels are useful and improve the site. The basis is your consent, which you can withdraw at any time.','რომ გავიგოთ, რომელი გვერდები და არხებია სასარგებლო, და გავაუმჯობესოთ საიტი. საფუძველია თქვენი თანხმობა, რომლის გაუქმებაც ნებისმიერ დროს შეგიძლიათ.')]],
  [c('Кому передаются данные','Who receives it','ვის გადაეცემა მონაცემები'),[
   c('Заявки доставляются нам через Telegram, электронную почту и CRM-систему amoCRM. Сайт размещён у хостинг-провайдера.','Enquiries reach us via Telegram, email and the amoCRM system. The site runs on a hosting provider.','განაცხადები გვეგზავნება Telegram-ით, ელფოსტით და amoCRM სისტემით. საიტი განთავსებულია ჰოსტინგ-პროვაიდერთან.'),
   c('Аналитические и рекламные сервисы (Google, Яндекс, Meta) получают данные только после вашего согласия. Мы не продаём данные третьим лицам.','Analytics and ad services (Google, Yandex, Meta) receive data only after your consent. We never sell data to third parties.','ანალიტიკისა და სარეკლამო სერვისები (Google, Yandex, Meta) მონაცემებს მხოლოდ თქვენი თანხმობის შემდეგ იღებენ. მონაცემებს მესამე პირებს არ ვყიდით.')]],
  [c('Сколько храним','How long we keep it','რამდენ ხანს ვინახავთ'),[
   c('Данные заявки — до 3 лет после последнего контакта или до вашего запроса на удаление.','Enquiry data is kept for up to 3 years after our last contact, or until you ask us to delete it.','განაცხადის მონაცემები ინახება ბოლო კონტაქტიდან 3 წლამდე ან წაშლის მოთხოვნამდე.')]],
  [c('Ваши права','Your rights','თქვენი უფლებები'),[
   c('Вы можете узнать, какие данные у нас есть, исправить или удалить их, отозвать согласие и подать жалобу в Службу защиты персональных данных Грузии. Напишите нам — ответим в течение 10 рабочих дней.','You may ask what data we hold, correct or delete it, withdraw consent and complain to the Personal Data Protection Service of Georgia. Contact us and we will reply within 10 working days.','შეგიძლიათ გაიგოთ, რა მონაცემები გვაქვს, გაასწოროთ ან წაშალოთ ისინი, გააუქმოთ თანხმობა და მიმართოთ საქართველოს პერსონალურ მონაცემთა დაცვის სამსახურს. მოგვწერეთ — 10 სამუშაო დღეში გიპასუხებთ.')]],
 ];
 return (
  <section className="wrap sec privacy">
   <nav aria-label="Breadcrumb" className="crumbs"><a href={x.link('').replace(/\/$/,'')}>{s.home}</a><span aria-hidden="true">/</span><span aria-current="page">{c('Конфиденциальность','Privacy','კონფიდენციალურობა')}</span></nav>
   <h1 className="inner-h1 mt24">{c('Политика конфиденциальности','Privacy policy','კონფიდენციალურობის პოლიტიკა')}</h1>
   <p className="lead">{c('Коротко: используем ваши данные только чтобы ответить на заявку, а аналитику включаем только с вашего согласия.','In short: we use your data only to answer your enquiry, and analytics runs only with your consent.','მოკლედ: თქვენს მონაცემებს ვიყენებთ მხოლოდ განაცხადზე პასუხისთვის, ანალიტიკა კი მხოლოდ თქვენი თანხმობით ირთვება.')}</p>
   <div className="privacy-body">
    {blocks.map(([h,ps])=><section key={h}><h2>{h}</h2>{ps.map(p=><p key={p}>{p}</p>)}</section>)}
    <section><h2>Cookie</h2><p>{c('Изменить решение о cookie можно в любой момент.','You can change your cookie choice at any time.','cookie-ებზე გადაწყვეტილების შეცვლა ნებისმიერ დროს შეგიძლიათ.')}</p><button type="button" onClick={()=>{setConsent('unset');window.scrollTo({top:0})}} className="btn btn-ghost mt14">{c('Настройки cookie','Cookie settings','cookie-ის პარამეტრები')}</button></section>
    <p className="privacy-date">{c('Обновлено: ','Last updated: ','განახლდა: ')+updated}</p>
   </div>
  </section>
 );
}

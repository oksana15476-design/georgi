import type {Copy} from './content';

// Search titles for department and industry pages [ru, en, ka], built around the queries in
// SEMANTIC-CORE.md. Pages without an entry fall back to the headline.
export const detailMeta:Record<string,Copy>={
 sales:['ИИ для отдела продаж: чат-бот в WhatsApp и CRM','AI for sales teams: WhatsApp chatbot and CRM automation','AI გაყიდვებისთვის: WhatsApp ჩატბოტი და CRM'],
 marketing:['ИИ для маркетинга: контент на трёх языках и отчёты','AI for marketing: content in three languages and reports','AI მარკეტინგისთვის: კონტენტი სამ ენაზე და ანგარიშები'],
 support:['Чат-бот для WhatsApp и Telegram: поддержка клиентов 24/7','WhatsApp and Telegram chatbot for customer support 24/7','WhatsApp და Telegram ჩატბოტი მომხმარებლების მხარდაჭერისთვის 24/7'],
 operations:['Автоматизация документов и бэк-офиса с ИИ','AI document processing and back-office automation','დოკუმენტებისა და ბექ‑ოფისის AI ავტომატიზაცია'],
 hr:['ИИ для HR: онбординг и ответы по регламентам','AI for HR: onboarding and internal policy assistant','AI HR‑ისთვის: ონბორდინგი და შიდა ასისტენტი'],
 finance:['ИИ для бухгалтерии: распознавание счетов и выписок','AI for accounting: invoice and statement processing','AI ბუღალტერიისთვის: ინვოისებისა და ამონაწერების დამუშავება'],
 procurement:['ИИ для закупок: сравнение КП поставщиков','AI for procurement: supplier quote comparison','AI შესყიდვებისთვის: მომწოდებლების შეთავაზებების შედარება'],
 leadership:['ИИ-стратегия для собственника: где ИИ окупится','AI strategy for business owners: where AI pays off','AI სტრატეგია მფლობელებისთვის: სად ანაზღაურდება AI'],
 retail:['ИИ для интернет-магазина: чат-бот-консультант 24/7','AI for e-commerce: 24/7 shopping assistant chatbot','AI ონლაინ მაღაზიისთვის: ჩატბოტი‑კონსულტანტი 24/7'],
 wholesale:['ИИ для оптовой торговли: заказы из PDF и WhatsApp в счёт','AI for wholesale: orders from PDF and WhatsApp to invoices','AI საბითუმო ვაჭრობისთვის: შეკვეთები PDF‑იდან და WhatsApp‑იდან'],
 hotels:['ИИ-консьерж и чат-бот для отелей: WhatsApp 24/7','AI concierge and chatbot for hotels: WhatsApp 24/7','AI კონსიერჟი და ჩატბოტი სასტუმროებისთვის: WhatsApp 24/7'],
 tourism:['ИИ для турагентств: маршрут и смета за минуты','AI for travel agencies: itinerary and quote in minutes','AI ტურისტული კომპანიებისთვის: მარშრუტი და ფასი წუთებში'],
 'real-estate':['ИИ для агентств недвижимости: лиды и подбор объектов','AI for real estate agencies: leads and property matching','AI უძრავი ქონების სააგენტოებისთვის: ლიდები და შერჩევა'],
 developers:['ИИ для застройщиков: квалификация лидов 24/7','AI for property developers: 24/7 lead qualification','AI დეველოპერებისთვის: ლიდების კვალიფიკაცია 24/7'],
 restaurants:['ИИ для ресторанов: бронирование столиков в WhatsApp','AI for restaurants: table bookings on WhatsApp','AI რესტორნებისთვის: მაგიდის დაჯავშნა WhatsApp‑ში'],
 clinics:['ИИ для клиник: чат-бот для записи пациентов 24/7','AI for clinics: 24/7 patient booking chatbot','AI კლინიკებისთვის: პაციენტების ჩაწერის ჩატბოტი 24/7'],
 logistics:['ИИ для логистики: CMR, накладные и статусы грузов','AI for logistics: CMRs, invoices and shipment status','AI ლოჯისტიკისთვის: CMR, ზედნადებები და ტვირთის სტატუსი'],
 manufacturing:['ИИ для производства: ассистент по регламентам и ТО','AI for manufacturing: assistant for procedures and maintenance','AI წარმოებისთვის: ასისტენტი რეგლამენტებითა და ტექმომსახურებით'],
 services:['ИИ для агентств и консалтинга: брифы, КП, протоколы','AI for agencies and consulting: briefs, proposals, meeting notes','AI სააგენტოებისა და კონსალტინგისთვის: ბრიფები და შეთავაზებები'],
 education:['ИИ для школ и курсов: чат-бот для набора и студентов','AI for schools and courses: admissions and student chatbot','AI სკოლებისა და კურსებისთვის: მიღებისა და სტუდენტების ჩატბოტი'],
};

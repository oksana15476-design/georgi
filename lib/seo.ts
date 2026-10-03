import {languages,Lang,t,Copy} from '@/lib/content';
// Public origin used for canonical and hreflang URLs. Update when the site moves to its own domain.
export const siteUrl='https://praxis-ai-georgia.evgenijbudnikov44.chatgpt.site';
export const defaultLang:Lang='en';
export const siteTitle:Copy=['Praxis AI — ИИ для бизнеса в Грузии','Praxis AI — AI for businesses in Georgia','Praxis AI — AI ბიზნესისთვის საქართველოში'];
export const siteDescription:Copy=['Разрабатываем ИИ-помощников, автоматизируем клиентский сервис и обучаем команды. Практические решения для компаний в Грузии.','We build AI assistants, automate customer service and train teams. Practical solutions for companies in Georgia.','ვქმნით AI ასისტენტებს, ვავტომატიზებთ მომსახურებას და ვასწავლით გუნდებს საქართველოში.'];
export const isLang=(v:string):v is Lang=>languages.includes(v as Lang);
// path is the part after the language prefix: '' for home, '/industries/retail' for a detail page.
export const alternates=(lang:Lang,path:string)=>({canonical:'/'+lang+path,languages:{...Object.fromEntries(languages.map(l=>[l,'/'+l+path])),'x-default':'/'+defaultLang+path}});
export const description=(lang:Lang)=>t(siteDescription,lang);

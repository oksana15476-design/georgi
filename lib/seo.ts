import type {Metadata} from 'next';
import {languages,Lang,t,Copy,departments,industries} from '@/lib/content';
import {contacts} from '@/lib/contacts';
import {pageCopy} from '@/lib/page-copy';
import {prices} from '@/lib/pricing';
import {detailMeta} from '@/lib/detail-meta';
// Public address (including any sub-path) used for canonical, hreflang, Open Graph and the sitemap.
// Set NEXT_PUBLIC_SITE_URL when the site moves to its own domain.
export const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||'https://praxis-ai-georgia.evgenijbudnikov44.chatgpt.site').replace(/\/$/,'');
export const defaultLang:Lang='en';
export const siteTitle:Copy=['Praxis AI — ИИ для бизнеса в Грузии','Praxis AI — AI for businesses in Georgia','Praxis AI — AI ბიზნესისთვის საქართველოში'];
export const siteDescription:Copy=['Разрабатываем ИИ-помощников, автоматизируем клиентский сервис и обучаем команды. Практические решения для компаний в Грузии.','We build AI assistants, automate customer service and train teams. Practical solutions for companies in Georgia.','ვქმნით AI ასისტენტებს, ვავტომატიზებთ მომსახურებას და ვასწავლით გუნდებს საქართველოში.'];
export const isLang=(v:string):v is Lang=>languages.includes(v as Lang);
export const absolute=(path:string)=>siteUrl+path;
// path is the part after the language prefix: '' for home, '/industries/retail' for a detail page.
export const alternates=(lang:Lang,path:string)=>({canonical:absolute('/'+lang+path),languages:{...Object.fromEntries(languages.map(l=>[l,absolute('/'+l+path)])),'x-default':absolute('/'+defaultLang+path)}});
export const description=(lang:Lang)=>t(siteDescription,lang);
const locales:Record<Lang,string>={en:'en_US',ka:'ka_GE',ru:'ru_RU'};

// Full metadata for one page: canonical and hreflang links, Open Graph and Twitter cards.
export function pageMeta(lang:Lang,path:string,title:string,desc:string):Metadata{
 const image={url:absolute('/og/og-'+lang+'.png'),width:1200,height:630,alt:t(siteTitle,lang)};
 return {title,description:desc,alternates:alternates(lang,path),
  openGraph:{type:'website',url:absolute('/'+lang+path),siteName:'Praxis AI',title,description:desc,locale:locales[lang],alternateLocale:languages.filter(l=>l!==lang).map(l=>locales[l]),images:[image]},
  twitter:{card:'summary_large_image',title,description:desc,images:[image.url]}};
}

// Every public page, for the sitemap.
export const allPaths=['',...['industries','departments','training','solutions','cases','partners','privacy'].map(s=>'/'+s),...departments.map(d=>'/departments/'+d.slug),...industries.map(i=>'/industries/'+i.slug)];

const offers:[Copy,keyof typeof prices,string?][]=[
 [['Обучение команды работе с ИИ','AI training for teams','გუნდის AI სწავლება'],'training','/training'],
 [['Внедрение ИИ-инструментов','AI tool implementation','AI ინსტრუმენტების დანერგვა'],'implementation','/solutions'],
 [['Разработка ИИ-решений','Custom AI development','AI გადაწყვეტილებების შემუშავება'],'development','/solutions'],
 [['Сопровождение ИИ-решений','AI support and maintenance','AI გადაწყვეტილებების მხარდაჭერა'],'support','/solutions'],
];

// Site-wide graph: the business with its services and starting prices, the founder and the website.
export function organizationJsonLd(lang:Lang){
 const org=absolute('/#organization');
 return {'@context':'https://schema.org','@graph':[
  {'@type':'ProfessionalService','@id':org,name:'Praxis AI',url:absolute('/'+lang),logo:absolute('/og/logo.png'),image:absolute('/og/og-'+lang+'.png'),description:description(lang),telephone:contacts.phone,
   address:{'@type':'PostalAddress',addressCountry:'GE'},areaServed:{'@type':'Country',name:'Georgia'},availableLanguage:['ka','en','ru'],knowsLanguage:['ka','en','ru'],sameAs:[contacts.telegram],
   founder:{'@id':absolute('/#founder')},
   contactPoint:{'@type':'ContactPoint',telephone:contacts.phone,contactType:'sales',availableLanguage:['Georgian','English','Russian']},
   hasOfferCatalog:{'@type':'OfferCatalog',name:t(['Услуги Praxis AI','Praxis AI services','Praxis AI-ის მომსახურება'],lang),itemListElement:offers.map(([name,key,path])=>({'@type':'Offer',url:absolute('/'+lang+(path||'')),
    priceSpecification:{'@type':'PriceSpecification',minPrice:prices[key].gel,priceCurrency:'GEL',...(key==='support'?{unitText:'MONTH'}:{})},
    itemOffered:{'@type':'Service',name:t(name,lang),provider:{'@id':org},areaServed:{'@type':'Country',name:'Georgia'}}}))}},
  {'@type':'Person','@id':absolute('/#founder'),name:t(['Евгений Будников','Evgeny Budnikov','ევგენი ბუდნიკოვი'],lang),jobTitle:t(['Основатель','Founder','დამფუძნებელი'],lang),worksFor:{'@id':org},image:absolute('/team/evgeny.jpg')},
  {'@type':'WebSite','@id':absolute('/#website'),url:absolute('/'+lang),name:'Praxis AI',inLanguage:lang,publisher:{'@id':org}},
 ]};
}

// Per-page graph: breadcrumbs, the FAQ shown on the page and, on department and industry pages,
// the service the page describes.
export function pageJsonLd({lang,crumbs,faq,service}:{lang:Lang;crumbs:[string,string][];faq:[string,string][];service?:{name:string;description:string;path:string}}){
 const graph:Record<string,unknown>[]=[];
 if(crumbs.length>1)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:absolute('/'+lang+path)}))});
 if(faq.length)graph.push({'@type':'FAQPage',inLanguage:lang,mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 if(service)graph.push({'@type':'Service',name:service.name,description:service.description,url:absolute('/'+lang+service.path),serviceType:service.name,provider:{'@id':absolute('/#organization')},areaServed:{'@type':'Country',name:'Georgia'},availableLanguage:['ka','en','ru']});
 return {'@context':'https://schema.org','@graph':graph};
}

// Department and industry pages: the search title from detail-meta (or the start of the page
// headline), and the page subheading as the description.
export function detailTitle(slug:string,lang:Lang,fallback:string){
 if(detailMeta[slug])return t(detailMeta[slug],lang)+' — Praxis AI';
 const h1=pageCopy[slug]?.[lang]?.h1;
 const head=h1?h1.split(':')[0].trim():fallback;
 return head+' '+t(['в Грузии','in Georgia','საქართველოში'],lang)+' — Praxis AI';
}
export function detailDescription(slug:string,lang:Lang,fallback:string){
 return pageCopy[slug]?.[lang]?.sub||fallback;
}

import type {Metadata} from 'next';
import {languages,Lang,t,Copy,departments,industries} from '@/lib/content';
import {contacts} from '@/lib/contacts';
import {pageCopy} from '@/lib/page-copy';
import {prices} from '@/lib/pricing';
import {detailMeta} from '@/lib/detail-meta';
import {contentUpdated} from '@/lib/proof';
import {indexable,isIntl,market,marketUrls} from '@/lib/market';
import {langPath} from '@/lib/base';
import {intlPaths,legalEntity} from '@/lib/intl';
import {foundingDate,founderProfiles,sameAsFor} from '@/lib/profiles';
// Public address (including any sub-path) used for canonical, hreflang, Open Graph and the sitemap.
// NEXT_PUBLIC_SITE_URL overrides it, e.g. for the Georgian domain or a staging address.
export const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||marketUrls[market]).replace(/\/$/,'');
export const defaultLang:Lang='en';
export const siteTitle:Copy=['Praxen AI — ИИ для бизнеса в Грузии','Praxen AI — AI for businesses in Georgia','Praxen AI — AI ბიზნესისთვის საქართველოში'];
export const siteDescription:Copy=['Разрабатываем чат-боты и ИИ-агентов, автоматизируем клиентский сервис и обучаем команды. Практические решения для компаний в Грузии.','We build AI chatbots and AI agents, automate customer service and train teams. Practical solutions for companies in Georgia.','ვქმნით AI ჩატბოტებსა და AI აგენტებს, ვავტომატიზებთ მომსახურებას და ვასწავლით გუნდებს საქართველოში.'];
export const isLang=(v:string):v is Lang=>languages.includes(v as Lang);
export const absolute=(path:string)=>siteUrl+path;
// Public address of a page: /en/pricing on praxenai.ge, /pricing on the English-only praxenai.com.
export const pageUrl=(lang:Lang,path:string)=>absolute((langPath(lang)+path)||'/');
// path is the part after the language prefix: '' for home, '/industries/retail' for a detail page.
// avail: the languages a page exists in (blog articles are not translated into every language).
export const alternates=(lang:Lang,path:string,avail:Lang[]=languages)=>({canonical:pageUrl(lang,path),languages:{...Object.fromEntries(avail.map(l=>[l,pageUrl(l,path)])),'x-default':pageUrl(avail.includes(defaultLang)?defaultLang:avail[0],path)}});
export const description=(lang:Lang)=>t(siteDescription,lang);
const locales:Record<Lang,string>={en:'en_US',ka:'ka_GE',ru:'ru_RU'};

// Full metadata for one page: canonical and hreflang links, Open Graph and Twitter cards.
export function pageMeta(lang:Lang,path:string,title:string,desc:string,avail:Lang[]=languages):Metadata{
 const image=isIntl?{url:absolute('/og/og-intl.png'),width:1200,height:630,alt:'Praxen AI — practical AI for business'}:{url:absolute('/og/og-'+lang+'.png'),width:1200,height:630,alt:t(siteTitle,lang)};
 return {title,description:desc,alternates:alternates(lang,path,avail),
  openGraph:{type:'website',url:pageUrl(lang,path),siteName:'Praxen AI',title,description:desc,locale:isIntl?'en_GB':locales[lang],alternateLocale:avail.filter(l=>l!==lang).map(l=>locales[l]),images:[image]},
  twitter:{card:'summary_large_image',title,description:desc,images:[image.url]},
  ...(indexable?{}:{robots:{index:false,follow:false}})};
}

// Every public page, for the sitemap.
export const allPaths=isIntl?intlPaths:['',...['industries','departments','training','solutions','cases','partners','privacy','about','security','blog'].map(s=>'/'+s),...departments.map(d=>'/departments/'+d.slug),...industries.map(i=>'/industries/'+i.slug)];

const offers:[Copy,keyof typeof prices,string?][]=[
 [['Обучение команды работе с ИИ','AI training for teams','გუნდის AI სწავლება'],'training','/training'],
 [['Внедрение ИИ-инструментов','AI tool implementation','AI ინსტრუმენტების დანერგვა'],'implementation','/solutions'],
 [['Разработка ИИ-решений','Custom AI development','AI გადაწყვეტილებების შემუშავება'],'development','/solutions'],
 [['Дополнительное ведение ИИ-решений','Ongoing AI maintenance','AI გადაწყვეტილებების დამატებითი მომსახურება'],'support','/solutions'],
];

// Site-wide graph: the business with its services and starting prices, the founder and the website.
// praxenai.com uses intlOrganizationJsonLd (lib/intl-seo.ts) instead.
export function organizationJsonLd(lang:Lang){
 const org=absolute('/#organization');
 return {'@context':'https://schema.org','@graph':[
  {'@type':'ProfessionalService','@id':org,name:'Praxen AI',url:pageUrl(lang,''),logo:absolute('/og/logo.png'),image:absolute('/og/og-'+lang+'.png'),description:description(lang),telephone:contacts.phone,
   address:{'@type':'PostalAddress',addressLocality:'Batumi',addressRegion:'Adjara',addressCountry:'GE'},areaServed:{'@type':'Country',name:'Georgia'},availableLanguage:['ka','en','ru'],knowsLanguage:['ka','en','ru'],sameAs:sameAsFor('ge',[contacts.telegram]),legalName:legalEntity.name,foundingDate,
   founder:{'@id':absolute('/#founder')},
   contactPoint:{'@type':'ContactPoint',telephone:contacts.phone,contactType:'sales',availableLanguage:['Georgian','English','Russian']},
   hasOfferCatalog:{'@type':'OfferCatalog',name:t(['Услуги Praxen AI','Praxen AI services','Praxen AI-ის მომსახურება'],lang),itemListElement:[...offers.map(([name,key,path])=>({'@type':'Offer',url:pageUrl(lang,path||''),
    priceSpecification:{'@type':'PriceSpecification',minPrice:prices[key].gel,priceCurrency:'GEL',...(key==='support'?{unitText:'MONTH'}:{})},
    itemOffered:{'@type':'Service',name:t(name,lang),provider:{'@id':org},areaServed:{'@type':'Country',name:'Georgia'}}})),]}},
  {'@type':'Person','@id':absolute('/#founder'),name:t(['Евгений Будников','Evgeny Budnikov','ევგენი ბუდნიკოვი'],lang),jobTitle:t(['Основатель','Founder','დამფუძნებელი'],lang),worksFor:{'@id':org},image:absolute('/team/evgeny.jpg'),url:pageUrl(lang,'/about'),knowsAbout:['AI implementation','AI chatbots','AI agents','Business process automation'],...(founderProfiles.length?{sameAs:founderProfiles}:{})},
  {'@type':'WebSite','@id':absolute('/#website'),url:pageUrl(lang,''),name:'Praxen AI',inLanguage:lang,publisher:{'@id':org}},
 ]};
}

// Per-page graph: breadcrumbs, the FAQ shown on the page and, on department and industry pages,
// the service the page describes.
export function pageJsonLd({lang,crumbs,faq,service,article,path}:{lang:Lang;crumbs:[string,string][];faq:[string,string][];service?:{name:string;description:string;path:string};article?:{title:string;description:string;date:string;path:string};path:string}){
 const graph:Record<string,unknown>[]=[{'@type':'WebPage','@id':pageUrl(lang,path),url:pageUrl(lang,path),inLanguage:lang,isPartOf:{'@id':absolute('/#website')},about:{'@id':absolute('/#organization')},dateModified:contentUpdated}];
 if(crumbs.length>1)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:pageUrl(lang,path)}))});
 if(faq.length)graph.push({'@type':'FAQPage',inLanguage:lang,mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 if(article)graph.push({'@type':'BlogPosting',headline:article.title,description:article.description,url:pageUrl(lang,article.path),inLanguage:lang,datePublished:article.date,dateModified:article.date,author:{'@id':absolute('/#founder')},publisher:{'@id':absolute('/#organization')},image:absolute('/og/og-'+lang+'.png'),mainEntityOfPage:pageUrl(lang,article.path)});
 if(service)graph.push({'@type':'Service',name:service.name,description:service.description,url:pageUrl(lang,service.path),serviceType:service.name,provider:{'@id':absolute('/#organization')},areaServed:{'@type':'Country',name:'Georgia'},availableLanguage:['ka','en','ru']});
 return {'@context':'https://schema.org','@graph':graph};
}

// Department and industry pages: the search title from detail-meta (or the start of the page
// headline), and the page subheading as the description.
export function detailTitle(slug:string,lang:Lang,fallback:string){
 if(detailMeta[slug])return t(detailMeta[slug],lang)+' — Praxen AI';
 const h1=pageCopy[slug]?.[lang]?.h1;
 const head=h1?h1.split(':')[0].trim():fallback;
 return head+' '+t(['в Грузии','in Georgia','საქართველოში'],lang)+' — Praxen AI';
}
export function detailDescription(slug:string,lang:Lang,fallback:string){
 return pageCopy[slug]?.[lang]?.sub||fallback;
}

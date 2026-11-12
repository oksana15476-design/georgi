// Page addresses and the per-page JSON-LD of praxenai.ge, without the page copy and the praxenai.com data that lib/seo.ts
// imports: components/site.tsx builds the JSON-LD in the browser too, so this file stays light. lib/seo.ts re-exports it all.
import type {Lang} from '@/lib/content';
import {gePageModified} from '@/lib/dates';
import {market,marketUrls} from '@/lib/market';
import {langPath} from '@/lib/base';

// Public address (including any sub-path) used for canonical, hreflang, Open Graph and the sitemap.
// NEXT_PUBLIC_SITE_URL overrides it, e.g. for the Georgian domain or a staging address.
export const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||marketUrls[market]).replace(/\/$/,'');
export const absolute=(path:string)=>siteUrl+path;
// Public address of a page: /en/pricing on praxenai.ge, /pricing on the English-only praxenai.com.
export const pageUrl=(lang:Lang,path:string)=>absolute((langPath(lang)+path)||'/');

// Per-page graph: breadcrumbs, the FAQ shown on the page and, on department and industry pages,
// the service the page describes. modified: an article's update date or a blog list's newest article (lib/freshness.ts);
// other pages take their date from gePageModified.
export function pageJsonLd({lang,crumbs,faq,service,article,path,modified}:{lang:Lang;crumbs:[string,string][];faq:[string,string][];service?:{name:string;description:string;path:string};article?:{title:string;description:string;date:string;path:string};path:string;modified?:string}){
 const dateModified=modified||gePageModified(path);
 const graph:Record<string,unknown>[]=[{'@type':'WebPage','@id':pageUrl(lang,path),url:pageUrl(lang,path),inLanguage:lang,isPartOf:{'@id':absolute('/#website')},about:{'@id':absolute('/#organization')},dateModified}];
 if(crumbs.length>1)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:pageUrl(lang,path)}))});
 if(faq.length)graph.push({'@type':'FAQPage',inLanguage:lang,mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 if(article)graph.push({'@type':'BlogPosting',headline:article.title,description:article.description,url:pageUrl(lang,article.path),inLanguage:lang,datePublished:article.date,dateModified,author:{'@id':absolute('/#founder')},publisher:{'@id':absolute('/#organization')},image:absolute('/og/og-'+lang+'.png'),mainEntityOfPage:pageUrl(lang,article.path)});
 if(service)graph.push({'@type':'Service',name:service.name,description:service.description,url:pageUrl(lang,service.path),serviceType:service.name,provider:{'@id':absolute('/#organization')},areaServed:{'@type':'Country',name:'Georgia'},availableLanguage:['ka','en','ru']});
 return {'@context':'https://schema.org','@graph':graph};
}

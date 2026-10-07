// praxenai.com structured data: the site-wide organisation graph and a graph per page
// (WebPage with dateModified, BreadcrumbList, FAQPage with every answer, Service with GBP/USD/EUR offers).
import {contacts} from '@/lib/contacts';
import {absolute,pageUrl} from '@/lib/seo';
import {curs,entityOf,faqFor,intlMeta,intlUpdated,offers,price,promo,routePath,sectionName,type IntlRoute} from '@/lib/intl';

const org=()=>absolute('/#organization');

export function intlOrganizationJsonLd(){
 return {'@context':'https://schema.org','@graph':[
  {'@type':'ProfessionalService','@id':org(),name:'Praxen AI',url:absolute('/'),logo:absolute('/og/logo.png'),email:contacts.email,
   description:'AI implementation company for small businesses in the UK, US and EU: AI receptionists, chatbots for websites and WhatsApp, automation for CRM, documents and invoices, AI agents and team training.',
   address:{'@type':'PostalAddress',addressLocality:'Batumi',addressCountry:'GE'},
   areaServed:[{'@type':'Country',name:'United Kingdom'},{'@type':'Country',name:'United States'},{'@type':'Place',name:'European Union'}],
   availableLanguage:['en'],knowsAbout:['AI receptionist','AI voice agent','AI chatbot','AI automation','AI agents','AI consultancy','AI training','UK GDPR'],
   founder:{'@id':absolute('/#founder')},contactPoint:{'@type':'ContactPoint',email:contacts.email,contactType:'sales',availableLanguage:['English']},
   hasOfferCatalog:{'@type':'OfferCatalog',name:'Praxen AI services',itemListElement:offers.map(o=>({'@type':'Offer',url:absolute(o.path),
    priceSpecification:{'@type':'UnitPriceSpecification',price:promo(price(o.price)),priceCurrency:'GBP',valueAddedTaxIncluded:false,...(o.monthly?{unitText:'MONTH'}:{})},
    itemOffered:{'@type':'Service',name:o.name,description:o.body,provider:{'@id':org()}}}))}},
  {'@type':'Person','@id':absolute('/#founder'),name:'Evgeny Budnikov',jobTitle:'Founder',worksFor:{'@id':org()},image:absolute('/team/evgeny.jpg')},
  {'@type':'WebSite','@id':absolute('/#website'),url:absolute('/'),name:'Praxen AI',inLanguage:'en-GB',publisher:{'@id':org()}},
 ]};
}

export function intlPageJsonLd(r:IntlRoute){
 const path=routePath(r),url=pageUrl('en',path),e=entityOf(r),m=intlMeta(r);
 const graph:Record<string,unknown>[]=[{'@type':'WebPage','@id':url,url,name:m.title,description:m.description,inLanguage:'en-GB',isPartOf:{'@id':absolute('/#website')},about:{'@id':org()},dateModified:intlUpdated}];
 const crumbs:[string,string][]=[['Home','']];
 if(r.page!=='home'){
  if(r.page==='training'||!r.slug)crumbs.push([e&&r.page!=='training'?e.name:sectionName[r.page],path]);
  else crumbs.push([sectionName[r.page],'/'+r.page],[e?.name||r.slug,path]);
 }
 if(crumbs.length>1)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,p],i)=>({'@type':'ListItem',position:i+1,name,item:pageUrl('en',p)}))});
 const faq=r.page==='privacy'||r.page==='terms'?[]:faqFor(r,e,'gbp').items;
 if(faq.length)graph.push({'@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 if(e){
  const rc=e.slug==='ai-receptionist';
  const key=rc?'rcMonth':e.slug==='ai-training'?'training':e.slug==='ai-agents'?'custom':'pilot';
  graph.push({'@type':'Service',name:e.name,description:e.sub,url,serviceType:e.name,provider:{'@id':org()},areaServed:[{'@type':'Country',name:'United Kingdom'},{'@type':'Country',name:'United States'},{'@type':'Place',name:'European Union'}],
   offers:curs.map(c=>({'@type':'Offer',priceCurrency:c.toUpperCase(),price:promo(price(key,c)),url,priceSpecification:{'@type':'UnitPriceSpecification',price:promo(price(key,c)),priceCurrency:c.toUpperCase(),valueAddedTaxIncluded:false,...(rc?{unitText:'MONTH'}:{})}}))});
 }
 return {'@context':'https://schema.org','@graph':graph};
}

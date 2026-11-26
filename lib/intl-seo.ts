// praxenai.com structured data: the site-wide organisation graph and a graph per page
// (WebPage with dateModified, BreadcrumbList, FAQPage with every answer, Service with GBP/USD/EUR offers).
import {contacts} from '@/lib/contacts';
import {absolute,pageUrl} from '@/lib/seo';
import {posts} from '@/lib/intl-blog';
import {foundingDate,founderProfiles,sameAsFor} from '@/lib/profiles';
import {modifiedOf,newestOf,intlPageModified} from '@/lib/freshness';
import {ogPageImage} from '@/lib/og-image';
import {curs,entityOf,faqFor,intlMeta,legalEntity,offers,packages,price,routePath,sectionName,type Cur,type IntlRoute,type PriceKey} from '@/lib/intl';

// A price in JSON-LD: monthly fees carry unitText MONTH; a package has two parts, the one-off launch fee and the monthly fee.
const spec=(k:PriceKey,c:Cur,monthly?:boolean,name?:string)=>({'@type':'UnitPriceSpecification',...(name?{name}:{}),price:price(k,c),priceCurrency:c.toUpperCase(),valueAddedTaxIncluded:false,...(monthly?{unitText:'MONTH'}:{})});

const org=()=>absolute('/#organization');

export function intlOrganizationJsonLd(){
 return {'@context':'https://schema.org','@graph':[
  {'@type':'ProfessionalService','@id':org(),name:'Praxen AI',url:absolute('/'),logo:absolute('/og/logo.png'),email:contacts.email,
   description:'AI implementation company for businesses in the UK, US and EU: AI receptionists, chatbots for websites and WhatsApp, automation for CRM, documents and invoices, AI agents and team training.',
   areaServed:[{'@type':'Country',name:'United Kingdom'},{'@type':'Country',name:'United States'},{'@type':'Place',name:'European Union'}],
   availableLanguage:['en'],knowsAbout:['AI receptionist','AI voice agent','AI chatbot','AI automation','AI agents','AI consultancy','AI training','UK GDPR'],
   founder:{'@id':absolute('/#founder')},...(sameAsFor('intl').length?{sameAs:sameAsFor('intl')}:{}),legalName:legalEntity.name,foundingDate,contactPoint:{'@type':'ContactPoint',email:contacts.email,contactType:'sales',availableLanguage:['English']},
   hasOfferCatalog:{'@type':'OfferCatalog',name:'Praxen AI services',itemListElement:offers.map(o=>({'@type':'Offer',url:absolute(o.path),
    priceSpecification:o.setup?[spec(o.setup,'gbp',false,'Launch fee'),spec(o.price,'gbp',true,'Monthly fee')]:spec(o.price,'gbp',o.monthly),
    itemOffered:{'@type':'Service',name:o.name,description:o.body,provider:{'@id':org()}}}))}},
  {'@type':'Person','@id':absolute('/#founder'),name:'Evgeny Budnikov',jobTitle:'Founder',worksFor:{'@id':org()},image:absolute('/team/evgeny.jpg'),url:absolute('/about'),knowsAbout:['AI implementation','AI receptionists','AI agents','Business process automation'],...(founderProfiles.intl.length?{sameAs:founderProfiles.intl}:{})},
  {'@type':'WebSite','@id':absolute('/#website'),url:absolute('/'),name:'Praxen AI',inLanguage:'en-GB',publisher:{'@id':org()}},
 ]};
}

// Title and description of any page, blog posts included.
export function intlPageMeta(r:IntlRoute){
 const post=r.page==='blog'&&r.slug?posts.find(p=>p.slug===r.slug):undefined;
 return post?{title:post.title+' | Praxen AI',description:post.description}:intlMeta(r);
}

export function intlPageJsonLd(r:IntlRoute){
 const path=routePath(r),url=pageUrl('en',path),e=entityOf(r),m=intlPageMeta(r);
 const post=r.page==='blog'&&r.slug?posts.find(p=>p.slug===r.slug):undefined;
 // An article: its update or publication date; the blog list: the newest article; other pages: lib/freshness.ts.
 const modified=post?modifiedOf(post):r.page==='blog'?newestOf(posts):intlPageModified(path);
 const graph:Record<string,unknown>[]=[{'@type':'WebPage','@id':url,url,name:m.title,description:m.description,inLanguage:'en-GB',isPartOf:{'@id':absolute('/#website')},about:{'@id':org()},dateModified:modified}];
 const crumbs:[string,string][]=[['Home','']];
 if(r.page!=='home'){
  if(r.page==='training'||!r.slug)crumbs.push([e&&r.page!=='training'?e.name:sectionName[r.page],path]);
  else crumbs.push([sectionName[r.page],'/'+r.page],[post?.title||e?.name||r.slug,path]);
 }
 if(crumbs.length>1)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map(([name,p],i)=>({'@type':'ListItem',position:i+1,name,item:pageUrl('en',p)}))});
 const faq=post?post.faq:r.page==='privacy'||r.page==='terms'||r.page==='blog'?[]:faqFor(r,e,'gbp').items;
 if(post)graph.push({'@type':'BlogPosting',headline:post.title,description:post.description,datePublished:post.date,dateModified:modified,inLanguage:'en-GB',mainEntityOfPage:url,url,image:absolute(ogPageImage('en',path)||'/og/og-intl.png'),author:{'@id':absolute('/#founder')},publisher:{'@id':org()}});
 if(faq.length)graph.push({'@type':'FAQPage',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 if(e){
  // Receptionist and chatbot pages: one offer per package and currency (launch fee + monthly fee); other pages: the starting price.
  const group=e.slug==='ai-receptionist'?'receptionist':e.slug==='ai-chatbot'?'chatbot':'';
  const key:PriceKey=e.slug==='ai-training'?'training':e.slug==='ai-agents'?'custom':'pilot';
  const offerList=group?packages.filter(p=>p.group===group).flatMap(p=>curs.map(c=>({'@type':'Offer',name:p.groupName+' '+p.name,priceCurrency:c.toUpperCase(),price:price(p.setup,c),url,
    priceSpecification:[spec(p.setup,c,false,'Launch fee'),spec(p.month,c,true,'Monthly fee')]})))
   :curs.map(c=>({'@type':'Offer',priceCurrency:c.toUpperCase(),price:price(key,c),url,priceSpecification:spec(key,c)}));
  graph.push({'@type':'Service',name:e.name,description:e.sub,url,serviceType:e.name,provider:{'@id':org()},areaServed:[{'@type':'Country',name:'United Kingdom'},{'@type':'Country',name:'United States'},{'@type':'Place',name:'European Union'}],
   offers:offerList});
 }
 return {'@context':'https://schema.org','@graph':graph};
}

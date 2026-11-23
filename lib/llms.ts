// llms.txt: a short plain-text guide to the site for language models, served by app/llms.txt/route.ts.
// Each Worker is built for one market (NEXT_PUBLIC_MARKET), so praxenai.ge and praxenai.com get their own
// file from the same data as the pages. praxenai.com never mentions Georgia, lari or praxenai.ge
// (owner rule: the two sites are separate companies); scripts/qa/live-check.mjs checks this on the live site.
import {t,departments as geDepartments,industries as geIndustries} from '@/lib/content';
import {contacts} from '@/lib/contacts';
import {geArticles} from '@/lib/ge-blog';
import {curInfo,departments,fmt,industries,intlMeta,launchDiscountNote,price,services,servicePath,vatNote,type IntlRoute} from '@/lib/intl';
import {posts} from '@/lib/intl-blog';
import {isIntl} from '@/lib/market';
import {prices,type PriceKey} from '@/lib/pricing';
import {sectionMeta} from '@/lib/section-meta';
import {detailDescription,detailTitle,pageUrl,siteUrl} from '@/lib/seo';

const link=(title:string,url:string,desc:string)=>`- [${title}](${url}): ${desc}`;

export function intlLlms(){
 const url=(p:string)=>siteUrl+(p?'/'+p:'');
 const line=(p:string,r:IntlRoute)=>{const m=intlMeta(r);return link(m.title.replace(/ \| Praxen AI$/,''),url(p),m.description)};
 const P=(k:Parameters<typeof price>[0])=>fmt(price(k));
 return `# Praxen AI

> Praxen AI is an AI implementation company for businesses in the UK, US and EU. It sets up AI receptionists that answer calls 24/7, chatbots for websites and WhatsApp, automation for CRM, documents and invoices, and AI agents with approvals and logs, and it trains teams to use AI safely. The team works remotely in UK business hours.

Key facts:
- Packages (launch fee + monthly fee): AI receptionist Start ${P('rcSetup')} + ${P('rcMonth')} a month (one phone number, answers to common questions, calendar booking, call transfer, up to 150 call minutes a month); AI receptionist Pro ${P('rcProSetup')} + ${P('rcProMonth')} a month (one CRM, qualification scripts, call quality reviews, up to 500 minutes); Chatbot Start ${P('chatSetup')} + ${P('chatMonth')} a month (one website or messaging channel, knowledge base, handover to staff); Chatbot with CRM ${P('chatCrmSetup')} + ${P('chatCrmMonth')} a month (qualification, CRM, testing on real enquiries, regular quality reviews).
- Projects: automation pilot ${P('pilot')} for a standard process, from ${P('pilotComplex')} for a complex one (one workflow with a measurable result); custom AI solution from ${P('custom')}, from ${P('customMulti')} across several systems or processes; team training ${P('training')} for a half-day session for up to 12 people, extended programme from ${P('trainingExt')}. Care after launch: ${P('care')} a month (monitoring and fixes) or ${P('careActive')} a month (regular improvements). Prices are also available in USD and EUR.
- ${vatNote}
- Call minutes beyond a receptionist plan are billed at provider cost, typically ${curInfo.gbp.usage} a minute. AI usage for chatbots and custom solutions runs on the client's own accounts at provider cost.
- ${launchDiscountNote}
- Every project starts with a free 30-minute audit; the pilot price is fixed before work begins.
- Uses enterprise APIs (OpenAI, Anthropic) that do not train on customer data; works as a processor under a data processing agreement (UK GDPR).
- AI does not make final decisions: review points and handover to a person are agreed for every workflow.
- Contact: ${contacts.email}, WhatsApp ${contacts.whatsapp}, free call ${contacts.booking}

## Main pages
${line('',{page:'home'})}
${line('solutions',{page:'solutions'})}
${line('ai-for-small-business',{page:'ai-for-small-business'})}
${line('cases',{page:'cases'})}
${line('about',{page:'about'})}
${line('security',{page:'security'})}

## Services
${services.map(s=>line(servicePath(s.slug),s.slug==='ai-training'?{page:'training'}:{page:'services',slug:s.slug})).join('\n')}

## Industries
${industries.map(s=>line('industries/'+s.slug,{page:'industries',slug:s.slug})).join('\n')}

## Departments
${departments.map(s=>line('departments/'+s.slug,{page:'departments',slug:s.slug})).join('\n')}

## Blog
${posts.map(p=>link(p.title,url('blog/'+p.slug),p.description)).join('\n')}

## Optional
${line('partners',{page:'partners'})}
${link('Privacy policy',url('privacy'),intlMeta({page:'privacy'}).description)}
${link('Terms of service',url('terms'),intlMeta({page:'terms'}).description)}
`;
}

export function geLlms(){
 const strip=(s:string)=>s.replace(/ — Praxen AI$/,'');
 const section=(key:string)=>{const m=sectionMeta[key];return link(strip(t(m.title,'en')),pageUrl('en',key==='home'?'':'/'+key),t(m.description,'en'))};
 const gel=(n:number)=>n.toLocaleString('en-GB')+' GEL';
 const usd=(n:number)=>'$'+n.toLocaleString('en-GB');
 const p=(k:PriceKey)=>gel(prices[k].gel)+' ('+usd(prices[k].usd)+')';
 // Newest articles first, as in the blog list; every article has an English version, the others are listed under it.
 const articles=[...geArticles].sort((a,b)=>b.date.localeCompare(a.date)).flatMap(a=>{const p=a.langs.en||a.langs.ru||a.langs.ka;if(!p)return [];const lang=a.langs.en?'en':a.langs.ru?'ru':'ka';return [link(p.title,pageUrl(lang,'/blog/'+a.slug),p.description)]});
 return `# Praxen AI

> Praxen AI is an AI implementation company based in Batumi, Georgia, working with businesses in Tbilisi and across the country. It builds AI chatbots for WhatsApp, Telegram and websites, deploys AI agents that update CRM and process documents, and trains teams to use AI. Solutions work in Georgian, English and Russian.

Key facts:
- Services and prices: AI chatbot packages for one channel: Start, ${p('chatStart')} to launch plus ${p('chatStartMonth')} per month (answers to common questions, enquiry collection, handover to staff), and with CRM, ${p('chatCrm')} plus ${p('chatCrmMonth')} per month (qualification, a deal in one CRM, an enquiry report); a process automation pilot from ${p('implementation')}, 2–4 weeks; custom AI development from ${p('development')}; team AI training, ${p('training')} for a 2-hour session on one task or ${p('trainingFull')} for a tailored workshop; maintenance, ${p('support')} per month basic or ${p('supportActive')} per month active.
- Chatbot packages run on a standard template with a usage limit. Project solutions run on the client's own accounts and servers; AI tokens and infrastructure are paid directly to the providers.
- Every project starts with a free process audit; the pilot price is fixed before work begins. A pilot covers one workflow on real requests.
- Integrations via API where available, for example amoCRM, Bitrix24, HubSpot, 1C, Google Workspace, hotel PMS (Opera, Cloudbeds, Bnovo, TravelLine), WhatsApp and Telegram.
- Uses enterprise APIs (OpenAI, Anthropic) that do not train on customer data; on-premise deployment is available.
- AI does not make final decisions: review points and escalation to staff are agreed for every workflow.
- Contact: phone and WhatsApp ${contacts.phoneLabel}, Telegram ${contacts.telegram}, form at ${siteUrl}/#contact

## Main pages
${['home','solutions','chatbot','training','cases','about','security','partners'].map(section).join('\n')}

## AI by department
${section('departments')}
${geDepartments.map(d=>link(strip(detailTitle(d.slug,'en',t(d.name,'en'))),pageUrl('en','/departments/'+d.slug),detailDescription(d.slug,'en',t(d.job,'en')))).join('\n')}

## AI by industry
${section('industries')}
${geIndustries.map(i=>link(strip(detailTitle(i.slug,'en',t(i.name,'en'))),pageUrl('en','/industries/'+i.slug),detailDescription(i.slug,'en',t(i.promise,'en')))).join('\n')}

## Blog
${section('blog')}
${articles.join('\n')}

## Other languages
The site is also available in Georgian and Russian.
- [Georgian version](${pageUrl('ka','')})
- [Russian version](${pageUrl('ru','')})

## Optional
${section('privacy')}
`;
}

export const llmsText=()=>isIntl?intlLlms():geLlms();

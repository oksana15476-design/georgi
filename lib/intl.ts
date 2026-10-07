// praxenai.com (NEXT_PUBLIC_MARKET=intl): pages, prices and search titles of the international site.
// Prices approved by the owner on 2026-10-07; the launch offer takes 30% off for the first UK clients.

export const intlPages=['ai-receptionist','pricing','privacy'] as const;
export type IntlPage='home'|typeof intlPages[number];
export const isIntlPage=(v:string):v is IntlPage=>v==='home'||(intlPages as readonly string[]).includes(v);

export const launchDiscount=0.3;
type Offer={key:string;name:string;price:number;monthly?:boolean;setup?:number;unit?:string;body:string;includes:string[];time:string};
export const offers:Offer[]=[
 {key:'receptionist',name:'AI receptionist',setup:950,price:249,monthly:true,body:'Answers every call 24/7, books appointments into your calendar, takes messages and sends you a summary after each call.',
  includes:['Voice agent trained on your services, prices and FAQs','Booking into Google Calendar, Outlook or your booking system','Call summaries by email or into your CRM','Transfer to a person for urgent calls','Monthly review and updates'],time:'Live in 2 weeks'},
 {key:'training',name:'Team training',price:850,unit:'half-day session, up to 12 people',body:'Hands-on session on your own tasks: prompts, templates and safe-use rules your team keeps using.',
  includes:['Programme built around your workflows','Online or on-site (travel extra)','Prompt library and usage policy','Follow-up Q&A after 2 weeks'],time:'From 1 week'},
 {key:'implementation',name:'AI implementation pilot',price:2900,body:'One workflow automated on your real data in 2–4 weeks: chat or WhatsApp assistant, CRM updates, documents or invoices.',
  includes:['Free audit and success metric agreed upfront','Integration with your tools (HubSpot, Pipedrive, Google Workspace, Microsoft 365…)','Testing on real cases before launch','Handover and team onboarding'],time:'2–4 weeks'},
 {key:'development',name:'Custom AI solution',price:6500,body:'Multi-step AI agents, internal assistants on your knowledge base and custom integrations.',
  includes:['Solution design and estimate','AI agents with access rules and logs','Knowledge base (RAG) on your documents','Documentation and handover'],time:'From 4 weeks'},
 {key:'care',name:'Ongoing care',price:350,monthly:true,body:'We monitor answers, update the knowledge base, fix issues and improve the workflows after launch.',
  includes:['Monthly quality review','Knowledge base and prompt updates','Fixes and small improvements','Priority support by email and WhatsApp'],time:'Monthly, cancel anytime'},
];
export const gbp=(n:number)=>'£'+Math.round(n).toLocaleString('en-GB');
export const promo=(n:number)=>Math.round(n*(1-launchDiscount));

// AI and phone usage is paid at cost on the client's own accounts, as on praxenai.ge.
export const usageNote='Call minutes and AI usage are billed at provider cost on your own accounts — typically 6–15p per minute of calls.';

export const intlMeta:Record<IntlPage,{title:string;description:string}>={
 home:{title:'AI receptionist & AI automation for UK small businesses — Praxen AI',description:'AI receptionist that answers every call 24/7, books appointments and qualifies leads, plus AI automation for CRM, documents and customer service. Launch offer: 30% off.'},
 'ai-receptionist':{title:'AI receptionist for UK businesses: 24/7 call answering and booking — Praxen AI',description:'An AI receptionist that answers calls, books appointments, takes messages and sends call summaries. Live in 2 weeks, from £665 setup + £174/month with the launch offer.'},
 pricing:{title:'Pricing: AI receptionist, AI implementation and team training — Praxen AI',description:'Clear prices in GBP: AI receptionist from £950 + £249/month, AI implementation pilot from £2,900, team training from £850. Launch offer: 30% off for our first UK clients.'},
 privacy:{title:'Privacy policy — Praxen AI',description:'How Praxen AI collects and uses personal data under UK GDPR: enquiries, call bookings, analytics with consent and your rights.'},
};

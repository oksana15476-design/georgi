// praxenai.com blog. Articles from docs/CONTENT-PLAN.md (clusters E1 and E2), British English.
// Numbers come from our own prices (lib/intl.ts) and the reader's own figures; no third-party statistics.
import {fmt,price,promo,curInfo} from '@/lib/intl';

export type Block={h:string;p?:string[];list?:string[];table?:[string[],...string[][]]};
export type Post={slug:string;cat:string;title:string;description:string;excerpt:string;date:string;dateLabel:string;minutes:number;answer:string;blocks:Block[];faq:[string,string][];links:[string,string][]};

const rcSetup=fmt(price('rcSetup')),rcMonth=fmt(price('rcMonth')),rcSetupP=fmt(promo(price('rcSetup'))),rcMonthP=fmt(promo(price('rcMonth')));
const pilot=fmt(price('pilot')),pilotP=fmt(promo(price('pilot'))),custom=fmt(price('custom')),customP=fmt(promo(price('custom')));
const training=fmt(price('training')),trainingP=fmt(promo(price('training'))),care=fmt(price('care')),careP=fmt(promo(price('care')));
const usage=curInfo.gbp.usage;

export const posts:Post[]=[
 {slug:'ai-receptionist-cost-uk',cat:'AI receptionist',date:'2026-10-07',dateLabel:'7 October 2026',minutes:7,
  title:'How much does an AI receptionist cost in the UK?',
  description:'Setup, monthly fee and call minutes explained, with a simple way to check whether an AI receptionist pays for itself in your business.',
  excerpt:'Setup, the monthly fee and call minutes, plus a five-minute way to check whether it pays back for you.',
  answer:'An AI receptionist usually costs a one-off setup fee, a monthly fee and call minutes billed by the telephony and AI providers. With Praxen that is '+rcSetup+' setup and '+rcMonth+' a month ('+rcSetupP+' and '+rcMonthP+' with the launch offer), plus typically '+usage+' per minute of calls on your own accounts. Prices exclude VAT.',
  blocks:[
   {h:'What you pay for',p:['There are three parts to the price, and it helps to keep them separate when you compare quotes.'],list:['Setup: we train the voice agent on your services, prices and FAQs and connect your calendar and CRM. Then we test it on real call types before it goes live.','Monthly fee: monitoring, updates when your prices or opening hours change, and a monthly review of calls.','Call minutes: what the telephony and AI providers charge per minute. With us these run on your own accounts at cost, so there is no mark-up and you can see every call.']},
   {h:'Praxen prices',table:[['Item','Standard','Launch offer'],['Setup, one-off',rcSetup,rcSetupP],['Monthly fee',rcMonth+'/mo',rcMonthP+'/mo'],['Call minutes','typically '+usage+' a minute','at cost']],p:['All prices exclude VAT. Setup takes about two weeks. The monthly plan includes the review and updates; there is no charge per booking.']},
   {h:'What changes the price',list:['Number of call types. A clinic that books, moves and cancels appointments needs more testing than a firm that only takes messages.','Integrations. Google Calendar or Outlook are quick. A practice management system or a CRM with custom fields takes longer.','Languages. Each extra language is tested separately.','Call volume. Our fee stays the same; the minutes you pay the providers grow with it.']},
   {h:'How to check it pays back',p:['Use your own numbers from a normal week.'],list:['Count the calls you miss or send to voicemail in a week. Your phone system or provider usually shows this.','Estimate how many of those callers would have become customers. One in five is a cautious starting point for new enquiries.','Multiply by the value of a first order or appointment.','Compare the monthly result with the monthly fee and minutes.']},
   {h:'A worked example',p:['A dental practice misses 15 calls a week at lunch and after 6 pm. Say one in five of those is a new patient worth £150 on the first visit. That is three patients and £450 a week, or roughly £1,900 a month. Against '+rcMonthP+' a month plus minutes, the receptionist pays for itself if it saves even a fraction of those calls. Your numbers will differ, which is why we start with a free 30-minute audit.']},
   {h:'What an AI receptionist will not do',list:['It will not give clinical, legal or financial advice. Those calls go to a person.','It will not quote prices, discounts or dates outside the rules you approve.','It does not replace your team. It answers when they cannot and hands over anything that needs judgement.']},
  ],
  faq:[['Can it use my existing phone number?','Yes. You forward your number to it after hours, when lines are busy, or all the time.'],['Is there a long contract?','The setup is a one-off fee and the plan is billed monthly.'],['What does a typical call cost in minutes?','A three-minute call at '+usage+' a minute costs well under 50p.']],
  links:[['services/ai-receptionist','AI receptionist: how it works and pricing'],['industries/clinics','AI for clinics and dentists'],['solutions','All prices']]},
 {slug:'ai-implementation-cost',cat:'Pricing',date:'2026-10-07',dateLabel:'7 October 2026',minutes:8,
  title:'How much does AI implementation cost?',
  description:'Training, a pilot on one workflow, custom agents and ongoing care: what each costs, how long it takes and how to keep the first project small.',
  excerpt:'Four formats, what each costs and how to start small enough to measure the result.',
  answer:'For most businesses, AI implementation starts with one of four formats: team training ('+training+', '+trainingP+' with the launch offer), a pilot on one workflow ('+pilot+', '+pilotP+'), a custom solution with AI agents (from '+custom+', '+customP+') and optional ongoing care ('+care+' a month, '+careP+'). AI usage is paid to the providers at cost. Prices exclude VAT.',
  blocks:[
   {h:'Start with one workflow',p:['The most expensive AI projects are the ones that try to change everything at once. A business gets better results from one workflow with a clear metric: calls answered, invoices entered, replies sent within a minute. Once that works, the next workflow reuses the same knowledge base, access rules and integrations, so it is cheaper and faster.']},
   {h:'The four formats',table:[['Format','What you get','Timeline','Price (launch offer)'],['Team training','Half-day session on your own tasks, prompt library, usage policy','From 1 week',trainingP],['Implementation pilot','One workflow on your real data, connected to your tools','2–4 weeks',pilotP],['Custom AI solution','AI agents, internal assistants, custom integrations','From 4 weeks','from '+customP],['Ongoing care','Monitoring, knowledge base updates, fixes','Monthly',careP+'/mo']]},
   {h:'What drives the cost',list:['Integrations. Reading and writing to HubSpot, Xero or a booking system is most of the work in a pilot.','Data quality. Clean price lists and policies are quick to load. Scattered documents need sorting first.','Approval points. Every place where a person must check the result needs a screen and a rule.','Volume and languages. More channels and languages mean more testing.']},
   {h:'Costs people forget',list:['AI and telephony usage. Billed by the providers per message or minute. With us it runs on your own accounts at cost.','Staff time in the pilot. Expect a few hours from the person who knows the workflow best.','Changes after launch. Prices, products and policies change; someone has to update the knowledge base. That is what ongoing care covers.']},
   {h:'How to keep the first project small',list:['Pick the workflow that eats the most hours each week.','Agree one metric and how you will measure it before the build starts.','Test on last month’s real cases before going live.','Decide in advance what the AI may never do on its own.']},
   {h:'Is it worth it?',p:['Take the hours a workflow costs each month and multiply them by the hourly cost of the people doing it. Then add the revenue from enquiries you lose today. If a pilot at '+pilotP+' pays back within a few months on those numbers, it is worth testing. The savings calculator on our pricing page does this sum for you.']},
  ],
  faq:[['Do we need new software?','Usually not. We connect to the tools you already use.'],['Who owns the solution?','You do. It runs on your accounts, and you keep the documentation at handover.'],['Can we start with training only?','Yes. Team training is a standalone format.']],
  links:[['solutions','Pricing and savings calculator'],['services/ai-automation','AI automation'],['services/ai-consultancy','AI consultancy']]},
];

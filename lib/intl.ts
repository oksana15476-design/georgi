// praxenai.com (NEXT_PUBLIC_MARKET=intl): pages, prices and copy of the international site.
// Source: Claude Design handoff v4 (design_handoff_praxenai_com), British English.
// Prices approved by the owner on 2026-10-07; the launch offer takes 30% off for the first clients.
// Prices are fixed round numbers per currency, not exchange-rate conversions.

export type Cur='gbp'|'usd'|'eur';
export const curs:Cur[]=['gbp','usd','eur'];
export const curInfo:Record<Cur,{sym:string;label:string;usage:string}>={
 gbp:{sym:'£',label:'GBP',usage:'6–15p'},usd:{sym:'$',label:'USD',usage:'8–19¢'},eur:{sym:'€',label:'EUR',usage:'7–17c'},
};
export type PriceKey='rcSetup'|'rcMonth'|'training'|'pilot'|'custom'|'care';
export const prices:Record<PriceKey,Record<Cur,number>>={
 rcSetup:{gbp:950,usd:1190,eur:1090},
 rcMonth:{gbp:249,usd:299,eur:279},
 training:{gbp:850,usd:1050,eur:990},
 pilot:{gbp:2900,usd:3600,eur:3350},
 custom:{gbp:6500,usd:8100,eur:7500},
 care:{gbp:350,usd:440,eur:400},
};
export const launchDiscount=0.3;
export const promo=(n:number)=>Math.round(n*(1-launchDiscount));
export const fmt=(n:number,cur:Cur='gbp')=>curInfo[cur].sym+Math.round(n).toLocaleString('en-GB');
export const price=(k:PriceKey,cur:Cur='gbp')=>prices[k][cur];
export const usageNote=(cur:Cur='gbp')=>'Call minutes and AI usage are billed at provider cost on your own accounts, typically '+curInfo[cur].usage+' per minute of calls.';
export const vatNote='All prices exclude VAT. We work with businesses only. UK and EU business customers account for VAT under the reverse charge.';
// Content review date shown in the short answers and used as dateModified.
export const intlUpdated='2026-10-07';
export const intlUpdatedLabel='7 October 2026';

// Offers for JSON-LD and the receptionist price block.
export type Offer={key:string;name:string;price:PriceKey;setup?:PriceKey;monthly?:boolean;body:string;includes:string[];path:string};
export const offers:Offer[]=[
 {key:'receptionist',name:'AI receptionist',price:'rcMonth',setup:'rcSetup',monthly:true,path:'/services/ai-receptionist',body:'Answers every call 24/7, books appointments into your calendar, takes messages and sends a summary after each call.',
  includes:['Voice agent trained on your services, prices and FAQs','Booking into Google Calendar, Outlook or your booking system','Call summaries by email or into your CRM','Transfer to a person for urgent calls']},
 {key:'training',name:'Team training',price:'training',path:'/training',body:'Hands-on half-day session for up to 12 people on your own tasks: prompts, templates and safe-use rules.',includes:['Programme built around your workflows','Online or on-site (travel extra)','Prompt library and a written usage policy','Follow-up Q&A after two weeks']},
 {key:'pilot',name:'AI implementation pilot',price:'pilot',path:'/solutions',body:'One workflow automated on your real data in 2–4 weeks: chat assistant, CRM updates, documents or invoices.',includes:[]},
 {key:'custom',name:'Custom AI solution',price:'custom',path:'/solutions',body:'Multi-step AI agents, internal assistants on your knowledge base and custom integrations.',includes:[]},
 {key:'care',name:'Ongoing care',price:'care',monthly:true,path:'/solutions',body:'We monitor answers, update the knowledge base, fix issues and improve workflows after launch.',includes:[]},
];

// Pricing block: step 1 one-off launch formats, step 2 monthly care.
export const tariffs:{key:PriceKey;name:string;body:string;time:string;cta:string;popular?:boolean;from?:boolean;monthly?:boolean}[]=[
 {key:'training',name:'Team training',body:'Hands-on session on your own tasks: prompts, templates and safe-use rules. Half a day, up to 12 people.',time:'from 1 week',cta:'Get a training plan'},
 {key:'pilot',name:'Implementation pilot',body:'One workflow on your real data: chat assistant, CRM updates, documents or invoices, connected to your tools.',time:'2–4 weeks',cta:'Find the right tools',popular:true},
 {key:'custom',name:'Custom AI solution',body:'AI agents, internal assistants on your knowledge base and custom integrations.',time:'from 4 weeks',cta:'Request an estimate',from:true},
 {key:'care',name:'Ongoing care',body:'We update the knowledge base, review answers, fix errors and improve workflows.',time:'AI usage and servers stay on your account, paid directly',cta:'Discuss care',monthly:true},
];

// ---- Animated scenes (components/intl/scene.tsx) ----
export type SceneType='call'|'doc'|'score'|'chat'|'agent'|'playbook'|'crm'|'helpdesk'|'slack'|'compare'|'planner';
export type SceneData=Record<string,unknown>;
export const scenes:Record<SceneType,SceneData>={
 call:{caller:'Incoming call',number:'+44 7700 900 412',lines:[['c','Hi, I’d like to book a consultation for next week.'],['a','Of course. Thursday at 14:30 or Friday at 10:00?'],['c','Thursday works. It’s Sarah Collins.'],['a','Booked. You’ll get a confirmation text now.']],slot:'Thu 14:30 · Consultation',slotWho:'Sarah Collins',summary:'New booking, first visit. Prefers SMS reminders.',to:'office@yourfirm.co.uk'},
 doc:{app:'Google Sheets',file:'INV-20418.pdf',from:'accounts@supplier.co.uk',fields:[['Supplier','Northgate Supplies Ltd'],['Invoice no.','INV-20418'],['Net','£1,240.00'],['VAT 20%','£248.00'],['Due','14 Nov 2026']],sheet:'Purchase ledger',row:['Northgate','£1,488.00','14 Nov'],approve:'Approved by finance'},
 score:{title:'Process audit',items:[['Answering phone enquiries',92,'18 h/wk'],['Invoice data entry',78,'9 h/wk'],['Writing quotes',64,'6 h/wk'],['Weekly reporting',40,'3 h/wk'],['Social media replies',28,'2 h/wk']],pick:3},
 chat:{channel:'WhatsApp',who:'Riverside Dental',q:'Do you do teeth whitening, and how much is it?',a:'Yes. In-surgery whitening is £395, home kits are £250. Both start with a check-up.',src:'Price list · updated 2 Oct',hand:'Hand over to reception'},
 agent:{title:'Agent run · supplier email',steps:[['inbox','Read','New order request from Bramley Foods'],['search-check','Check','Stock and price list match 6 of 6 lines'],['file-edit','Draft','Order confirmation and delivery date'],['user-check','Wait for approval','Sent to Tom for sign-off']],log:['09:12 read email #4821','09:12 matched 6 SKUs','09:13 drafted reply','09:13 waiting: human approval']},
 playbook:{title:'Team playbook',cards:[['Reply to a complaint','Prompt'],['Summarise a call','Prompt'],['Never paste client IDs','Rule'],['Draft a quote','Template'],['Check facts against source','Rule']],hours:11},
 crm:{app:'HubSpot',tile:'#ff7a59',deal:'Bramley Foods — 40 office chairs',stages:['New','Qualified','Quote sent','Won'],stage:1,fields:[['Contact','Tom Reed'],['Deal value','£8,400'],['Source','Inbound call · 14:02'],['Next step','Send quote today']],note:'Call summary logged by AI · reviewed by Sam'},
 helpdesk:{tickets:[['#5521','Where is my order?','Resolved by AI','ok'],['#5522','Item arrived damaged, want a refund','Urgent','urgent'],['#5523','How do I change my delivery address?','Resolved by AI','ok']],open:'Item arrived damaged, want a refund',draft:'Sorry about that. I’ve attached our returns label and flagged this for a refund.',hand:'Hand over to an agent',who:'Assigned to Emma · 1 min'},
 slack:{app:'Slack',channel:'ask-hr',user:'Nina Shah',q:'How many days of holiday do I have left this year?',a:'You have 9 days left for 2026. Book them in BrightHR before 15 December to carry over up to 5.',src:'Staff handbook · section 4.2',bot:'HR assistant'},
 compare:{pdf:'quote_FINAL_v3 (2).pdf',email:'RE: RE: Fwd: pricing for Q4',head:['Supplier','Unit','Delivery','Total'],rows:[['Northgate','£4.20','5 days','£4,200'],['Bexley Ltd','£3.95','10 days','£3,950'],['Harper & Co','£4.05','3 days','£4,050']],best:2,bestLabel:'Best value for a 1-week deadline'},
 planner:{days:['Mon','Tue','Wed','Thu','Fri'],posts:[[0,'Instagram','Autumn menu is here'],[2,'LinkedIn','How we cut reply times to 10 seconds'],[4,'Instagram','Meet the team: Sarah']],status:'Scheduled · waiting for your approval'},
};
const xero={app:'Xero',tile:'#13b5ea',sheet:'Xero · Bills to pay'};

// ---- Services (jobs to be done), industries and departments ----
type Pair=[string,string];
export type Entity={slug:string;name:string;icon:string;desc:string;scene:SceneType;sceneData?:SceneData;h1:string;sub:string;stats:Pair[];
 scenarios:[string,string,string][];tested?:string[];answer?:string;question?:string;faqs?:Pair[];pricing?:boolean;title?:string};

export const services:Entity[]=[
 {slug:'ai-receptionist',name:'AI receptionist',icon:'phone-call',desc:'Answers every call, books and takes messages 24/7',scene:'call',pricing:true,
  title:'AI receptionist for UK businesses: 24/7 call answering',question:'What does an AI receptionist do and what does it cost?',
  h1:'An AI receptionist that answers every call.',sub:'It picks up 24/7, books appointments into your calendar, takes messages and sends you a summary after each call. Urgent calls go straight to a person.',
  stats:[['24/7','calls answered, evenings and weekends'],['2 weeks','from first call to live'],['6–15p','per call minute, at cost']],
  scenarios:[['calendar-check','Book appointments','Checks free slots and books directly into Google Calendar, Outlook or your booking system.'],['message-square-text','Take messages','Captures name, number and reason, then emails or texts you a clean summary.'],['phone-forwarded','Transfer urgent calls','Recognises urgent requests and puts them through to the right person.'],['help-circle','Answer FAQs','Opening hours, prices, parking and what to bring, from your own information.'],['user-plus','Qualify new leads','Asks your questions and logs the answers in HubSpot or Pipedrive.'],['languages','Speak several languages','Handles callers in English and other languages your clients use.']],
  tested:['We call it ourselves with 50+ real scenarios from your business before launch.','It never quotes prices, dates or promises outside the rules you approve.','Every call has a recording, transcript and summary you can check.'],
  answer:'An AI receptionist is a voice agent that answers your business phone, books appointments and takes messages around the clock. Praxen sets one up in about two weeks.',
  faqs:[['Will callers know it’s AI?','Yes. It introduces itself as your virtual assistant. Most callers care that they get an answer and a booking straight away.'],['Can it use my existing number?','Yes. We forward your number to it after hours, when lines are busy, or all the time. Your choice.'],['What happens with a difficult call?','It transfers to a person or takes a detailed message and flags it as urgent.']]},
 {slug:'ai-automation',name:'AI automation',icon:'workflow',desc:'Stop retyping enquiries, documents and invoices',scene:'doc',
  title:'AI automation for invoices, documents and CRM',question:'What does AI automation do and what does it cost?',
  h1:'AI automation for the work your team retypes.',sub:'Enquiries, PDFs, invoices and emails are read, checked and entered into your CRM, accounting software or spreadsheets. People approve, the system types.',
  stats:[['2–4 wks','pilot on one workflow'],['1 metric','agreed before we start'],['Human','approval before anything is posted']],
  scenarios:[['file-text','Invoices into Xero or QuickBooks','Supplier invoices are read, coded and queued for approval.'],['mail','Email enquiries into CRM','Each enquiry becomes a contact and deal with the right fields filled.'],['table','Reports from spreadsheets','Weekly figures pulled together and summarised in plain English.']],
  tested:['We run the workflow on a month of your real documents before launch.','Anything the system is unsure about goes to a person for a check.','Every change is logged with the source document.'],
  answer:'AI automation uses language models to read documents and messages and enter the data into your systems, with a person approving the result.',
  faqs:[['Which tools do you connect to?','HubSpot, Pipedrive, Xero, QuickBooks, Google Workspace, Microsoft 365 and most tools with an API.'],['Do we need to change our software?','No. We work with what you already use.']]},
 {slug:'ai-consultancy',name:'AI consultancy',icon:'compass',desc:'Find where AI pays back, then implement calmly',scene:'score',
  title:'AI consultancy for small businesses: from audit to a working pilot',question:'What does AI consultancy include and what does it cost?',
  h1:'AI consultancy that ends in a working pilot.',sub:'We map your workflows, estimate hours and money saved, and pick the one or two that pay back fastest. Then we build them.',
  stats:[['30 min','free first call'],['1 week','audit and shortlist'],['3','workflows ranked by payback']],
  scenarios:[['list-checks','Process audit','Interviews with your team and a ranked list of automation candidates.'],['calculator','Payback estimate','Hours saved, cost and risk for each candidate, in one table.'],['shield-check','AI usage policy','Clear rules on what staff may and may not do with AI tools.']],
  tested:['Estimates use your real volumes.','We tell you when AI is not the right answer.','You keep the audit report whether or not you work with us.'],
  answer:'AI consultancy helps a business find which processes are worth automating and in what order. Praxen starts with a free 30-minute call and a one-week audit that ends in a ranked shortlist.',
  faqs:[['How is this different from a big consultancy?','We are small, we build what we recommend, and the audit takes about a week.']]},
 {slug:'ai-chatbot',name:'AI chatbot',icon:'messages-square',desc:'Website chat and WhatsApp replies from your knowledge base',scene:'chat',
  title:'AI chatbot for your website and WhatsApp',question:'What does an AI chatbot do and what does it cost?',
  h1:'An AI chatbot that answers from your own information.',sub:'On your website and WhatsApp, it replies in seconds using your price list, policies and FAQs, cites the source and hands over to a person when it should.',
  stats:[['< 10 sec','typical reply time'],['24/7','website and WhatsApp'],['1 click','handover to your team']],
  scenarios:[['globe','Website chat','Answers visitors and captures leads with name, email and need.'],['message-circle','WhatsApp Business','Replies, sends links and books appointments in WhatsApp.'],['book-open','Internal help desk','Staff ask questions about policies and get answers with sources.']],
  tested:['Answers come only from documents you approve.','It says “I don’t know” and hands over rather than guessing.','Weekly review of conversations in the first month.'],
  answer:'An AI chatbot answers customer questions on your website or WhatsApp using your own knowledge base, with handover to a person built in.',
  faqs:[['Can it book appointments?','Yes, it connects to your calendar or booking system.']]},
 {slug:'ai-agents',name:'AI agents',icon:'bot',desc:'Multi-step routine handled with checks and logs',scene:'agent',
  title:'AI agents for business: built with approvals and logs',question:'What do AI agents do and what do they cost?',
  h1:'AI agents that do the steps and ask before they act.',sub:'An agent reads, checks, drafts and waits for approval. Every action is logged, access is limited to what it needs, and a person signs off where it matters.',
  stats:[['4–8 wks','typical build'],['100%','actions logged'],['0','actions without your rules']],
  scenarios:[['inbox','Order processing','Reads order emails, checks stock and drafts confirmations.'],['users','Candidate screening','Scores CVs against the brief and schedules first calls.'],['receipt','Month-end chasing','Finds unpaid invoices and drafts polite reminders.']],
  tested:['Agents run in a sandbox on past cases before touching live systems.','Role-based access: read-only unless approved.','Human approval points on anything external.'],
  answer:'AI agents are programs that complete multi-step tasks across your tools, such as reading an email, checking data and drafting a reply. Praxen builds them with approval points and full logs.',
  faqs:[['Is it safe to let an agent send emails?','By default agents draft and a person sends. We remove the approval step only where you decide.']]},
 {slug:'ai-training',name:'AI training',icon:'graduation-cap',desc:'Teach your team to use AI safely and usefully',scene:'playbook',
  title:'AI training for teams: hands-on half-day workshops',question:'What does AI training for teams include and what does it cost?',
  h1:'AI training your team will still use next month.',sub:'A half-day session on your own tasks. Everyone leaves with a playbook of prompts, templates and rules, and we follow up two weeks later.',
  stats:[['½ day','online or on-site'],['12','people per session'],['2 weeks','follow-up Q&A']],
  scenarios:[['pen-line','Writing and replies','Emails, proposals and complaint replies in your tone.'],['file-search','Research and summaries','Reading long documents and checking facts against sources.'],['shield','Safe use','What data never goes into AI tools, and why.']],
  tested:['Exercises use your real (anonymised) documents.','A written usage policy is part of the deliverable.','We measure hours saved at the follow-up.'],
  answer:'AI training for teams teaches staff to use tools like ChatGPT, Claude and Copilot on their real work, safely. Praxen runs half-day sessions for up to 12 people.',
  faqs:[['Which tools do you cover?','ChatGPT, Claude, Microsoft Copilot or Gemini, whichever your company allows.']]},
];

export const industries:Entity[]=[
 {slug:'accounting',name:'Accounting firms',icon:'calculator',desc:'Invoices, client chasing and deadline reminders',scene:'doc',
  sceneData:{...xero,file:'client-invoices-Oct.pdf',from:'bookkeeping@client.co.uk',fields:[['Client','Hartley & Sons Ltd'],['Invoices','23 documents'],['VAT period','Jul–Sep 2026'],['Missing','2 receipts'],['MTD deadline','7 Nov 2026']],sheet:'Xero · Client files',row:['Hartley & Sons','23 / 25','7 Nov'],approve:'Reviewed by accountant'},
  h1:'AI for accounting firms: less data entry, fewer chasers.',sub:'Client documents are read and coded, missing receipts are chased automatically, and deadline reminders go out on time. Your accountants review instead of retyping.',
  stats:[['10–20 h','saved per accountant a month (estimate)'],['MTD','deadline reminders on autopilot'],['UK GDPR','processing under a DPA']],
  scenarios:[['file-text','Bookkeeping data entry','Invoices and receipts read and coded into Xero or QuickBooks for review.'],['bell-ring','Chasing missing documents','Polite, personalised reminders until the client sends what’s missing.'],['calendar-clock','Deadline reminders','VAT, payroll and self-assessment dates tracked per client.'],['phone-call','Front-desk calls','An AI receptionist answers routine client questions and books calls.']],
  tested:['Nothing is posted to the ledger without a person approving it.','Client data stays in your own accounts and is never used to train models.','Pilot runs on last quarter’s documents first.'],
  answer:'Accounting firms use AI to read and code client documents, chase missing paperwork and track deadlines, connected to Xero or QuickBooks.'},
 {slug:'recruitment',name:'Recruitment agencies',icon:'users',desc:'Screen candidates and book first calls faster',scene:'agent',
  sceneData:{title:'Agent run · Senior bookkeeper role',steps:[['inbox','Read','48 new applications'],['search-check','Check','12 match must-haves, 3 need visa check'],['file-edit','Draft','Shortlist with reasons per candidate'],['user-check','Wait for approval','Sent to consultant for review']],log:['10:02 parsed 48 CVs','10:04 scored against brief','10:05 drafted shortlist','10:05 waiting: consultant approval']},
  h1:'AI for recruitment agencies: shortlist in minutes.',sub:'CVs are screened against the brief, candidates get a reply the same day and first calls are booked automatically. Consultants spend their time on people.',
  stats:[['Same day','reply to every applicant'],['48 → 12','CVs to a reasoned shortlist'],['0','decisions made without a consultant']],
  scenarios:[['user-search','CV screening','Each CV scored against must-haves with a short reason.'],['calendar-plus','Interview scheduling','Candidates pick a slot; reminders go out automatically.'],['phone-call','Candidate calls','An AI receptionist answers “any update on my application?”']],
  tested:['Scoring criteria are written and approved by you.','Bias checks on the shortlist before go-live.','Final decisions always made by a consultant.'],
  answer:'Recruitment agencies use AI to screen CVs against a brief, reply to applicants and book interviews, with consultant approval at every decision.'},
 {slug:'law-firms',name:'Law firms',icon:'scale',desc:'Intake calls, document review and client updates',scene:'call',
  sceneData:{caller:'New enquiry',number:'+44 20 7946 0123',lines:[['c','Hello, I need advice on a lease dispute.'],['a','I can book a first consultation. Is this commercial or residential?'],['c','Commercial. We’re a café in Leeds.'],['a','Booked with Ms Patel, Tuesday 11:00.']],slot:'Tue 11:00 · Commercial property',slotWho:'New client · café, Leeds',summary:'Lease dispute, commercial. Conflict check needed.',to:'intake@yourfirm.co.uk'},
  h1:'AI for law firms: every enquiry captured and triaged.',sub:'New-client calls are answered and triaged by practice area, intake forms are filled in, and routine client updates are drafted for a fee earner to send.',
  stats:[['24/7','new-client intake'],['Triage','by practice area'],['No advice','legal advice stays with your lawyers']],
  scenarios:[['phone-call','Intake calls','Captures the matter type and books a first consultation.'],['file-search','Document review','Summaries of long documents with page references.'],['mail','Client updates','Drafts status emails for fee earners to check and send.']],
  tested:['The assistant never gives legal advice.','Conflict checks flagged before any booking is confirmed.','Data processed under a DPA with UK/EU hosting.'],
  answer:'Law firms use AI receptionists to capture and triage new enquiries, and AI tools to summarise documents and draft client updates, with no legal advice given by the AI.'},
 {slug:'hospitality',name:'Hotels & restaurants',icon:'bed-double',desc:'Bookings and guest questions in every channel',scene:'chat',
  sceneData:{channel:'WhatsApp',who:'The Harbour Inn',q:'Hi, is there parking, and can we check in early on Friday?',a:'Yes, free parking behind the inn. Early check-in from 12:00 is £20. Shall I add it?',src:'Guest info · house rules',hand:'Hand over to front desk'},
  h1:'AI for hotels and restaurants: every guest gets an answer.',sub:'Booking questions, table requests and “is there parking?” answered in seconds on WhatsApp, web chat and phone. Staff focus on the guests in front of them.',
  stats:[['< 10 sec','reply to guest messages'],['24/7','phone, web chat and WhatsApp'],['0','upgrades or discounts without your rules']],
  scenarios:[['message-circle','Guest questions','Parking, check-in, menus and allergies, from your own information.'],['calendar-check','Table and room requests','Checks availability and books or hands over.'],['star','Review replies','Drafts replies to Google and Booking.com reviews.']],
  tested:['No discounts or upgrades offered without your rules.','Allergy questions always confirmed by staff.','Busy-night handover tested before launch.'],
  answer:'Hotels and restaurants use AI to answer guest questions and booking requests on WhatsApp, web chat and phone, with staff handover for anything outside the rules.'},
 {slug:'estate-agents',name:'Estate agents',icon:'home',desc:'Viewing requests and applicant qualifying',scene:'call',
  sceneData:{caller:'Viewing request',number:'+44 7700 900 881',lines:[['c','I saw the two-bed flat on Mill Road. Can I view it?'],['a','Yes. Are you buying or renting, and do you have a mortgage in principle?'],['c','Buying, and yes, I do.'],['a','Viewing booked for Saturday 10:30.']],slot:'Sat 10:30 · 14 Mill Road',slotWho:'Buyer · MIP confirmed',summary:'Qualified buyer, first-time. Wants parking.',to:'sales@youragency.co.uk'},
  h1:'AI for estate agents: viewings booked while you’re out.',sub:'Portal enquiries and calls are answered, applicants qualified and viewings booked into the diary, evenings and weekends included.',
  stats:[['24/7','viewing requests handled'],['Qualified','buyers and tenants before the call'],['CRM','notes logged automatically']],
  scenarios:[['phone-call','Viewing calls','Qualifies the applicant and books a slot.'],['mail','Portal enquiries','Rightmove and Zoopla leads answered in minutes.'],['wrench','Maintenance reports','Tenants report issues; jobs logged with photos.']],
  tested:['No offers or prices negotiated by the AI.','Diary rules (travel time, hours) respected.','Tested on a month of past enquiries.'],
  answer:'Estate agents use AI to answer viewing requests, qualify applicants and book viewings around the clock.'},
 {slug:'clinics',name:'Clinics & dentists',icon:'stethoscope',desc:'Appointment calls, reminders and FAQs',scene:'call',
  sceneData:{caller:'Patient call',number:'+44 7700 900 230',lines:[['c','Hi, I need a check-up and a hygienist appointment.'],['a','I have Wednesday at 9:00 for both, back to back. Does that work?'],['c','Perfect, thanks.'],['a','Booked. We’ll text you a reminder the day before.']],slot:'Wed 09:00 · Check-up + hygienist',slotWho:'Existing patient',summary:'Two appointments booked back to back. SMS reminder set.',to:'reception@yourclinic.co.uk'},
  h1:'AI for clinics and dentists: fewer missed calls, fewer no-shows.',sub:'Patients book, move and cancel appointments by phone or chat at any hour. Reminders go out automatically and reception gets the calls that need a person.',
  stats:[['24/7','appointment line'],['Reminders','by SMS and WhatsApp'],['0','clinical advice from AI']],
  scenarios:[['phone-call','Appointment calls','Book, move and cancel into your practice system.'],['bell-ring','Reminders','SMS and WhatsApp reminders with easy rescheduling.'],['help-circle','Patient FAQs','Prices, opening hours, parking and what to bring.']],
  tested:['Never gives clinical advice; urgent symptoms go to staff or 111.','Patient data handled under UK GDPR with a DPA.','Tested with reception staff before launch.'],
  answer:'Clinics and dental practices use AI receptionists to handle appointment calls and reminders 24/7, with no clinical advice given by the AI.'},
 {slug:'trades',name:'Trades & field services',icon:'wrench',desc:'Answer calls on the job and book visits',scene:'call',
  sceneData:{caller:'Job enquiry',number:'+44 7700 900 655',lines:[['c','My boiler’s stopped working. Can someone come out?'],['a','Sorry to hear that. Is there any smell of gas?'],['c','No, just no hot water.'],['a','Engineer booked for tomorrow 8–10am.']],slot:'Tomorrow 08:00–10:00 · Boiler',slotWho:'Home owner · Didsbury',summary:'No hot water, no gas smell. Combi boiler, 9 yrs.',to:'jobs@yourcompany.co.uk'},
  h1:'AI for trades: answer every call while you’re on the job.',sub:'Calls are answered while your hands are full, jobs are qualified and booked into the diary, and emergencies come straight through to you.',
  stats:[['Every','call answered on the job'],['Qualified','jobs with photos and address'],['Urgent','calls put straight through']],
  scenarios:[['phone-call','Job calls','Captures the problem, address and best time.'],['calendar-check','Diary booking','Books visits with travel time between jobs.'],['file-text','Quotes','Drafts a quote from your price list for you to check.']],
  tested:['Safety questions (gas, water, electrics) escalate immediately.','Your diary rules are respected.','Tested on your real call types.'],
  answer:'Tradespeople use AI receptionists to answer calls while on the job, qualify the work and book visits.'},
];

export const departments:Entity[]=[
 {slug:'customer-support',name:'Customer support',icon:'headphones',desc:'Answer routine questions, escalate the rest',scene:'helpdesk',
  h1:'AI for customer support: routine answered, people for the rest.',sub:'Order status, returns and “how do I…” questions are answered on chat, email and phone from your help centre. Your agents handle the conversations that need judgement.',
  stats:[['< 10 sec','first reply'],['24/7','chat, email and phone'],['1 click','handover with full context']],
  scenarios:[['messages-square','Chat and WhatsApp','Answers from your help centre with links to sources.'],['mail','Email triage','Tags, routes and drafts replies for agents.'],['phone-call','Phone support','An AI receptionist answers and resolves simple calls.'],['package-search','Order status','Looks up orders in Shopify or your system.'],['refresh-ccw','Returns','Explains the policy and starts the return.'],['bar-chart-3','Weekly insights','Top reasons for contact, summarised.']],
  tested:['Answers only from approved help-centre content.','Angry or sensitive messages go to a person straight away.','Weekly review of a sample of conversations.'],
  answer:'Customer support teams use AI to answer routine questions on chat, email and phone, and hand over complex ones to agents with full context.'},
 {slug:'sales',name:'Sales',icon:'trending-up',desc:'Reply to leads fast and keep HubSpot complete',scene:'crm',
  h1:'AI for sales teams: every lead answered, every deal logged.',sub:'Leads get a reply in minutes, calls are qualified, and HubSpot or Pipedrive is filled in automatically. Salespeople sell instead of typing notes.',
  stats:[['Minutes','to first reply on every lead'],['HubSpot','and Pipedrive kept complete'],['Draft','quotes ready for review']],
  scenarios:[['user-plus','Lead qualification','Asks your questions and scores the lead.'],['database','CRM updates','Calls and emails summarised into HubSpot.'],['file-text','Quotes and proposals','Drafted from your price list and templates.'],['repeat','Follow-ups','Reminders and drafted follow-up emails.']],
  tested:['No discounts or prices beyond your rules.','Salesperson approves every quote.','CRM field mapping checked on 100 past deals.'],
  answer:'Sales teams use AI to reply to leads quickly, qualify them and keep the CRM complete. Praxen connects to HubSpot and Pipedrive.'},
 {slug:'marketing',name:'Marketing',icon:'megaphone',desc:'Content drafts, review replies and reports',scene:'planner',
  h1:'AI for marketing: drafts and reports, your voice.',sub:'Content drafts, review replies and campaign reports prepared in your brand voice for your team to edit.',
  stats:[['Drafts','in your tone of voice'],['Weekly','reports summarised'],['Reviews','answered the same day']],
  scenarios:[['pen-line','Content drafts','Posts and newsletters from your briefs.'],['star','Review replies','Google and Trustpilot replies drafted.'],['bar-chart-3','Reports','Campaign numbers explained in plain English.']]},
 {slug:'operations',name:'Operations',icon:'settings-2',desc:'Orders, scheduling and internal requests',scene:'agent',
  h1:'AI for operations: routine steps run themselves.',sub:'Orders, scheduling and internal requests processed by agents with checks and logs.',
  stats:[['Logged','every action'],['Approval','where it matters'],['Fewer','manual handoffs']],
  scenarios:[['inbox','Order intake','Emails and PDFs into your system.'],['calendar-range','Scheduling','Rotas and visits planned with your rules.'],['ticket','Internal requests','IT and facilities requests triaged.']]},
 {slug:'hr',name:'HR',icon:'users',desc:'Screening, onboarding and policy questions',scene:'slack',
  h1:'AI for HR: less admin, more time for people.',sub:'CV screening, onboarding checklists and policy questions handled with clear rules.',
  stats:[['Same day','reply to applicants'],['Policy','answers with sources'],['Human','final decisions']],
  scenarios:[['user-search','Screening','CVs scored against the role.'],['clipboard-check','Onboarding','Checklists and welcome packs.'],['book-open','Policy questions','Staff handbook answers with references.']]},
 {slug:'finance',name:'Finance',icon:'landmark',desc:'Invoices, reconciliation and chasing',scene:'doc',sceneData:{...xero},
  h1:'AI for finance: invoices in, chasers out.',sub:'Supplier invoices read and coded, payments reconciled and overdue clients chased, all with approval.',
  stats:[['Coded','invoices for review'],['Chasers','sent on schedule'],['Approved','by finance every time']],
  scenarios:[['file-text','Invoice processing','Into Xero or QuickBooks for approval.'],['git-compare','Reconciliation','Bank lines matched with suggestions.'],['bell-ring','Credit control','Polite reminders for overdue invoices.']]},
 {slug:'procurement',name:'Procurement',icon:'truck',desc:'Supplier quotes compared and summarised',scene:'compare',
  h1:'AI for procurement: quotes compared in minutes.',sub:'Supplier quotes and price lists read, compared and summarised for a buyer to decide.',
  stats:[['Side-by-side','quote comparison'],['Price list','changes flagged'],['Buyer','decides']],
  scenarios:[['scale','Quote comparison','Like-for-like tables from different formats.'],['file-search','Price list checks','Changes highlighted against last order.'],['mail','Supplier emails','Order confirmations drafted.']]},
 {slug:'leadership',name:'Leadership',icon:'briefcase',desc:'Weekly briefings and an AI plan',scene:'score',
  h1:'AI for leadership: a clear plan, then results.',sub:'A ranked list of where AI pays back, a usage policy and a weekly briefing from your own numbers.',
  stats:[['Ranked','AI opportunities'],['Policy','for safe use'],['Weekly','briefing from your data']],
  scenarios:[['compass','AI roadmap','Where to start and what it’s worth.'],['shield-check','Usage policy','Rules your team can follow.'],['line-chart','Briefings','Key numbers summarised every Monday.']]},
];

// AI training lives at /training (the .ge structure), not under /services.
export const servicePath=(slug:string)=>slug==='ai-training'?'training':'services/'+slug;

// ---- Integrations ----
// Colour logos from public/logos; names do not imply partnerships.
export const logos:[string,string][]=[['HubSpot','hubspot.svg'],['Salesforce','salesforce.svg'],['Pipedrive',''],['Microsoft 365','microsoft365.svg'],['Google Workspace','google.svg'],['Slack','slack.svg'],['Microsoft Teams','microsoftteams.svg'],['Zendesk','zendesk.svg'],['Intercom','intercom.svg'],['Xero','xero.svg'],['QuickBooks','quickbooks.svg'],['Sage','sage.svg'],['Clio','clio.png'],['Bullhorn','bullhorn.png'],['SAP','sap.svg'],['Microsoft Dynamics','dynamics365.svg'],['WhatsApp','whatsapp.svg'],['Calendly','calendly.svg']];
export const logoSets:Record<string,string[]>={accounting:['Xero','QuickBooks','Sage','Microsoft 365','Google Workspace'],recruitment:['Bullhorn','Microsoft Teams','Calendly','Microsoft 365'],'law-firms':['Clio','Microsoft 365','Calendly','Microsoft Teams'],sales:['HubSpot','Salesforce','Pipedrive','Microsoft 365','Calendly'],'customer-support':['Zendesk','Intercom','WhatsApp','Slack','HubSpot'],hr:['Slack','Microsoft Teams','Google Workspace'],finance:['Xero','QuickBooks','Sage','SAP'],procurement:['SAP','Microsoft Dynamics','Microsoft 365'],'ai-receptionist':['Calendly','Microsoft 365','Google Workspace','HubSpot','Pipedrive'],'ai-chatbot':['WhatsApp','Intercom','Zendesk','HubSpot']};
export const defaultLogoSet=['HubSpot','Microsoft 365','Google Workspace','WhatsApp','Slack'];

// ---- Copy shared by several pages ----
// Page-specific primary CTA (one accent colour, wording per page). The header always says "Book a free call".
export const ctas:Record<string,string>={home:'Get a free AI audit','ai-receptionist':'Audit my phone line','ai-automation':'Audit my manual work','ai-consultancy':'Get a free AI audit','ai-chatbot':'Audit my enquiries','ai-agents':'Request an estimate','ai-training':'Get a training plan',accounting:'Audit my client admin',recruitment:'Audit my screening','law-firms':'Audit my intake',hospitality:'Audit my guest messages','estate-agents':'Audit my viewings',clinics:'Audit my front desk',trades:'Audit my call handling',sales:'Audit my sales process','customer-support':'Audit my helpdesk',marketing:'Audit our marketing',operations:'Audit our operations',hr:'Audit our onboarding',finance:'Audit our invoices',procurement:'Automate quote comparison',leadership:'Get an AI roadmap',partners:'Become a partner'};
export const ctaFor=(key:string)=>ctas[key]||'Get a free AI audit';

// Page-specific options for the short form.
export const pains:Record<string,string[]>={
 default:['We miss calls and enquiries','Staff retype data between systems','Quotes and documents take hours','The team uses AI without rules'],
 'ai-receptionist':['We miss calls when we’re busy','No one answers after hours','Reception spends the day on routine calls','Bookings are taken on paper'],
 'ai-automation':['We retype invoices and PDFs','Enquiries are copied into the CRM by hand','Weekly reports take a day','Data lives in too many spreadsheets'],
 'ai-chatbot':['Website visitors leave without an answer','WhatsApp replies take hours','The same questions every day'],
 'ai-agents':['Multi-step admin eats our week','Orders arrive in emails and PDFs','We need logs and approvals'],
 'ai-training':['People use ChatGPT without rules','Only one person knows how to use AI','We need a usage policy'],
 accounting:['Clients send documents late','We code invoices by hand','Deadline reminders are manual','Phones ring all through filing season'],
 recruitment:['Too many CVs to read','Candidates wait days for a reply','Scheduling interviews takes hours'],
 'law-firms':['New enquiries go to voicemail','Intake forms are retyped','Clients chase us for updates'],
 sales:['We lose leads after hours','Reps skip CRM updates','Quotes take too long','Follow-ups get forgotten'],
 'customer-support':['The same questions all day','Urgent tickets get buried','Replies take hours at weekends'],
 hr:['Staff ask the same policy questions','Onboarding is a manual checklist','Too many CVs to screen'],
 procurement:['Supplier quotes arrive in every format','Comparing prices takes hours','Price changes slip through'],
 marketing:['Content takes too long to draft','Reviews go unanswered','Reports are manual'],
 partners:['IT support or managed services','Accounting or bookkeeping firm','Marketing or web agency','Business consultant'],
};

// Industry tabs inside service and department pages: one micro-scenario each.
export const micro:Record<string,Record<string,string>>={
 accounting:{default:'chases missing client documents before the filing deadline','ai-receptionist':'answers “has my return been filed?” and books calls with the right accountant','ai-automation':'reads client invoices and codes them into Xero for review'},
 recruitment:{default:'screens 50 CVs against the brief and books first calls','ai-receptionist':'answers candidate calls about application status'},
 'law-firms':{default:'triages new enquiries by practice area and books a first consultation','ai-automation':'turns intake calls into a completed matter form in Clio'},
 hospitality:{default:'answers parking, check-in and allergy questions in seconds','ai-receptionist':'takes table bookings by phone on busy evenings'},
 'estate-agents':{default:'qualifies viewing requests and books them into the diary'},
 clinics:{default:'books, moves and cancels appointments and sends reminders'},
 trades:{default:'answers calls while you’re on a job and books the visit'},
};

// No verified UK cases yet: example scenarios instead of quotes (as casesVerified=false on .ge).
export const examples:{over:string;title:string;body:string;nums:Pair[];href:string;situation:string;solution:string;measure:string}[]=[
 {over:'Dental practice · 3 chairs',title:'Every call answered, fewer no-shows',body:'An AI receptionist answers after hours and at lunch, books into the practice system and sends reminders.',nums:[['0','missed calls after hours'],['~12 h','reception time saved a week']],href:'industries/clinics',situation:'Reception answers the phone between patients. Calls at lunch, after 6 pm and at weekends go to voicemail, and some callers book elsewhere.',solution:'An AI receptionist takes every call, books, moves and cancels appointments in the practice system and sends SMS reminders. Anything clinical goes to staff.',measure:'Missed calls, bookings made outside opening hours, no-show rate and reception hours spent on the phone.'},
 {over:'Accounting firm · 8 staff',title:'Client documents coded before review',body:'Invoices and receipts are read and coded into Xero. Missing documents are chased automatically before the deadline.',nums:[['~15 h','per accountant a month'],['2','reminders before every deadline']],href:'industries/accounting',situation:'Clients send invoices and receipts late and in every format. Staff code them by hand and chase missing documents by email before each VAT deadline.',solution:'Documents are read and coded into Xero for review, missing items are chased automatically, and deadline reminders go out per client.',measure:'Hours of data entry per accountant, documents chased by hand and returns filed in the last week before the deadline.'},
 {over:'Recruitment agency · 5 consultants',title:'Shortlists in minutes, decisions by people',body:'CVs scored against the brief with reasons. Candidates get a same-day reply and pick an interview slot.',nums:[['48 → 12','CVs to a reasoned shortlist'],['Same day','reply to every applicant']],href:'industries/recruitment',situation:'Each role brings dozens of CVs. Consultants read them all, candidates wait days for a reply and interview scheduling takes hours of emails.',solution:'CVs are scored against the brief with a short reason, every applicant gets a same-day reply and shortlisted candidates pick an interview slot.',measure:'Time to shortlist, time to first reply and consultant hours per role. Every decision stays with a consultant.'},
];

export const homeFaq=(cur:Cur):Pair[]=>[
 ['How much does an AI receptionist cost?','Setup is '+fmt(price('rcSetup',cur),cur)+' and the monthly fee is '+fmt(price('rcMonth',cur),cur)+'. Both are 30% off during our launch offer. Call minutes are billed at cost on your own account, typically '+curInfo[cur].usage+' a minute.'],
 ['Where is your team based?','In Georgia (UTC+4), three to four hours ahead of the UK. We schedule calls in UK working hours and reply on email and WhatsApp the same day.'],
 ['Is our data safe?','We process data under UK GDPR with a data processing agreement. Your data stays on your accounts and is never used to train public models.'],
 ['What if the AI makes a mistake?','Every workflow has rules, review points and a handover to a person. In the pilot we test on your real cases before anything goes live.'],
 ['Do we need to change our software?','No. We connect to what you use: HubSpot, Pipedrive, Xero, QuickBooks, Google Workspace, Microsoft 365, WhatsApp and more.'],
 ['How do you charge VAT?','All prices exclude VAT. We work with businesses only; UK and EU business customers account for VAT under the reverse charge.'],
];
export const brandDef=(cur:Cur)=>'Praxen AI is an AI implementation company for small businesses in the UK, US and EU. We set up AI receptionists that answer calls 24/7, chatbots for websites and WhatsApp, and automations for CRM, documents and invoices, and we train teams to use AI safely. Every project starts with a free 30-minute audit; a pilot on one workflow takes 2–4 weeks from '+fmt(promo(price('pilot',cur)),cur)+' with the launch offer, and team training starts at '+fmt(promo(price('training',cur)),cur)+'. All prices exclude VAT.';

// ---- Routes ----
export type ListPage='services'|'industries'|'departments'|'cases';
export type IntlPage='home'|'ai-for-small-business'|ListPage|'solutions'|'training'|'about'|'security'|'partners'|'privacy'|'terms';
export type IntlRoute={page:IntlPage;slug?:string};
export const groups:Record<'services'|'industries'|'departments',Entity[]>={services,industries,departments};
const simplePages:IntlPage[]=['ai-for-small-business','services','industries','departments','solutions','training','cases','about','security','partners','privacy','terms'];
// Top-level sections served without the /en prefix (see next.config.ts).
export const intlSections=simplePages;

export function resolveIntl(seg:string[]=[]):IntlRoute|null{
 if(!seg.length)return {page:'home'};
 const [p,slug,...rest]=seg;
 if(rest.length||!(simplePages as string[]).includes(p))return null;
 if(!slug)return {page:p as IntlPage};
 if(p==='services'||p==='industries'||p==='departments'){
  if(p==='services'&&slug==='ai-training')return null;
  return groups[p].some(e=>e.slug===slug)?{page:p,slug}:null;
 }
 return null;
}
export const routePath=(r:IntlRoute)=>r.page==='home'?'':'/'+r.page+(r.slug?'/'+r.slug:'');
export const entityOf=(r:IntlRoute):Entity|undefined=>r.page==='training'?services.find(s=>s.slug==='ai-training'):r.slug&&(r.page==='services'||r.page==='industries'||r.page==='departments')?groups[r.page].find(e=>e.slug===r.slug):undefined;
export const intlPaths:string[]=['',...simplePages.map(p=>'/'+p),...services.filter(s=>s.slug!=='ai-training').map(s=>'/services/'+s.slug),...industries.map(s=>'/industries/'+s.slug),...departments.map(s=>'/departments/'+s.slug)];

// ---- Inner page heroes ----
export type Fact=[string,string,string];
export const innerPages:Partial<Record<IntlPage,{eyebrow:string;h1:string;sub:string;badge?:boolean;showCur?:boolean;facts?:Fact[]}>>={
 services:{eyebrow:'Services',h1:'Six jobs AI can take off your team.',sub:'Pick the job you need done. Each one starts with a free audit and a fixed-price pilot on one workflow.',facts:[['search-check','Free audit first','A 30-minute call, then a named first workflow'],['receipt','Fixed price','Agreed before any work starts'],['shield-check','Control built in','Review points, logs and human handover']]},
 industries:{eyebrow:'Industries',h1:'AI for the businesses we know best.',sub:'Each page shows the routine work AI handles in that kind of business, and what we check before launch.',facts:[['layers','Same building blocks','Receptionist, chatbot, automation and agents'],['users','Your workflows','Set up on your real cases, not a template'],['clock','2–4 weeks','From audit to a working pilot']]},
 departments:{eyebrow:'Departments',h1:'Start with the team that’s most overloaded.',sub:'Support and sales usually feel it first. One knowledge base means every next department connects faster.',facts:[['headphones','Customer support','Routine answered, urgent escalated'],['trending-up','Sales','Every lead answered and logged in HubSpot'],['database','One system','Shared knowledge base and access rules']]},
 solutions:{eyebrow:'Solutions & pricing',h1:'What AI implementation costs.',sub:'Prices fixed before we start. Tools and AI usage run on your own accounts, billed at cost.',badge:true,showCur:true,facts:[['search-check','The audit is free','30 minutes, no obligation'],['receipt','Fixed launch price','Agreed in the pilot plan'],['calendar-x','Care is optional','Monthly, cancel anytime']]},
 cases:{eyebrow:'Cases',h1:'Example scenarios, honest numbers.',sub:'We publish client results only with permission. Until our first UK case studies are signed off, these are example scenarios with the metrics we track.',facts:[['flag','Example','Every scenario below is marked as an example'],['bar-chart-3','Estimates','Real numbers are measured in your pilot'],['shield-check','With permission','Client names only when they agree']]},
 about:{eyebrow:'About',h1:'A small team that builds what it recommends.',sub:'Praxen AI implements practical AI for small businesses. We started in Georgia and now work with companies in the UK, US and EU.',facts:[['map-pin','Based in Georgia','UTC+4, 3–4 hours ahead of the UK'],['clock','UK working hours','Calls scheduled in your day'],['user-round','One accountable lead','From audit to launch']]},
 security:{eyebrow:'Security',h1:'Your data, your rules.',sub:'We use enterprise APIs. Your data never trains public models. Here is how we handle data, access and UK GDPR.',facts:[['lock','Enterprise APIs','No training on your data'],['file-signature','DPA as standard','We act as your processor'],['scroll-text','Full logs','Every AI action is recorded']]},
 partners:{eyebrow:'Partner programme',h1:'Earn from AI with us.',sub:'For IT providers, accountants, agencies and consultants who already have small-business clients: you introduce a company, we implement AI, you earn a reward.',facts:[['wallet','A reward on every project','A share of each paid project and care plan'],['handshake','Joint sales','We meet clients together or deliver under your brand'],['book-open','Demos and materials','Case scenarios and decks for your sales']]},
 privacy:{eyebrow:'Legal',h1:'Privacy policy',sub:'How Praxen AI collects and uses personal data under UK GDPR. Last updated: '+intlUpdatedLabel+'.'},
 terms:{eyebrow:'Legal',h1:'Terms of service',sub:'The basics of how we work with business customers. Last updated: '+intlUpdatedLabel+'.'},
};
export const sectionName:Record<string,string>={services:'Services',industries:'Industries',departments:'Departments',training:'Training',solutions:'Solutions & pricing',cases:'Cases',about:'About',security:'Security',partners:'Partners',privacy:'Privacy policy',terms:'Terms of service','ai-for-small-business':'AI for small businesses'};

// ---- Search titles and descriptions ----
const meta:Partial<Record<IntlPage,[string,string]>>={
 home:['AI receptionist & AI automation for small businesses | Praxen AI','AI receptionists that answer every call 24/7, chatbots and automation for CRM, documents and invoices, plus team training. Free AI audit, fixed-price pilot. Launch offer: 30% off.'],
 'ai-for-small-business':['AI for small businesses: start with one workflow | Praxen AI','No big IT project: we find the job that eats the most hours (calls, enquiries or paperwork) and automate it in 2–4 weeks at a fixed price. Free 30-minute audit.'],
 services:['AI services for small businesses: receptionist, chatbots, automation | Praxen AI','AI receptionist, AI automation, AI chatbots, AI agents, AI consultancy and team training. Every project starts with a free audit and a fixed-price pilot.'],
 industries:['AI for accounting, law, recruitment, clinics and more | Praxen AI','How AI handles routine work in accounting firms, recruitment agencies, law firms, hotels, estate agents, clinics and trades — and what we check before launch.'],
 departments:['AI for sales, customer support, finance and HR | Praxen AI','Start with the team that is most overloaded: customer support, sales, marketing, operations, HR, finance, procurement or leadership. One knowledge base for all.'],
 solutions:['AI implementation pricing: receptionist, pilot, training | Praxen AI','Clear prices in £, $ or €: AI receptionist from £950 + £249/month, implementation pilot from £2,900, team training from £850. Launch offer: 30% off. Prices exclude VAT.'],
 cases:['AI implementation examples for small businesses | Praxen AI','Example scenarios for dental practices, accounting firms and recruitment agencies, with the metrics we track. Real results are measured in your pilot.'],
 about:['About Praxen AI: a small team that builds what it recommends','Praxen AI implements practical AI for small businesses in the UK, US and EU. One accountable lead from audit to launch, calls in UK working hours.'],
 security:['Security and UK GDPR: how Praxen AI handles your data','Enterprise APIs that never train on your data, a DPA as standard, role-based access, full logs and retention you control. Subprocessors listed.'],
 partners:['Partner with Praxen AI: referral and delivery partners','For accountants, IT providers and agencies: refer clients for AI implementation or deliver larger projects with us.'],
 privacy:['Privacy policy | Praxen AI','How Praxen AI collects and uses personal data under UK GDPR: enquiries, call bookings, analytics with consent and your rights.'],
 terms:['Terms of service | Praxen AI','How Praxen AI works with business customers: prices excluding VAT, reverse charge for UK and EU businesses, usage costs and data processing.'],
};
export function intlMeta(r:IntlRoute):{title:string;description:string}{
 const e=entityOf(r);
 if(e){
  const own=e.title||e.h1.replace(/\.$/,'');
  const recDesc=e.slug==='ai-receptionist'?' From '+fmt(promo(price('rcSetup')))+' setup + '+fmt(promo(price('rcMonth')))+'/month with the launch offer.':'';
  return {title:own+' | Praxen AI',description:e.sub+recDesc};
 }
 const m=meta[r.page]||meta.home!;
 return {title:m[0],description:m[1]};
}

// FAQ shown on a page (also used for FAQPage JSON-LD, so the markup always matches the page).
export const faqFor=(route:IntlRoute,entity:Entity|undefined,cur:Cur):{items:[string,string][];title:string}=>{
 const gen=homeFaq(cur);
 if(entity)return {items:[...(entity.faqs||[]),gen[0],gen[2],gen[3]].slice(0,6),title:'Questions about '+entity.name.toLowerCase()+'.'};
 if(route.page==='security')return {items:[gen[2],['Where is data stored?','With UK or EU hosting wherever the provider allows. Data location is listed in your DPA.'],['Do you sign a DPA?','Yes, as standard, before we touch any personal data.'],['Who at Praxen can see our data?','Only the engineer working on your project, with access removed at handover.']],title:'Security questions.'};
 if(route.page==='partners')return {items:[['How much will I earn?','A share of each paid project and care plan. The rate depends on your role, from a referral to joint selling, and is fixed in a contract.'],['Do I need to know AI?','No. Knowing your client’s needs is enough. We handle the audit, estimate and delivery and give you demos and materials.'],['Can you deliver under our brand?','Yes, for joint projects. We agree how we present the work to the client before the first meeting.'],['Who owns the client relationship?','You do. We keep you in the loop on every meeting and never approach your clients about other work without you.']],title:'Partner questions.'};
 if(route.page==='solutions')return {items:[gen[0],gen[5],['What does the launch offer include?','30% off every price on this page for our first clients, including setup and monthly fees.'],['Can we start with training only?','Yes. Team training is a standalone format.']],title:'Pricing questions.'};
 if(route.page==='home'||route.page==='ai-for-small-business')return {items:[['What is Praxen AI?',brandDef(cur)],...gen.slice(0,5)],title:'Before our first conversation.'};
 return {items:gen,title:'Before our first conversation.'};
};

// Partner programme (the same terms as praxenai.ge/en/partners).
export const partnerWho:[string,string,string][]=[['wrench','IT support and managed service providers','Add AI receptionists, chatbots and automation to the services you already sell.'],['calculator','Accountants and bookkeepers','For clients buried in paperwork: documents read, coded and chased automatically.'],['megaphone','Marketing and web agencies','Chatbots, lead handling and content workflows for your clients.'],['compass','Business consultants','Offer clients measurable automation after your diagnostics.']];
export const partnerSteps=['You introduce a client or bring them to a meeting.','We run the free audit and launch a pilot.','You are paid once the client pays.'];

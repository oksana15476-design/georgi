// «Статьи по теме» / «Related guides» on service, industry and department pages of both sites (work plan 2.2).
// An article is a candidate when its own `links` point at the page: new articles join the block automatically.
// The fallback lists below only fill pages that fewer than two articles link to yet; they name articles of the
// same site whose topic covers the page. Each site uses only its own blog (.ge and .com never link to each other).
// The blogs are passed in by the caller, so each site's bundle carries only its own blog.
import type {Post} from '@/lib/intl-blog';
import type {GeArticle} from '@/lib/ge-blog';
import type {Lang} from '@/lib/content';

export type RelatedArticle={slug:string;cat:string;title:string;excerpt:string;dateLabel:string;minutes:number};

const max=3;

// Page path (as used in article links) → article slugs, used only after the articles that link to the page.
const intlFallback:Record<string,string[]>={
 'departments/customer-support':['whatsapp-chatbot-for-business','ai-chatbot-cost'],
 'departments/sales':['whatsapp-chatbot-for-business','ai-phone-answering-service'],
 'departments/marketing':['chatgpt-for-business','ai-workflow-automation-examples'],
 'departments/operations':['ai-workflow-automation-examples','n8n-vs-zapier-vs-make'],
 'departments/hr':['ai-for-recruitment-agencies','gdpr-and-ai'],
 'departments/procurement':['invoice-automation-ai','ai-workflow-automation-examples'],
 'industries/clinics':['ai-phone-answering-service','gdpr-and-ai'],
 'industries/estate-agents':['ai-voice-agents','ai-receptionist-cost-uk'],
 'industries/hospitality':['whatsapp-chatbot-for-business','whatsapp-business-api'],
 'industries/law-firms':['gdpr-and-ai','ai-phone-answering-service'],
 'industries/recruitment':['ai-agents-for-business','gdpr-and-ai'],
};
const geFallback:Record<string,string[]>={
 'departments/finance':['wholesale-orders-1c','choose-ai-integrator-georgia'],
 'departments/hr':['ai-tools-for-business'],
 'departments/marketing':['ai-tools-for-business'],
 'departments/procurement':['wholesale-orders-1c'],
 'industries/clinics':['whatsapp-telegram-ai-chatbot','georgian-language-ai'],
 'industries/developers':['crm-ai-amocrm-bitrix24'],
 'industries/education':['whatsapp-telegram-ai-chatbot'],
 'industries/hotels':['ai-for-restaurants-georgia','whatsapp-telegram-ai-chatbot'],
 'industries/logistics':['wholesale-orders-1c'],
 'industries/manufacturing':['wholesale-orders-1c'],
 'industries/real-estate':['crm-ai-amocrm-bitrix24'],
 'industries/restaurants':['ai-for-hotels-adjara','whatsapp-telegram-ai-chatbot'],
 'industries/retail':['whatsapp-telegram-ai-chatbot','ai-marketing-georgia'],
 'industries/services':['crm-ai-amocrm-bitrix24','whatsapp-telegram-ai-chatbot'],
 'industries/wholesale':['crm-ai-amocrm-bitrix24'],
 chatbot:['georgian-language-ai','crm-ai-amocrm-bitrix24'],
};

type Cand={slug:string;date:string;pos:number;i:number;post:Omit<RelatedArticle,'slug'>&{links:[string,string][]}};
// Articles that link to the page come first: the earlier the page sits in the article's links, the closer the topic;
// then the newest. Fallback articles follow in the listed order.
function pick(cands:Cand[],page:string,fallback:string[]=[],skip:string[]=[]):RelatedArticle[]{
 const own=cands.map(c=>({...c,pos:c.post.links.findIndex(([h])=>h===page)})).filter(c=>c.pos>=0)
  .sort((a,b)=>a.pos-b.pos||b.date.localeCompare(a.date)||b.i-a.i);
 const fill=fallback.map(s=>cands.find(c=>c.slug===s)).filter((c):c is Cand=>!!c);
 const seen=new Set(skip),out:RelatedArticle[]=[];
 for(const c of [...own,...fill]){if(seen.has(c.slug)||out.length>=max)continue;seen.add(c.slug);const {cat,title,excerpt,dateLabel,minutes}=c.post;out.push({slug:c.slug,cat,title,excerpt,dateLabel,minutes})}
 return out;
}

export const intlRelated=(posts:Post[],page:string):RelatedArticle[]=>pick(posts.map((p,i)=>({slug:p.slug,date:p.date,pos:-1,i,post:p})),page,intlFallback[page]);

// skip: articles the page already links to elsewhere (the chatbot page's own «Read next» list).
export const geRelated=(geArticles:GeArticle[],page:string,lang:Lang,skip:string[]=[]):RelatedArticle[]=>pick(
 geArticles.flatMap((a,i)=>{const p=a.langs[lang];return p?[{slug:a.slug,date:a.date,pos:-1,i,post:p}]:[]}),page,geFallback[page],skip);

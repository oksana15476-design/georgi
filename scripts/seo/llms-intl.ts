// Writes public/llms-intl.txt (served as praxenai.com/llms.txt) from the site data in lib/intl.ts.
// Run after changing prices or pages: npx tsx scripts/seo/llms-intl.ts
import {writeFileSync} from 'node:fs';
import {departments,fmt,industries,intlMeta,price,promo,services,servicePath,vatNote} from '../../lib/intl';
import {contacts} from '../../lib/contacts';
import {posts} from '../../lib/intl-blog';

const site='https://praxenai.com';
const url=(p:string)=>site+(p?'/'+p:'');
const line=(p:string,seg:string[])=>{const m=intlMeta(seg.length?(seg.length===2?{page:seg[0] as 'services',slug:seg[1]}:{page:seg[0] as 'solutions'}):{page:'home'});return `- [${m.title.replace(/ \| Praxen AI$/,'')}](${url(p)}): ${m.description}`;};
const P=(k:Parameters<typeof price>[0])=>`${fmt(promo(price(k)))} (standard ${fmt(price(k))})`;
const out=`# Praxen AI

> Praxen AI is an AI implementation company for small businesses in the UK, US and EU. It sets up AI receptionists that answer calls 24/7, chatbots for websites and WhatsApp, automation for CRM, documents and invoices, and AI agents with approvals and logs, and it trains teams to use AI safely. The team works remotely in UK business hours.

Key facts:
- Prices with the launch offer (30% off): AI receptionist ${P('rcSetup')} setup + ${P('rcMonth')} a month; team training ${P('training')} for a half-day session for up to 12 people; implementation pilot ${P('pilot')} for one workflow in 2–4 weeks; custom AI solution from ${P('custom')}; ongoing care ${P('care')} a month. Prices are also available in USD and EUR.
- ${vatNote}
- Call minutes and AI usage are billed at provider cost on the client's own accounts — typically 6–15p per minute of calls.
- Every project starts with a free 30-minute audit; the pilot price is fixed before work begins.
- Uses enterprise APIs (OpenAI, Anthropic) that do not train on customer data; works as a processor under a data processing agreement (UK GDPR).
- AI does not make final decisions: review points and handover to a person are agreed for every workflow.
- Contact: ${contacts.email}, WhatsApp ${contacts.whatsapp}, free call ${contacts.booking}

## Main pages
${line('',[])}
${line('solutions',['solutions'])}
${line('ai-for-small-business',['ai-for-small-business'])}
${line('cases',['cases'])}
${line('about',['about'])}
${line('security',['security'])}

## Services
${services.map(s=>line(servicePath(s.slug),s.slug==='ai-training'?['training']:['services',s.slug])).join('\n')}

## Industries
${industries.map(s=>line('industries/'+s.slug,['industries',s.slug])).join('\n')}

## Departments
${departments.map(s=>line('departments/'+s.slug,['departments',s.slug])).join('\n')}

## Blog
${posts.map(p=>`- [${p.title}](${url('blog/'+p.slug)}): ${p.description}`).join('\n')}
`;
writeFileSync(new URL('../../public/llms-intl.txt',import.meta.url),out);
console.log(out.length+' bytes');

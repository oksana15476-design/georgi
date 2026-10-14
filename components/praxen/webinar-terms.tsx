import {homeHref,langPath,base,pageHref} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import type {Lang} from '@/lib/content';
import {offerPath} from '@/lib/webinar-offer';
import {termsCopy,termsDraft,termsPath} from '@/lib/webinar-terms';
import {Icon} from './icon';
import {Wordmark} from './ui';
import {WbLangs} from './webinar';

// Public offer page for the workshop offer (lib/webinar-terms.ts). Plain document layout; empty seller details show as highlighted gaps.
export function WebinarTerms({lang='ru'}:{lang?:Lang}){
 const L=(lang==='en'||lang==='ka'?lang:'ru') as 'ru'|'en'|'ka',c=termsCopy[L],home=homeHref(L);
 const gap=<mark className="wb-gap">[{c.missing}]</mark>;
 return (
  <div className="site wb wb-terms">
   <header className="wb-c wb-head">
    <a href={home} className="brand" aria-label="Praxen AI"><Wordmark/></a>
    <div className="wb-head-r"><WbLangs lang={L} path={termsPath}/></div>
   </header>
   <main id="main" tabIndex={-1} className="wb-c wb-doc">
    <a href={base+langPath(L)+offerPath} className="wb-doc-back"><Icon name="arrow-left" size={16}/>{c.back}</a>
    <h1 className="wb-h2">{c.h1}</h1>
    <p className="wb-doc-ed">{c.edition}</p>
    {termsDraft&&<p role="note" className="wb-doc-draft"><Icon name="alert-triangle" size={18}/>{c.draft}</p>}
    {c.sections.map(s=><section key={s.h}><h2>{s.h}</h2>{s.p.map(p=><p key={p}>{p}</p>)}</section>)}
    <section><h2>{c.reqH}</h2><dl className="wb-doc-req">{c.req.map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v||gap}</dd></div>)}</dl></section>
    <section className="wb-doc-form"><h2>{c.formH}</h2>{c.form.map(p=><p key={p}>{p}</p>)}</section>
   </main>
   <footer className="footer">
    <div className="wrap footer-in wb-foot">
     <div className="footer-bottom">
      <a href={home} className="brand brand-dark"><Wordmark dark/></a>
      <div className="footer-contacts"><a href={'tel:'+contacts.phone} className="footer-phone"><Icon name="phone" size={16}/>{contacts.phoneLabel}</a><a href={'mailto:'+contacts.email} className="footer-phone"><Icon name="mail" size={16}/>{contacts.email}</a></div>
     </div>
     <div className="footer-bottom wb-foot-legal"><span>© 2026 Praxen AI · {c.foot.location} · <a href={pageHref(L,'privacy')} className="footer-privacy">{c.foot.privacy}</a></span></div>
    </div>
   </footer>
  </div>
 );
}

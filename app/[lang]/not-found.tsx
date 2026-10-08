// Branded 404 for both sites: the logo, a short message and the pages people usually look for,
// instead of the framework's bare error page.
import {isIntl} from '@/lib/market';
import {base} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {Wordmark} from '@/components/praxen/ui';

export default function NotFound(){
 const links:[string,string][]=isIntl
  ?[['/','Home'],['/services','Services'],['/industries','Industries'],['/solutions','Solutions & pricing'],['/cases','Cases'],['/about','About']]
  :[['/en','English'],['/ka','ქართული'],['/ru','Русский'],['/en/solutions','Solutions & prices'],['/en/industries','Industries'],['/en/cases','Cases']];
 return (
  <div className={'site'+(isIntl?' ix':'')}>
   <header className="site-header"><div className="wrap header-row"><a href={base+(isIntl?'/':'/en')} aria-label="Praxen AI" className="brand"><Wordmark/></a></div></header>
   <main id="main" className="wrap sec">
    <p className="hero-eyebrow">404</p>
    <h1 className="h1 mt14">{isIntl?'This page does not exist.':'Page not found.'}</h1>
    <p className="lead">{isIntl?'The link may be old or mistyped. Here are the pages people usually look for.':'The link may be old or mistyped. Choose a language or one of the main pages.'}</p>
    <div className="btn-row mt28">{links.map(([h,l],i)=><a key={h} href={base+h} className={'btn '+(i===0?'btn-primary':'btn-ghost')}>{l}</a>)}</div>
    <p className="lead lead-muted">{isIntl?<>Or write to us: <a href={'mailto:'+contacts.email} className="ix-inline">{contacts.email}</a></>:<>WhatsApp: <a href={contacts.whatsapp} className="ix-inline">{contacts.phoneLabel}</a></>}</p>
   </main>
  </div>
 );
}

// Branded 404 for both sites: the logo, a short message and the pages people usually look for,
// instead of the framework's bare error page.
import {isIntl} from '@/lib/market';
import {base} from '@/lib/base';
import {contacts} from '@/lib/contacts';
import {Wordmark} from '@/components/praxen/ui';
import {GeNotFound} from '@/components/praxen/not-found';

export default function NotFound(){
 // praxenai.ge: the page in the visitor's language with the site header (components/praxen/not-found.tsx).
 if(!isIntl)return <GeNotFound/>;
 const links:[string,string][]=[['/','Home'],['/services','Services'],['/industries','Industries'],['/solutions','Solutions & pricing'],['/cases','Cases'],['/about','About']];
 return (
  <div className="site ix">
   <header className="site-header"><div className="wrap header-row"><a href={base+'/'} aria-label="Praxen AI" className="brand"><Wordmark/></a></div></header>
   <main id="main" className="wrap sec">
    <p className="hero-eyebrow">404</p>
    <h1 className="h1 mt14">This page does not exist.</h1>
    <p className="lead">The link may be old or mistyped. Here are the pages people usually look for.</p>
    <div className="btn-row mt28">{links.map(([h,l],i)=><a key={h} href={base+h} className={'btn '+(i===0?'btn-primary':'btn-ghost')}>{l}</a>)}</div>
    <p className="lead lead-muted">Or write to us: <a href={'mailto:'+contacts.email} className="ix-inline">{contacts.email}</a></p>
   </main>
  </div>
 );
}

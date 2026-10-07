// Server-side entry for praxenai.com pages: static params, metadata and the page with its JSON-LD.
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {pageMeta} from '@/lib/seo';
import {intlPaths,resolveIntl,routePath} from '@/lib/intl';
import {intlPageJsonLd,intlPageMeta} from '@/lib/intl-seo';
import IntlSite from './site';

// Paths for one route folder: the catch-all takes everything except /industries/* and /departments/*.
export function intlParams(group?:'industries'|'departments'){
 const segs=intlPaths.map(p=>p.split('/').filter(Boolean));
 if(group)return segs.filter(s=>s[0]===group&&s.length===2).map(s=>({lang:'en',slug:s[1]}));
 return segs.filter(s=>!((s[0]==='industries'||s[0]==='departments')&&s.length===2)).map(s=>({lang:'en',section:s}));
}

export function intlMetadata(lang:string,seg:string[]):Metadata{
 const r=lang==='en'?resolveIntl(seg):null;
 if(!r)notFound();
 const m=intlPageMeta(r);
 const meta=pageMeta('en',routePath(r),m.title,m.description);
 // Blog posts are articles for Open Graph.
 return r.page==='blog'&&r.slug?{...meta,openGraph:{...meta.openGraph,type:'article'}}:meta;
}

export function IntlPage({lang,seg}:{lang:string;seg:string[]}){
 const r=lang==='en'?resolveIntl(seg):null;
 if(!r)notFound();
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(intlPageJsonLd(r)).replace(/</g,'\\u003c')}}/>
  <IntlSite route={r}/>
 </>;
}

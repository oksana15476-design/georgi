// Server-side entry for praxenai.com pages: static params, metadata and the page with its JSON-LD.
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {pageMeta} from '@/lib/seo';
import {intlPaths,resolveIntl,routePath,type IntlRoute} from '@/lib/intl';
import {intlPageJsonLd,intlPageMeta} from '@/lib/intl-seo';
import {posts} from '@/lib/intl-blog';
import {intlRelated} from '@/lib/related-articles';
import IntlSite,{type IntlBlog} from './site';

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

// The blog slice one page shows (lib/intl-blog.ts holds every article, so it stays on the server):
// an article with its two «related pages» links, the list cards, or the «Related guides» of a service, industry or department.
const card=(p:(typeof posts)[number])=>({slug:p.slug,cat:p.cat,title:p.title,excerpt:p.excerpt,dateLabel:p.dateLabel,minutes:p.minutes});
function intlBlog(r:IntlRoute):IntlBlog{
 if(r.page==='blog'&&r.slug){
  const post=posts.find(p=>p.slug===r.slug);if(!post)return {};
  // Two more articles from the same blog (the next ones in the list) that the post does not already link to.
  const i=posts.findIndex(p=>p.slug===post.slug),seen=new Set(post.links.map(([h])=>h));
  return {post,more:[...posts.slice(i+1),...posts.slice(0,i)].filter(p=>!seen.has('blog/'+p.slug)).slice(0,2).map(p=>['blog/'+p.slug,p.title])};
 }
 // Newest article first (owner, 2 November); articles of the same day: the one added last comes first.
 if(r.page==='blog')return {cards:posts.map((p,i)=>({p,i})).sort((a,b)=>b.p.date.localeCompare(a.p.date)||b.i-a.i).map(x=>card(x.p))};
 return {guides:intlRelated(posts,routePath(r).slice(1))};
}

export function IntlPage({lang,seg}:{lang:string;seg:string[]}){
 const r=lang==='en'?resolveIntl(seg):null;
 if(!r)notFound();
 return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(intlPageJsonLd(r)).replace(/</g,'\\u003c')}}/>
  <IntlSite route={r} blog={intlBlog(r)}/>
 </>;
}

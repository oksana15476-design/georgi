import type {MetadataRoute} from 'next';
import {languages} from '@/lib/content';
import {allPaths,alternates,pageUrl} from '@/lib/seo';
import {isIntl} from '@/lib/market';
import {posts} from '@/lib/intl-blog';
import {gePageModified,intlPageModified,modifiedOf,newestOf} from '@/lib/freshness';
import {geArticles} from '@/lib/ge-blog';
import {webinar,webinarLangs} from '@/lib/webinar';
import type {Lang} from '@/lib/content';

export const dynamic='force-static';

// lastmod: an article's update or publication date, a blog list's newest article, other pages from lib/freshness.ts.
const lastModified=(path:string)=>{
 if(path==='/blog')return newestOf(isIntl?posts:geArticles);
 if(isIntl&&path.startsWith('/blog/')){const p=posts.find(x=>'/blog/'+x.slug===path);if(p)return modifiedOf(p)}
 return isIntl?intlPageModified(path):gePageModified(path);
};

export default function sitemap():MetadataRoute.Sitemap{
 const pages:MetadataRoute.Sitemap=allPaths.flatMap(path=>languages.map(lang=>({
  url:pageUrl(lang,path),
  lastModified:lastModified(path),
  changeFrequency:'monthly' as const,
  priority:path===''?1:path.split('/').length===2?.8:.6,
  alternates:{languages:alternates(lang,path).languages},
 })));
 // praxenai.ge articles exist only in the languages they were written in, once each.
 const articles:MetadataRoute.Sitemap=isIntl?[]:geArticles.flatMap(a=>{
  const avail=Object.keys(a.langs) as Lang[];
  return avail.map(lang=>({url:pageUrl(lang,'/blog/'+a.slug),lastModified:modifiedOf(a),changeFrequency:'monthly' as const,priority:.6,alternates:{languages:alternates(lang,'/blog/'+a.slug,avail).languages}}));
 });
 // Webinar landing: praxenai.ge, ru, en and ka (lib/webinar.ts).
 const webinarPage:MetadataRoute.Sitemap=isIntl?[]:webinarLangs.map(lang=>({url:pageUrl(lang,webinar.path),lastModified:gePageModified(webinar.path),changeFrequency:'weekly' as const,priority:.6,alternates:{languages:alternates(lang,webinar.path,webinarLangs).languages}}));
 return [...pages,...articles,...webinarPage];
}

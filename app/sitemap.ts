import type {MetadataRoute} from 'next';
import {languages} from '@/lib/content';
import {allPaths,alternates,pageUrl} from '@/lib/seo';
import {isIntl} from '@/lib/market';
import {intlUpdated} from '@/lib/intl';
import {geArticles} from '@/lib/ge-blog';
import type {Lang} from '@/lib/content';

export const dynamic='force-static';

export default function sitemap():MetadataRoute.Sitemap{
 const pages:MetadataRoute.Sitemap=allPaths.flatMap(path=>languages.map(lang=>({
  url:pageUrl(lang,path),
  // praxenai.com lists the content review date; praxenai.ge keeps its current sitemap.
  ...(isIntl?{lastModified:intlUpdated}:{}),
  changeFrequency:'monthly' as const,
  priority:path===''?1:path.split('/').length===2?.8:.6,
  alternates:{languages:alternates(lang,path).languages},
 })));
 // praxenai.ge articles exist only in the languages they were written in, once each.
 const articles:MetadataRoute.Sitemap=isIntl?[]:geArticles.flatMap(a=>{
  const avail=Object.keys(a.langs) as Lang[];
  return avail.map(lang=>({url:pageUrl(lang,'/blog/'+a.slug),lastModified:a.date,changeFrequency:'monthly' as const,priority:.6,alternates:{languages:alternates(lang,'/blog/'+a.slug,avail).languages}}));
 });
 return [...pages,...articles];
}

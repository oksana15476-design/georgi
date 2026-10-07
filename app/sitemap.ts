import type {MetadataRoute} from 'next';
import {languages} from '@/lib/content';
import {allPaths,alternates,pageUrl} from '@/lib/seo';

export const dynamic='force-static';

export default function sitemap():MetadataRoute.Sitemap{
 return allPaths.flatMap(path=>languages.map(lang=>({
  url:pageUrl(lang,path),
  changeFrequency:'monthly' as const,
  priority:path===''?1:path.split('/').length===2?.8:.6,
  alternates:{languages:alternates(lang,path).languages},
 })));
}

import type {MetadataRoute} from 'next';
import {absolute} from '@/lib/seo';
import {indexable,isIntl} from '@/lib/market';

// praxenai.com names the AI search and answer crawlers explicitly so they can cite the site.
const aiBots=['GPTBot','OAI-SearchBot','ChatGPT-User','ClaudeBot','Claude-User','Claude-SearchBot','PerplexityBot','Google-Extended'];

export const dynamic='force-static';

// Clean-param (read by Yandex in any group) folds ad, social and popup-preview parameters into the
// clean URL, so links like /ru?fbclid=… are not indexed as separate pages.
// One parameter per line: the robots route HTML-escapes '&', which would break a combined list.
const cleanParam=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid','yclid','ysclid','popup'];

export default function robots():MetadataRoute.Robots{
 if(!indexable)return {rules:[{userAgent:'*',disallow:'/'}]};
 if(isIntl)return {rules:[{userAgent:'*',allow:'/',disallow:'/api/'},{userAgent:aiBots,allow:'/',disallow:'/api/'}],sitemap:absolute('/sitemap.xml')};
 return {rules:[{userAgent:'*',allow:'/',disallow:'/api/',other:{'Clean-param':cleanParam}}],sitemap:absolute('/sitemap.xml')};
}

import type {MetadataRoute} from 'next';
import {absolute} from '@/lib/seo';

export const dynamic='force-static';

// Clean-param (read by Yandex in any group) folds ad, social and popup-preview parameters into the
// clean URL, so links like /ru?fbclid=… are not indexed as separate pages.
const cleanParam='utm_source&utm_medium&utm_campaign&utm_content&utm_term&fbclid&gclid&yclid&ysclid&popup';

export default function robots():MetadataRoute.Robots{
 return {rules:[{userAgent:'*',allow:'/',disallow:'/api/',other:{'Clean-param':cleanParam}}],sitemap:absolute('/sitemap.xml')};
}

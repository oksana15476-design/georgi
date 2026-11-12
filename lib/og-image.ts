import type {Lang} from '@/lib/content';
import {isIntl} from '@/lib/market';

// Share pictures of single pages (Open Graph and X, 1200×630): an article or a commercial page gets its own card
// with the rubric, the page title and the domain (plan 2.7, 12 November 2026).
// The cards are drawn during the build by build/og-images.mjs from lib/og-cards.ts and land in public/og/pages/
// (not in git). The build passes the list of cards it drew as __PRAXEN_OG__ (card key → content hash), so a page
// links a card only when the file exists; without it (dev server, scripts, a failed render) the site-wide picture stays.
declare const __PRAXEN_OG__:Record<string,string>|undefined;
const drawn:Record<string,string>=typeof __PRAXEN_OG__==='undefined'?{}:__PRAXEN_OG__;

// Card key of a page: '<lang>/<path>' on praxenai.ge, '<path>' on praxenai.com; 'home' for the home page.
export const ogKey=(lang:Lang,path:string)=>(isIntl?'':lang+'/')+(path.replace(/^\//,'')||'home');

// The card file of a page, or undefined when the build drew none. The hash in the name changes with the text,
// so messengers that cache a picture by its address show the new card after a title change.
export function ogPageImage(lang:Lang,path:string):string|undefined{
 const key=ogKey(lang,path),hash=drawn[key];
 return hash?'/og/pages/'+key+'-'+hash+'.png':undefined;
}

// Freshness dates for both sites: sitemap lastmod, dateModified in JSON-LD and the visible "updated" lines.
// Blog articles: `updated` (set when an article was revised after publication), otherwise the publication date.
// Other pages: the date their own content (text, prices, FAQ) last changed, taken from git log on 11 November 2026.
// When you change a page's content, put the new date here. Layout, analytics and form changes do not count.
import {departments,industries,intlUpdated,services} from '@/lib/intl';
// The dates that do not need lib/intl.ts live in lib/dates.ts (the browser bundle of praxenai.ge imports them from there).
export {modifiedOf,newestOf,dateLabelOf,gePageModified,type Dated} from '@/lib/dates';

// praxenai.com. Pages not listed take intlUpdated from lib/intl.ts (8 October content pass).
// The 11 November text pass covers every service, industry and department page, training, solutions,
// the home page (results check in the pricing block) and the small-business page (smallPerks). It replaces the
// earlier dates of those pages (receptionist and trades 23 October, page guides 3 November).
const textPass='2026-11-11';
const textPassPaths=[
 ...services.filter(s=>s.slug!=='ai-training').map(s=>'/services/'+s.slug),
 ...industries.map(s=>'/industries/'+s.slug),
 ...departments.map(s=>'/departments/'+s.slug),
 '/training','/solutions','','/ai-for-small-business',
];
const intlPages:Record<string,string>={
 '/privacy':'2026-10-24', // analytics section
 ...Object.fromEntries(textPassPaths.map(p=>[p,textPass])),
};
// path: '' for home, '/services/ai-receptionist' and so on; blog pages are dated in lib/intl-seo.ts.
export const intlPageModified=(path:string)=>intlPages[path]??intlUpdated;


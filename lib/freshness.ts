// Freshness dates for both sites: sitemap lastmod, dateModified in JSON-LD and the visible "updated" lines.
// Blog articles: `updated` (set when an article was revised after publication), otherwise the publication date.
// Other pages: the date their own content (text, prices, FAQ) last changed, taken from git log on 11 November 2026.
// When you change a page's content, put the new date here. Layout, analytics and form changes do not count.
import type {Lang} from '@/lib/content';
import {contentUpdated} from '@/lib/proof';

export type Dated={date:string;updated?:string};
// Never earlier than the publication date.
export const modifiedOf=(a:Dated)=>a.updated&&a.updated>a.date?a.updated:a.date;
// Blog lists change when the newest article goes out or an article is revised.
export const newestOf=(list:Dated[])=>list.reduce((m,a)=>{const d=modifiedOf(a);return d>m?d:m},'');

const months:Record<Lang,string[]>={
 en:['January','February','March','April','May','June','July','August','September','October','November','December'],
 ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
 ka:['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი'],
};
// '2026-11-09' → '9 November 2026' / '9 ноября 2026' / '9 ნოემბერი 2026', the same as dateLabel in the blogs.
export const dateLabelOf=(iso:string,lang:Lang='en')=>{const [y,m,d]=iso.split('-').map(Number);return d+' '+months[lang][m-1]+' '+y};

// praxenai.com. The site-wide date matches intlUpdated in lib/intl.ts (8 October content pass).
const intlSite='2026-10-08';
const intlPages:Record<string,string>={
 '':'2026-11-03', // home FAQ: standard and launch-offer receptionist prices
 '/services/ai-receptionist':'2026-10-23','/industries/trades':'2026-10-23', // tuned to Search Console queries
 '/privacy':'2026-10-24', // analytics section
 // page-specific guides (lib/intl-guides.ts)
 ...Object.fromEntries(['customer-support','sales','marketing','operations','finance','hr','procurement','leadership'].map(s=>['/departments/'+s,'2026-11-03'])),
 '/industries/hospitality':'2026-11-03',
};
// path: '' for home, '/services/ai-receptionist' and so on; blog pages are dated in lib/intl-seo.ts.
export const intlPageModified=(path:string)=>intlPages[path]||intlSite;

// praxenai.ge. The site-wide date is the 8 October content pass (pages without repeated blocks, page FAQs);
// department and industry pages show it as "Updated" (lib/proof.ts).
const gePages:Record<string,string>={
 '/partners':'2026-10-30', // three reward levels and a worked example
 '/privacy':'2026-10-24', // analytics section
 '/chatbot':'2026-11-09', // page created; editor's edits and the Georgian sync the same day
 '/webinar':'2026-11-06', // workshop moved to 12 December
};
// path without the language prefix; blog pages are dated by their articles.
export const gePageModified=(path:string)=>gePages[path]||contentUpdated;

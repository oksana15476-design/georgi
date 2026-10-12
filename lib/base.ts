// Path prefix for hosting under a sub-path (GitHub Pages serves the site at /georgi). Empty on the main host.
export const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
// English pages have no language prefix: praxenai.com/pricing (English only) and praxenai.ge/solutions;
// Georgian and Russian keep theirs: praxenai.ge/ka/solutions, praxenai.ge/ru/solutions (owner decision, 12 October 2026).
export const langPath=(lang:string)=>process.env.NEXT_PUBLIC_MARKET==='intl'||lang==='en'?'':'/'+lang;
// Site root for a language and a link to a page under it.
export const homeHref=(lang:string)=>base+langPath(lang)||'/';
export const pageHref=(lang:string,page:string)=>base+langPath(lang)+'/'+page;

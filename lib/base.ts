// Path prefix for hosting under a sub-path (GitHub Pages serves the site at /georgi). Empty on the main host.
export const base=process.env.NEXT_PUBLIC_BASE_PATH||'';
// The English-only international site has no language prefix: praxenai.com/pricing, not /en/pricing.
export const langPath=(lang:string)=>process.env.NEXT_PUBLIC_MARKET==='intl'?'':'/'+lang;
// Site root for a language and a link to a page under it.
export const homeHref=(lang:string)=>base+langPath(lang)||'/';
export const pageHref=(lang:string,page:string)=>base+langPath(lang)+'/'+page;

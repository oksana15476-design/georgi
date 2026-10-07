// One codebase, two sites. NEXT_PUBLIC_MARKET is baked in at build time:
// - 'ge' (default): praxenai.ge — Georgia and Russian-speaking clients, ka/ru/en, GEL.
// - 'intl': praxenai.com — UK and other English-speaking markets, English only.
export type Market='ge'|'intl';
export const market:Market=process.env.NEXT_PUBLIC_MARKET==='intl'?'intl':'ge';
export const isIntl=market==='intl';
// The international site stays out of search results until NEXT_PUBLIC_INTL_LIVE=1.
export const indexable=!isIntl||process.env.NEXT_PUBLIC_INTL_LIVE==='1';
export const marketUrls={ge:'https://praxenai.ge',intl:'https://praxenai.com'};

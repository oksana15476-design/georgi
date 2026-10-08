// One codebase, two sites. NEXT_PUBLIC_MARKET is baked in at build time:
// - 'ge' (default): praxenai.ge — Georgia and Russian-speaking clients, ka/ru/en, GEL.
// - 'intl': praxenai.com — UK and other English-speaking markets, English only.
export type Market='ge'|'intl';
export const market:Market=process.env.NEXT_PUBLIC_MARKET==='intl'?'intl':'ge';
export const isIntl=market==='intl';
// praxenai.com went live on 8 October 2026. NEXT_PUBLIC_INTL_LIVE=0 at build time takes it out of search again.
export const indexable=!isIntl||process.env.NEXT_PUBLIC_INTL_LIVE!=='0';
export const marketUrls={ge:'https://praxenai.ge',intl:'https://praxenai.com'};

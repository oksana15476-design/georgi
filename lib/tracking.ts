import {isIntl} from '@/lib/market';

// Analytics and ad platform IDs. Each one is optional; when each loads is decided in components/analytics.tsx.
export const tracking = {
 // Public IDs of the live site; an environment variable overrides them.
 // praxenai.com has its own GA4 property, so its traffic is not mixed with praxenai.ge.
 ga: process.env.NEXT_PUBLIC_GA_ID || (isIntl ? 'G-8JMZ08G5Y3' : 'G-JPD37TCM27'),
 // praxenai.ge: dataset "praxenai.ge" in the business portfolio 2199775080882690 (12 October 2026).
 // praxenai.com still uses the earlier pixel until it gets its own.
 metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || (isIntl ? '3535943709898672' : '4732417260323563'),
 // Yandex Metrica counter number (digits only).
 // Not loaded on the international site: Yandex is a Russian processor, a GDPR risk for UK/EU visitors.
 ym: isIntl ? '' : process.env.NEXT_PUBLIC_YM_ID || '113476399',
 // Google Ads conversion: AW-XXXXXXXXX and the label of the "lead" conversion action.
 ads: process.env.NEXT_PUBLIC_ADS_ID || '',
 adsLeadLabel: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL || '',
};

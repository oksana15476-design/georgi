// Analytics and ad platform IDs. Each one is optional; nothing loads until the visitor accepts cookies.
export const tracking = {
 // Public IDs of the live site; an environment variable overrides them.
 ga: process.env.NEXT_PUBLIC_GA_ID || 'G-JPD37TCM27',
 metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '3535943709898672',
 // Yandex Metrica counter number (digits only).
 ym: process.env.NEXT_PUBLIC_YM_ID || '113476399',
 // Google Ads conversion: AW-XXXXXXXXX and the label of the "lead" conversion action.
 ads: process.env.NEXT_PUBLIC_ADS_ID || '',
 adsLeadLabel: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL || '',
};

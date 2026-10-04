// Analytics and ad platform IDs. Each one is optional; nothing loads until the visitor accepts cookies.
export const tracking = {
 ga: process.env.NEXT_PUBLIC_GA_ID || '',
 metaPixel: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
 // Google Ads conversion: AW-XXXXXXXXX and the label of the "lead" conversion action.
 ads: process.env.NEXT_PUBLIC_ADS_ID || '',
 adsLeadLabel: process.env.NEXT_PUBLIC_ADS_LEAD_LABEL || '',
};

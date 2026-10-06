// Starting prices: Moscow agency rates minus about a third, rounded. Shown in lari or dollars.
export type Currency='gel'|'usd';
export const prices={training:{gel:1900,usd:700},implementation:{gel:3200,usd:1200},development:{gel:6700,usd:2500},support:{gel:550,usd:200}};
// Turnkey messenger assistant packages: one-off setup plus a monthly fee, minimum term 3 months.
// Priced against aiNOW's monthly tariffs (docs/COMPETITOR-AINOW-PRICING.md), with setup done by us.
export const packages={
 start:{setup:{gel:490,usd:180},monthly:{gel:290,usd:110}},
 business:{setup:{gel:1500,usd:550},monthly:{gel:590,usd:220}},
};
const group=(n:number)=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
export const money=(p:{gel:number;usd:number},cur:Currency)=>cur==='gel'?group(p.gel)+' ₾':'$'+group(p.usd);

// Starting prices: Moscow agency rates minus about a third, rounded. Shown in lari or dollars.
export type Currency='gel'|'usd';
export const prices={training:{gel:1900,usd:700},implementation:{gel:3200,usd:1200},development:{gel:6700,usd:2500},support:{gel:550,usd:200}};
const group=(n:number)=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
export const money=(p:{gel:number;usd:number},cur:Currency)=>cur==='gel'?group(p.gel)+' ₾':'$'+group(p.usd);

// praxenai.ge prices in lari and dollars (owner decision, 23 November 2026). Dollars follow the lari at about 2.7 ₾ per $, rounded.
// The four original keys stay (the blog imports them): training is the short 2-hour session, support the basic monthly level.
// Chatbot packages are a launch fee plus a monthly fee; the rest are «from» prices for projects.
export type Currency='gel'|'usd';
export type Price={gel:number;usd:number};
export const prices={
 training:{gel:990,usd:370},
 trainingFull:{gel:1900,usd:700},
 implementation:{gel:3200,usd:1200},
 development:{gel:6700,usd:2500},
 support:{gel:290,usd:110},
 supportActive:{gel:550,usd:200},
 chatStart:{gel:990,usd:370},
 chatStartMonth:{gel:249,usd:90},
 chatCrm:{gel:2490,usd:920},
 chatCrmMonth:{gel:449,usd:170},
};
export type PriceKey=keyof typeof prices;
// Monthly fee that goes with each chatbot package.
export const packageMonth={chatStart:'chatStartMonth',chatCrm:'chatCrmMonth'} as const;
// First month of a package: the launch fee plus one monthly fee.
export const firstMonth=(launch:Price,month:Price):Price=>({gel:launch.gel+month.gel,usd:launch.usd+month.usd});
const group=(n:number)=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
export const money=(p:Price,cur:Currency)=>cur==='gel'?group(p.gel)+' ₾':'$'+group(p.usd);

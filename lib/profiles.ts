// Public profiles of Praxen AI outside the two sites: company pages, maps and directories.
// They go into Organization.sameAs on both sites, so search engines and AI assistants tie every
// mention to one company. Add a URL as soon as a profile is live (docs/AI-VISIBILITY.md lists them).
import {marketUrls,type Market} from './market';

export const companyProfiles:string[]=[];
export const founderProfiles:string[]=[];

// praxenai.ge and praxenai.com are the same company, so each site points to the other.
export const sameAsFor=(m:Market,extra:string[]=[])=>[marketUrls[m==='ge'?'intl':'ge'],...extra,...companyProfiles];
export const foundingDate='2026';

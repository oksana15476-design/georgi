// Public profiles of Praxen AI outside the sites: company pages, maps and directories. They go into
// Organization.sameAs so search engines and AI assistants tie mentions to the company.
// The two sites are kept as separate companies for their markets (owner decision, 9 October 2026):
// local profiles go to praxenai.ge, international ones to praxenai.com, and the sites do not point to
// each other. Add a URL as soon as a profile is live (docs/AI-VISIBILITY.md lists them).
import type {Market} from './market';

export const companyProfiles:Record<Market,string[]>={ge:[],intl:[]};
export const founderProfiles:Record<Market,string[]>={ge:[],intl:[]};

export const sameAsFor=(m:Market,extra:string[]=[])=>[...extra,...companyProfiles[m]];
export const foundingDate='2026';

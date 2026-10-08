import Site from '@/components/site';
import {isIntl} from '@/lib/market';
import {IntlPage,intlMetadata,intlParams} from '@/components/intl/route';
import {pageData} from '@/lib/page-data';
import {notFound} from 'next/navigation';
import {industries,languages,Lang,t} from '@/lib/content';
import {detailDescription,detailTitle,pageMeta} from '@/lib/seo';
export function generateStaticParams(){if(isIntl)return intlParams('industries');return languages.flatMap(lang=>industries.map(d=>({lang,slug:d.slug})))}
export async function generateMetadata({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;if(isIntl)return intlMetadata(lang,['industries',slug]);const e=industries.find(x=>x.slug===slug);if(!e||!languages.includes(lang as Lang))return {};return pageMeta(lang as Lang,'/industries/'+slug,detailTitle(slug,lang as Lang,t(e.name,lang as Lang)),detailDescription(slug,lang as Lang,t(e.promise,lang as Lang)))}
export default async function Page({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;if(isIntl)return <IntlPage lang={lang} seg={['industries',slug]}/>;if(!languages.includes(lang as Lang)||!industries.some(i=>i.slug===slug))notFound();return <Site lang={lang as Lang} section="industries" slug={slug} data={pageData(lang as Lang,'industries',slug)}/>}

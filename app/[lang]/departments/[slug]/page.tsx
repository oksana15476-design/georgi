import Site from '@/components/site';
import {notFound} from 'next/navigation';
import {departments,languages,Lang,t} from '@/lib/content';
import {detailDescription,detailTitle,pageMeta} from '@/lib/seo';
export function generateStaticParams(){return languages.flatMap(lang=>departments.map(d=>({lang,slug:d.slug})))}
export async function generateMetadata({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;const e=departments.find(x=>x.slug===slug);if(!e||!languages.includes(lang as Lang))return {};return pageMeta(lang as Lang,'/departments/'+slug,detailTitle(slug,lang as Lang,t(e.name,lang as Lang)),detailDescription(slug,lang as Lang,t(e.job,lang as Lang)))}
export default async function Page({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;if(!languages.includes(lang as Lang)||!departments.some(d=>d.slug===slug))notFound();return <Site lang={lang as Lang} section="departments" slug={slug}/>}

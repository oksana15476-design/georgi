import {notFound} from 'next/navigation';
import {isIntl} from '@/lib/market';
import {pageMeta} from '@/lib/seo';
import {webinar} from '@/lib/webinar';
import {Webinar} from '@/components/praxen/webinar';
// Webinar landing: praxenai.ge only, Russian only (praxenai.ge/ru/webinar).
export function generateStaticParams(){return isIntl?[]:[{lang:'ru'}]}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(isIntl||lang!=='ru')return {};return pageMeta('ru',webinar.path,webinar.title,webinar.description,['ru'])}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(isIntl||lang!=='ru')notFound();return <Webinar/>}

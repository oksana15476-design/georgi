import {notFound} from 'next/navigation';
import {isIntl} from '@/lib/market';
import {pageMeta} from '@/lib/seo';
import {webinar,webinarCopy,webinarLangs} from '@/lib/webinar';
import {Webinar} from '@/components/praxen/webinar';
import type {Lang} from '@/lib/content';
// Webinar landing: praxenai.ge only (/ru/webinar, /ka/webinar, English at /webinar).
const ok=(l:string):l is Lang=>!isIntl&&(webinarLangs as string[]).includes(l);
export function generateStaticParams(){return isIntl?[]:webinarLangs.map(lang=>({lang}))}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!ok(lang))return {};const c=webinarCopy[lang];return pageMeta(lang,webinar.path,c.title,c.description,webinarLangs)}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!ok(lang))notFound();return <Webinar lang={lang}/>}

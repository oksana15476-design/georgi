import Site from '@/components/site';
import {pageData} from '@/lib/page-data';
import {notFound} from 'next/navigation';
import {languages,Lang,t} from '@/lib/content';
import {isLang,pageMeta} from '@/lib/seo';
import {sectionMeta} from '@/lib/section-meta';
export function generateStaticParams(){return languages.flatMap(lang=>[{lang,section:[]},...['industries','departments','training','solutions','cases','partners','privacy'].map(x=>({lang,section:[x]}))])}
export async function generateMetadata({params}:{params:Promise<{lang:string;section?:string[]}>}){const {lang,section}=await params;if(!isLang(lang))return {};const key=section?.[0]||'home',m=sectionMeta[key]||sectionMeta.home;return pageMeta(lang,section?.[0]?'/'+section[0]:'',t(m.title,lang),t(m.description,lang))}
export default async function Page({params}:{params:Promise<{lang:string;section?:string[]}>}){const {lang,section}=await params;if(!languages.includes(lang as Lang)||section&& (section.length>1||!['industries','departments','training','solutions','cases','partners','privacy'].includes(section[0])))notFound();return <Site lang={lang as Lang} section={section?.[0]||'home'} data={pageData(lang as Lang,section?.[0]||'home')}/>}

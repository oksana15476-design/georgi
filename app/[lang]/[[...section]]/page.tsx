import Site from '@/components/site';
import {pageData} from '@/lib/page-data';
import {notFound} from 'next/navigation';
import {languages,Lang,t} from '@/lib/content';
import {isLang,pageMeta} from '@/lib/seo';
import {sectionMeta} from '@/lib/section-meta';
import {isIntl} from '@/lib/market';
import {intlMeta,intlPages,isIntlPage} from '@/lib/intl';
import IntlSite from '@/components/intl/site';
export function generateStaticParams(){if(isIntl)return [{lang:'en',section:[]},...intlPages.map(x=>({lang:'en',section:[x]}))];return languages.flatMap(lang=>[{lang,section:[]},...['industries','departments','training','solutions','cases','partners','privacy'].map(x=>({lang,section:[x]}))])}
export async function generateMetadata({params}:{params:Promise<{lang:string;section?:string[]}>}){const {lang,section}=await params;if(!isLang(lang))return {};if(isIntl){const k=section?.[0]||'home';if(!isIntlPage(k))return {};return pageMeta(lang,section?.[0]?'/'+k:'',intlMeta[k].title,intlMeta[k].description)}const key=section?.[0]||'home',m=sectionMeta[key]||sectionMeta.home;return pageMeta(lang,section?.[0]?'/'+section[0]:'',t(m.title,lang),t(m.description,lang))}
export default async function Page({params}:{params:Promise<{lang:string;section?:string[]}>}){const {lang,section}=await params;if(isIntl){const k=section?.[0]||'home';if(lang!=='en'||(section&&section.length>1)||!isIntlPage(k))notFound();return <IntlSite page={k}/>}if(!languages.includes(lang as Lang)||section&& (section.length>1||!['industries','departments','training','solutions','cases','partners','privacy'].includes(section[0])))notFound();return <Site lang={lang as Lang} section={section?.[0]||'home'} data={pageData(lang as Lang,section?.[0]||'home')}/>}

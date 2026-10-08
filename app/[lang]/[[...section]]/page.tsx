import Site from '@/components/site';
import {pageData} from '@/lib/page-data';
import {notFound} from 'next/navigation';
import {languages,Lang,t} from '@/lib/content';
import {isLang,pageMeta} from '@/lib/seo';
import {sectionMeta} from '@/lib/section-meta';
import {isIntl} from '@/lib/market';
import {IntlPage,intlMetadata,intlParams} from '@/components/intl/route';
import {geArticle,geArticles} from '@/lib/ge-blog';
const geSections=['industries','departments','training','solutions','cases','partners','privacy','about','security','blog'];
export function generateStaticParams(){if(isIntl)return intlParams();return languages.flatMap(lang=>[{lang,section:[]},...geSections.map(x=>({lang,section:[x]})),...geArticles.filter(a=>a.langs[lang]).map(a=>({lang,section:['blog',a.slug]}))])}
export async function generateMetadata({params}:{params:Promise<{lang:string;section?:string[]}>}){const {lang,section}=await params;if(!isLang(lang))return {};if(isIntl)return intlMetadata(lang,section||[]);if(section?.[0]==='blog'&&section[1]){const a=geArticle(section[1]),p=a?.langs[lang];if(!a||!p)return {};return pageMeta(lang,'/blog/'+a.slug,p.title.length>50?p.title:p.title+' — Praxen AI',p.description,Object.keys(a.langs) as Lang[])}const key=section?.[0]||'home',m=sectionMeta[key]||sectionMeta.home;return pageMeta(lang,section?.[0]?'/'+section[0]:'',t(m.title,lang),t(m.description,lang))}
export default async function Page({params}:{params:Promise<{lang:string;section?:string[]}>}){const {lang,section}=await params;if(isIntl)return <IntlPage lang={lang} seg={section||[]}/>;if(!languages.includes(lang as Lang)||section&&(!geSections.includes(section[0])||section.length>2||section.length===2&&(section[0]!=='blog'||!geArticle(section[1])?.langs[lang as Lang])))notFound();return <Site lang={lang as Lang} section={section?.[0]||'home'} slug={section?.[1]} data={pageData(lang as Lang,section?.[0]||'home')}/>}

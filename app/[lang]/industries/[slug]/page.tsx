import Site from '@/components/site';
import {notFound} from 'next/navigation';
import {industries,languages,Lang,t} from '@/lib/content';
import {alternates} from '@/lib/seo';
export async function generateMetadata({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;const i=industries.find(i=>i.slug===slug);if(!i||!languages.includes(lang as Lang))return {};return {title:t(i.name,lang as Lang)+' — Praxis AI',description:t(i.promise,lang as Lang),alternates:alternates(lang as Lang,'/industries/'+slug)}}
export default async function Page({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;if(!languages.includes(lang as Lang)||!industries.some(i=>i.slug===slug))notFound();return <Site lang={lang as Lang} section="industries" slug={slug}/>}

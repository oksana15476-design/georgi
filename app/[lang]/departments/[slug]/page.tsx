import Site from '@/components/site';
import {notFound} from 'next/navigation';
import {departments,languages,Lang,t} from '@/lib/content';
import {alternates} from '@/lib/seo';
export async function generateMetadata({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;const d=departments.find(d=>d.slug===slug);if(!d||!languages.includes(lang as Lang))return {};return {title:t(d.name,lang as Lang)+' — Praxis AI',description:t(d.job,lang as Lang),alternates:alternates(lang as Lang,'/departments/'+slug)}}
export default async function Page({params}:{params:Promise<{lang:string;slug:string}>}){const {lang,slug}=await params;if(!languages.includes(lang as Lang)||!departments.some(d=>d.slug===slug))notFound();return <Site lang={lang as Lang} section="departments" slug={slug}/>}

import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {isIntl} from '@/lib/market';
import {termsCopy,termsLangs} from '@/lib/webinar-terms';
import {WebinarTerms} from '@/components/praxen/webinar-terms';
import type {Lang} from '@/lib/content';
// Public offer for the services on the workshop offer page. Open to anyone by link (the bank checks it), but kept out of
// search and the sitemap like the offer page itself.
const ok=(l:string):l is 'ru'|'en'|'ka'=>!isIntl&&(termsLangs as string[]).includes(l);
export function generateStaticParams(){return isIntl?[]:termsLangs.map(lang=>({lang}))}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!ok(lang))return {};const c=termsCopy[lang];return {title:c.title,description:c.description,robots:{index:false,follow:false}}}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!ok(lang))notFound();return <WebinarTerms lang={lang as Lang}/>}

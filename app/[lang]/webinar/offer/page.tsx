import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {isIntl} from '@/lib/market';
import {offerCopy,offerLangs} from '@/lib/webinar-offer';
import {WebinarOffer} from '@/components/praxen/webinar-offer';
import type {Lang} from '@/lib/content';
// Offer page after the workshop: reachable only by the link sent to participants, so it is closed to search engines,
// has no canonical or hreflang and is left out of the sitemap.
const ok=(l:string):l is 'ru'|'en'=>!isIntl&&(offerLangs as string[]).includes(l);
export function generateStaticParams(){return isIntl?[]:offerLangs.map(lang=>({lang}))}
export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{const {lang}=await params;if(!ok(lang))return {};const c=offerCopy[lang];return {title:c.title,description:c.description,robots:{index:false,follow:false}}}
export default async function Page({params}:{params:Promise<{lang:string}>}){const {lang}=await params;if(!ok(lang))notFound();return <WebinarOffer lang={lang as Lang}/>}

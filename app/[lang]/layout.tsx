import type {Metadata,Viewport} from 'next';
import '../globals.css';
import {t} from '@/lib/content';
import {base} from '@/lib/base';
import {siteUrl,defaultLang,siteTitle,isLang,description,organizationJsonLd} from '@/lib/seo';
import {Analytics} from '@/components/analytics';
import {isIntl} from '@/lib/market';
import {intlOrganizationJsonLd} from '@/lib/intl-seo';

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
  const {lang:raw}=await params;const lang=isLang(raw)?raw:defaultLang;
  return {
    metadataBase:new URL(siteUrl),
    title:isIntl?'Praxen AI — practical AI for business':t(siteTitle,lang),
    description:isIntl?'AI receptionists, chatbots and automation for businesses in the UK, US and EU, plus team training.':description(lang),
    other:{'codex-preview':'development'},
    formatDetection:{telephone:true},
    // favicon.ico is what Yandex and Google fetch by default; SVG for modern browsers, PNG sizes for search results and home screens.
    icons:{
      icon:[{url:base+'/favicon.ico',sizes:'48x48',type:'image/x-icon'},{url:base+'/favicon.svg',type:'image/svg+xml'},{url:base+'/favicon-96x96.png',sizes:'96x96',type:'image/png'}],
      apple:[{url:base+'/apple-touch-icon.png',sizes:'180x180',type:'image/png'}],
    },
    manifest:base+'/site.webmanifest',
  };
}

export const viewport:Viewport={themeColor:'#f6f8fb'};

// Marks the document before first paint so scroll-reveal styles only hide content when JS runs.
const motionScript="document.documentElement.classList.add('js');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-off')";

export default async function RootLayout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{lang:string}>}>){
  const {lang}=await params;
  return (
    <html lang={isIntl?'en-GB':isLang(lang)?lang:defaultLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:motionScript}}/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        {/* praxenai.com is English only and does not need the Georgian font. */}
        <link rel="stylesheet" href={isIntl?'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap':'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Georgian:wght@400;500;600;700;800&display=swap'}/>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(isIntl?intlOrganizationJsonLd():organizationJsonLd(isLang(lang)?lang:defaultLang)).replace(/</g,'\\u003c')}}/>
        {children}
        <Analytics lang={isLang(lang)?lang:defaultLang}/>
      </body>
    </html>
  );
}

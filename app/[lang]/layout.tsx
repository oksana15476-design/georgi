import type {Metadata,Viewport} from 'next';
import '../globals.css';
import {t} from '@/lib/content';
import {base} from '@/lib/base';
import {siteUrl,defaultLang,siteTitle,isLang,description} from '@/lib/seo';

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
  const {lang:raw}=await params;const lang=isLang(raw)?raw:defaultLang;
  return {
    metadataBase:new URL(siteUrl),
    title:t(siteTitle,lang),
    description:description(lang),
    other:{'codex-preview':'development'},
    formatDetection:{telephone:true},
    icons:{icon:base+'/favicon.svg',shortcut:base+'/favicon.svg'},
  };
}

export const viewport:Viewport={themeColor:'#f6f8fb'};

// Marks the document before first paint so scroll-reveal styles only hide content when JS runs.
const motionScript="document.documentElement.classList.add('js');if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion-off')";

export default async function RootLayout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{lang:string}>}>){
  const {lang}=await params;
  return (
    <html lang={isLang(lang)?lang:defaultLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:motionScript}}/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- loaded once in the root layout */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Georgian:wght@400;500;600&display=swap"/>
      </head>
      <body>{children}</body>
    </html>
  );
}

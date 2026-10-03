import type {Metadata} from 'next';
import '../globals.css';
import {t} from '@/lib/content';
import {siteUrl,defaultLang,siteTitle,isLang,description} from '@/lib/seo';

export async function generateMetadata({params}:{params:Promise<{lang:string}>}):Promise<Metadata>{
  const {lang:raw}=await params;const lang=isLang(raw)?raw:defaultLang;
  return {
    metadataBase:new URL(siteUrl),
    title:t(siteTitle,lang),
    description:description(lang),
    other:{'codex-preview':'development'},
    icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'},
  };
}

export default async function RootLayout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{lang:string}>}>){
  const {lang}=await params;
  return (
    <html lang={isLang(lang)?lang:defaultLang}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

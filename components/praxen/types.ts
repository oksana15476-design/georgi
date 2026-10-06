import type {Lang} from '@/lib/content';
import type {C,SiteCopy} from '@/lib/site-copy';
import type {PageData} from '@/lib/page-data';

// Shared page context passed to every section.
export type X={lang:Lang;c:C;s:SiteCopy;link:(path:string)=>string;go:(context:string)=>void;toContact:(e?:React.MouseEvent)=>void;data:PageData};

import type {Lang} from '@/lib/content';

// WhatsApp chats open with a short text and the page code, so the manager sees where the visitor came from:
// «Здравствуйте! Хочу обсудить аудит. (стр.: /ru/industries/hotels, кампания: hotels-oct)».
// A link that already has its own text (hero, calculator, quiz) keeps it, and only the page code is added.
// The address is completed when the link is clicked (components/analytics.tsx), so every WhatsApp button on both sites gets it.
const intro:Record<Lang,string>={ru:'Здравствуйте! Хочу обсудить аудит.',en:'Hi! I’d like to discuss a free audit.',ka:'გამარჯობა! მინდა აუდიტის განხილვა.'};
const pageWord:Record<Lang,string>={ru:'стр.',en:'page',ka:'გვ.'};
const campaignWord:Record<Lang,string>={ru:'кампания',en:'campaign',ka:'კამპანია'};

export function waHref(href:string,lang:Lang,path:string,campaign=''):string{
 const [base,query='']=href.split('?');
 const text=new URLSearchParams(query).get('text')||intro[lang];
 const code='('+pageWord[lang]+': '+path.slice(0,120)+(campaign?', '+campaignWord[lang]+': '+campaign.slice(0,60):'')+')';
 return base+'?text='+encodeURIComponent(text+' '+code);
}

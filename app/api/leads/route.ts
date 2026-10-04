import {env} from 'cloudflare:workers';

type Secrets={TELEGRAM_BOT_TOKEN?:string;TELEGRAM_CHAT_ID?:string;RESEND_API_KEY?:string;LEAD_EMAIL_TO?:string;LEAD_EMAIL_FROM?:string;AMO_DOMAIN?:string;AMO_TOKEN?:string;AMO_PIPELINE_ID?:string};
type Lead={name:string;contact:string;method:string;value:string;message:string;tasks:string[];context:string;lang:string;page:string;source:string};

const timeout=()=>AbortSignal.timeout(10000);

function leadText(l:Lead){
 return ['Praxis AI — новая заявка',...(l.name?['Имя: '+l.name]:[]),'Контакт: '+l.contact,'Задача: '+l.message,'Выбрано: '+l.tasks.join(', '),'Контекст: '+l.context,'Язык: '+l.lang,'Страница: '+l.page,'Источник: '+(l.source||'прямой заход')].join('\n');
}

async function toTelegram(s:Secrets,l:Lead){
 const r=await fetch('https://api.telegram.org/bot'+s.TELEGRAM_BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:s.TELEGRAM_CHAT_ID,text:leadText(l)}),signal:timeout()});
 const result=await r.json() as {ok?:boolean};
 if(!r.ok||!result.ok)throw new Error('telegram');
}

async function toEmail(s:Secrets,l:Lead){
 const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+s.RESEND_API_KEY},body:JSON.stringify({from:s.LEAD_EMAIL_FROM,to:s.LEAD_EMAIL_TO!.split(',').map(v=>v.trim()).filter(Boolean),subject:'Praxis AI — заявка: '+(l.context||l.tasks[0]||l.contact),text:leadText(l)}),signal:timeout()});
 if(!r.ok)throw new Error('email');
}

// Creates a deal with a contact in amoCRM, then attaches the full enquiry as a note.
async function toAmo(s:Secrets,l:Lead){
 const host=s.AMO_DOMAIN!.replace(/^https?:\/\//,'').replace(/\/.*$/,'');
 const headers={'Content-Type':'application/json',Authorization:'Bearer '+s.AMO_TOKEN};
 const contactFields=l.method==='phone'?[{field_code:'PHONE',values:[{value:l.value,enum_code:'WORK'}]}]:[];
 const lead:Record<string,unknown>={name:'Сайт: '+(l.context||l.tasks[0]||'заявка'),_embedded:{contacts:[{first_name:l.name||l.value,custom_fields_values:contactFields}],tags:[{name:'praxis-site'},{name:l.lang}]}};
 if(s.AMO_PIPELINE_ID)lead.pipeline_id=Number(s.AMO_PIPELINE_ID);
 const r=await fetch('https://'+host+'/api/v4/leads/complex',{method:'POST',headers,body:JSON.stringify([lead]),signal:timeout()});
 if(!r.ok)throw new Error('amo');
 const created=await r.json() as {id?:number}[];
 const id=created[0]?.id;
 if(id)await fetch('https://'+host+'/api/v4/leads/'+id+'/notes',{method:'POST',headers,body:JSON.stringify([{note_type:'common',params:{text:leadText(l)}}]),signal:timeout()}).catch(()=>{});
}

export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'size'},{status:413});
 let body:Record<string,unknown>;try{const raw=await request.text();if(raw.length>12000)return Response.json({error:'size'},{status:413});body=JSON.parse(raw)}catch{return Response.json({error:'invalid'},{status:400})}
 if(!body||typeof body!=='object'||body.website)return Response.json({error:'invalid'},{status:400});
 const clean=(key:string,max:number)=>typeof body[key]==='string'?(body[key] as string).trim().slice(0,max):'';
 const contact=clean('contact',180);
 if(!contact)return Response.json({error:'required'},{status:400});
 const [method,...rest]=contact.split(': ');
 const lead:Lead={name:clean('name',100),contact,method,value:rest.join(': ')||contact,message:clean('message',2000),
  tasks:Array.isArray(body.tasks)?body.tasks.filter((v):v is string=>typeof v==='string').slice(0,10).map(v=>v.slice(0,120)):[],
  context:clean('context',180),lang:clean('lang',5),page:clean('page',220),source:clean('source',300)};

 const s=env as unknown as Secrets;
 const channels:Promise<void>[]=[];
 if(s.TELEGRAM_BOT_TOKEN&&s.TELEGRAM_CHAT_ID)channels.push(toTelegram(s,lead));
 if(s.RESEND_API_KEY&&s.LEAD_EMAIL_TO&&s.LEAD_EMAIL_FROM)channels.push(toEmail(s,lead));
 if(s.AMO_DOMAIN&&s.AMO_TOKEN)channels.push(toAmo(s,lead));
 if(!channels.length)return Response.json({error:'unavailable'},{status:503});
 // The lead counts as received if at least one channel accepted it.
 const results=await Promise.allSettled(channels);
 if(results.some(r=>r.status==='fulfilled'))return Response.json({ok:true});
 return Response.json({error:'delivery'},{status:502});
}

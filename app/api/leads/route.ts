import {env} from 'cloudflare:workers';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>12000)return Response.json({error:'size'},{status:413});
 let body:Record<string,unknown>;try{const raw=await request.text();if(raw.length>12000)return Response.json({error:'size'},{status:413});body=JSON.parse(raw)}catch{return Response.json({error:'invalid'},{status:400})}
 if(!body||typeof body!=='object'||body.website)return Response.json({error:'invalid'},{status:400});
 const clean=(key:string,max:number)=>typeof body[key]==='string'?(body[key] as string).trim().slice(0,max):'';
 const name=clean('name',100),contact=clean('contact',180);
 if(!name||!contact)return Response.json({error:'required'},{status:400});
 const secrets=env as unknown as {TELEGRAM_BOT_TOKEN?:string;TELEGRAM_CHAT_ID?:string};
 if(!secrets.TELEGRAM_BOT_TOKEN||!secrets.TELEGRAM_CHAT_ID)return Response.json({error:'unavailable'},{status:503});
 const text=['Praxis AI — новая заявка','Имя: '+name,'Контакт: '+contact,'Компания: '+clean('company',180),'Задача: '+clean('message',2000),'Выбрано: '+(Array.isArray(body.tasks)?body.tasks.filter(v=>typeof v==='string').slice(0,5).map(v=>v.slice(0,100)).join(', '):''),'Контекст: '+clean('context',180),'Язык: '+clean('lang',5),'Страница: '+clean('page',220)].join('\n');
 try{const response=await fetch('https://api.telegram.org/bot'+secrets.TELEGRAM_BOT_TOKEN+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:secrets.TELEGRAM_CHAT_ID,text}),signal:AbortSignal.timeout(10000)});const result=await response.json() as {ok?:boolean};if(!response.ok||!result.ok)throw new Error();return Response.json({ok:true})}catch{return Response.json({error:'delivery'},{status:502})}
}

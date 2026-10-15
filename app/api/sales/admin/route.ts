import {env} from 'cloudflare:workers';
import {getSales,sameKey,setSales} from '@/lib/sales-switch.mjs';
import {amoSetup,connectTelegram,funnelReport,systemStatus} from '@/lib/funnel-admin.mjs';

// The owner's control page for the «open sales» switch: /api/sales/admin?key=<SALES_ADMIN_KEY>.
// The key is a Cloudflare secret of at least 16 characters; without it the page answers 404.
// Below the switch: the state of every funnel connection and the one-time set-up buttons (amoCRM pipeline, Telegram buttons).
const E=()=>env as unknown as Record<string,string|undefined>;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const allowed=(key:string)=>{const k=E().SALES_ADMIN_KEY||'';return k.length>=16&&sameKey(key,k)};

type Row={name:string;ok:boolean;text:string};
function page(key:string,state:string,note='',rows:Row[]=[]){
 const open=state==='open',label=open?'Продажи ОТКРЫТЫ':state==='closed'?'Продажи закрыты':'Состояние неизвестно (Telegram не отвечает)';
 const btn=(action:string,text:string,color:string)=>`<form method="post"><input type="hidden" name="key" value="${esc(key)}"><input type="hidden" name="action" value="${action}"><button style="background:${color}">${text}</button></form>`;
 return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Продажи воркшопа</title>
<style>body{margin:0;font:16px/1.5 system-ui,sans-serif;background:#f6f8fb;color:#121a2b}main{max-width:480px;margin:0 auto;padding:32px 20px}h1{font-size:22px;margin:0 0 16px}h2{font-size:18px;margin:32px 0 8px}.sys{list-style:none;margin:0;padding:0}.sys li{display:grid;gap:2px;padding:10px 0;border-bottom:1px solid #dde3ec}.sys span{font-size:14px;color:#3c4658}.s{padding:16px 18px;border-radius:14px;font-weight:800;font-size:20px;background:${open?'#d9fbe3':'#fff'};border:2px solid ${open?'#1f9d55':'#cdd6e3'}}form{margin-top:14px}button{width:100%;min-height:64px;border:0;border-radius:999px;color:#fff;font-size:18px;font-weight:800;cursor:pointer}p{color:#3c4658;font-size:14px}.n{margin-top:14px;padding:12px 14px;border-radius:12px;background:#fff4d6}</style></head>
<body><main><h1>Продажи воркшопа</h1><div class="s">${label}</div>${note?`<div class="n">${esc(note)}</div>`:''}
${open?btn('close','Закрыть продажи','#d14343'):btn('open','Открыть продажи','#315bf5')}
<form method="get"><input type="hidden" name="key" value="${esc(key)}"><button style="background:#5d6779">Обновить</button></form>
<h2>Система</h2><ul class="sys">${rows.map(x=>`<li><b>${x.ok?'✅':'⚪️'} ${esc(x.name)}</b><span>${esc(x.text)}</span></li>`).join('')}</ul>
<form method="get"><input type="hidden" name="key" value="${esc(key)}"><input type="hidden" name="report" value="1"><button style="background:#1f9d55">Проверка воронки</button></form>
${btn('amo-setup','Настроить amoCRM','#121a2b')}${btn('tg-hook','Подключить кнопки в Telegram','#121a2b')}
<p>«Настроить amoCRM» создаёт воронку «Воркшоп 12 ноября», этапы и поля сделки; повторное нажатие ничего не ломает. «Подключить кнопки» включает кнопку «✅ Оплата пришла» под заказами с оплатой по счёту в чате с ботом заявок.</p>
<p>Когда продажи открыты, лендинг воркшопа (/ru/webinar, /webinar, /ka/webinar) за 15 секунд переводит всех посетителей, включая тех, кто уже на странице, на страницу тарифов. Когда закрыты, страница тарифов возвращает на лендинг. Переключить можно и в Telegram: закреплённое сообщение с меткой #sales_open в чате с ботом заявок = продажи открыты.</p></main></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
}

// Funnel check: deals of the workshop pipeline with their stage history, duplicates and conversion (lib/workshop-crm.mjs).
async function report(key:string){
 let body='';
 try{
  const d=await funnelReport(E());
  const pct=d.registered?Math.round(d.bought/d.registered*1000)/10:0;
  body=`<div class="s">Сделок: ${d.total} · записались на воркшоп: ${d.registered} · купили всего: ${d.boughtAll}<br>Из записавшихся купили: ${d.bought} — конверсия ${pct}% · купили без записи: ${d.boughtAll-d.bought}</div>
<p>${Object.entries(d.stages).map(([k,v])=>esc(k)+': '+v).join(' · ')}</p>
<h2>Дубли</h2>${d.duplicates.length?`<ul class="sys">${d.duplicates.map(x=>`<li><b>⚠️ ${esc(x.key)}</b><span>сделки ${x.deals.join(', ')}</span></li>`).join('')}</ul>`:'<p>✅ Дублей нет: у каждого контакта и кода участника одна сделка.</p>'}
<h2>Сделки (${d.rows.length})</h2><ul class="sys">${d.rows.map(x=>`<li><b>${esc(x.name)}</b><span>#${x.id} · сейчас: <b>${esc(x.stage)}</b></span><span>история: ${esc(x.path.join(' → ')||'—')}</span><span>записей в сделке: ${x.notes}${x.price?' · сумма '+x.price+' ₾':''}</span><span>поля: ${esc(Object.entries(x.filled).map(([k,v])=>k+' = '+v).join(' · ')||'—')}</span>${x.missing.length?`<span>⚠️ не заполнено: ${esc(x.missing.join(', '))}</span>`:''}</li>`).join('')}</ul>`;
 }catch(e){body=`<div class="n">Не получилось: ${esc(String((e as Error).message||e))}</div>`}
 return new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Проверка воронки</title>
<style>body{margin:0;font:16px/1.5 system-ui,sans-serif;background:#f6f8fb;color:#121a2b}main{max-width:720px;margin:0 auto;padding:32px 20px}h1{font-size:22px;margin:0 0 16px}h2{font-size:18px;margin:28px 0 8px}.s{padding:16px 18px;border-radius:14px;font-weight:800;font-size:18px;background:#fff;border:2px solid #cdd6e3}.n{padding:12px 14px;border-radius:12px;background:#fff4d6}.sys{list-style:none;margin:0;padding:0}.sys li{display:grid;gap:2px;padding:10px 0;border-bottom:1px solid #dde3ec}.sys span{font-size:14px;color:#3c4658}p{color:#3c4658;font-size:14px}a{color:#315bf5}</style></head>
<body><main><h1>Проверка воронки «Воркшоп»</h1>${body}<p><a href="?key=${encodeURIComponent(key)}">← Назад к управлению</a></p></main></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
}

const rows=(origin:string)=>systemStatus(E(),origin).catch(()=>[] as Row[]);

export async function GET(request:Request){
 const key=new URL(request.url).searchParams.get('key')||'';
 if(!allowed(key))return new Response('Not found',{status:404});
 const q=new URL(request.url).searchParams;
 if(q.get('report')==='json')return funnelReport(E()).then(d=>Response.json(d,{headers:{'Cache-Control':'no-store'}}),e=>Response.json({error:String((e as Error).message||e)},{status:500}));
 if(q.get('report'))return report(key);
 const origin=new URL(request.url).origin;
 return page(key,await getSales(E(),true),'',await rows(origin));
}

export async function POST(request:Request){
 const form=await request.formData().catch(()=>null);
 const key=String(form?.get('key')||''),action=String(form?.get('action')||'');
 if(!allowed(key))return new Response('Not found',{status:404});
 const origin=new URL(request.url).origin;
 try{
  if(action==='amo-setup'){const done=await amoSetup(E());return page(key,await getSales(E()),'amoCRM: '+done.join('; ')+'.',await rows(origin))}
  if(action==='tg-hook'){await connectTelegram(E(),origin);return page(key,await getSales(E()),'Готово: кнопки в Telegram подключены.',await rows(origin))}
  const state=await setSales(E(),action==='open');
  return page(key,state,action==='open'?'Готово: продажи открыты.':'Готово: продажи закрыты.',await rows(origin));
 }catch(e){
  const m=String((e as Error).message||e);
  return page(key,await getSales(E(),true),'Не получилось: '+m+(action==='open'||action==='close'?'. Если чат — группа, бот должен быть в ней администратором с правом закреплять сообщения.':''),await rows(origin));
 }
}

// Lead validation and delivery shared by the Cloudflare route (app/api/leads/route.ts) and the
// Node server used in Docker (server/index.mjs). Each enquiry goes to every configured channel in
// parallel and counts as received if at least one accepts it.
// Workshop registrations and offer orders go to the workshop pipeline in amoCRM (lib/workshop-crm.mjs) instead of a new deal each time.
import { amoEvent, amoLeadFields } from './workshop-crm.mjs';
import { reportOffline } from './metrika-offline.mjs';
import { AMO_FIELDS, amoValues, attributionLines, cleanAttribution } from './lead-attribution.mjs';

/** @typedef {{TELEGRAM_BOT_TOKEN?:string,TELEGRAM_CHAT_ID?:string,RESEND_API_KEY?:string,LEAD_EMAIL_TO?:string,LEAD_EMAIL_FROM?:string,AMO_DOMAIN?:string,AMO_TOKEN?:string,AMO_PIPELINE_ID?:string,YM_OFFLINE_TOKEN?:string,YM_COUNTER_ID?:string}} Secrets */
/** @typedef {{name:string,contact:string,method:string,value:string,message:string,tasks:string[],context:string,lang:string,page:string,source:string,code?:string,crm?:import('./workshop-crm.mjs').CrmEvent,buttons?:{text:string,data:string}[][],title?:string,
 *   market?:'ge'|'com',attribution?:import('./lead-attribution.mjs').Attribution}} Lead */
// market is set by the server from the site that took the enquiry (praxenai.ge, including its English pages, is «ge»), never by the browser.

// Bytes: Cyrillic and Georgian text takes 2–3 bytes a letter, and the enquiry also carries both visits (lib/lead-attribution.mjs).
export const MAX_BODY = 16000;
const timeout = () => AbortSignal.timeout(10000);

/**
 * Validates a raw JSON body. Returns the lead or an error code.
 * @param {string} raw
 * @returns {{lead?:Lead,error?:'invalid'|'required'}}
 */
export function parseLead(raw) {
  let body;
  try { body = JSON.parse(raw); } catch { return { error: 'invalid' }; }
  if (!body || typeof body !== 'object' || body.website) return { error: 'invalid' };
  const clean = (key, max) => (typeof body[key] === 'string' ? body[key].trim().slice(0, max) : '');
  const contact = clean('contact', 180);
  if (!contact) return { error: 'required' };
  const [method, ...rest] = contact.split(': ');
  return {
    lead: {
      name: clean('name', 100), contact, method, value: rest.join(': ') || contact, message: clean('message', 2000),
      tasks: Array.isArray(body.tasks) ? body.tasks.filter(v => typeof v === 'string').slice(0, 10).map(v => v.slice(0, 120)) : [],
      context: clean('context', 180), lang: clean('lang', 5), page: clean('page', 220), source: clean('source', 300),
      code: /^W[A-Z0-9]{4,11}$/.test(clean('code', 12)) ? clean('code', 12) : '',
      ...(cleanAttribution(body.attribution) ? { attribution: cleanAttribution(body.attribution) } : {}),
    },
  };
}

/** Host of the page address, or '' when it is not a valid address (the enquiry is delivered anyway). @param {string} page */
const hostOf = page => { try { return /^https?:\/\//.test(page) ? new URL(page).host : ''; } catch { return ''; } };

/** «ge» or «com»: set by the server, or recognised from the page address (workshop orders, older callers). @param {Lead} l */
export function marketOf(l) {
  if (l.market) return l.market;
  const host = hostOf(l.page);
  return /(^|\.)praxenai\.com$/.test(host) ? 'com' : /(^|\.)praxenai\.ge$/.test(host) ? 'ge' : '';
}

/** @param {Lead} l */
export function leadText(l) {
  // The site is named in the title, so leads from praxenai.ge and praxenai.com are easy to tell apart in one chat.
  const site = hostOf(l.page);
  const contact = l.value !== l.contact ? l.method + ' · ' + l.value : l.contact;
  const market = marketOf(l), visits = attributionLines(l.attribution);
  return [
    (l.title || 'Praxen AI — новая заявка') + (site ? ' с ' + site : ''),
    ...(market ? ['Рынок: ' + market] : []),
    ...(l.name ? ['Имя: ' + l.name] : []),
    'Контакт: ' + contact,
    ...(l.message ? ['Сообщение: ' + l.message] : []),
    ...(l.tasks.length ? ['Выбрано: ' + l.tasks.join(', ')] : []),
    ...(l.context ? ['Тема: ' + l.context] : []),
    ...(l.code ? ['Код участника: ' + l.code] : []),
    'Язык: ' + l.lang,
    'Страница: ' + l.page,
    // The visits kept by the browser (first and last source); older callers send only the source line.
    ...(visits.length ? visits : ['Источник: ' + (l.source || 'прямой заход')]),
  ].join('\n');
}

/** @param {Secrets} s @param {Lead} l */
async function toTelegram(s, l) {
  const r = await fetch('https://api.telegram.org/bot' + s.TELEGRAM_BOT_TOKEN + '/sendMessage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: s.TELEGRAM_CHAT_ID, text: leadText(l), ...(l.buttons ? { reply_markup: { inline_keyboard: l.buttons.map(row => row.map(b => ({ text: b.text, callback_data: b.data }))) } } : {}) }), signal: timeout() });
  const result = await r.json();
  if (!r.ok || !result.ok) throw new Error('telegram ' + r.status + (result.description ? ': ' + result.description : ''));
}

/** @param {Secrets} s @param {Lead} l */
async function toEmail(s, l) {
  const to = String(s.LEAD_EMAIL_TO).split(',').map(v => v.trim()).filter(Boolean);
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.RESEND_API_KEY }, body: JSON.stringify({ from: s.LEAD_EMAIL_FROM, to, subject: 'Praxen AI — заявка: ' + (l.context || l.tasks[0] || l.contact), text: leadText(l) }), signal: timeout() });
  if (!r.ok) throw new Error('email ' + r.status);
}

/**
 * Deal fields of a service enquiry: market, language, page, source and ad click ids (lib/lead-attribution.mjs),
 * as field ids. The fields are found by name (and created once); if amoCRM does not answer, the deal goes without them.
 * @param {Secrets} s @param {Lead} l @returns {Promise<{field_id:number,values:{value:string}[]}[]>}
 */
export async function amoLeadValues(s, l) {
  const ids = await amoLeadFields(/** @type {Record<string,string|undefined>} */ (s), AMO_FIELDS).catch(e => { console.error('amo fields', String(e?.message || e)); return /** @type {Record<string,number>} */ ({}); });
  return Object.entries(amoValues({ ...l, market: marketOf(l) || undefined })).filter(([k]) => ids[k]).map(([k, v]) => ({ field_id: ids[k], values: [{ value: v.slice(0, 250) }] }));
}

/** Creates a deal with a contact in amoCRM, then attaches the full enquiry as a note. @param {Secrets} s @param {Lead} l */
async function toAmo(s, l) {
  const host = String(s.AMO_DOMAIN).replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.AMO_TOKEN };
  const contactFields = l.method === 'phone' || l.method === 'whatsapp' ? [{ field_code: 'PHONE', values: [{ value: l.value, enum_code: 'WORK' }] }] : [];
  const market = marketOf(l);
  const custom = await amoLeadValues(s, l);
  /** @type {Record<string,unknown>} */
  const lead = { name: 'Сайт: ' + (l.context || l.tasks[0] || 'заявка'), ...(custom.length ? { custom_fields_values: custom } : {}), _embedded: { contacts: [{ first_name: l.name || l.value, ...(contactFields.length ? { custom_fields_values: contactFields } : {}) }], tags: [{ name: 'praxen-site' }, { name: l.lang }, ...(market ? [{ name: 'рынок ' + market }] : [])] } };
  if (s.AMO_PIPELINE_ID) lead.pipeline_id = Number(s.AMO_PIPELINE_ID);
  const post = (/** @type {Record<string,unknown>} */ body) => fetch('https://' + host + '/api/v4/leads/complex', { method: 'POST', headers, body: JSON.stringify([body]), signal: timeout() });
  let r = await post(lead);
  // A field amoCRM refuses must not cost the enquiry: the deal is created again without the fields (they stay in the note).
  if (r.status === 400 && custom.length) {
    console.error('amo fields refused, deal created without them');
    delete lead.custom_fields_values;
    r = await post(lead);
  }
  if (!r.ok) throw new Error('amo ' + r.status);
  const created = await r.json();
  const id = created?.[0]?.id;
  if (id) await fetch('https://' + host + '/api/v4/leads/' + id + '/notes', { method: 'POST', headers, body: JSON.stringify([{ note_type: 'common', params: { text: leadText(l) } }]), signal: timeout() }).catch(() => {});
}

/** Workshop registrations are recognised by the form's context («Воркшоп 12 ноября …», lib/webinar.ts). @param {Lead} l */
export const isWorkshop = l => /^Воркшоп/.test(l.context);

/** A workshop registration or order as a funnel event in amoCRM. @param {Secrets} s @param {Lead} l */
function toWorkshopCrm(s, l) {
  const phone = l.method === 'phone' || l.method === 'whatsapp' ? l.value : '';
  const ev = l.crm || { stage: 'registered', phone, fields: { 'Контакт для ссылки': l.contact } };
  return amoEvent(/** @type {Record<string,string|undefined>} */ (s), { name: l.name, lang: l.lang, page: l.page, source: l.source, note: leadText(l), ...(l.code ? { code: l.code } : {}), ...ev });
}

/**
 * Sends the lead to every configured channel.
 * @param {Lead} lead @param {Secrets} s
 * @returns {Promise<{status:'ok'|'unavailable'|'failed',errors:string[]}>}
 */
export async function deliverLead(lead, s) {
  const channels = [];
  if (s.TELEGRAM_BOT_TOKEN && s.TELEGRAM_CHAT_ID) channels.push(toTelegram(s, lead));
  if (s.RESEND_API_KEY && s.LEAD_EMAIL_TO && s.LEAD_EMAIL_FROM) channels.push(toEmail(s, lead));
  if (s.AMO_DOMAIN && s.AMO_TOKEN) channels.push(lead.crm || isWorkshop(lead) ? toWorkshopCrm(s, lead) : toAmo(s, lead));
  if (!channels.length) return { status: 'unavailable', errors: [] };
  // A registration or enquiry from a Yandex Direct click also goes to Metrica; it is not a delivery channel, and a failure only goes to the log.
  // Questions sent after registering («… · вопрос к воркшопу») and order events (lead.crm) are not new conversions.
  // Yandex Metrica runs on praxenai.ge only, so a yclid from another market is not sent to Yandex.
  const offline = lead.crm || /вопрос/.test(lead.context) || marketOf(lead) !== 'ge' ? null
    : reportOffline(/** @type {Record<string,string|undefined>} */ (s), lead.source, isWorkshop(lead) ? 'workshop_crm' : 'lead_crm').catch(e => console.error('metrika offline', String(e?.message || e)));
  const results = await Promise.allSettled(channels);
  await offline;
  const errors = results.filter(r => r.status === 'rejected').map(r => String(r.reason?.message || r.reason));
  // A channel that failed while Telegram worked (e.g. amoCRM) is reported to the team chat, so it is not lost silently.
  if (errors.length && s.TELEGRAM_BOT_TOKEN && s.TELEGRAM_CHAT_ID && results[0]?.status === 'fulfilled') {
    await fetch('https://api.telegram.org/bot' + s.TELEGRAM_BOT_TOKEN + '/sendMessage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: s.TELEGRAM_CHAT_ID, text: '⚠️ Заявка «' + (lead.name || lead.value) + '» дошла не во все системы:\n' + errors.join('\n').replace(/bot[0-9]+:[\w-]+/g, 'bot…').slice(0, 1500), disable_notification: true }), signal: timeout() }).catch(() => {});
  }
  return { status: results.some(r => r.status === 'fulfilled') ? 'ok' : 'failed', errors };
}

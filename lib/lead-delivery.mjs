// Lead validation and delivery shared by the Cloudflare route (app/api/leads/route.ts) and the
// Node server used in Docker (server/index.mjs). Each enquiry goes to every configured channel in
// parallel and counts as received if at least one accepts it.

/** @typedef {{TELEGRAM_BOT_TOKEN?:string,TELEGRAM_CHAT_ID?:string,RESEND_API_KEY?:string,LEAD_EMAIL_TO?:string,LEAD_EMAIL_FROM?:string,AMO_DOMAIN?:string,AMO_TOKEN?:string,AMO_PIPELINE_ID?:string}} Secrets */
/** @typedef {{name:string,contact:string,method:string,value:string,message:string,tasks:string[],context:string,lang:string,page:string,source:string}} Lead */

export const MAX_BODY = 12000;
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
    },
  };
}

/** @param {Lead} l */
export function leadText(l) {
  // The site is named in the title, so leads from praxenai.ge and praxenai.com are easy to tell apart in one chat.
  const site = /^https?:\/\//.test(l.page) ? new URL(l.page).host : '';
  const contact = l.value !== l.contact ? l.method + ' · ' + l.value : l.contact;
  return [
    'Praxen AI — новая заявка' + (site ? ' с ' + site : ''),
    ...(l.name ? ['Имя: ' + l.name] : []),
    'Контакт: ' + contact,
    ...(l.message ? ['Сообщение: ' + l.message] : []),
    ...(l.tasks.length ? ['Выбрано: ' + l.tasks.join(', ')] : []),
    ...(l.context ? ['Тема: ' + l.context] : []),
    'Язык: ' + l.lang,
    'Страница: ' + l.page,
    'Источник: ' + (l.source || 'прямой заход'),
  ].join('\n');
}

/** @param {Secrets} s @param {Lead} l */
async function toTelegram(s, l) {
  const r = await fetch('https://api.telegram.org/bot' + s.TELEGRAM_BOT_TOKEN + '/sendMessage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: s.TELEGRAM_CHAT_ID, text: leadText(l) }), signal: timeout() });
  const result = await r.json();
  if (!r.ok || !result.ok) throw new Error('telegram ' + r.status + (result.description ? ': ' + result.description : ''));
}

/** @param {Secrets} s @param {Lead} l */
async function toEmail(s, l) {
  const to = String(s.LEAD_EMAIL_TO).split(',').map(v => v.trim()).filter(Boolean);
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.RESEND_API_KEY }, body: JSON.stringify({ from: s.LEAD_EMAIL_FROM, to, subject: 'Praxen AI — заявка: ' + (l.context || l.tasks[0] || l.contact), text: leadText(l) }), signal: timeout() });
  if (!r.ok) throw new Error('email ' + r.status);
}

/** Creates a deal with a contact in amoCRM, then attaches the full enquiry as a note. @param {Secrets} s @param {Lead} l */
async function toAmo(s, l) {
  const host = String(s.AMO_DOMAIN).replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + s.AMO_TOKEN };
  const contactFields = l.method === 'phone' || l.method === 'whatsapp' ? [{ field_code: 'PHONE', values: [{ value: l.value, enum_code: 'WORK' }] }] : [];
  const lead = { name: 'Сайт: ' + (l.context || l.tasks[0] || 'заявка'), _embedded: { contacts: [{ first_name: l.name || l.value, custom_fields_values: contactFields }], tags: [{ name: 'praxen-site' }, { name: l.lang }] } };
  if (s.AMO_PIPELINE_ID) lead.pipeline_id = Number(s.AMO_PIPELINE_ID);
  const r = await fetch('https://' + host + '/api/v4/leads/complex', { method: 'POST', headers, body: JSON.stringify([lead]), signal: timeout() });
  if (!r.ok) throw new Error('amo ' + r.status);
  const created = await r.json();
  const id = created?.[0]?.id;
  if (id) await fetch('https://' + host + '/api/v4/leads/' + id + '/notes', { method: 'POST', headers, body: JSON.stringify([{ note_type: 'common', params: { text: leadText(l) } }]), signal: timeout() }).catch(() => {});
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
  if (s.AMO_DOMAIN && s.AMO_TOKEN) channels.push(toAmo(s, lead));
  if (!channels.length) return { status: 'unavailable', errors: [] };
  const results = await Promise.allSettled(channels);
  const errors = results.filter(r => r.status === 'rejected').map(r => String(r.reason?.message || r.reason));
  return { status: results.some(r => r.status === 'fulfilled') ? 'ok' : 'failed', errors };
}

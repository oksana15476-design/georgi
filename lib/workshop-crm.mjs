// Workshop funnel in amoCRM: one deal per participant in the workshop pipeline, moved forward by site events
// (registration, checkout, invoice request, payment). Shared by the Cloudflare routes and the Docker server.
// Needs AMO_DOMAIN (e.g. praxenai.amocrm.ru) and AMO_TOKEN (long-lived token of a private integration).
// The pipeline, its stages and the deal fields are created once by amoSetup() from the owner's control page
// (/api/sales/admin), and found by name afterwards, so nothing has to be copied into settings by hand.

export const PIPELINE = 'Воркшоп 12 ноября';
/** Stages in funnel order. «Оплачено» and «Не купил» are amoCRM's built-in won (142) and lost (143) stages. */
export const STAGES = [
  { key: 'registered', name: 'Записался', color: '#d6eaff' },
  { key: 'attended', name: 'Пришёл на эфир', color: '#98cbff' },
  { key: 'checkout', name: 'Перешёл к оплате', color: '#fffd7f' },
  { key: 'invoice', name: 'Запросил счёт', color: '#ffdc7f' },
  { key: 'booked', name: 'Бронь оплачена', color: '#deff81' },
  { key: 'paid', name: 'Оплачено', id: 142 },
  { key: 'lost', name: 'Не купил', id: 143 },
];
/** Deal fields (text), filled from the site. */
export const FIELDS = ['Код участника', 'Номер заказа', 'Тариф', 'Покупка или бронь', 'Способ оплаты', 'Статус оплаты', 'Плательщик', 'Код плательщика', 'Контакт для ссылки', 'Язык', 'UTM source', 'UTM medium', 'UTM campaign', 'Источник', 'Страница'];

const timeout = () => AbortSignal.timeout(10000);
/** @param {Record<string,string|undefined>} env */
export const amoReady = env => Boolean(env.AMO_DOMAIN && env.AMO_TOKEN);
/** @param {Record<string,string|undefined>} env */
const host = env => String(env.AMO_DOMAIN).replace(/^https?:\/\//, '').replace(/\/.*$/, '');

/** @param {Record<string,string|undefined>} env @param {string} method @param {string} path @param {unknown} [body] */
async function api(env, method, path, body) {
  const r = await fetch('https://' + host(env) + path, {
    method, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + env.AMO_TOKEN },
    body: body === undefined ? undefined : JSON.stringify(body), signal: timeout(),
  });
  if (r.status === 204) return null;
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error('amo ' + method + ' ' + path.split('?')[0] + ' ' + r.status + (j?.title ? ': ' + j.title : '') + (j?.detail ? ' (' + j.detail + ')' : ''));
  return j;
}

/** @typedef {{pipelineId:number,stages:Record<string,number>,names:Record<number,string>,fields:Record<string,number>}} Schema */
/** @type {{schema:Schema|null,at:number}} */
let cache = { schema: null, at: 0 };

/** Reads the pipeline and fields by name. @param {Record<string,string|undefined>} env @returns {Promise<Schema|null>} */
async function readSchema(env) {
  const pipes = (await api(env, 'GET', '/api/v4/leads/pipelines'))?._embedded?.pipelines || [];
  const pipe = pipes.find(p => p.name === PIPELINE);
  if (!pipe) return null;
  const statuses = pipe._embedded?.statuses || [];
  /** @type {Record<string,number>} */
  const stages = {};
  for (const s of STAGES) {
    const found = s.id ? statuses.find(x => x.id === s.id) : statuses.find(x => x.name === s.name);
    if (found) stages[s.key] = found.id;
  }
  /** @type {Record<string,number>} */
  const fields = {};
  for (let page = 1; page < 10; page++) {
    const j = await api(env, 'GET', '/api/v4/leads/custom_fields?limit=250&page=' + page);
    for (const f of j?._embedded?.custom_fields || []) if (FIELDS.includes(f.name)) fields[f.name] = f.id;
    if (!j?._links?.next) break;
  }
  return { pipelineId: pipe.id, stages, names: Object.fromEntries(statuses.map(x => [x.id, x.name])), fields };
}

/** @param {Record<string,string|undefined>} env */
async function schema(env) {
  if (cache.schema && Date.now() - cache.at < 300000) return cache.schema;
  let s = await readSchema(env);
  // Fields added to FIELDS after the set-up are created on first use, so a code update needs no second click.
  const missing = s ? FIELDS.filter(f => !s.fields[f]) : [];
  if (s && missing.length) {
    await api(env, 'POST', '/api/v4/leads/custom_fields', missing.map((name, i) => ({ name, type: 'text', sort: 600 + i }))).catch(() => {});
    s = await readSchema(env);
  }
  if (!s) throw new Error('amo: воронка «' + PIPELINE + '» не создана — нажмите «Настроить amoCRM» на странице управления');
  cache = { schema: s, at: Date.now() };
  return s;
}

/** Checks the token and that the pipeline exists; throws with the reason. @param {Record<string,string|undefined>} env */
export async function amoCheck(env) {
  cache = { schema: null, at: 0 };
  await schema(env);
}

/**
 * Creates the pipeline, stages and fields that are missing. Safe to run again.
 * @param {Record<string,string|undefined>} env
 * @returns {Promise<string[]>} what was done, for the control page
 */
export async function amoSetup(env) {
  const done = [];
  let s = await readSchema(env);
  if (!s) {
    await api(env, 'POST', '/api/v4/leads/pipelines', [{
      name: PIPELINE, sort: 10, is_main: false, is_unsorted_on: false,
      _embedded: { statuses: STAGES.filter(x => !x.id).map((x, i) => ({ name: x.name, sort: (i + 1) * 10, color: x.color })) },
    }]);
    done.push('создана воронка «' + PIPELINE + '»');
    s = await readSchema(env);
  }
  if (!s) throw new Error('amo: воронка не появилась после создания');
  const missing = STAGES.filter(x => !x.id && !s.stages[x.key]);
  if (missing.length) {
    await api(env, 'POST', '/api/v4/leads/pipelines/' + s.pipelineId + '/statuses', missing.map(x => ({ name: x.name, sort: 10 * (STAGES.indexOf(x) + 1), color: x.color })));
    done.push('добавлены этапы: ' + missing.map(x => x.name).join(', '));
  }
  // The built-in won/lost stages get the funnel's names; amoCRM may refuse, which changes nothing else.
  for (const x of STAGES.filter(st => st.id && s.names[st.id] !== st.name)) {
    await api(env, 'PATCH', '/api/v4/leads/pipelines/' + s.pipelineId + '/statuses/' + x.id, { name: x.name }).then(() => done.push('этап ' + x.id + ' назван «' + x.name + '»')).catch(() => {});
  }
  const newFields = FIELDS.filter(f => !s.fields[f]);
  if (newFields.length) {
    await api(env, 'POST', '/api/v4/leads/custom_fields', newFields.map((name, i) => ({ name, type: 'text', sort: 500 + i })));
    done.push('добавлены поля сделки: ' + newFields.join(', '));
  }
  cache = { schema: null, at: 0 };
  await schema(env);
  if (!done.length) done.push('всё уже настроено');
  return done;
}

/** @param {string} source e.g. «utm_source=fb; utm_medium=cpc; ref=google.com» */
function utm(source) {
  /** @type {Record<string,string>} */
  const out = {};
  for (const part of String(source || '').split(';')) { const [k, ...v] = part.trim().split('='); if (k) out[k] = v.join('='); }
  return out;
}

/**
 * @typedef {{stage:'registered'|'attended'|'checkout'|'invoice'|'booked'|'paid'|'lost',force?:boolean,name?:string,phone?:string,email?:string,
 *   orderId?:string,code?:string,price?:number,fields?:Record<string,string>,source?:string,page?:string,lang?:string,note?:string,existingOnly?:boolean}} CrmEvent
 */

const rank = key => ['registered', 'attended', 'checkout', 'invoice', 'booked', 'paid'].indexOf(key);

/** @param {Record<string,string|undefined>} env @param {CrmEvent} ev */
async function findDeal(env, s, ev) {
  // A paid order is found by its number first: the bank's notice may carry another phone or email.
  if (ev.orderId) {
    const j = await api(env, 'GET', '/api/v4/leads?query=' + encodeURIComponent(ev.orderId) + '&filter[pipeline_id]=' + s.pipelineId);
    const lead = j?._embedded?.leads?.[0];
    if (lead) return { lead, contactId: null };
  }
  // The participant code links an order to the registration made in the same browser, whatever contacts were given.
  if (ev.code) {
    const j = await api(env, 'GET', '/api/v4/leads?query=' + encodeURIComponent(ev.code) + '&filter[pipeline_id]=' + s.pipelineId);
    const lead = j?._embedded?.leads?.[0];
    if (lead) return { lead, contactId: null };
  }
  const queries = [ev.phone && ev.phone.replace(/\D/g, '').slice(-9), ev.email].filter(Boolean);
  for (const q of queries) {
    const c = (await api(env, 'GET', '/api/v4/contacts?query=' + encodeURIComponent(String(q)) + '&with=leads'))?._embedded?.contacts?.[0];
    if (!c) continue;
    const ids = (c._embedded?.leads || []).map(l => l.id).slice(0, 40);
    if (!ids.length) return { lead: null, contactId: c.id };
    const j = await api(env, 'GET', '/api/v4/leads?' + ids.map(id => 'filter[id][]=' + id).join('&') + '&filter[pipeline_id]=' + s.pipelineId);
    const leads = (j?._embedded?.leads || []).sort((a, b) => b.updated_at - a.updated_at);
    return { lead: leads[0] || null, contactId: c.id };
  }
  return { lead: null, contactId: null };
}

/** @param {Record<string,string|undefined>} env @param {number} leadId @param {CrmEvent} ev */
async function addContactDetails(env, leadId, ev) {
  const cid = (await api(env, 'GET', '/api/v4/leads/' + leadId + '?with=contacts'))?._embedded?.contacts?.[0]?.id;
  if (!cid) return;
  const c = await api(env, 'GET', '/api/v4/contacts/' + cid);
  const update = [];
  for (const [code, value] of [['PHONE', ev.phone], ['EMAIL', ev.email]]) {
    if (!value) continue;
    const old = (c?.custom_fields_values || []).find(f => f.field_code === code)?.values || [];
    const norm = v => (code === 'PHONE' ? String(v).replace(/\D/g, '').slice(-9) : String(v).toLowerCase());
    if (old.some(v => norm(v.value) === norm(value))) continue;
    update.push({ field_code: code, values: [...old.map(v => ({ value: v.value, ...(v.enum_code ? { enum_code: v.enum_code } : {}) })), { value, enum_code: 'WORK' }] });
  }
  if (update.length) await api(env, 'PATCH', '/api/v4/contacts/' + cid, { custom_fields_values: update });
}

/**
 * Records a funnel event: finds the participant's deal (by order number, phone or email) or creates it,
 * moves it forward (never back, unless force), fills the fields and adds a note.
 * @param {Record<string,string|undefined>} env @param {CrmEvent} ev
 */
export async function amoEvent(env, ev) {
  const s = await schema(env);
  const u = utm(ev.source || '');
  /** @type {Record<string,string>} */
  const values = {
    ...(ev.orderId ? { 'Номер заказа': ev.orderId } : {}),
    ...(ev.code ? { 'Код участника': ev.code } : {}),
    ...(ev.lang ? { 'Язык': ev.lang } : {}),
    ...(u.utm_source ? { 'UTM source': u.utm_source } : {}),
    ...(u.utm_medium ? { 'UTM medium': u.utm_medium } : {}),
    ...(u.utm_campaign ? { 'UTM campaign': u.utm_campaign } : {}),
    ...(ev.source ? { 'Источник': ev.source } : {}),
    ...(ev.page ? { 'Страница': ev.page } : {}),
    ...(ev.fields || {}),
  };
  const custom = Object.entries(values).filter(([k, v]) => s.fields[k] && v).map(([k, v]) => ({ field_id: s.fields[k], values: [{ value: String(v).slice(0, 250) }] }));
  const target = s.stages[ev.stage];
  const { lead, contactId } = await findDeal(env, s, ev);
  let id;
  if (lead) {
    id = lead.id;
    const cur = Object.entries(s.stages).find(([, v]) => v === lead.status_id)?.[0] || 'registered';
    const forward = ev.force || cur === 'lost' ? ev.stage !== cur : ev.stage === 'lost' ? cur !== 'paid' : rank(ev.stage) > rank(cur);
    /** @type {Record<string,unknown>} */
    const patch = custom.length ? { custom_fields_values: custom } : {};
    if (forward && target) patch.status_id = target;
    if (ev.price) patch.price = ev.price;
    if (Object.keys(patch).length) await api(env, 'PATCH', '/api/v4/leads/' + id, patch);
  } else {
    if (ev.existingOnly) throw new Error('amo: сделка с заказом ' + (ev.orderId || '') + ' не найдена');
    // amoCRM rejects an empty custom_fields_values list, so it is left out for a contact without phone and email (Telegram).
    const details = [
      ...(ev.phone ? [{ field_code: 'PHONE', values: [{ value: ev.phone, enum_code: 'WORK' }] }] : []),
      ...(ev.email ? [{ field_code: 'EMAIL', values: [{ value: ev.email, enum_code: 'WORK' }] }] : []),
    ];
    const contact = contactId ? { id: contactId } : { first_name: ev.name || ev.phone || ev.email || 'Участник воркшопа', ...(details.length ? { custom_fields_values: details } : {}) };
    const created = await api(env, 'POST', '/api/v4/leads/complex', [{
      name: 'Воркшоп: ' + (ev.name || ev.phone || ev.email || 'участник'), pipeline_id: s.pipelineId, ...(target ? { status_id: target } : {}),
      ...(ev.price ? { price: ev.price } : {}), ...(custom.length ? { custom_fields_values: custom } : {}),
      _embedded: { contacts: [contact], tags: [{ name: 'воркшоп' }, ...(ev.lang ? [{ name: ev.lang }] : [])] },
    }]);
    id = created?.[0]?.id;
  }
  // A deal found by order number or participant code may belong to a contact without this phone or email
  // (e.g. registered by Telegram): they are added, so later messages and the CRM's WhatsApp reach the buyer.
  if (lead && (ev.phone || ev.email)) await addContactDetails(env, id, ev).catch(() => {});
  if (id && ev.note) await api(env, 'POST', '/api/v4/leads/' + id + '/notes', [{ note_type: 'common', params: { text: ev.note.slice(0, 4000) } }]).catch(() => {});
  return id;
}

/**
 * Funnel check for the owner's control page: every deal of the workshop pipeline with its stage history
 * (amoCRM events), number of notes, participant code and contact, plus duplicates (one contact or code
 * in several deals) and the registration-to-purchase conversion.
 * @param {Record<string,string|undefined>} env
 */
export async function funnelReport(env) {
  const s = await schema(env);
  const byId = Object.fromEntries(Object.entries(s.stages).map(([k, v]) => [v, STAGES.find(x => x.key === k)?.name || k]));
  const leads = [];
  for (let page = 1; page <= 10; page++) {
    const j = await api(env, 'GET', '/api/v4/leads?filter[pipeline_id]=' + s.pipelineId + '&with=contacts&limit=250&page=' + page);
    leads.push(...(j?._embedded?.leads || []));
    if (!j?._links?.next) break;
  }
  const ids = leads.map(l => l.id);
  /** @type {Record<number,{at:number,to:string}[]>} */
  const history = {};
  /** @type {Record<number,number>} */
  const notes = {};
  for (let i = 0; i < ids.length; i += 10) {
    const part = ids.slice(i, i + 10), q = part.map(id => 'filter[entity_id][]=' + id).join('&');
    for (let page = 1; page <= 5; page++) {
      const ev = await api(env, 'GET', '/api/v4/events?filter[entity]=lead&' + q + '&filter[type][]=lead_added&filter[type][]=lead_status_changed&limit=100&page=' + page).catch(() => null);
      for (const e of ev?._embedded?.events || []) {
        const st = e.value_after?.[0]?.lead_status?.id;
        (history[e.entity_id] ||= []).push({ at: e.created_at, to: st ? byId[st] || String(st) : 'создана' });
      }
      if (!ev?._links?.next) break;
    }
    const nt = await api(env, 'GET', '/api/v4/leads/notes?' + q + '&limit=250').catch(() => null);
    for (const n of nt?._embedded?.notes || []) notes[n.entity_id] = (notes[n.entity_id] || 0) + 1;
  }
  const field = (l, name) => (l.custom_fields_values || []).find(f => f.field_id === s.fields[name])?.values?.[0]?.value || '';
  const rows = leads.map(l => {
    const path = (history[l.id] || []).sort((a, b) => a.at - b.at).map(h => h.to);
    const filled = Object.fromEntries(FIELDS.map(f => [f, field(l, f)]).filter(([, v]) => v));
    const order = Boolean(filled['Номер заказа']);
    // Fields every deal of this kind must have: a registration, an order, a bank transfer.
    const need = [...(path.includes('Записался') || filled['Контакт для ссылки'] ? ['Контакт для ссылки', 'Язык'] : []), ...(order ? ['Тариф', 'Покупка или бронь', 'Способ оплаты', 'Статус оплаты'] : []), ...(filled['Способ оплаты'] === 'по счёту' ? ['Плательщик'] : [])];
    return { id: l.id, name: l.name, stage: byId[l.status_id] || String(l.status_id), path, notes: notes[l.id] || 0, code: field(l, 'Код участника'), order: field(l, 'Номер заказа'), contact: l._embedded?.contacts?.[0]?.id || 0, registered: Boolean(field(l, 'Контакт для ссылки')) || path.includes('Записался'), price: l.price || 0, filled, missing: need.filter(f => !filled[f]) };
  }).sort((a, b) => b.id - a.id);
  /** @type {Record<string,number[]>} */
  const groups = {};
  for (const r of rows) {
    if (r.contact) (groups['контакт ' + r.contact] ||= []).push(r.id);
    if (r.code) (groups['код ' + r.code] ||= []).push(r.id);
  }
  const duplicates = Object.entries(groups).filter(([, v]) => new Set(v).size > 1).map(([k, v]) => ({ key: k, deals: [...new Set(v)] }));
  const registered = rows.filter(r => r.registered), bought = registered.filter(r => r.stage === 'Оплачено' || r.stage === 'Бронь оплачена');
  /** @type {Record<string,number>} */
  const stages = {};
  for (const r of rows) stages[r.stage] = (stages[r.stage] || 0) + 1;
  return { rows, duplicates, stages, registered: registered.length, bought: bought.length };
}

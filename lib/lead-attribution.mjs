// Where an enquiry came from: the first and the last visit with a source (UTM tags, ad click ids, referrer, landing page).
// The browser keeps them for 90 days in its own storage (components/analytics.tsx) and sends them with every enquiry to
// /api/leads (on praxenai.com only after the visitor accepts cookies; «Decline» deletes them on both sites). The enquiry then goes
// to the team's Telegram, email and amoCRM, and a yclid also to Yandex Metrica (lib/metrika-offline.mjs).
// Shared by the browser (keys, checks), the Cloudflare route and the Docker server.

/** Keys of one visit, in the order they are kept. at — time of the visit (ms). */
export const TOUCH_KEYS = /** @type {const} */ (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'yclid', 'msclkid', 'ref', 'landing']);
/** Ad click ids read from the address. */
export const CLICK_KEYS = /** @type {const} */ (['gclid', 'fbclid', 'yclid', 'msclkid']);
export const TTL_DAYS = 90;

/** @typedef {Partial<Record<typeof TOUCH_KEYS[number],string>>&{at?:number}} Touch */
/** @typedef {'granted'|'denied'|'unset'} Consent */
/** @typedef {{first?:Touch,last?:Touch,fbc?:string,fbp?:string,consent?:Consent}} Attribution */

/** A UTM value that looks like an email or a phone number (an «@», or 7+ digits in a row) is personal data put in a link by mistake: dropped. */
export const utmOk = (/** @type {string} */ v) => !/@|\d{7}/.test(v);

const id = /^[\w.-]+$/;
/** Per key: longest value kept and the allowed form (anything else is dropped). */
const RULES = /** @type {Record<string,[number,RegExp|null]>} */ ({
  utm_source: [100, null], utm_medium: [100, null], utm_campaign: [100, null], utm_content: [100, null], utm_term: [100, null],
  gclid: [250, id], fbclid: [250, id], msclkid: [100, id], yclid: [30, /^\d+$/],
  ref: [120, /^[a-z0-9.-]+(:\d+)?$/i], landing: [200, /^\/\S*$/], fbc: [300, id], fbp: [100, id],
});

/** @param {unknown} v @param {string} key */
function value(v, key) {
  const [max, form] = RULES[key];
  if (typeof v !== 'string') return '';
  const s = v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
  return s && (!form || form.test(s)) && (!key.startsWith('utm_') || utmOk(s)) ? s : '';
}

/** @param {unknown} t @returns {Touch|undefined} */
function cleanTouch(t) {
  if (!t || typeof t !== 'object') return undefined;
  const src = /** @type {Record<string,unknown>} */ (t);
  /** @type {Touch} */
  const out = {};
  for (const k of TOUCH_KEYS) { const v = value(src[k], k); if (v) out[k] = v; }
  const at = Number(src.at);
  // A visit time from the future or older than the storage period is dropped, the rest is kept.
  if (Number.isFinite(at) && at > Date.now() - (TTL_DAYS + 1) * 864e5 && at < Date.now() + 864e5) out.at = Math.floor(at);
  return Object.keys(out).length ? out : undefined;
}

/**
 * Validates the attribution sent by the browser: only known keys, short values of the expected form.
 * @param {unknown} a @returns {Attribution|undefined}
 */
export function cleanAttribution(a) {
  if (!a || typeof a !== 'object') return undefined;
  const src = /** @type {Record<string,unknown>} */ (a);
  /** @type {Attribution} */
  const out = {};
  const first = cleanTouch(src.first), last = cleanTouch(src.last);
  if (first) out.first = first;
  if (last) out.last = last;
  if (src.consent === 'granted' || src.consent === 'denied' || src.consent === 'unset') out.consent = src.consent;
  // Meta's cookies are kept only from a visitor who accepted cookies (the browser checks this too).
  if (out.consent === 'granted') for (const k of /** @type {const} */ (['fbc', 'fbp'])) { const v = value(src[k], k); if (v) out[k] = v; }
  return Object.keys(out).length ? out : undefined;
}

const CLICK_NAMES = { gclid: 'Google Ads', fbclid: 'Meta', yclid: 'Яндекс Директ', msclkid: 'Microsoft Ads' };
const date = (/** @type {number} */ at) => new Date(at).toISOString().slice(0, 10).split('-').reverse().join('.');

/**
 * One visit in words for the team: «google / cpc / hotels-oct · объявление: banner-a · клик: Google Ads (gclid) · вход: /ru/industries/hotels · 03.11.2026».
 * @param {Touch} t
 */
export function touchText(t) {
  const utm = [t.utm_source, t.utm_medium, t.utm_campaign].filter(Boolean).join(' / ');
  const clicks = CLICK_KEYS.filter(k => t[k]).map(k => CLICK_NAMES[k] + ' (' + k + ')');
  return [
    utm || (t.ref ? 'переход с ' + t.ref : clicks.length ? 'реклама' : 'прямой заход'),
    ...(utm && t.ref ? ['с ' + t.ref] : []),
    ...(t.utm_content ? ['объявление: ' + t.utm_content] : []),
    ...(t.utm_term ? ['ключ: ' + t.utm_term] : []),
    ...(clicks.length ? ['клик: ' + clicks.join(', ')] : []),
    ...(t.landing ? ['вход: ' + t.landing] : []),
    ...(t.at ? [date(t.at)] : []),
  ].join(' · ');
}

const same = (/** @type {Touch|undefined} */ a, /** @type {Touch|undefined} */ b) => JSON.stringify(a || {}) === JSON.stringify(b || {});

/**
 * Lines for the lead message (Telegram, email, amoCRM note). Empty when the browser sent nothing.
 * @param {Attribution|undefined} a @returns {string[]}
 */
export function attributionLines(a) {
  if (!a) return [];
  const consent = a.consent ? ['Cookie: ' + CONSENT[a.consent]] : [];
  if (!a.first && !a.last) return consent;
  const last = a.last || a.first, first = a.first;
  if (!first || same(first, last)) return ['Источник: ' + touchText(/** @type {Touch} */ (last)), ...consent];
  return ['Первый заход: ' + touchText(first), 'Последний заход: ' + touchText(/** @type {Touch} */ (last)), ...consent];
}

/** The visitor's cookie choice when the enquiry was sent. */
export const CONSENT = { granted: 'приняты', denied: 'отклонены', unset: 'не выбрано' };

/**
 * Deal fields for service enquiries in amoCRM (text fields, created by «Настроить amoCRM» on the owner's page, lib/workshop-crm.mjs).
 * If the account already has a field with the name but of another type (a list «Источник»), the text field is called by the second name.
 */
export const AMO_FIELDS = ['Рынок', 'Язык', 'Страница', 'Источник', 'Первый источник', 'UTM source', 'UTM medium', 'UTM campaign', 'UTM content', 'UTM term', 'gclid', 'fbclid', 'fbc', 'fbp', 'yclid', 'msclkid', 'Реферер', 'Страница входа', 'Cookie'];
/** @param {string} name */
export const amoAltName = name => (name === 'Источник' ? 'Источник заявки' : name + ' (сайт)');

/**
 * Deal field values: UTM tags, referrer and landing page of the last visit; ad click ids of the last visit, or of the
 * first one when the last has none (each ad platform credits its own click); both visits in words.
 * @param {{attribution?:Attribution,market?:string,lang?:string,page?:string,source?:string}} l
 * @returns {Record<string,string>}
 */
export function amoValues(l) {
  const a = l.attribution || {};
  const last = a.last || a.first || {}, first = a.first;
  /** @type {Record<string,string|undefined>} */
  const v = {
    'Рынок': l.market, 'Язык': l.lang, 'Страница': l.page,
    'Источник': a.last || a.first ? touchText(last) : l.source,
    'Первый источник': first && !same(first, a.last) ? touchText(first) : '',
    'UTM source': last.utm_source, 'UTM medium': last.utm_medium, 'UTM campaign': last.utm_campaign, 'UTM content': last.utm_content, 'UTM term': last.utm_term,
    gclid: last.gclid || first?.gclid, fbclid: last.fbclid || first?.fbclid, yclid: last.yclid || first?.yclid, msclkid: last.msclkid || first?.msclkid,
    fbc: a.fbc, fbp: a.fbp, 'Реферер': last.ref, 'Страница входа': last.landing, Cookie: a.consent ? CONSENT[a.consent] : '',
  };
  return /** @type {Record<string,string>} */ (Object.fromEntries(Object.entries(v).filter(([, x]) => x)));
}

// Owner tools for the workshop funnel, used by the control page (/api/sales/admin) and the lead bot's webhook (/api/telegram):
// the state of every connection, and the «✅ Оплата пришла» button on bank-transfer orders in the team's Telegram chat.
import { flittReady } from './flitt.mjs';
import { amoCheck, amoEvent, amoReady, amoSetup } from './workshop-crm.mjs';

export { amoSetup };
const timeout = () => AbortSignal.timeout(8000);

/** @param {Record<string,string|undefined>} env @param {string} method @param {Record<string,unknown>} body */
async function tg(env, method, body) {
  const r = await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/' + method, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: timeout() });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw new Error('telegram ' + method + ': ' + (j.description || r.status));
  return j.result;
}

/** Secret Telegram sends with every webhook call, derived from SALES_ADMIN_KEY so no extra setting is needed. @param {Record<string,string|undefined>} env */
export async function webhookSecret(env) {
  const key = env.SALES_ADMIN_KEY || '';
  if (key.length < 16) return '';
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key + ':telegram-webhook'));
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('').slice(0, 48);
}

/** Points the lead bot's updates (button presses) at this site. @param {Record<string,string|undefined>} env @param {string} origin */
export async function connectTelegram(env, origin) {
  await tg(env, 'setWebhook', { url: origin + '/api/telegram', secret_token: await webhookSecret(env), allowed_updates: ['callback_query'], drop_pending_updates: true });
}

/**
 * State of every connection, for the control page.
 * @param {Record<string,string|undefined>} env @param {string} origin
 * @returns {Promise<{name:string,ok:boolean,text:string}[]>}
 */
export async function systemStatus(env, origin) {
  const out = [];
  const tgOk = Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
  out.push({ name: 'Telegram: заявки и заказы', ok: tgOk, text: tgOk ? 'подключён' : 'нет TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID' });
  let hook = false;
  if (tgOk) hook = await tg(env, 'getWebhookInfo', {}).then(i => i.url === origin + '/api/telegram').catch(() => false);
  out.push({ name: 'Кнопка «Оплата пришла»', ok: hook, text: hook ? 'работает' : 'не подключена — нажмите «Подключить кнопки в Telegram»' });
  let amo = { ok: false, text: 'нет AMO_DOMAIN / AMO_TOKEN' };
  if (amoReady(env)) {
    amo = await amoCheck(env).then(() => ({ ok: true, text: 'готова: воронка и поля на месте' })).catch(e => ({ ok: false, text: String(e?.message || e).slice(0, 200) }));
  }
  out.push({ name: 'amoCRM: воронка «Воркшоп»', ...amo });
  out.push({ name: 'Оплата картой (Flitt)', ok: flittReady(env), text: flittReady(env) ? 'подключена' : 'нет ключей — заказы приходят в Telegram, ссылку на оплату шлёте вручную' });
  const mail = Boolean(env.RESEND_API_KEY);
  out.push({ name: 'Письма (Resend)', ok: mail, text: mail ? 'ключ есть' : 'нет RESEND_API_KEY' });
  return out;
}

const STAMP = /\n\n(✅|↩️)[^\n]*$/;
const now = () => new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tbilisi', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

/**
 * Handles a press on «✅ Оплата пришла» / «↩️ Отменить отметку» under an order in the team chat:
 * marks the message, moves the deal in amoCRM and lets the button be undone.
 * @param {Record<string,string|undefined>} env @param {any} update
 */
export async function telegramUpdate(env, update) {
  const q = update?.callback_query;
  if (!q) return;
  const chat = q.message?.chat?.id, messageId = q.message?.message_id;
  if (String(chat) !== String(env.TELEGRAM_CHAT_ID)) { await tg(env, 'answerCallbackQuery', { callback_query_id: q.id, text: 'Нет доступа' }).catch(() => {}); return; }
  const [act, id] = String(q.data || '').split(':');
  if (!/^PX[A-Z0-9]{4,20}$/.test(id || '') || !['paid', 'undo'].includes(act)) return;
  const text = String(q.message?.text || '').replace(STAMP, '');
  const book = /Бронь спеццены/.test(text), when = now();
  let crm = '';
  if (amoReady(env)) {
    const ev = act === 'paid'
      ? { stage: book ? 'booked' : 'paid', fields: { 'Статус оплаты': book ? 'бронь оплачена по счёту' : 'оплачено по счёту' }, note: 'Оплата по счёту подтверждена в Telegram, ' + when }
      : { stage: 'invoice', force: true, fields: { 'Статус оплаты': 'счёт запрошен' }, note: 'Отметка об оплате снята в Telegram, ' + when };
    crm = await amoEvent(env, { orderId: id, existingOnly: true, ...ev }).then(() => ' · amoCRM обновлена').catch(e => ' · amoCRM: ' + String(e?.message || e).slice(0, 120));
  }
  const paid = act === 'paid';
  await tg(env, 'editMessageText', {
    chat_id: chat, message_id: messageId,
    text: text + (paid ? '\n\n✅ Оплата получена ' + when + crm : '\n\n↩️ Отметка снята ' + when + crm),
    reply_markup: { inline_keyboard: [[paid ? { text: '↩️ Отменить отметку', callback_data: 'undo:' + id } : { text: '✅ Оплата пришла', callback_data: 'paid:' + id }]] },
  }).catch(() => {});
  await tg(env, 'answerCallbackQuery', { callback_query_id: q.id, text: paid ? 'Отмечено: оплата получена' : 'Отметка снята' }).catch(() => {});
}

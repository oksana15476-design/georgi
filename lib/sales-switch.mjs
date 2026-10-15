// «Open sales» switch for the workshop: when open, the workshop landing sends everyone to the offer page, and the offer
// page is available; when closed, the offer page sends visitors back to the landing.
// The site has no database on Cloudflare, so the state lives in the team's Telegram chat with the lead bot
// (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID): sales are open while the chat's pinned message carries the #sales_open tag.
// The owner switches it with the buttons at /api/sales/admin?key=… (SALES_ADMIN_KEY) or by pinning / unpinning in Telegram.

export const SALES_TAG = '#sales_open';
const TTL = 10000;
/** Per-isolate cache, so each Worker instance asks Telegram at most once every 10 seconds. */
let cached = { state: /** @type {'open'|'closed'|'unknown'} */ ('unknown'), at: 0, pinnedId: 0 };

/** @param {Record<string,string|undefined>} env @param {string} method @param {Record<string,unknown>} body */
async function tg(env, method, body) {
  const r = await fetch('https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/' + method, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000),
  });
  const j = await r.json().catch(() => ({}));
  if (!j.ok) throw new Error('telegram ' + method + ': ' + (j.description || r.status));
  return j.result;
}

/**
 * Current state. «unknown» when Telegram is not configured or does not answer: the pages then keep their normal behaviour.
 * @param {Record<string,string|undefined>} env @param {boolean} [fresh]
 * @returns {Promise<'open'|'closed'|'unknown'>}
 */
export async function getSales(env, fresh = false) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return 'unknown';
  if (!fresh && Date.now() - cached.at < TTL) return cached.state;
  try {
    const chat = await tg(env, 'getChat', { chat_id: env.TELEGRAM_CHAT_ID });
    const pin = chat?.pinned_message;
    const open = Boolean(pin && String(pin.text || '').includes(SALES_TAG));
    cached = { state: open ? 'open' : 'closed', at: Date.now(), pinnedId: open ? pin.message_id : 0 };
  } catch {
    cached = { state: 'unknown', at: Date.now(), pinnedId: 0 };
  }
  return cached.state;
}

/**
 * Opens or closes sales by pinning or unpinning a tagged message in the team chat.
 * @param {Record<string,string|undefined>} env @param {boolean} open
 */
export async function setSales(env, open) {
  if (open) {
    const msg = await tg(env, 'sendMessage', {
      chat_id: env.TELEGRAM_CHAT_ID,
      text: '🟢 Продажи открыты ' + SALES_TAG + '\nЛендинг воркшопа ведёт всех на страницу тарифов. Чтобы закрыть продажи, открепите это сообщение или нажмите «Закрыть продажи» на странице управления.',
    });
    await tg(env, 'pinChatMessage', { chat_id: env.TELEGRAM_CHAT_ID, message_id: msg.message_id, disable_notification: true });
  } else {
    await getSales(env, true);
    if (cached.pinnedId) await tg(env, 'unpinChatMessage', { chat_id: env.TELEGRAM_CHAT_ID, message_id: cached.pinnedId });
    await tg(env, 'sendMessage', { chat_id: env.TELEGRAM_CHAT_ID, text: '🔴 Продажи закрыты: страница тарифов снова ведёт на лендинг воркшопа.', disable_notification: true }).catch(() => {});
  }
  cached.at = 0;
  return getSales(env, true);
}

/** Constant-time comparison for the admin key. @param {string} a @param {string} b */
export function sameKey(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

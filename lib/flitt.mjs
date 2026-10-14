// Online payment through Flitt (TBC Group; settles to the company's TBC account). Docs: https://docs.flitt.com/
// TBC Checkout itself is not used: it caps one payment at 1 500 ₾, below the 3 900 and 6 900 ₾ tariffs.
// Keys come from the environment (FLITT_MERCHANT_ID, FLITT_SECRET_KEY) and are never committed. Without them the offer
// page falls back to sending the order to the team, who send a payment link by hand.
// Works on Cloudflare Workers and in Node 18+: only fetch and WebCrypto.

const API = 'https://pay.flitt.com/api/checkout/url';

/** @param {{FLITT_MERCHANT_ID?:string,FLITT_SECRET_KEY?:string}} env */
export const flittReady = env => Boolean(env.FLITT_MERCHANT_ID && env.FLITT_SECRET_KEY);

async function sha1(text) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Flitt signature: SHA-1 of the secret and every non-empty parameter value, sorted by parameter name, joined with «|».
 * @param {string} secret @param {Record<string,unknown>} params
 */
export async function flittSignature(secret, params) {
  const values = Object.keys(params)
    .filter(k => k !== 'signature' && k !== 'response_signature_string')
    .sort()
    .map(k => params[k])
    .filter(v => v !== undefined && v !== null && v !== '')
    .map(v => String(v));
  return sha1([secret, ...values].join('|'));
}

/**
 * Creates a Flitt order and returns the hosted checkout URL. The amount is in lari; Flitt takes minor units (tetri).
 * @param {{FLITT_MERCHANT_ID?:string,FLITT_SECRET_KEY?:string}} env
 * @param {{orderId:string,amount:number,desc:string,email:string,lang:string,data:Record<string,string>,callbackUrl:string,returnUrl:string}} o
 * @returns {Promise<{url?:string,error?:string}>}
 */
export async function flittCreate(env, o) {
  /** @type {Record<string,string|number>} */
  const request = {
    merchant_id: Number(env.FLITT_MERCHANT_ID), order_id: o.orderId, order_desc: o.desc.slice(0, 1000), currency: 'GEL',
    amount: Math.round(o.amount * 100), server_callback_url: o.callbackUrl, response_url: o.returnUrl,
    sender_email: o.email, lang: ['ru', 'en', 'ka'].includes(o.lang) ? o.lang : 'en', lifetime: 7200,
    merchant_data: JSON.stringify(o.data).slice(0, 2000),
  };
  request.signature = await flittSignature(String(env.FLITT_SECRET_KEY), request);
  try {
    const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ request }), signal: AbortSignal.timeout(15000) });
    const res = (await r.json())?.response;
    if (res?.response_status === 'success' && res.checkout_url) return { url: res.checkout_url };
    return { error: 'flitt ' + (res?.error_code || r.status) + (res?.error_message ? ': ' + res.error_message : '') };
  } catch (e) {
    return { error: 'flitt ' + String(e?.message || e) };
  }
}

/**
 * Reads a Flitt callback or return body (JSON or form-encoded) and checks its signature.
 * @param {{FLITT_SECRET_KEY?:string}} env @param {string} raw @param {string} type content type
 * @returns {Promise<Record<string,string>|null>} the verified fields, or null when the signature does not match
 */
export async function flittVerify(env, raw, type) {
  if (!env.FLITT_SECRET_KEY || !raw) return null;
  /** @type {Record<string,string>} */
  let body = {};
  try {
    if (type.includes('json')) { const j = JSON.parse(raw); body = j?.response || j; }
    else body = Object.fromEntries(new URLSearchParams(raw));
  } catch { return null; }
  if (!body || typeof body.signature !== 'string') return null;
  const expected = await flittSignature(String(env.FLITT_SECRET_KEY), body);
  return expected === body.signature.toLowerCase() ? body : null;
}

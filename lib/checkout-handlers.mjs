// Checkout endpoints of the workshop offer page, shared by the Cloudflare routes (app/api/checkout/**) and the Docker
// server (server/index.mjs):
//   POST /api/checkout           creates the order; with Flitt keys returns the bank's payment page, otherwise sends the order to the team;
//                                a bank-transfer order goes to the team and the buyer gets the requisites
//   POST /api/checkout/callback  Flitt's server notice; a verified «approved» payment is reported to the team as paid
//   GET|POST /api/checkout/return  where Flitt sends the buyer back; redirects to the offer page with the result
// The buyer's return is never treated as proof of payment: only the signed server notice is.
import { deliverLead } from './lead-delivery.mjs';
import { flittCreate, flittReady, flittVerify } from './flitt.mjs';
import { orderDesc, orderLead, parseOrder } from './webinar-offer-order.mjs';

const OFFER_PAGES = ['/webinar/offer', '/ru/webinar/offer', '/ka/webinar/offer'];
/** Only the offer pages themselves are valid return targets. @param {string} p */
const offerPage = p => { const path = String(p || '').replace(/^https?:\/\/[^/]+/, '').split('?')[0]; return OFFER_PAGES.includes(path) ? path : '/ru/webinar/offer'; };

/**
 * @param {string} raw @param {string} origin e.g. https://praxenai.ge @param {Record<string,string|undefined>} env @param {number} now
 * @returns {Promise<{status:number,body:Record<string,unknown>}>}
 */
export async function createCheckout(raw, origin, env, now) {
  const { order, error } = parseOrder(raw, now);
  if (!order) return { status: 400, body: { error } };
  if (order.page.startsWith('/')) order.page = origin + order.page;
  // Bank transfer: the buyer sees the requisites at once, the team gets the order and issues the invoice.
  if (order.pay === 'invoice') {
    const sent = await deliverLead(orderLead(order, 'invoice'), env);
    if (sent.status !== 'ok') return { status: sent.status === 'unavailable' ? 503 : 502, body: { error: 'delivery' } };
    return { status: 200, body: { ok: true, amount: order.amount, payment: 'invoice', order: order.id, ...(sent.errors.length ? { warn: sent.errors } : {}) } };
  }
  if (!flittReady(env)) {
    const sent = await deliverLead(orderLead(order, 'manual'), env);
    if (sent.status !== 'ok') return { status: sent.status === 'unavailable' ? 503 : 502, body: { error: 'delivery' } };
    return { status: 200, body: { ok: true, amount: order.amount, payment: 'manual', order: order.id, ...(sent.errors.length ? { warn: sent.errors } : {}) } };
  }
  const data = { t: order.tariff, m: order.mode, pr: String(order.price), n: order.name, ph: order.phone, l: order.lang, p: offerPage(order.page), b: order.bonus ? '1' : '', c: order.code || '' };
  const { url, error: payError } = await flittCreate(env, {
    orderId: order.id, amount: order.amount, desc: orderDesc(order), email: order.email, lang: order.lang, data,
    callbackUrl: origin + '/api/checkout/callback', returnUrl: origin + '/api/checkout/return',
  });
  if (!url) {
    // The bank page could not be created: the team still gets the order and sends a link by hand.
    console.error('checkout', payError);
    const sent = await deliverLead(orderLead(order, 'manual'), env);
    return sent.status === 'ok' ? { status: 200, body: { ok: true, amount: order.amount, payment: 'manual' } } : { status: 502, body: { error: 'payment' } };
  }
  // The team sees started payments too, so a buyer who stops on the bank page can be helped.
  const started = await deliverLead(orderLead(order, 'pending'), env).catch(() => null);
  return { status: 200, body: { ok: true, amount: order.amount, payment: 'redirect', url, order: order.id, ...(started?.errors.length ? { warn: started.errors } : {}) } };
}

/** @param {Record<string,string>} f verified Flitt fields */
function orderFrom(f) {
  let d = {};
  try { d = JSON.parse(f.merchant_data || '{}'); } catch { /* keep empty */ }
  const amount = Math.round(Number(f.actual_amount || f.amount || 0)) / 100;
  return { id: f.order_id || '', code: d.c || '', tariff: d.t || '', mode: d.m === 'book' ? 'book' : 'buy', pay: 'card', payer: '', payerId: '', amount, price: Number(d.pr) || amount, name: d.n || '', email: f.sender_email || '', phone: d.ph || '', lang: d.l || 'ru', page: d.p || '', source: 'Flitt', bonus: d.b === '1' };
}

/**
 * @param {string} raw @param {string} type @param {Record<string,string|undefined>} env
 * @returns {Promise<{status:number,text:string}>}
 */
export async function checkoutCallback(raw, type, env) {
  const f = await flittVerify(env, raw, type);
  if (!f) return { status: 400, text: 'invalid signature' };
  // approved → paid; declined or expired → the team and the CRM see the refusal; reversed → refund.
  const stage = { approved: 'paid', declined: 'failed', expired: 'failed', reversed: 'refunded' }[f.order_status];
  if (stage) {
    const result = await deliverLead(orderLead(orderFrom(f), stage, f.order_status), env);
    // A failed notice makes Flitt retry, so the team is not left without the payment.
    if (result.status !== 'ok') return { status: 502, text: 'delivery' };
  }
  return { status: 200, text: 'OK' };
}

/**
 * @param {string} raw body or query string @param {string} type @param {Record<string,string|undefined>} env
 * @returns {Promise<string>} the address to redirect the buyer to
 */
export async function checkoutReturn(raw, type, env) {
  const f = await flittVerify(env, raw, type);
  if (!f) return '/ru/webinar/offer?payment=unknown';
  const o = orderFrom(f);
  const q = new URLSearchParams(f.order_status === 'approved' ? { payment: 'success', order: o.id, tariff: o.tariff, mode: o.mode, amount: String(o.amount) } : { payment: f.order_status === 'processing' || f.order_status === 'created' ? 'pending' : 'fail', tariff: o.tariff, mode: o.mode });
  return offerPage(o.page) + '?' + q.toString();
}

// Offer page after the workshop (/ru/webinar/offer, /webinar/offer): tariffs, deadlines and the server-side order check.
// Shared by the page (lib/webinar-offer.ts), the Cloudflare route (app/api/checkout/route.ts) and the Docker server.
// The amount is always computed here from the tariff, the mode and the current time; the client amount is ignored.
// Payment goes through Flitt (lib/flitt.mjs); without its keys the order goes to the team, who send a payment link by hand.
// A buyer can also choose a bank transfer by the seller's requisites (pay: 'invoice'): the team issues the invoice by hand.
// Prices, the 500 ₾ deposit, the 25 base hours and the bonus session await the owner's confirmation (design handoff, 14 October 2026).

/** Regular site prices are in lib/pricing.ts: training 1 900 ₾, implementation 3 200 ₾, development 6 700 ₾; the bundles add training. */
export const TARIFFS = [
  { key: 'training', price: 1500, old: 1900 },
  { key: 'training_impl', price: 3900, old: 5100, featured: true },
  { key: 'training_dev', price: 6900, old: 8600, from: true, baseHours: 25 },
];
export const DEPOSIT = 500;
export const HOLD_DAYS = 14;

/** One workshop (12 November, 19:00): special prices end two days after it, the fast-payment bonus one day after. */
export const OFFER_END = '2026-11-14T19:45:00+04:00';
export const BONUS_END = '2026-11-13T19:45:00+04:00';

/** @param {number} now */
export const offerActive = now => now < Date.parse(OFFER_END);
/** @param {number} now */
export const bonusActive = now => now < Date.parse(BONUS_END);

/**
 * Current price of a tariff in lari: the special price until the deadline, then the regular one.
 * @param {typeof TARIFFS[number]} t @param {number} now
 */
export const tariffPrice = (t, now) => (offerActive(now) ? t.price : t.old);

export const NAMES = { training: 'Обучение команды', training_impl: 'Обучение + внедрение', training_dev: 'Обучение + разработка' };

/** @typedef {{id:string,tariff:string,mode:'buy'|'book',pay:'card'|'invoice',payer:string,payerId:string,amount:number,price:number,name:string,email:string,phone:string,lang:string,page:string,source:string,bonus:boolean}} Order */

/**
 * Validates an order body. The amount comes from the tariff, the mode and the current time, never from the client.
 * @param {string} raw @param {number} now
 * @returns {{order?:Order,error?:string}}
 */
export function parseOrder(raw, now) {
  let b;
  try { b = JSON.parse(raw); } catch { return { error: 'invalid' }; }
  if (!b || typeof b !== 'object' || b.website) return { error: 'invalid' };
  const str = (k, max) => (typeof b[k] === 'string' ? b[k].trim().slice(0, max) : '');
  const t = TARIFFS.find(x => x.key === b.tariff);
  const mode = b.mode === 'book' ? 'book' : b.mode === 'buy' ? 'buy' : '';
  const name = str('name', 100), email = str('email', 160), phone = str('phone', 40);
  if (!t || !mode) return { error: 'invalid' };
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || phone.replace(/\D/g, '').length < 7) return { error: 'required' };
  // Bank transfer: who pays (a company or a person) is needed for the invoice; the company's code is optional.
  const pay = b.pay === 'invoice' ? 'invoice' : 'card', payer = pay === 'invoice' ? str('payer', 160) : '', payerId = pay === 'invoice' ? str('payerId', 40) : '';
  if (pay === 'invoice' && !payer) return { error: 'required' };
  const price = tariffPrice(t, now);
  const lang = ['ru', 'en', 'ka'].includes(b.lang) ? b.lang : 'ru';
  const id = 'PX' + now.toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
  return { order: { id, tariff: t.key, mode, pay, payer, payerId, amount: mode === 'book' ? DEPOSIT : price, price, name, email, phone, lang, page: str('page', 220), source: str('source', 300), bonus: bonusActive(now) } };
}

/** Short description for the bank page and the receipt. @param {Order} o */
export const orderDesc = o => 'Praxen AI — ' + (o.mode === 'book' ? 'бронь: ' : '') + NAMES[o.tariff] + ' (' + o.id + ')';

/**
 * Turns an order into a lead for lib/lead-delivery.mjs, so it reaches the team's Telegram, email or CRM.
 * @param {Order} o @param {'pending'|'manual'|'invoice'|'paid'} stage
 * @returns {import('./lead-delivery.mjs').Lead}
 */
export function orderLead(o, stage) {
  const head = { pending: 'Начата оплата (ждём подтверждения банка)', manual: 'Заказ без онлайн-оплаты: отправьте клиенту ссылку на оплату или счёт', invoice: 'Оплата по реквизитам: выставьте счёт на email клиента и ждите перевод', paid: 'ОПЛАЧЕНО' }[stage];
  const t = TARIFFS.find(x => x.key === o.tariff);
  const lines = [
    head + ' · заказ ' + o.id,
    (o.mode === 'book' ? 'Бронь спеццены' : 'Покупка') + ': ' + NAMES[o.tariff] + (t?.from ? ' (от)' : ''),
    'Сумма: ' + o.amount + ' ₾' + (o.mode === 'book' ? ' (бронь; цена тарифа ' + o.price + ' ₾ на ' + HOLD_DAYS + ' дней)' : ''),
    ...(o.bonus ? ['Бонус 24 часа: личная сессия'] : []),
    ...(o.pay === 'invoice' ? ['Плательщик: ' + o.payer + (o.payerId ? ', код ' + o.payerId : ''), 'Назначение платежа: заказ ' + o.id] : []),
    'Email для чека: ' + o.email,
  ];
  const crmStage = stage === 'paid' ? (o.mode === 'book' ? 'booked' : 'paid') : stage === 'invoice' ? 'invoice' : 'checkout';
  const payStatus = { pending: 'начата оплата картой', manual: 'ждёт ссылку на оплату', invoice: 'счёт запрошен', paid: o.mode === 'book' ? 'бронь оплачена' : 'оплачено' }[stage];
  return {
    name: o.name, contact: 'phone: ' + o.phone, method: 'phone', value: o.phone, message: lines.join('\n'), tasks: [],
    // Bank transfers are confirmed by the team: the button in Telegram marks the order paid (app/api/telegram).
    ...(stage === 'invoice' ? { buttons: [[{ text: '✅ Оплата пришла', data: 'paid:' + o.id }]] } : {}),
    crm: {
      stage: crmStage, phone: o.phone, email: o.email, orderId: o.id, price: o.amount,
      fields: { 'Тариф': NAMES[o.tariff] || o.tariff, 'Покупка или бронь': o.mode === 'book' ? 'бронь ' + o.amount + ' ₾ (цена ' + o.price + ' ₾)' : 'покупка', 'Способ оплаты': o.pay === 'invoice' ? 'по счёту' : 'карта', 'Статус оплаты': payStatus, ...(o.payer ? { 'Плательщик': o.payer } : {}), ...(o.payerId ? { 'Код плательщика': o.payerId } : {}) },
    },
    context: (stage === 'paid' ? 'Оплата' : 'Заказ') + ' после воркшопа: ' + NAMES[o.tariff] + ', ' + o.amount + ' ₾', lang: o.lang, page: o.page, source: o.source,
  };
}

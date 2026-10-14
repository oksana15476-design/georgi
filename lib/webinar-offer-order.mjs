// Offer page after the workshop (/ru/webinar/offer, /webinar/offer): tariffs, deadlines and the server-side order check.
// Shared by the page (lib/webinar-offer.ts), the Cloudflare route (app/api/checkout/route.ts) and the Docker server.
// The amount is always computed here from the tariff, the mode and the current time; the client amount is ignored.
// Online payment is not connected yet: an order goes to the team as a lead and the team sends a payment link or an invoice.
// Prices, the 500 ₾ deposit, the 25 base hours and the bonus session await the owner's confirmation (design handoff, 14 October 2026).

/** Regular site prices are in lib/pricing.ts: training 1 900 ₾, implementation 3 200 ₾, development 6 700 ₾; the bundles add training. */
export const TARIFFS = [
  { key: 'training', price: 1500, old: 1900 },
  { key: 'training_impl', price: 3900, old: 5100, featured: true },
  { key: 'training_dev', price: 6900, old: 8600, from: true, baseHours: 25 },
];
export const DEPOSIT = 500;
export const HOLD_DAYS = 14;
export const METHODS = ['card', 'tbc', 'ipay'];

/** Each workshop session has its own deadlines: special prices end two days after it, the fast-payment bonus one day after. */
export const OFFER_EVENTS = {
  ru: { offerEnd: '2026-11-14T19:45:00+04:00', bonusEnd: '2026-11-13T19:45:00+04:00' },
  en: { offerEnd: '2026-11-19T19:45:00+04:00', bonusEnd: '2026-11-18T19:45:00+04:00' },
};

/** @param {'ru'|'en'} ev @param {number} now */
export const offerActive = (ev, now) => now < Date.parse(OFFER_EVENTS[ev].offerEnd);
/** @param {'ru'|'en'} ev @param {number} now */
export const bonusActive = (ev, now) => now < Date.parse(OFFER_EVENTS[ev].bonusEnd);

/**
 * Current price of a tariff in lari: the special price until the deadline, then the regular one.
 * @param {typeof TARIFFS[number]} t @param {'ru'|'en'} ev @param {number} now
 */
export const tariffPrice = (t, ev, now) => (offerActive(ev, now) ? t.price : t.old);

const NAMES = { training: 'Обучение команды', training_impl: 'Обучение + внедрение', training_dev: 'Обучение + разработка' };
const METHOD_NAMES = { card: 'банковская карта', tbc: 'TBC Pay', ipay: 'iPay (Bank of Georgia)' };

/**
 * Validates an order body and turns it into a lead for lib/lead-delivery.mjs.
 * @param {string} raw @param {number} now
 * @returns {{lead?:import('./lead-delivery.mjs').Lead,amount?:number,error?:string}}
 */
export function parseOrder(raw, now) {
  let b;
  try { b = JSON.parse(raw); } catch { return { error: 'invalid' }; }
  if (!b || typeof b !== 'object' || b.website) return { error: 'invalid' };
  const str = (k, max) => (typeof b[k] === 'string' ? b[k].trim().slice(0, max) : '');
  const t = TARIFFS.find(x => x.key === b.tariff);
  const mode = b.mode === 'book' ? 'book' : b.mode === 'buy' ? 'buy' : '';
  const ev = b.event === 'en' ? 'en' : 'ru';
  const method = METHODS.includes(b.method) ? b.method : '';
  const name = str('name', 100), email = str('email', 160), phone = str('phone', 40);
  if (!t || !mode || !method) return { error: 'invalid' };
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || phone.replace(/\D/g, '').length < 7) return { error: 'required' };
  const price = tariffPrice(t, ev, now);
  const amount = mode === 'book' ? DEPOSIT : price;
  const lines = [
    (mode === 'book' ? 'Бронь спеццены' : 'Покупка') + ': ' + NAMES[t.key] + (t.from ? ' (от)' : ''),
    'К оплате: ' + amount + ' ₾' + (mode === 'book' ? ' (бронь; цена тарифа ' + price + ' ₾ на ' + HOLD_DAYS + ' дней)' : ''),
    'Спеццена: ' + (offerActive(ev, now) ? 'действует' : 'закончилась') + (bonusActive(ev, now) ? ' · бонус 24 часа: личная сессия' : ''),
    'Способ оплаты: ' + METHOD_NAMES[method],
    'Email для чека: ' + email,
    'Онлайн-оплата ещё не подключена: отправьте клиенту ссылку на оплату или счёт.',
  ];
  return {
    amount,
    lead: {
      name, contact: 'phone: ' + phone, method: 'phone', value: phone, message: lines.join('\n'), tasks: [],
      context: 'Заказ после воркшопа: ' + NAMES[t.key] + ', ' + amount + ' ₾', lang: str('lang', 5), page: str('page', 220), source: str('source', 300),
    },
  };
}

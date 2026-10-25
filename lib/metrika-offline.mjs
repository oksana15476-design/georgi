// Offline conversions for Yandex Direct: a lead whose visit came from a Direct click (yclid in the attribution, see
// components/analytics.tsx) is reported to Metrica from the server, so Direct counts every registration, including
// visitors whose browser blocked Metrica. Needs the Cloudflare secret YM_OFFLINE_TOKEN (Yandex OAuth token with the metrika:offline_data permission).
// Goals «workshop_crm» and «lead_crm» in counter 113476399 are not created at the moment (owner, 25 October); without them Metrica ignores the upload.
const COUNTER = '113476399';

/** @param {string} source e.g. «utm_source=yandex; …; yclid=1234567890» */
export const yclidOf = source => /(?:^|;\s*)yclid=(\d{1,30})(?:;|$)/.exec(String(source || ''))?.[1] || '';

/**
 * @param {Record<string,string|undefined>} env @param {string} source @param {'workshop_crm'|'lead_crm'} target
 * @returns {Promise<boolean>} true when a conversion was sent
 */
export async function reportOffline(env, source, target) {
  const yclid = yclidOf(source);
  if (!yclid || !env.YM_OFFLINE_TOKEN) return false;
  const csv = 'Yclid,Target,DateTime\n' + yclid + ',' + target + ',' + Math.floor(Date.now() / 1000) + '\n';
  const form = new FormData();
  form.append('file', new Blob([csv], { type: 'text/csv' }), 'conversions.csv');
  const r = await fetch('https://api-metrika.yandex.net/management/v1/counter/' + (env.YM_COUNTER_ID || COUNTER) + '/offline_conversions/upload?client_id_type=YCLID', {
    method: 'POST', headers: { Authorization: 'OAuth ' + env.YM_OFFLINE_TOKEN }, body: form, signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error('metrika ' + r.status);
  return true;
}

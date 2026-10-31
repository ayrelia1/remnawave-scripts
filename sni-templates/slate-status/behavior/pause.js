'use strict';

const address = document.querySelector('[data-address]');
const endpoint = 'https://api.ipify.org?format=json';
if (endpoint) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  fetch(endpoint, {signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'})
    .then(response => { if (!response.ok) throw new Error('unavailable'); return response.json(); })
    .then(data => { address.textContent = typeof data.ip === 'string' && /^[0-9a-fA-F:.]{3,45}$/.test(data.ip) ? data.ip : 'Не определён'; })
    .catch(() => { address.textContent = 'Не определён'; })
    .finally(() => clearTimeout(timeout));
} else { address.textContent = 'Не определён'; }

document.querySelector('#pause-retry').addEventListener('click', () => window.location.reload());

// A local reference for this page load; it is not an authentication token.
function referenceBytes(count) {
  const bytes = new Uint8Array(count);
  if (globalThis.crypto && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let i=0;i<count;i++) bytes[i]=Math.floor(Math.random()*256);
  return [...bytes].map(value=>value.toString(16).padStart(2,'0')).join('').toUpperCase();
}
const reference = 'RQ-' + referenceBytes(12);
const requestId = document.querySelector('[data-request-id]');
requestId.textContent = reference;
const copy = document.querySelector('[data-copy-reference]');
copy.addEventListener('click', async () => {
  const message = document.querySelector('[data-copy-result]');
  try {
    await navigator.clipboard.writeText(reference);
    message.textContent = 'Код обращения скопирован.';
  } catch {
    message.textContent = 'Выделите код обращения и скопируйте его вручную.';
    const range = document.createRange(); range.selectNodeContents(requestId);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
});
// The original status pages retry after five minutes. Keep that behavior.
const deadline = Date.now() + 300000;
const countdown = document.querySelector('[data-countdown]');
const ticker = setInterval(() => {
  const seconds = Math.max(0, Math.ceil((deadline - Date.now())/1000));
  countdown.textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
  if (!seconds) { clearInterval(ticker); window.location.reload(); }
},1000);

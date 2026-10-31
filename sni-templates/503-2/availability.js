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

document.querySelector('#still-time').textContent = `Открыто в ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}`;
document.querySelector('#still-refresh').addEventListener('click', () => window.location.reload());

'use strict';

const portions = document.querySelector('#servings');
portions.addEventListener('input', () => {
  const n = Number(portions.value), valid = Number.isInteger(n) && n >= 1 && n <= 12;
  portions.setAttribute('aria-invalid', String(!valid));
  document.querySelector('#portion-error').textContent = valid ? '' : 'Введите целое число от 1 до 12. Показаны последние верные пропорции.';
  if (valid) document.querySelectorAll('[data-grams]').forEach(out => { out.textContent = String(Math.round(Number(out.dataset.grams) * n / 2 * 10) / 10); });
});

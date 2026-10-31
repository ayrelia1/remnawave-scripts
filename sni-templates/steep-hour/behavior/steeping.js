'use strict';

const kind = document.querySelector('#tea-kind');
const clock = document.querySelector('#tea-clock');
const start = document.querySelector('#tea-start');
const state = document.querySelector('#tea-state');
let remaining = Number(kind.value), deadline = 0, running = false;
function display() { clock.textContent = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`; }
function stop() { running = false; start.textContent = 'Начать'; kind.disabled = false; }
kind.addEventListener('change', () => {
  stop(); remaining = Number(kind.value); display(); state.textContent = 'Таймер готов.';
  document.querySelector('#tea-water').textContent = `Вода: ${{180:'75–85 °C',240:'95–100 °C',300:'85–95 °C'}[kind.value]}`;
});
start.addEventListener('click', () => {
  if (running) { remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); stop(); start.textContent = 'Продолжить'; state.textContent = 'Таймер на паузе.'; display(); return; }
  if (!remaining) remaining = Number(kind.value);
  deadline = Date.now() + remaining * 1000; running = true; kind.disabled = true;
  start.textContent = 'Пауза'; state.textContent = 'Чай заваривается.'; display();
});
document.querySelector('#tea-reset').addEventListener('click', () => { stop(); remaining = Number(kind.value); display(); state.textContent = 'Таймер готов.'; });
setInterval(() => { if (!running) return; remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000)); display(); if (!remaining) { stop(); state.textContent = 'Чай готов. Приятного чаепития!'; } }, 250);

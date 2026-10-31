'use strict';

const goal = document.querySelector('#week-goal'), feedback = document.querySelector('#week-feedback');
const buttons = [...document.querySelectorAll('[data-day]')];
const monday = new Date(); monday.setHours(12,0,0,0); monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
const week = `${monday.getFullYear()}-${monday.getMonth()+1}-${monday.getDate()}`;
let data = {week,goal:'',days:Array(7).fill(false)};
try { const saved = JSON.parse(localStorage.getItem('seven-week') || 'null'); if (saved && typeof saved.goal === 'string') { data.goal = saved.goal.slice(0,120); if (saved.week === week && Array.isArray(saved.days) && saved.days.length === 7) data.days = saved.days.map(x => x === true); } } catch { feedback.textContent = 'Хранилище недоступно. Отметки сохранятся до закрытия страницы.'; }
goal.value = data.goal;
document.querySelector('#week-label').textContent = `Неделя с ${monday.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}`;
function render() { buttons.forEach((b,i) => { b.setAttribute('aria-pressed',String(data.days[i])); b.querySelector('b').textContent = data.days[i] ? '✓' : '·'; }); document.querySelector('#week-total').textContent = `${data.days.filter(Boolean).length} из 7`; }
function save() { try { localStorage.setItem('seven-week',JSON.stringify(data)); feedback.textContent = 'Сохранено в этом браузере.'; } catch { feedback.textContent = 'Не удалось сохранить. Отметки доступны до закрытия страницы.'; } }
buttons.forEach((b,i) => b.addEventListener('click', () => { data.days[i] = !data.days[i]; render(); save(); }));
goal.addEventListener('change', () => { data.goal = goal.value; save(); }); render();

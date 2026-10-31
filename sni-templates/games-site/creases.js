'use strict';

const steps = [
 ['Найдите середину','Сложите прямоугольный лист пополам по короткой стороне. Разверните, затем сложите пополам по длинной стороне. Оставьте лист сложенным, сгибом вверх.'],
 ['Сведите углы','Загните верхние углы к центральной линии. Получится треугольная вершина и две свободные полоски бумаги внизу.'],
 ['Поднимите борта','Поднимите нижнюю полоску вверх с каждой стороны. Выступающие уголки подогните за края треугольника. Получится бумажная шляпа.'],
 ['Сложите ромб','Раскройте шляпу снизу и сведите боковые углы — получится ромб. Нижний угол каждой стороны поднимите к верхнему.'],
 ['Отправляйтесь в плавание','Раскройте новый треугольник снизу в ромб. Потяните верхние уголки в стороны и осторожно расправьте дно. Кораблик готов.']
];
let step = 0;
const prev = document.querySelector('#fold-prev'), next = document.querySelector('#fold-next');
function render() {
  document.querySelector('#fold-heading').textContent = steps[step][0];
  document.querySelector('#fold-copy').textContent = steps[step][1];
  document.querySelector('#fold-position').textContent = `Шаг ${step + 1} из 5`;
  document.querySelector('#fold-progress').value = step + 1;
  prev.disabled = step === 0; next.disabled = step === 4;
  document.querySelector('#fold-announcement').textContent = `Шаг ${step + 1}: ${steps[step][0]}`;
}
prev.addEventListener('click', () => { if (step > 0) { step--; render(); } });
next.addEventListener('click', () => { if (step < 4) { step++; render(); } });

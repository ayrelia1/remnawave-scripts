'use strict';

const ink = document.querySelector('#ink-color'), paper = document.querySelector('#paper-color');
function luminance(hex) { return [1,3,5].map(i => parseInt(hex.slice(i,i+2),16) / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((total,v,i) => total + v * [.2126,.7152,.0722][i],0); }
function update() {
  const view = document.querySelector('#color-preview'); view.style.color = ink.value; view.style.backgroundColor = paper.value;
  document.querySelector('#ink-hex').textContent = ink.value; document.querySelector('#paper-hex').textContent = paper.value;
  const a = luminance(ink.value), b = luminance(paper.value), ratio = (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
  document.querySelector('#contrast-ratio').textContent = `${ratio.toFixed(2)} : 1`;
  document.querySelector('#contrast-verdict').textContent = ratio >= 4.5 ? 'Достаточно для обычного текста.' : ratio >= 3 ? 'Подходит для крупного текста. Для мелкого контраста мало.' : 'Контраста мало. Попробуйте сильнее различающиеся цвета.';
}
ink.addEventListener('input',update); paper.addEventListener('input',update);
document.querySelector('#swap-colors').addEventListener('click', () => { const previous = ink.value; ink.value = paper.value; paper.value = previous; update(); }); update();

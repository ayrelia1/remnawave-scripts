'use strict';

const planets = [
 ['Меркурий','Самая маленькая планета и ближайший сосед Солнца. Его поверхность хранит следы множества древних столкновений.','4 879 км','88 земных суток'],
 ['Венера','Плотные облака скрывают поверхность. Венера вращается вокруг своей оси в направлении, обратном вращению большинства планет.','12 104 км','225 земных суток'],
 ['Земля','Океаны покрывают большую часть поверхности. Единственная известная нам планета, на которой существует жизнь.','12 742 км','365,25 земных суток'],
 ['Марс','Ржавые оттенки поверхности связаны с оксидами железа. На Марсе есть огромные вулканы, каньоны и полярные шапки.','6 779 км','687 земных суток']
];
const picks = [...document.querySelectorAll('[data-planet]')];
picks.forEach((button,index) => button.addEventListener('click', () => {
  const p = planets[index]; ['name','description','diameter','year'].forEach((key,i) => { document.querySelector(`#planet-${key}`).textContent = p[i]; });
  picks.forEach((b,i) => b.setAttribute('aria-pressed',String(i === index)));
  document.querySelector('#planet-live').textContent = `Выбрана планета: ${p[0]}`;
}));

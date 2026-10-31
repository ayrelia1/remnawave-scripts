'use strict';

const filter = document.querySelector('#leaf-filter');
filter.addEventListener('change', () => {
  let count = 0;
  document.querySelectorAll('[data-leaf]').forEach(card => {
    card.hidden = filter.value !== 'all' && card.dataset.leaf !== filter.value;
    if (!card.hidden) count++;
  });
  document.querySelector('#leaf-count').textContent = `Показано деревьев: ${count}`;
});

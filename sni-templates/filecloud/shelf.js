'use strict';

const title = document.querySelector('#book-name'), note = document.querySelector('#book-note'), message = document.querySelector('#reading-status');
try { const saved = JSON.parse(localStorage.getItem('margin-reading') || 'null'); if (saved && typeof saved.title === 'string' && typeof saved.note === 'string') { title.value = saved.title.slice(0,120); note.value = saved.note.slice(0,2000); message.textContent = 'Открыта сохранённая заметка.'; } } catch { message.textContent = 'Хранилище недоступно. Заметку можно написать и скопировать вручную.'; }
document.querySelector('#save-reading').addEventListener('click', () => {
  if (!title.value.trim() && !note.value.trim()) { message.textContent = 'Добавьте название книги или текст заметки.'; title.focus(); return; }
  try { localStorage.setItem('margin-reading', JSON.stringify({title:title.value,note:note.value})); message.textContent = 'Заметка сохранена в этом браузере.'; }
  catch { message.textContent = 'Не удалось сохранить. Скопируйте текст, чтобы не потерять его.'; }
});

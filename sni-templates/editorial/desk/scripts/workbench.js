'use strict';
const $ = selector => document.querySelector(selector);
const make = (tag,text,className) => { const el=document.createElement(tag); if(text!==undefined)el.textContent=text; if(className)el.className=className; return el; };
const uid = prefix => prefix + '-' + (globalThis.crypto?.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2));
const dateLabel = value => new Date(value).toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
async function fetchRecords(url) {
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try { const response=await fetch(url,{signal:controller.signal,cache:'no-store'}); if(!response.ok)throw new Error('unavailable'); return await response.json(); }
  finally { clearTimeout(timer); }
}
function readLocal(key,validate) {
  try { const raw=localStorage.getItem(key); if(!raw)return []; if(raw.length>800000)throw new Error('too large'); const value=JSON.parse(raw); if(!Array.isArray(value)||value.length>100||!value.every(validate))throw new Error('invalid'); return value; }
  catch { $('#storage-note').textContent='Сохранённые данные недоступны. Исходные материалы можно читать; несохранённый текст можно скопировать.'; return []; }
}
function writeLocal(key,records) { const raw=JSON.stringify(records);if(records.length>100||raw.length>800000)throw new Error('limit'); localStorage.setItem(key,raw); }
function merge(seed,local) { return [...new Map([...seed,...local].map(record=>[record.id,record])).values()]; }
function setupLeaveGuard(form) {
  form.addEventListener('input',()=>{form.dataset.dirty='true';});
  let destination='',trigger=null;const dialog=$('#leave-dialog');
  document.addEventListener('click',event=>{const link=event.target.closest('a[href]'); if(!link||form.dataset.dirty!=='true'||link.hash&&link.pathname===location.pathname)return; const url=new URL(link.href);if(url.origin!==location.origin)return;event.preventDefault();destination=url.href;trigger=link;dialog.showModal();$('#stay-here').focus();});
  $('#stay-here').addEventListener('click',()=>dialog.close());
  $('#leave-now').addEventListener('click',()=>{form.dataset.dirty='false';location.href=destination;});
  dialog.addEventListener('close',()=>trigger?.focus());
}
function validateFields(form,fields) {
  let first=null;
  for(const [id,min,max] of fields){const input=form.querySelector('#'+id);const valid=input.value.trim().length>=min&&input.value.trim().length<=max;input.setAttribute('aria-invalid',String(!valid));if(!valid&&!first)first=input;}
  if(first)first.focus();return !first;
}

const seedURL=new URL('../records/articles.json',document.currentScript.src),key='folio-desk-records';
const categories=['Заметки','Практика','Подборки'];
const valid=r=>r&&typeof r.id==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(r.id)&&typeof r.title==='string'&&r.title.trim().length>=3&&r.title.length<=120&&typeof r.text==='string'&&r.text.trim().length>=10&&r.text.length<=6000&&categories.includes(r.category)&&['draft','ready'].includes(r.status)&&Number.isFinite(Date.parse(r.updated));
let records=[],seed=[],local=[],page=0;
const isEditor=document.body.dataset.page==='editor',params=new URLSearchParams(location.search),id=params.get('id');
if(isEditor)setupLeaveGuard($('#article-form'));
document.querySelectorAll('.desk-sidebar nav a').forEach(link=>{if(new URL(link.href).pathname===location.pathname)link.setAttribute('aria-current','page');});
async function load(){
  $('#load-error').hidden=true;
  try{const result=await fetchRecords(seedURL);if(!Array.isArray(result)||!result.every(valid))throw new Error('invalid');seed=result;local=readLocal(key,valid);records=merge(seed,local);if(isEditor)fillEditor();else render();}
  catch{$('#load-error').hidden=false;if(!isEditor)$('#desk-message').textContent='Материалы пока недоступны.';}
}
function render(){
  const search=$('#article-search').value.trim().toLocaleLowerCase('ru'),filter=$('#article-filter').value;
  let items=records.filter(r=>r.title.toLocaleLowerCase('ru').includes(search)&&(filter==='all'||r.status===filter)).sort((a,b)=>b.updated.localeCompare(a.updated));
  page=Math.min(page,Math.max(0,Math.ceil(items.length/8)-1));
  $('#stat-total').textContent=records.length;$('#stat-draft').textContent=records.filter(r=>r.status==='draft').length;$('#stat-ready').textContent=records.filter(r=>r.status==='ready').length;
  const body=$('#article-rows');body.replaceChildren();
  const back=new URLSearchParams();if(search)back.set('q',$('#article-search').value);if(filter!=='all')back.set('status',filter);
  history.replaceState(null,'',location.pathname+(back.size?'?'+back.toString():''));
  for(const item of items.slice(page*8,page*8+8)){
    const row=make('tr'),cell=make('td'),link=make('a',item.title,'row-link');link.href='/workspace/editor.html?'+new URLSearchParams({id:item.id,back:back.toString()});cell.append(link,make('small',item.text.slice(0,85)+'…'));row.append(cell,make('td',item.category));
    const state=make('td');state.append(make('span',item.status==='ready'?'Готов':'Черновик','status-pill '+item.status));row.append(state,make('td',dateLabel(item.updated)));body.append(row);
  }
  $('#article-empty').hidden=items.length>0;$('#article-range').textContent=items.length?`${page*8+1}–${Math.min(page*8+8,items.length)} из ${items.length}`:'0 материалов';
  $('#article-prev').disabled=page===0;$('#article-next').disabled=(page+1)*8>=items.length;
  $('#desk-message').textContent=params.get('saved')==='1'?'Материал сохранён на этом устройстве.':`Найдено материалов: ${items.length}`;
}
function fillEditor(){
  const current=id?records.find(r=>r.id===id):null;
  if(id&&!current){$('#load-error').hidden=false;$('#editor-message').textContent='Материал не найден.';return;}
  $('#editor-heading').textContent=current?'Редактировать материал':'Новый материал';
  if(current){$('#article-title').value=current.title;$('#article-text').value=current.text;$('#article-category').value=current.category;$('#article-status').value=current.status;}
  const back=new URLSearchParams(params.get('back')||'');const safe=new URLSearchParams();for(const field of ['q','status'])if(back.has(field))safe.set(field,back.get(field));
  $('#back-to-library').href='/'+(safe.size?'?'+safe.toString():'');$('#editor-fields').disabled=false;$('#editor-message').textContent='Изменения появятся в библиотеке после сохранения.';
}
if(isEditor){
  $('#article-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;
    if(!validateFields(form,[['article-title',3,120],['article-text',10,6000]])){$('#editor-message').textContent='Проверьте название и текст материала.';return;}
    const item={id:id||uid('article'),title:$('#article-title').value.trim(),text:$('#article-text').value.trim(),category:$('#article-category').value,status:$('#article-status').value,updated:new Date().toISOString()};
    try{const latest=readLocal(key,valid);const next=merge(latest,[item]);if(merge(seed,next).length>100)throw new Error('limit');writeLocal(key,next);form.dataset.dirty='false';const target=new URL($('#back-to-library').href);target.searchParams.set('saved','1');location.href=target.href;}
    catch{$('#editor-message').textContent='Не удалось сохранить. Оставьте страницу открытой и скопируйте текст либо попробуйте ещё раз.';}
  });
}else{
  $('#article-search').value=params.get('q')||'';if(['draft','ready'].includes(params.get('status')))$('#article-filter').value=params.get('status');
  for(const selector of ['#article-search','#article-filter'])$(selector).addEventListener('input',()=>{page=0;render();});
  $('#clear-articles').addEventListener('click',()=>{$('#article-search').value='';$('#article-filter').value='all';page=0;render();$('#article-search').focus();});
  $('#article-prev').addEventListener('click',()=>{page--;render();});$('#article-next').addEventListener('click',()=>{page++;render();});
}
$('#retry-load').addEventListener('click',load);load();

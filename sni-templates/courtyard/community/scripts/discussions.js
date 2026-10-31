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

const seedURL=new URL('../records/topics.json',document.currentScript.src),key='practice-topics',categories=['Мастерская','Дом и сад','Идеи'];
const validPost=p=>p&&typeof p.author==='string'&&p.author.trim().length>=2&&p.author.length<=40&&typeof p.text==='string'&&p.text.trim().length>=3&&p.text.length<=2000&&Number.isFinite(Date.parse(p.date));
const valid=t=>t&&typeof t.id==='string'&&/^[a-zA-Z0-9-]{1,80}$/.test(t.id)&&typeof t.title==='string'&&t.title.trim().length>=5&&t.title.length<=140&&categories.includes(t.category)&&Array.isArray(t.posts)&&t.posts.length>0&&t.posts.length<=100&&t.posts.every(validPost);
let seed=[],records=[],page=0;
const kind=document.body.dataset.page,params=new URLSearchParams(location.search),id=params.get('id');
const replyWord=count=>count%100>=11&&count%100<=14?'ответов':count%10===1?'ответ':count%10>=2&&count%10<=4?'ответа':'ответов';
if(kind==='new')setupLeaveGuard($('#topic-form'));if(kind==='thread')setupLeaveGuard($('#reply-form'));
async function load(){
  $('#load-error').hidden=true;
  try{const result=await fetchRecords(seedURL);if(!Array.isArray(result)||!result.every(valid))throw new Error('invalid');seed=result;records=merge(seed,readLocal(key,valid));
    if(kind==='topics')renderList();else if(kind==='thread')renderThread();else{$('#topic-fields').disabled=false;$('#new-topic-message').textContent='Тема будет доступна в этом браузере.';}}
  catch{$('#load-error').hidden=false;if(kind==='topics')$('#forum-message').textContent='Список обсуждений недоступен.';}
}
function persist(item){const latest=readLocal(key,valid);const next=merge(latest,[item]);if(merge(seed,next).length>100)throw new Error('limit');writeLocal(key,next);records=merge(seed,next);}
function renderList(){
  const query=$('#topic-search').value.trim().toLocaleLowerCase('ru'),category=$('#topic-filter').value;
  const items=records.filter(t=>t.title.toLocaleLowerCase('ru').includes(query)&&(category==='all'||t.category===category)).sort((a,b)=>b.posts.at(-1).date.localeCompare(a.posts.at(-1).date));
  page=Math.min(page,Math.max(0,Math.ceil(items.length/8)-1));const list=$('#topic-list');list.replaceChildren();
  const urlParams=new URLSearchParams();if(query)urlParams.set('q',$('#topic-search').value);if(category!=='all')urlParams.set('category',category);history.replaceState(null,'',location.pathname+(urlParams.size?'?'+urlParams:'') );
  for(const topic of items.slice(page*8,page*8+8)){
    const row=make('article',undefined,'topic-card'),content=make('div'),heading=make('h3'),link=make('a',topic.title,'row-link');link.href='/discussions/thread.html?'+new URLSearchParams({id:topic.id});heading.append(link);content.append(make('p',topic.category,'eyebrow'),heading,make('p',topic.posts[0].author+' · '+dateLabel(topic.posts.at(-1).date),'topic-meta'));
    const count=make('div',undefined,'reply-count');count.append(make('strong',String(topic.posts.length-1)),make('span',replyWord(topic.posts.length-1)));row.append(make('span',topic.posts[0].author[0].toUpperCase(),'topic-avatar'),content,count);list.append(row);
  }
  $('#topic-empty').hidden=items.length>0;$('#forum-message').textContent=`Найдено тем: ${items.length}`;$('#topic-range').textContent=items.length?`${page*8+1}–${Math.min(page*8+8,items.length)} из ${items.length}`:'0 тем';$('#topic-prev').disabled=page===0;$('#topic-next').disabled=(page+1)*8>=items.length;
}
function renderThread(){
  const topic=records.find(t=>t.id===id),container=$('#thread-content');container.replaceChildren();
  if(!topic){container.append(make('h1','Обсуждение не найдено'));$('#reply-section').hidden=true;return;}
  container.append(make('p',topic.category,'eyebrow'),make('h1',topic.title,'thread-title'));
  topic.posts.forEach((post,index)=>{if(index===1)container.append(make('h2','Ответы','reply-heading'));const card=make('article',undefined,'post-card'),head=make('header',undefined,'post-head'),byline=make('div');byline.append(make('strong',post.author),make('small',dateLabel(post.date)));head.append(make('span',post.author[0].toUpperCase(),'topic-avatar'),byline);card.append(head,make('p',post.text,'post-body'));container.append(card);});
  $('#reply-section').hidden=false;$('#add-reply').disabled=topic.posts.length>=100;if(topic.posts.length>=100)$('#reply-message').textContent='В теме уже 100 сообщений. Можно создать новое обсуждение.';
}
if(kind==='topics'){
  $('#topic-search').value=params.get('q')||'';if(categories.includes(params.get('category')))$('#topic-filter').value=params.get('category');
  for(const selector of ['#topic-search','#topic-filter'])$(selector).addEventListener('input',()=>{page=0;renderList();});
  $('#clear-topics').addEventListener('click',()=>{$('#topic-search').value='';$('#topic-filter').value='all';page=0;renderList();$('#topic-search').focus();});
  $('#topic-prev').addEventListener('click',()=>{page--;renderList();});$('#topic-next').addEventListener('click',()=>{page++;renderList();});
}else if(kind==='new'){
  $('#topic-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!validateFields(form,[['topic-title',5,140],['topic-author',2,40],['topic-text',10,2000]])){$('#new-topic-message').textContent='Проверьте заголовок, имя и первое сообщение.';return;}
    const topic={id:uid('topic'),title:$('#topic-title').value.trim(),category:$('#topic-category').value,posts:[{author:$('#topic-author').value.trim(),text:$('#topic-text').value.trim(),date:new Date().toISOString()}]};
    try{persist(topic);form.dataset.dirty='false';location.href='/discussions/thread.html?'+new URLSearchParams({id:topic.id});}catch{$('#new-topic-message').textContent='Не удалось сохранить тему. Скопируйте текст или попробуйте ещё раз.';}
  });
}else{
  $('#reply-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;if(!validateFields(form,[['reply-author',2,40],['reply-text',3,2000]])){$('#reply-message').textContent='Добавьте имя и текст ответа.';return;}
    const current=merge(seed,readLocal(key,valid)).find(t=>t.id===id);if(!current||current.posts.length>=100){$('#reply-message').textContent='Тема недоступна для нового ответа.';return;}
    const next={...current,posts:[...current.posts,{author:$('#reply-author').value.trim(),text:$('#reply-text').value.trim(),date:new Date().toISOString()}]};
    try{persist(next);form.dataset.dirty='false';$('#reply-text').value='';renderThread();$('#reply-message').textContent='Ответ сохранён на этом устройстве.';}catch{$('#reply-message').textContent='Не удалось сохранить ответ. Текст остался в поле; скопируйте его или повторите попытку.';}
  });
}
$('#retry-load').addEventListener('click',load);load();

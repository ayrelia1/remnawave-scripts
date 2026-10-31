'use strict';
const form=document.querySelector('#login-form');
const fields=document.querySelector('#login-fields');
const username=document.querySelector('#login-username');
const password=document.querySelector('#login-password');
const message=document.querySelector('#login-message');
const toggle=document.querySelector('#toggle-password');
function maskPassword(){password.type='password';toggle.textContent='Показать';toggle.setAttribute('aria-label','Показать пароль');toggle.setAttribute('aria-pressed','false');}
toggle.addEventListener('click',()=>{const reveal=password.type==='password';password.type=reveal?'text':'password';toggle.textContent=reveal?'Скрыть':'Показать';toggle.setAttribute('aria-label',reveal?'Скрыть пароль':'Показать пароль');toggle.setAttribute('aria-pressed',String(reveal));});
for(const input of [username,password])input.addEventListener('input',()=>{username.removeAttribute('aria-invalid');password.removeAttribute('aria-invalid');message.textContent='';});
form.addEventListener('submit',event=>{
  event.preventDefault();
  const hasUsername=username.value.trim().length>0,hasPassword=password.value.length>0;
  username.setAttribute('aria-invalid',String(!hasUsername));password.setAttribute('aria-invalid',String(!hasPassword));
  if(!hasUsername||!hasPassword){message.textContent=!hasUsername?'Введите логин.':'Введите пароль.';(!hasUsername?username:password).focus();return;}
  message.textContent='Неверный логин или пароль.';
  username.setAttribute('aria-invalid','true');password.setAttribute('aria-invalid','true');
  password.value='';maskPassword();password.focus();
});
fields.disabled=false;

const {chromium}=require('playwright');
const path=require('path'),fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const c=await chromium.launchPersistentContext(path.resolve('.selfsteal-work/browser-actions'),{channel:'chrome',headless:true,viewport:{width:1366,height:900},reducedMotion:'reduce'});
 await c.route('**/*',r=>r.request().url().includes('api.ipify.org')?r.fulfill({json:{ip:'203.0.113.42'}}):r.request().url().startsWith('http://127.0.0.1:')?r.continue():r.abort());
 c.setDefaultTimeout(5000);
 let results=[];
 async function check(name,port,action){const p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:'+port,{waitUntil:'networkidle'});await action(p);assert.equal(errors.length,0,name+': '+errors);results.push(name);console.log('PASS: '+name);await p.close();}
 await check('Sidewalk: feed, category filter, theme toggle',8871,async p=>{
  await p.locator('main h3').first().waitFor();
  await p.getByRole('button',{name:'GIFs',exact:true}).click();
  await p.locator('main h3').first().waitFor();
  const before=await p.locator('html').getAttribute('class');await p.getByRole('button',{name:/Switch to/}).click();assert.notEqual(await p.locator('html').getAttribute('class'),before);
 });
 await check('Cutlane: editor entry, login dialog and local error',8872,async p=>{
  await p.locator('header').getByRole('button',{name:'Войти',exact:true}).click();
  await p.locator('input[type=email]').fill('preview@example.invalid');await p.locator('input[type=password]').fill('preview-only');
  await p.getByRole('button',{name:'Sign In',exact:true}).click();await p.getByText('No account matched those details. You can ask for an invitation below.').waitFor();
 });
 await check('Formatwell: file chooser, format selection and cancellation',8873,async p=>{
  await p.getByRole('button',{name:'Choose a file to begin',exact:true}).click();
  await p.locator('input[type=file]').setInputFiles({name:'preview.txt',mimeType:'text/plain',buffer:Buffer.from('Local preview file')});
  await p.getByText('preview.txt',{exact:false}).first().waitFor();
  await p.getByText('Starting format',{exact:true}).waitFor();
  await p.getByText('Destination format',{exact:true}).waitFor();
  await p.getByText('Destination format',{exact:true}).locator('..').getByRole('button').first().click();
  await p.getByRole('button',{name:'DOCX',exact:true}).click();
  await p.getByRole('button',{name:'Cancel',exact:true}).click();
 });
 await check('Parcelink: media type and format dropdown',8874,async p=>{
  await p.getByRole('button',{name:'Видео',exact:true}).click();
  await p.getByPlaceholder('https://',{exact:true}).waitFor();assert(await p.locator('select').count()>0);
  await p.locator('#autoDetect').uncheck();
  await p.locator('select').first().selectOption({index:1});
 });
 await check('Foliohaven: login validation',8875,async p=>{
  await p.locator('input[type=email]').fill('preview@example.invalid');await p.locator('input[type=password]').fill('preview-only');
  await p.getByRole('button',{name:'Login',exact:true}).last().click();await p.getByText('User not found',{exact:false}).waitFor();
 });
 await check('Cartridge Club: search, empty filter and invite dialog',8876,async p=>{
  const search=p.getByPlaceholder('Название с твоей полки…');await search.fill('Copper Pipe');await p.getByText('Copper Pipe Quest',{exact:true}).waitFor();
  await search.fill('no-match-preview-435');assert.equal(await p.locator('#games h3').count(),0);await search.fill('');await p.getByText('Copper Pipe Quest',{exact:true}).waitFor();
  await p.getByRole('button',{name:/Access Vault/i}).click();await p.getByText('Вход в игровой клуб',{exact:true}).waitFor();
 });
 await check('Patchbay: invitation dialog and local validation error',8877,async p=>{
  await p.getByRole('button',{name:'Open your collection',exact:true}).click();await p.getByPlaceholder('Enter your email').fill('preview@example.invalid');await p.getByPlaceholder('Enter your invite code').fill('preview-only');
  await p.locator('form').getByRole('button',{name:'Login',exact:true}).click();await p.getByText('Invalid invite code',{exact:true}).waitFor();
 });
 await check('LineMeter: simulated measurement and retry state',8878,async p=>{
  await p.clock.install();await p.getByRole('button',{name:'Проверить соединение',exact:true}).click();await p.clock.runFor(30000);
  await p.getByText('Измерение остановилось. Можно запустить проверку ещё раз.',{exact:true}).waitFor();await p.getByRole('button',{name:'Повторить проверку',exact:true}).waitFor();
 });
 await check('Кадротека: video verification and IP display',8879,async p=>{
  await p.locator('main h3').first().click();await p.getByText('Небольшая проверка перед просмотром',{exact:true}).waitFor();await p.getByText('203.0.113.42',{exact:false}).waitFor();
 });
 for(const port of [8880,8881])await check('Status '+port+': countdown advances',port,async p=>{await p.clock.install();await p.clock.runFor(1100);await p.getByText('04:59',{exact:false}).waitFor();});
 fs.writeFileSync('.selfsteal-work/action-results.json',JSON.stringify(results,null,2));await c.close();
})().catch(e=>{console.error(e);process.exit(1)});

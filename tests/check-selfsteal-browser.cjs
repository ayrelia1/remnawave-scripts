// Optional browser suite: uses an existing Playwright installation and Chrome.
// Serve fixtures only on loopback and never run the system installer.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const folders = ['bracken','courtyard','steep-hour','spoon-ratio','editorial','fold-studies',
  'chroma-deck','seven-days','orbit-almanac','slate-status','still-status'];
const base = path.resolve(process.argv[2] || path.join(__dirname,'../sni-templates'));
const random = process.argv[3] && path.resolve(process.argv[3]);
const output = process.env.SELFSTEAL_BROWSER_REPORT;
const pictures = process.env.SELFSTEAL_BROWSER_PICTURES;
const servers = [], report = [];
let browser;

async function serve(root) {
  const server = http.createServer((req,res) => {
    const name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file = path.resolve(root,'.' + (name === '/' ? '/index.html' : name));
    if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
      '.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.json':'application/json'};
    res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream'});
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
  servers.push(server);
  return `http://127.0.0.1:${server.address().port}`;
}

async function actions(page,folder) {
  if (folder === 'bracken') {
    await page.locator('#leaf-filter').selectOption('needle');
    assert.equal(await page.locator('[data-leaf]:visible').count(),2);
    await page.locator('#leaf-filter').selectOption('all');
  } else if (folder === 'courtyard') {
    await page.locator('#topic-list .row-link').first().waitFor();
    await page.locator('#topic-search').fill('неттакойтемы');
    assert(await page.locator('#topic-empty').isVisible());
    await page.locator('#clear-topics').click();
    await page.locator('#topic-filter').selectOption('Мастерская');
    assert.equal(await page.locator('.topic-card').count(),2);
    await page.locator('#clear-topics').click();
    await page.locator('#topic-list .row-link').first().click();
    await page.locator('#reply-section').waitFor();
    await page.locator('#add-reply').click();
    assert.equal(await page.locator('#reply-author').getAttribute('aria-invalid'),'true');
    await page.locator('#reply-author').fill('Тестовый читатель');
    await page.locator('#reply-text').fill('<img src=x onerror=alert(1)>');
    await page.locator('#add-reply').click();
    assert((await page.locator('.post-body').last().textContent()).includes('<img src=x'));
    assert.equal(await page.locator('img').count(),0);
    await page.reload();
    assert((await page.locator('.post-body').last().textContent()).includes('<img src=x'));
    await page.locator('.forum-header a[href="/discussions/new.html"]').click();
    const createdTitle='Тестовая новая тема '+ 'Д'.repeat(100);
    await page.locator('#topic-title').fill(createdTitle);
    await page.locator('#topic-author').fill('А'.repeat(40));
    await page.locator('#topic-text').fill('Достаточно длинное сообщение для новой темы.');
    await page.locator('.forum-header a[href="/"]').first().click();
    assert(await page.locator('#leave-dialog').isVisible());
    await page.locator('#stay-here').click();
    await page.locator('#create-topic').click();
    await page.waitForURL('**/discussions/thread.html?*');
    await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,createdTitle);
    assert.equal(await page.locator('h1').textContent(),createdTitle);
    await page.reload();
    await page.waitForFunction(title=>document.querySelector('h1')?.textContent===title,createdTitle);
    assert.equal(await page.locator('h1').textContent(),createdTitle);
    assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),'Long thread title/author overflow');
  } else if (folder === 'steep-hour') {
    await page.locator('#tea-kind').selectOption('240');
    assert.equal(await page.locator('#tea-clock').textContent(),'04:00');
    await page.locator('#tea-start').click();
    await page.waitForFunction(() => document.querySelector('#tea-clock').textContent !== '04:00');
    await page.locator('#tea-start').click();
    assert((await page.locator('#tea-state').textContent()).includes('паузе'));
    await page.locator('#tea-reset').click();
    assert.equal(await page.locator('#tea-clock').textContent(),'04:00');
    // Finish without waiting four minutes; timer uses wall time rather than ticks.
    await page.locator('#tea-start').click();
    await page.evaluate(() => { const now = Date.now(); Date.now = () => now + 300000; });
    await page.waitForFunction(() => document.querySelector('#tea-state').textContent.includes('Чай готов'));
    await page.reload();
  } else if (folder === 'spoon-ratio') {
    await page.locator('#servings').fill('4');
    assert.equal(await page.locator('[data-grams="80"]').textContent(),'160');
    await page.locator('#servings').fill('0');
    assert.equal(await page.locator('#servings').getAttribute('aria-invalid'),'true');
    assert.equal(await page.locator('[data-grams="80"]').textContent(),'160');
    await page.locator('#servings').fill('2');
  } else if (folder === 'editorial') {
    const url=page.url(),requests=[];
    const watch=request=>requests.push(request.url());page.on('request',watch);
    await page.locator('#sign-in').click();
    assert.equal(await page.locator('#login-message').textContent(),'Введите логин.');
    await page.locator('#login-username').fill('admin');
    await page.locator('#sign-in').click();
    assert.equal(await page.locator('#login-message').textContent(),'Введите пароль.');
    await page.locator('#login-password').fill('Example-password-1');
    await page.locator('#toggle-password').click();
    assert.equal(await page.locator('#login-password').getAttribute('type'),'text');
    await page.locator('#sign-in').click();
    assert.equal(await page.locator('#login-message').textContent(),'Неверный логин или пароль.');
    assert.equal(await page.locator('#login-password').inputValue(),'');
    assert.equal(await page.locator('#login-password').getAttribute('type'),'password');
    assert.equal(await page.locator('#login-username').inputValue(),'admin');
    await page.locator('#login-username').fill('<img src=x onerror=alert(1)>');
    await page.locator('#login-password').fill('Другой пароль');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#login-message').textContent(),'Неверный логин или пароль.');
    assert.equal(page.url(),url);
    assert.deepEqual(requests,[],'Sign-in generated a network request');
    assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0,'Credentials persisted');
    assert.equal((await page.context().cookies()).length,0);
    page.off('request',watch);
  } else if (folder === 'fold-studies') {
    assert(await page.locator('#fold-prev').isDisabled());
    for (let i=0;i<4;i++) await page.locator('#fold-next').click();
    assert(await page.locator('#fold-next').isDisabled());
    assert.equal(await page.locator('#fold-position').textContent(),'Шаг 5 из 5');
    for (let i=0;i<4;i++) await page.locator('#fold-prev').click();
  } else if (folder === 'chroma-deck') {
    await page.locator('#ink-color').evaluate(el => { el.value='#000000'; el.dispatchEvent(new Event('input',{bubbles:true})); });
    await page.locator('#paper-color').evaluate(el => { el.value='#ffffff'; el.dispatchEvent(new Event('input',{bubbles:true})); });
    assert.equal(await page.locator('#contrast-ratio').textContent(),'21.00 : 1');
    await page.locator('#swap-colors').click();
    assert.equal(await page.locator('#ink-color').inputValue(),'#ffffff');
    await page.locator('#paper-color').evaluate(el => { el.value='#ffffff'; el.dispatchEvent(new Event('input',{bubbles:true})); });
    assert.equal(await page.locator('#contrast-ratio').textContent(),'1.00 : 1');
    await page.reload();
  } else if (folder === 'seven-days') {
    await page.locator('#week-goal').fill('Десять страниц');
    await page.locator('#week-goal').blur();
    await page.locator('[data-day="0"]').click();
    assert.equal(await page.locator('#week-total').textContent(),'1 из 7');
    await page.reload();
    assert.equal(await page.locator('#week-goal').inputValue(),'Десять страниц');
    assert.equal(await page.locator('[data-day="0"]').getAttribute('aria-pressed'),'true');
    for (let i=1;i<7;i++) await page.locator(`[data-day="${i}"]`).click();
    assert.equal(await page.locator('#week-total').textContent(),'7 из 7');
  } else if (folder === 'orbit-almanac') {
    for (const [i,name] of ['Меркурий','Венера','Земля','Марс'].entries()) {
      await page.locator(`[data-planet="${i}"]`).click();
      assert.equal(await page.locator('#planet-name').textContent(),name);
    }
    assert.equal(await page.locator('#planet-year').textContent(),'687 земных суток');
    await page.locator('[data-planet="0"]').click();
  } else {
    const firstId=await page.locator('[data-request-id]').textContent();
    assert(/^[A-Z0-9-]{27,50}$/.test(firstId),`${folder}: request reference missing`);
    const firstClock=await page.locator('[data-countdown]').textContent();
    assert(/^0[45]:[0-5][0-9]$/.test(firstClock));
    await page.context().grantPermissions(['clipboard-read','clipboard-write']);
    await page.locator('[data-copy-reference]').click();
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),firstId);
    assert((await page.locator('[data-copy-result]').textContent()).includes('скопирован'));
    await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('blocked'))}}));
    await page.locator('[data-copy-reference]').click();
    assert((await page.locator('[data-copy-result]').textContent()).includes('вручную'));
    await page.locator(folder === 'slate-status' ? '#pause-retry' : '#still-refresh').click();
    await page.waitForLoadState('networkidle');
    assert(await page.locator('h1').isVisible());
    const nextId=await page.locator('[data-request-id]').textContent();
    assert.notEqual(nextId,firstId,`${folder}: reference did not change after reload`);
    await page.waitForFunction(()=>document.querySelector('[data-countdown]').textContent!=='05:00');
    const navigation=page.waitForNavigation({waitUntil:'networkidle'});
    await page.evaluate(()=>{const now=Date.now();Date.now=()=>now+300500;});
    await navigation;
    assert.notEqual(await page.locator('[data-request-id]').textContent(),nextId,`${folder}: automatic retry failed`);
  }
}

(async () => {
  browser = await chromium.launch({channel:'chrome',headless:true});
  for (const [mode,root] of [['base',base], ...(random ? [['randomized',random]] : [])]) {
    for (const folder of folders.filter(name=>!process.env.SELFSTEAL_BROWSER_ONLY||process.env.SELFSTEAL_BROWSER_ONLY===name)) {
      const url = await serve(path.join(root,folder));
      const context = await browser.newContext({reducedMotion:'reduce',viewport:{width:1366,height:900}});
      const calls = [], errors = [], missing = [];
      await context.route('**/*',route => {
        const target = route.request().url();
        if (target.startsWith('https://api.ipify.org')) { calls.push(target); return route.fulfill({json:{ip:'203.0.113.42'}}); }
        if (target.startsWith(url)) return route.continue();
        errors.push('Unexpected external request: '+target); return route.abort();
      });
      const page = await context.newPage();
      page.on('pageerror',err => errors.push(err.message));
      page.on('response',res => { if (res.status() >= 400) missing.push(res.url()); });
      await page.goto(url,{waitUntil:'networkidle'});
      assert(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)),`${folder}: overflow after local edits`);
      assert.equal(calls.length,mode==='base' && folder.endsWith('-status') ? 1 : 0,`${mode}/${folder}: IP mode`);
      if (folder.endsWith('-status')) assert.equal(await page.locator('[data-address]').textContent(),mode==='base' ? '203.0.113.42' : 'Не определён');
      const views=[];
      for (const width of [1366,768,390,320]) {
        await page.setViewportSize({width,height:900});
        const metrics = await page.evaluate(() => ({
          overflow:document.documentElement.scrollWidth > innerWidth + 1,
          content:document.querySelector('main').innerText.length,
          animations:document.getAnimations().filter(animation => animation.playState==='running').length,
          controls:[...document.querySelectorAll('button,input,select,textarea')].filter(el => !el.disabled && el.getBoundingClientRect().width > 0).map(el => ({id:el.id,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}))
        }));
        assert(!metrics.overflow,`${mode}/${folder}/${width}: horizontal overflow`);
        assert(metrics.content > 80,`${mode}/${folder}: empty page`);
        assert.equal(metrics.animations,0,`${folder}: reduced motion`);
        for (const control of metrics.controls) assert(control.width >= 24 && control.height >= 24,`${folder}: small ${control.id}`);
        if (pictures && [1366,390].includes(width)) { fs.mkdirSync(pictures,{recursive:true}); await page.screenshot({path:path.join(pictures,`${mode}-${folder}-${width}.png`),fullPage:true}); }
        views.push({width,...metrics});
      }
      await actions(page,folder);
      await page.goto(url,{waitUntil:'networkidle'});
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement.className),'skip');
      await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(() => document.activeElement.id),'content');
      assert.deepEqual(errors,[],`${mode}/${folder}: browser errors`);
      assert.deepEqual(missing,[],`${mode}/${folder}: missing resources`);
      report.push({folder,mode,views,errors,missing});
      const noJS = await browser.newContext({javaScriptEnabled:false});
      const staticPage = await noJS.newPage(); await staticPage.goto(url);
      assert(await staticPage.locator('h1').isVisible());
      assert((await staticPage.locator('main').innerText()).length > 80);
      if(folder==='editorial'){
        assert(await staticPage.locator('#sign-in').isDisabled(),'No-JS sign-in must not submit');
        assert(await staticPage.locator('#login-password').isDisabled(),'No-JS password field must stay disabled');
      }
      await noJS.close();
      if (folder==='courtyard') {
        const paths=['/discussions/new.html','/discussions/thread.html?id=conversation-1'];
        for(const route of paths){
          await page.goto(url+route,{waitUntil:'networkidle'});
          const routeViews=[];
          for(const width of [1366,768,390,320]){
            await page.setViewportSize({width,height:900});
            assert(await page.locator('h1').isVisible(),`${folder}/${route}: heading`);
            const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
            assert(!overflow,`${mode}/${folder}/${route}/${width}: horizontal overflow`);
            if(pictures&&[1366,390].includes(width))await page.screenshot({path:path.join(pictures,`${mode}-${folder}-${route.includes('thread')?'thread':'new'}-${width}.png`),fullPage:true});
            routeViews.push({width,overflow});
          }
          report.push({folder,mode,route,views:routeViews});
        }
        const broken=await browser.newContext();
        await broken.route('**/records/*.json',route=>route.fulfill({status:503,body:'Unavailable'}));
        const failure=await broken.newPage();await failure.goto(url,{waitUntil:'networkidle'});
        assert(await failure.locator('#load-error').isVisible());
        await broken.unroute('**/records/*.json');await failure.locator('#retry-load').click();
        await failure.waitForFunction(()=>document.querySelectorAll('#topic-list .topic-card').length>0);
        await broken.close();
        const corrupt=await browser.newContext();
        await corrupt.addInitScript(()=>{localStorage.setItem('practice-topics','[{"id":"bad","title":"Bad topic","category":"Идеи","posts":[{"author":"","text":"text","date":"2026-10-25"}]}]');});
        const recovered=await corrupt.newPage();await recovered.goto(url,{waitUntil:'networkidle'});
        assert((await recovered.locator('#storage-note').textContent()).includes('недоступны'));
        assert(await recovered.locator('#topic-list .row-link').first().isVisible());
        await corrupt.close();
      }
      // Verify denied storage and failed network independently of the happy path.
      if (folder==='seven-days') {
        const blocked = await browser.newContext();
        await blocked.addInitScript(() => { Object.defineProperty(window,'localStorage',{get(){ throw new DOMException('Unavailable','SecurityError'); }}); });
        const offline = await blocked.newPage(); await offline.goto(url);
        await offline.locator('[data-day="0"]').click(); assert((await offline.locator('#week-feedback').textContent()).includes('Не удалось сохранить'));
        await blocked.close();
      }
      if (folder.endsWith('-status') && mode==='base') {
        const failed = await browser.newContext();
        await failed.route('https://api.ipify.org/**',route => route.abort());
        const fallback = await failed.newPage(); await fallback.goto(url,{waitUntil:'networkidle'});
        assert.equal(await fallback.locator('[data-address]').textContent(),'Не определён');
        await failed.close();
      }
      assert.deepEqual(errors,[],`${mode}/${folder}: browser errors on subpages`);
      assert.deepEqual(missing,[],`${mode}/${folder}: missing subpage resources`);
      await context.close();
      console.log(`PASS: ${mode}/${folder}: four widths, interactions, keyboard, no-JS and failure states`);
    }
  }
  if (output) fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
  console.log(`PASS: ${report.length * 4} viewport cases, ${report.length} independent page/mode cases`);
})().catch(error => { console.error(error); process.exitCode=1; }).finally(async () => {
  if (browser) await browser.close();
  await Promise.all(servers.map(server => new Promise(resolve => server.close(resolve))));
});

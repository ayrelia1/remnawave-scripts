const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const names = ['10gag','convertit','converter','downloader','filecloud','games-site','modmanager','speedtest','YouTube','503-1','503-2'];
(async () => {
  const browser = await chromium.launchPersistentContext(path.resolve('.selfsteal-work/browser'), { channel:'chrome', headless:true, viewport:{width:1366,height:900} });
  await browser.route('**/*', route => {
    const url = route.request().url();
    if (url.includes('api.ipify.org')) return route.fulfill({json:{ip:'203.0.113.42'}});
    if (!url.startsWith('http://127.0.0.1:')) return route.abort();
    return route.continue();
  });
  const results = [];
  for (let i=0;i<names.length;i++) {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:${8871+i}`,{waitUntil:'networkidle'});
    const data=await page.evaluate(()=>({title:document.title,text:document.body.innerText,classes:[...document.querySelectorAll('#root > *,header,nav,main,section,footer,h1')].map(el=>({tag:el.tagName,id:el.id,classes:el.className,text:el.innerText.slice(0,130)})),overflow:document.documentElement.scrollWidth>innerWidth}));
    await page.screenshot({path:`.selfsteal-work/after-${names[i]}.png`});
    results.push({name:names[i],...data,errors});
    await page.close();
  }
  fs.writeFileSync('.selfsteal-work/after.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results.map(r=>({name:r.name,title:r.title,text:r.text.slice(0,160),overflow:r.overflow,errors:r.errors})),null,1));
  await browser.close();
})();

const { chromium } = require('playwright');
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const names=['10gag','convertit','converter','downloader','filecloud','games-site','modmanager','speedtest','YouTube','503-1','503-2'];
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#546c83"/></svg>';
(async()=>{
 const context=await chromium.launchPersistentContext(path.resolve('.selfsteal-work/browser-runtime'),{channel:'chrome',headless:true,viewport:{width:1366,height:900},reducedMotion:'reduce'});
 await context.route('**/*',route=>{
  const url=route.request().url();
  if(url.includes('api.ipify.org'))return route.fulfill({json:{ip:'203.0.113.42'}});
  if(!url.startsWith('http://127.0.0.1:')){
   if(route.request().resourceType()==='image')return route.fulfill({contentType:'image/svg+xml',body:svg});
   return route.abort();
  }
  return route.continue();
 });
 const report=[];
 for(const randomized of [false,true])for(let i=0;i<names.length;i++){
  const name=names[i],page=await context.newPage(),errors=[],bad=[],ip=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('ipify.org'))ip.push(r.url());});
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:')&&r.status()>=400&&!r.url().includes('/_s/ip'))bad.push(r.url());});
  await page.goto(`http://127.0.0.1:${(randomized?8891:8871)+i}`,{waitUntil:'networkidle'});
  if(name==='10gag')await page.locator('main [class*="grid-cols"]').waitFor();
  assert.equal(errors.length,0,`${name}: ${errors}`);assert.equal(bad.length,0,`${name}: ${bad}`);
  if([8,9,10].includes(i))assert.equal(ip.length,randomized?0:1,`${name}: IP mode`);
  const view=[];
  for(const width of [1366,390]){
   await page.setViewportSize({width,height:900});
   const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,root:document.getElementById('root').innerText.length,animations:document.getAnimations().filter(a=>a.playState==='running').length}));
   assert(!data.overflow,`${name} ${width}: horizontal overflow`);assert(data.root>30,`${name}: empty root`);assert.equal(data.animations,0,`${name}: reduced motion`);
   view.push({width,...data});
   await page.screenshot({path:`.selfsteal-work/${randomized?'randomized':'base'}-${name}-${width}.png`});
  }
  await page.keyboard.press('Tab');
  const focus=await page.evaluate(()=>document.activeElement.tagName);
  report.push({name,randomized,ipRequests:ip.length,errors,bad,view,focus});
  console.log(`PASS: ${name} ${randomized?'randomized':'base'}: desktop, mobile, reduced motion, local resources and IP mode`);
  await page.close();
 }
 // Check real error handling when the optional external IP endpoint is unavailable.
 await context.unroute('**/*');
 await context.route('**/*',route=>route.request().url().includes('api.ipify.org')?route.abort():route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
 for(const i of [9,10]){
  const page=await context.newPage();await page.goto(`http://127.0.0.1:${8871+i}`,{waitUntil:'networkidle'});
  assert((await page.locator('body').innerText()).includes(i===9?'не определен':'недоступен'));
  await page.close();
 }
 fs.writeFileSync('.selfsteal-work/runtime-results.json',JSON.stringify(report,null,2));
 await context.close();
 console.log('PASS: status pages handle unavailable external IP service.');
})().catch(e=>{console.error(e);process.exit(1)});

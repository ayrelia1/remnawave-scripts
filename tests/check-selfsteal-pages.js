// Validate each published asset graph using only repository-standard Node tools.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../sni-templates');
const folders=['bracken','courtyard','steep-hour','spoon-ratio','editorial','fold-studies','chroma-deck','seven-days','orbit-almanac','slate-status','still-status'];
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);
const identities=new Set();
for(const folder of folders){
  const dir=path.join(root,folder),files=walk(dir),inventory=fs.readFileSync(path.join(dir,'files.list'),'utf8').trim().split(/\r?\n/).sort();
  assert.deepEqual(inventory,files.map(file=>path.relative(dir,file).replaceAll(path.sep,'/')).filter(file=>file!=='files.list').sort(),`${folder}: inventory mismatch`);
  const manifest=JSON.parse(fs.readFileSync(path.join(dir,'site.webmanifest'),'utf8'));
  assert(!identities.has(manifest.name));identities.add(manifest.name);
  let css=0,js=0;
  for(const file of files){
    const content=fs.readFileSync(file,'utf8');
    assert(!/DigneZzZ|SmallPoppa|selfsteal|react-dom|__vite|sourceMappingURL|id="root"/i.test(content),`${file}: donor artifact`);
    if(file.endsWith('.css'))css++;
    if(file.endsWith('.js')){js++;execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}
    if(file.endsWith('.json')||file.endsWith('.webmanifest'))JSON.parse(content);
    if(!file.endsWith('.html'))continue;
    assert(/<main[ >]/.test(content),`${file}: missing landmark`);
    assert(!/<style>|<script>|data:image/.test(content),`${file}: embedded assets`);
    const title=content.match(/<title>([^<]+)<\/title>/)[1],description=content.match(/name="description" content="([^"]+)"/)[1];
    assert(content.includes(`property="og:title" content="${title}"`));
    assert(content.includes(`property="og:description" content="${description}"`));
    assert.equal(content.match(/name="application-name" content="([^"]+)"/)[1],manifest.name);
    for(const [,ref] of content.matchAll(/(?:src|href)="([^"#]+)"/g)){
      if(!ref.startsWith('/'))continue;
      const asset=path.join(dir,decodeURIComponent(ref.split('?')[0]));
      assert(fs.existsSync(asset),`${file}: missing ${ref}`);
    }
  }
  assert(css>0,`${folder}: no stylesheet`);
  assert(js>0,`${folder}: no script`);
  for(const icon of manifest.icons)assert(fs.statSync(path.join(dir,icon.src)).isFile());
  if(folder.endsWith('-status')){
    const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
    assert(html.includes('data-request-id')&&html.includes('data-countdown'));
    assert(files.filter(f=>f.endsWith('.js')).some(f=>fs.readFileSync(f,'utf8').includes('https://api.ipify.org?format=json')));
  }
  console.log(`PASS: ${folder}: separate HTML/CSS/JS, metadata, icons, JSON and complete local links`);
}
assert.equal(identities.size,11);
require('./check-selfsteal-login.js');

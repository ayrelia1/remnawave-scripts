// Each published site is a complete document, with no donor runtime or asset graph.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../sni-templates');
const titles=new Set();
for(const folder of fs.readdirSync(root).filter(f=>fs.statSync(path.join(root,f)).isDirectory())){
  const files=fs.readdirSync(path.join(root,folder));
  assert.deepEqual(files,['index.html'],`${folder}: distribution must be self-contained`);
  const html=fs.readFileSync(path.join(root,folder,'index.html'),'utf8');
  assert(/<main[ >]/.test(html)&&/<h1[ >]/.test(html),`${folder}: readable content without JS`);
  assert(!/DigneZzZ|SmallPoppa|selfsteal|react-dom|__vite|\/assets\/|id="root"|sourceMappingURL/i.test(html),`${folder}: donor artifact`);
  assert(!/(?:src|href)="\/(?!["#])/.test(html),`${folder}: external asset dependency`);
  const title=html.match(/<title>([^<]+)<\/title>/)[1];
  assert(!titles.has(title),`${folder}: duplicate title`);titles.add(title);
  const description=html.match(/name="description" content="([^"]+)"/)[1];
  assert(html.includes(`property="og:title" content="${title}"`));
  assert(html.includes(`property="og:description" content="${description}"`));
  for(const [,js] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)){
    execFileSync(process.execPath,['--check'],{input:js,stdio:['pipe','pipe','pipe']});
  }
  if(folder.startsWith('503-')){
    assert(html.includes('data-request-id')&&html.includes('data-countdown'));
    assert(html.includes('https://api.ipify.org?format=json'));
  }
  console.log(`PASS: ${folder}: complete HTML, distinct metadata, script syntax and no donor resources`);
}
assert.equal(titles.size,11);

// These distributions must remain standalone, readable websites without the donor bundles.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../sni-templates');
for (const folder of fs.readdirSync(root).filter(name => fs.statSync(path.join(root, name)).isDirectory())) {
  const files = fs.readFileSync(path.join(root, folder, 'files.list'), 'utf8').trim().split('\n');
  const html = fs.readFileSync(path.join(root, folder, 'index.html'), 'utf8');
  assert(/<main[ >]/.test(html) && /<h1[ >]/.test(html), `${folder}: content depends on JavaScript`);
  assert(!/id="root"|\/assets\/|vite|react|SmallPoppa|DigneZzZ|selfsteal/i.test(html), `${folder}: donor shell`);
  for (const file of files) {
    assert(!/^assets\//.test(file), `${folder}: old asset directory`);
    const content = fs.readFileSync(path.join(root, folder, file), 'utf8');
    assert(!/SmallPoppa|DigneZzZ|selfsteal|react-dom|__vite|\/\*![\s\S]*React/i.test(content), `${folder}/${file}: donor artifact`);
  }
  console.log(`PASS: ${folder}: independent HTML and resource distribution`);
}

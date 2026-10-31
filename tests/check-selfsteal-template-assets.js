// Validate the independently served template asset graph using only Node.js.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..', 'sni-templates');
const folders = ['10gag', 'convertit', 'converter', 'downloader', 'filecloud',
  'games-site', 'modmanager', 'speedtest', 'YouTube', '503-1', '503-2'];
const identities = new Set();
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);

for (const folder of folders) {
  const dir = path.join(root, folder);
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  const app = html.match(/name="application-name" content="([^"]+)"/)[1];
  const description = html.match(/name="description" content="([^"]+)"/)[1];
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'site.webmanifest'), 'utf8'));
  const inventory = fs.readFileSync(path.join(dir, 'files.list'), 'utf8').trim().split(/\r?\n/).sort();
  const actual = walk(dir).map(file => path.relative(dir, file).split(path.sep).join('/'))
    .filter(file => file !== 'files.list').sort();
  assert.deepEqual(inventory, actual, `${folder}: stale download inventory`);
  assert(!identities.has(app), `${folder}: duplicate identity`);
  identities.add(app);
  assert.equal(manifest.name, app, `${folder}: manifest identity`);
  assert(html.includes(`property="og:title" content="${title}"`));
  assert(html.includes(`property="og:description" content="${description}"`));
  assert(!/MyWebSite|MySite|vite\.svg|fonts\.googleapis/.test(html));
  const assets = [...html.matchAll(/(?:href|src)="(\/[^"?#]+)(?:\?[^"#]*)?"/g)]
    .map(match => match[1]).concat(manifest.icons.map(icon => icon.src));
  for (const asset of assets) {
    assert(fs.statSync(path.join(dir, asset)).isFile(), `${folder}: missing ${asset}`);
  }
  for (const file of walk(dir).filter(file => file.endsWith('.js'))) {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  }
  const icon = fs.readFileSync(path.join(dir, manifest.icons[0].src), 'utf8');
  assert(icon.includes('<svg') && icon.includes('viewBox="0 0 64 64"'));
  console.log(`PASS: ${folder}: local assets, metadata, icon and JavaScript syntax`);
}
require('./check-selfsteal-independent-pages.js');
require('./check-selfsteal-flow.js');

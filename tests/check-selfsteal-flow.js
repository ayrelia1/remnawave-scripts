// Freeze donor install/CLI/config contracts, allowing only template labels.
// Reference: DigneZzZ/remnawave-scripts a318e2c8baf3e1a4b77b27b7a56dc349b36a711b.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const source = fs.readFileSync(path.join(__dirname,'../selfsteal.sh'),'utf8').replace(/\r\n/g,'\n');
function block(name) {
  const start = source.indexOf(name+'() {');
  assert(start >= 0, `Missing donor function ${name}`);
  const offset = start + name.length + 5;
  const next = /^\w+\(\) [({]/m.exec(source.slice(offset));
  let text = source.slice(start,next ? offset + next.index : source.length).trimEnd();
  text = text.slice(0,text.lastIndexOf('\n}')+2);
  return text.replace(/    local template_names=\([^\n]*\)/,'    local template_names=(DISPLAY_NAMES)');
}
const expected = {
  install_command:'13e5121f90edd0922e65a55a660c308b2aae99cb563865c3342b5c38118ba6ff',
  create_caddy_config:'dc769b921ea63848038cc46d271f0c534ea6af8a3dfd9e2392385b30ecfc2de5',
  create_nginx_config:'7b5b0d0047ac6140769565b2c071c0f95e65d5758ace6ca8cc295d1909c42fec',
  init_web_server_config:'8c0096421112950fbee8a0a099af948607ade63c0ad5fafafa4582a001a41368',
  install_management_script:'70a23543fe4388205af90d4ed37708497e6d73ef6da16b8039349011225863e8',
  arguments:'8b617453b31b6ac0a2735f77a9a4074c5a86720b2988695869637765150f52d4'
};
for (const [name,hash] of Object.entries(expected)) {
  const text = name==='arguments' ? source.slice(source.indexOf('# Parse command line arguments'),
    source.indexOf('# Initialize web server configuration based on selection')).trimEnd() : block(name);
  assert.equal(createHash('sha256').update(text).digest('hex'),hash,`${name}: donor flow/config changed`);
  console.log(`PASS: donor contract: ${name}`);
}

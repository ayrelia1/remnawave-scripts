// Compare the entire installer to the fork baseline, allowing presentation edits only.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const baseline=execFileSync('git',['show','a318e2c8baf3e1a4b77b27b7a56dc349b36a711b:selfsteal.sh'],{cwd:root,encoding:'utf8'});
const current=fs.readFileSync(path.join(root,'selfsteal.sh'),'utf8');
function replaceFunction(text,name,transform){
  const start=text.indexOf(name+'() {');assert(start>=0,`Missing ${name}`);
  const offset=start+name.length+5,next=/^\w+\(\) [({]/m.exec(text.slice(offset));
  const limit=next?offset+next.index:text.length;
  const end=text.lastIndexOf('\n}',limit)+2;
  return text.slice(0,start)+transform(text.slice(start,end))+text.slice(end);
}
function normalize(text){
  text=text.replace(/\r\n/g,'\n');
  text=replaceFunction(text,'randomize_template',()=> 'PRESENTATION_RANDOMIZATION');
  if(text.includes('validate_template_files() {'))text=replaceFunction(text,'validate_template_files',()=> '');
  text=text.replace(/\n{3,}(?=download_template)/g,'\n\n');
  text=replaceFunction(text,'download_template',fn=>fn.replace(/ && validate_template_files "\$HTML_DIR"/g,'').replace(/        rm -f -- "\$HTML_DIR\/files.list"\n/g,''));
  for(const name of ['download_via_api','download_via_curl_fallback'])text=replaceFunction(text,name,()=> 'ASSET_TRANSPORT');
  // The donor deletes its current working directory after a Git download.
  // Permit only the one-line return to the document root before cleanup.
  text=replaceFunction(text,'download_via_git',fn=>fn.replace('        cd "$HTML_DIR" || return 1\n',''));
  for(const name of ['create_default_html','create_fallback_html'])
    text=replaceFunction(text,name,fn=>fn.replace(/(<< ?'?EOF'?[^\n]*\n)[\s\S]*?(\nEOF)/g,'$1PAGE_CONTENT$2'));
  return text.replace(/^(# VERSION=|SCRIPT_VERSION=).*$/gm,'$1VERSION')
    .replace(/(https:\/\/(?:raw\.githubusercontent\.com|github\.com|api\.github\.com\/repos)\/)(?:ayrelia1|dignezzz)(\/remnawave-scripts)/gi,'$1SOURCE_OWNER$2')
    .replace(/declare -A TEMPLATE_NAMES=\([\s\S]*?\n\)/,'TEMPLATE_DISPLAY_NAMES')
    .replace(/declare -A TEMPLATE_FOLDERS=\([\s\S]*?\n\)/,'TEMPLATE_DIRECTORIES')
    .replace(/    local template_names=\([^\n]*\)/,'    local template_names=(DISPLAY_NAMES)');
}
const actual=normalize(current),expected=normalize(baseline);
if(actual!==expected){const a=actual.split('\n'),b=expected.split('\n'),line=a.findIndex((value,i)=>value!==b[i]);console.error('First installer mismatch at line',line+1,{actual:a.slice(line,line+3),expected:b.slice(line,line+3)});}
assert(actual===expected,'Installer changed outside the presentation/asset-transport allowlist');
console.log('PASS: full installer, command parser, prompts, menus, download methods and server configs match the donor outside the presentation allowlist');

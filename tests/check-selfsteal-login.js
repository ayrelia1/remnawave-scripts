// Template 5 is a local rejection-only sign-in screen, not a credential endpoint.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../sni-templates/editorial');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(html.includes('id="login-form"'),'Template 5 must be a sign-in page');
assert(!fs.existsSync(path.join(root,'workspace/editor.html')),'Editor must not remain accessible');
assert(!fs.existsSync(path.join(root,'desk/records/articles.json')),'Old cabinet data must be removed');
assert(/<fieldset[^>]*disabled/.test(html),'No-JS form must stay disabled');
const script=fs.readFileSync(path.join(root,html.match(/<script defer src="([^"]+)"/)[1]),'utf8');
assert(!/fetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|document\.cookie|console\./.test(script),'Sign-in data must not be sent or persisted');
assert(script.includes('Неверный логин или пароль.'),'Filled sign-ins must reject');
console.log('PASS: template 5: rejection-only sign-in, disabled no-JS form, no old cabinet or credential transport/storage');

// QA helper (see docs/HANDOFF.md).
// Static server that mimics the live routing: .com without /en prefix, .ge with it.
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
const [,,root,port,mode]=process.argv;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.txt':'text/plain','.xml':'application/xml','.json':'application/json','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};
http.createServer((req,res)=>{
 let p=decodeURIComponent(new URL(req.url,'http://x').pathname);
 const cands=[];
 if(mode==='intl'){cands.push(p==='/'?'/en.html':'/en'+p+'.html')}
 cands.push(p,p+'.html',path.join(p,'index.html'));
 for(const c of cands){const f=path.join(root,c);if(f.startsWith(root)&&fs.existsSync(f)&&fs.statSync(f).isFile()){res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(res);return}}
 res.writeHead(404);res.end('404');
}).listen(+port,'127.0.0.1');

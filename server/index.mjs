// Production server for the Docker image: serves the static export in ./out and accepts leads at
// POST /api/leads. No dependencies beyond Node itself.
import {createServer} from 'node:http';
import {createReadStream,existsSync,readFileSync,statSync} from 'node:fs';
import {extname,join,normalize,resolve} from 'node:path';
import {gzipSync} from 'node:zlib';
import {MAX_BODY,deliverLead,parseLead} from '../lib/lead-delivery.mjs';

const root=resolve(process.env.STATIC_DIR||new URL('../out',import.meta.url).pathname);
const port=Number(process.env.PORT||3000);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.rsc':'text/x-component','.woff2':'font/woff2'};
const compressible=new Set(['.html','.js','.css','.json','.svg','.txt','.xml','.rsc']);
const security={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'SAMEORIGIN','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Strict-Transport-Security':'max-age=31536000'};

if(!existsSync(join(root,'en.html'))){console.error('Static site not found in '+root+'. Run the static build first.');process.exit(1)}

// Small in-memory gzip cache: the site is a fixed set of files.
const gzCache=new Map();
function gz(file,mtime){const k=file+':'+mtime;let v=gzCache.get(k);if(!v){v=gzipSync(readFileSync(file));gzCache.set(k,v)}return v}

function resolveFile(pathname){
 const clean=normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/,'');
 for(const c of [clean,clean+'.html',join(clean,'index.html')]){
  const f=join(root,c);
  if(f.startsWith(root)&&existsSync(f)&&statSync(f).isFile())return f;
 }
 return null;
}

function sendFile(req,res,file,status=200){
 const ext=extname(file),st=statSync(file);
 const headers={...security,'Content-Type':types[ext]||'application/octet-stream',
  'Cache-Control':file.includes('/_next/static/')?'public, max-age=31536000, immutable':ext==='.html'||ext==='.rsc'?'no-cache':'public, max-age=3600',
  'Last-Modified':st.mtime.toUTCString()};
 if(compressible.has(ext)&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){
  const body=gz(file,st.mtimeMs);
  res.writeHead(status,{...headers,'Content-Encoding':'gzip','Vary':'Accept-Encoding','Content-Length':body.length});
  return res.end(req.method==='HEAD'?undefined:body);
 }
 res.writeHead(status,{...headers,'Content-Length':st.size});
 if(req.method==='HEAD')return res.end();
 createReadStream(file).pipe(res);
}

function json(res,status,body){res.writeHead(status,{...security,'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body))}

// At most 5 lead submissions per IP in 10 minutes.
const hits=new Map();
function limited(ip){
 const now=Date.now(),list=(hits.get(ip)||[]).filter(t=>now-t<600000);
 list.push(now);hits.set(ip,list);
 if(hits.size>5000)for(const [k,v] of hits)if(now-v[v.length-1]>600000)hits.delete(k);
 return list.length>5;
}

async function handleLead(req,res){
 const host=req.headers['x-forwarded-host']||req.headers.host;
 const origin=req.headers.origin;
 if(!origin||new URL(origin).host!==host)return json(res,403,{error:'origin'});
 const ip=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim();
 if(limited(ip))return json(res,429,{error:'rate'});
 let raw='';
 for await(const chunk of req){raw+=chunk;if(raw.length>MAX_BODY)return json(res,413,{error:'size'})}
 const {lead,error}=parseLead(raw);
 if(!lead)return json(res,400,{error});
 const result=await deliverLead(lead,process.env);
 if(result.errors.length)console.error('lead delivery errors:',result.errors.join('; '));
 if(result.status==='ok')return json(res,200,{ok:true});
 return json(res,result.status==='unavailable'?503:502,{error:result.status==='unavailable'?'unavailable':'delivery'});
}

function preferredLang(header=''){
 const ranked=String(header).split(',').map((part,i)=>{const [tag,...params]=part.trim().toLowerCase().split(';');const q=params.find(p=>p.trim().startsWith('q='));return {lang:tag.split('-')[0],q:q?Number(q.trim().slice(2))||0:1,i}}).sort((a,b)=>b.q-a.q||a.i-b.i);
 return ranked.find(r=>['ka','ru','en'].includes(r.lang))?.lang||'en';
}

const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||'/','http://localhost');
  if(url.pathname==='/api/leads'){
   if(req.method==='POST')return await handleLead(req,res);
   return json(res,405,{error:'method'});
  }
  if(url.pathname==='/healthz')return json(res,200,{ok:true});
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405,security);return res.end()}
  // The root sends visitors to their browser language: Georgian or Russian, English otherwise.
  if(url.pathname==='/'){res.writeHead(302,{...security,Location:'/'+preferredLang(req.headers['accept-language']),Vary:'Accept-Language','Cache-Control':'no-store'});return res.end()}
  // Trailing slashes redirect to the clean address.
  if(url.pathname.length>1&&url.pathname.endsWith('/')){res.writeHead(301,{...security,Location:url.pathname.slice(0,-1)+url.search});return res.end()}
  const file=resolveFile(url.pathname);
  if(file)return sendFile(req,res,file);
  const notFound=join(root,'404.html');
  if(existsSync(notFound))return sendFile(req,res,notFound,404);
  res.writeHead(404,security);res.end('Not found');
 }catch(e){
  console.error(e);
  if(!res.headersSent)json(res,500,{error:'server'});else res.end();
 }
});

server.listen(port,()=>console.log('Praxis AI site on :'+port+' (static: '+root+')'));
for(const sig of ['SIGTERM','SIGINT'])process.on(sig,()=>server.close(()=>process.exit(0)));

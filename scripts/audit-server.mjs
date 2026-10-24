import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import worker from '../dist/index.js';

// Serve the exact production Worker bundle and emitted public assets. No Vite
// development server, transforms or HMR are involved in audit measurements.
const root=resolve('dist');
const types={'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.webp':'image/webp','.avif':'image/avif','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.txt':'text/plain','.xml':'application/xml'};
async function asset(request){
 const pathname=decodeURIComponent(new URL(request.url).pathname);
 const path=resolve(root,`.${pathname}`);
 if(!path.startsWith(root+sep)||pathname.startsWith('/ssr/')||['/index.js','/_worker.js'].includes(pathname))return new Response('Not found',{status:404});
 try{if(!(await stat(path)).isFile())throw Error();return new Response(await readFile(path),{headers:{'Content-Type':types[extname(path)]||'application/octet-stream','Cache-Control':'public, max-age=604800'}});}catch{return new Response('Not found',{status:404});}
}
createServer(async(req,res)=>{
 try{
  const request=new Request(`http://127.0.0.1:3089${req.url}`,{method:req.method,headers:req.headers});
  let response=await asset(request);
  if(response.status===404)response=await worker.fetch(request,{ASSETS:{fetch:asset}},{waitUntil(){},passThroughOnException(){}});
  res.writeHead(response.status,Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
 }catch(error){res.writeHead(500);res.end(String(error));}
}).listen(3089,'127.0.0.1',()=>console.log('Production audit server: http://127.0.0.1:3089'));

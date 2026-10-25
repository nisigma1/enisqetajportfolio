import {chromium,devices} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'https://enisqetaj.com';
const directory='outputs/responsive-20261025/navigation-latency';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({...devices['iPhone 15 Pro Max']});
const page=await context.newPage();
const results=[];
try {
 await page.goto(origin,{waitUntil:'networkidle'});
 for(let run=1;run<=3;run++)for(const [label,path] of [['Background','/background'],['Work','/work'],['Malera Studio','/companies'],['Crypto Analysis','/pricing'],['Contact','/contact']]) {
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  const link=page.getByRole('dialog').getByRole('link',{name:new RegExp(label)});
  await link.evaluate(e=>e.addEventListener('click',()=>{window.qaNavigationStart=performance.now();},{once:true,capture:true}));
  await link.click();
  await page.waitForURL(origin+path);
  await page.locator('#app-shell[aria-busy="false"]').waitFor();
  const ms=await page.evaluate(()=>performance.now()-window.qaNavigationStart);
  results.push({run,label,path,clickToContentReadyMs:Math.round(ms)});
 }
} finally {await browser.close();}
const medians=Object.fromEntries([...new Set(results.map(r=>r.path))].map(path=>[path,results.filter(r=>r.path===path).map(r=>r.clickToContentReadyMs).sort((a,b)=>a-b)[1]]));
await writeFile(`${directory}/results.json`,JSON.stringify({origin,conditions:'Chromium touch emulation, no artificial CPU/network throttling, includes mosaic completion; not field INP',results,medians},null,2));
console.log(JSON.stringify(medians));

import assert from 'node:assert/strict';
import {chromium,devices} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://127.0.0.1:3089';
const directory='outputs/responsive-20261025/ambient-animation';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const context=await browser.newContext({...devices['iPhone 15 Pro Max']});
const page=await context.newPage();
const samples=[];
try {
 await page.goto(origin,{waitUntil:'networkidle'});
 const portrait=page.locator('.author-artifact');
 await portrait.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.author-artifact').dataset.animationVisible==='true');
 assert.equal(await portrait.evaluate(e=>getComputedStyle(e).animationPlayState),'running');
 await page.locator('#contact').scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.author-artifact').dataset.animationVisible==='false');
 assert.equal(await portrait.evaluate(e=>getComputedStyle(e).animationPlayState),'paused');
 await page.waitForTimeout(1500);
 const cdp=await context.newCDPSession(page);
 await cdp.send('Performance.enable');
 for(let run=1;run<=3;run++) {
  const before=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  await page.waitForTimeout(3000);
  const after=Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  samples.push({run,...Object.fromEntries(['TaskDuration','RecalcStyleDuration','RecalcStyleCount','LayoutDuration'].map(k=>[k,after[k]-before[k]]))});
 }
 await portrait.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('.author-artifact').dataset.animationVisible==='true');
 assert.equal(await portrait.evaluate(e=>getComputedStyle(e).animationPlayState),'running');
} finally {await browser.close();}
await writeFile(`${directory}/results.json`,JSON.stringify({origin,visibleEffectPreserved:true,offscreenPaused:true,resumes:true,samples},null,2));
console.log(JSON.stringify(samples));

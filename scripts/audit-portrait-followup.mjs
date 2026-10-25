import assert from 'node:assert/strict';
import {webkit,chromium,devices} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://127.0.0.1:3089';
const directory='outputs/responsive-20261025/portrait-followup';
await mkdir(directory,{recursive:true});
const browsers={webkit:await webkit.launch(),chromium:await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'})};
const results=[];
try {
 for(const [engine,browser] of Object.entries(browsers))for(const width of engine==='webkit'?[390,430]:[320,390,430,768,1440]) {
  const context=await browser.newContext({...(width<768?devices['iPhone 15 Pro Max']:{}),viewport:{width,height:932},screen:{width,height:932}});
  await context.addInitScript(()=>localStorage.setItem('enis-theme','light'));
  const page=await context.newPage();
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'.pixel-image__piece{animation:none!important;opacity:1!important}'});
  await page.locator('.pixel-image__source').evaluate(i=>i.decode());
  const result=await page.locator('.pixel-image').evaluate(e=>{
   const r=e.getBoundingClientRect();
   const pieces=[...e.querySelectorAll('.pixel-image__piece')];
   return {currentSrc:e.querySelector('img').currentSrc,pieces:pieces.length,areaRatio:pieces.reduce((sum,p)=>{const b=p.getBoundingClientRect();return sum+b.width*b.height;},0)/(r.width*r.height),imageRequests:performance.getEntriesByType('resource').filter(r=>/images\/enis\//.test(r.name)).map(r=>r.name)};
  });
  assert.match(result.currentSrc,/\.webp$/);
  assert.equal(result.pieces,24);
  assert.ok(Math.abs(result.areaRatio-1)<0.002);
  assert.equal(result.imageRequests.length,1,JSON.stringify({engine,width,...result}));
  await page.locator('.pixel-image').screenshot({path:`${directory}/portrait-${engine}-${width}.png`});
  if(width===430&&engine==='webkit') {
   await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   const header=await page.locator('.masthead').screenshot({path:`${directory}/header-after.png`});
   const reference=await context.newPage();
   await reference.goto('https://enisqetaj.com/',{waitUntil:'networkidle'});
   await reference.evaluate(()=>document.fonts.ready);
   const before=await reference.locator('.masthead').screenshot({path:`${directory}/header-before.png`});
   const a=await sharp(header).raw().toBuffer(),b=await sharp(before).raw().toBuffer();
   result.headerSameDimensions=a.length===b.length;
   result.headerMeanDifference=a.length===b.length?a.reduce((sum,v,i)=>sum+Math.abs(v-b[i]),0)/a.length:null;
   await reference.close();
  }
  results.push({engine,width,...result});
  await context.close();
 }
} finally {await Promise.all(Object.values(browsers).map(b=>b.close()));}
await writeFile(`${directory}/results.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));

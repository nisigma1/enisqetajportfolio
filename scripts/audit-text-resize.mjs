import {webkit,devices} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://127.0.0.1:3089';
const directory='outputs/responsive-20261025/text-resize';
await mkdir(directory,{recursive:true});
const browser=await webkit.launch();
const results=[];
try {
 for(const width of [320,390,430]) {
  const context=await browser.newContext({...devices['iPhone 15 Pro Max'],viewport:{width,height:844}});
  const page=await context.newPage();
  for(const route of ['/','/background','/work','/companies','/pricing','/contact','/work/besiana-photography']) {
   await page.goto(origin+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   for(const scale of [1,1.3,2]) {
    await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale*100}%`,scale);
    await page.evaluate(async()=>{
     for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,20));}
     scrollTo({top:0,behavior:'instant'});
    });
    await page.waitForTimeout(100);
    const measurement=await page.evaluate(()=>{
     const width=document.documentElement.clientWidth;
     const nodes=[...document.querySelectorAll('main h1, main h2, main h3, main p, main a, main button, main select, main li')];
     const failures=nodes.filter(e=>{
      const r=e.getBoundingClientRect(),s=getComputedStyle(e);
      if(!r.width||!r.height||s.visibility==='hidden'||e.closest('[aria-hidden="true"],.visually-hidden,.fold-text__sr-only'))return false;
      return r.right>width+2||r.left< -2||e.scrollWidth>e.clientWidth+2;
     }).map(e=>({tag:e.tagName,class:String(e.className),text:e.textContent.trim().slice(0,80),width:e.clientWidth,scroll:e.scrollWidth}));
     const brand=document.querySelector('.masthead-name');
     const brandLines=brand?Math.round(brand.getBoundingClientRect().height/parseFloat(getComputedStyle(brand).lineHeight)):0;
     return {width,scrollWidth:document.documentElement.scrollWidth,brandLines,failures};
    });
    results.push({width,route,scale,...measurement});
   }
  }
  await context.close();
  console.log(`text resize ${width} complete`);
 }
} finally {await browser.close();}
await writeFile(`${directory}/results.json`,JSON.stringify(results,null,2));
const failures=results.filter(r=>r.scrollWidth>r.width+1||r.failures.length||r.brandLines>2);
await writeFile(`${directory}/failures.json`,JSON.stringify(failures,null,2));
console.log(JSON.stringify({checks:results.length,failures:failures.length}));
if(failures.length)process.exitCode=1;

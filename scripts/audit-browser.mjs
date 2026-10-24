import { chromium } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2] || 'before';
const origin = process.argv[3] || 'http://127.0.0.1:3089';
const directory = `outputs/audit-20261019/${phase}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const routes = ['/', '/background', '/work', '/work/barber-brothers', '/work/hixhame-tina', '/work/besiana-photography', '/companies', '/malera', '/pricing', '/contact', '/about', '/research', '/markets', '/build'];
const sizes = [[320,568],[360,800],[390,844],[430,932],[768,1024],[1440,900],[1920,1080]];
const results = [];
const jobs=sizes.flatMap(([width,height])=>['light','dark'].map(theme=>({width,height,theme})));
let saveQueue=Promise.resolve();
async function worker(){
  while(jobs.length){
    const {width,height,theme}=jobs.shift();
    const context = await browser.newContext({viewport:{width,height},colorScheme:theme});
    await context.addInitScript((theme) => localStorage.setItem('enis-theme', theme),theme);
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => {if(message.type() === 'error')errors.push(message.text());});
      const response = await page.goto(origin+route,{waitUntil:'networkidle',timeout:45000});
      await page.evaluate(async () => {
        // Walk content to exercise lazy media and deferred islands.
        for(let y=0;y<document.documentElement.scrollHeight;y+=600){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,35));}
        window.scrollTo({top:0,behavior:'instant'});
        await document.fonts.ready;
      });
      await page.waitForTimeout(350);
      await page.waitForLoadState('networkidle');
      const measurement = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const outside = [...document.querySelectorAll('main *')].filter(e=> {
          const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
          return r.width>0 && s.display!=='none' && (r.right>viewport+2 || r.left<-2) && !e.closest('[aria-hidden="true"]');
        }).map(e=>({tag:e.tagName,class:e.className,left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right)}));
        return {width:viewport,scrollWidth:document.documentElement.scrollWidth,outside:outside.slice(0,30),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)};
      });
      const filename = `${width}-${theme}-${route.replaceAll('/','_')||'home'}`;
      if ([390,430,1440].includes(width)) await page.screenshot({path:`${directory}/${filename}.png`,fullPage:true,animations:'disabled'});
      results.push({route,width,height,theme,status:response.status(),...measurement,errors});
      await page.close();
    }
    await context.close();
    const snapshot=JSON.stringify(results,null,2);
    saveQueue=saveQueue.then(()=>writeFile(`${directory}/responsive.json`,snapshot));
    await saveQueue;
    console.log(`${phase}: ${width}px ${theme} complete`);
  }
}
await Promise.all([worker(),worker(),worker()]);
await saveQueue;
await browser.close();
console.log(JSON.stringify({checks:results.length,overflow:results.filter(r=>r.scrollWidth>r.width+1).map(r=>({route:r.route,width:r.width,theme:r.theme})),errors:results.filter(r=>r.errors.length),broken:results.filter(r=>r.brokenImages.length)},null,2));

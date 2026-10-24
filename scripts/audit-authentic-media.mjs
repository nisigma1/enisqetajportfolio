import { chromium } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('https://besianaphotography.com/',{waitUntil:'networkidle'});
await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=650){scrollTo(0,y);await new Promise(r=>setTimeout(r,150));}});
const assets=await page.locator('img').evaluateAll(images=>images.map(e=>({src:e.currentSrc,srcset:e.srcset,alt:e.alt,width:e.naturalWidth,height:e.naturalHeight})));
await writeFile('outputs/audit-20261019/authentic-assets.json',JSON.stringify(assets,null,2));
console.log(JSON.stringify(assets,null,2));
// These source paths are read from the actual page, not invented artwork.
const hero=assets.find(e=>e.src.includes('frame-01'));
if(hero){
 const source=hero.src;
 const data=Buffer.from(await(await fetch(source)).arrayBuffer());
 const metadata=await sharp(data).metadata();
 await sharp(data).webp({quality:88}).toFile('public/projects/besiana-photography/besiana-authentic-portrait.webp');
 await sharp(data).resize({width:480,withoutEnlargement:true}).webp({quality:84}).toFile('public/projects/besiana-photography/besiana-authentic-portrait-480.webp');
 console.log(JSON.stringify({source,width:metadata.width,height:metadata.height}));
}
await page.evaluate(()=>scrollTo(0,0));
await page.screenshot({path:'outputs/audit-20261019/authentic-besiana-desktop.png',fullPage:false});
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'outputs/audit-20261019/authentic-besiana-mobile.png',fullPage:false});
await browser.close();

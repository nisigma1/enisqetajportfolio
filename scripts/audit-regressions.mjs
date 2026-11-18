import assert from 'node:assert/strict';
import {chromium} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://127.0.0.1:3089';
const directory=process.argv[3]||'outputs/audit-20261019/after';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
for(const width of [320,360,390,430,768,1440,1920]){
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.goto(origin+'/pricing',{waitUntil:'networkidle'});
 const notes=page.locator('.research-note');
 assert.equal(await notes.count(),4);
 for(const image of await notes.locator('img').all()){
  await image.scrollIntoViewIfNeeded();
  assert.ok(await image.evaluate(async image=>{await image.decode();return image.naturalWidth;}));
 }
 const contained=async()=>notes.evaluateAll(cards=>cards.every(card=>{const r=card.getBoundingClientRect();const parent=card.closest('.research-notes__grid').getBoundingClientRect();return r.left>=parent.left-1&&r.right<=parent.right+1&&card.scrollWidth<=card.clientWidth+1;}));
 assert.equal(await contained(),true,`research card ${width}px`);
 await page.locator('.research-note__footer > span:first-child').first().evaluate(e=>{e.textContent='ResearchTitle'.repeat(30);});
 assert.equal(await contained(),true,`long research title ${width}px`);
 if(width===1440){await page.addStyleTag({content:'html { zoom: 2; }'});assert.equal(await contained(),true,'200% CSS zoom');await page.screenshot({path:`${directory}/research-200-percent.png`});}
 await page.goto(origin+'/work/besiana-photography',{waitUntil:'networkidle'});
 await page.locator('.besiana-artwork__authentic').evaluate(async image=>{await image.decode();});
 assert.equal(await page.locator('.besiana-artwork__phone').count(),0);
 assert.equal(await page.locator('.besiana-gallery img').count(),2);
 for(const image of await page.locator('.besiana-gallery img').all()){await image.scrollIntoViewIfNeeded();await image.evaluate(async image=>{await image.decode();});assert.equal(await image.evaluate(i=>i.naturalWidth>0),true);}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 results.push({width,researchContained:true,longTitleContained:true,besianaImagesLoaded:true,noPhoneOverlay:true});
 await page.close();
}
const page=await browser.newPage({viewport:{width:390,height:844}});
for(const [index,name]of ['Technical','Advanced','Complete'].entries()){
 await page.goto(origin+'/pricing',{waitUntil:'networkidle'});
 await page.getByRole('link',{name:'Request this plan',exact:true}).nth(index).click();
 await page.waitForURL(/\/contact\?.*#contact-form$/);
 await page.waitForFunction(plan=>document.querySelector('[name="project"]').value.includes(plan),name);
 await page.locator('[name="paymentMethod"]').waitFor();
}
await page.goto(origin+'/companies',{waitUntil:'networkidle'});
await page.getByRole('link',{name:'Discuss a project',exact:true}).click();
await page.waitForURL(/\/contact\?service=digital-project#contact-form$/);
await page.waitForFunction(()=>document.querySelector('[name="project"]')?.value==='Digital Project');
assert.equal(await page.locator('[name="paymentMethod"]').count(),0);
results.push({threeResearchPlanPrefills:true,digitalProjectPrefill:true});
for(const [path,expected]of [['/research/no-published-note',404],['/work/unknown-project',404],['/work/barber-brothers/cover',200]]){const response=await page.goto(origin+path,{waitUntil:'networkidle'});assert.equal(response.status(),expected);results.push({path,status:response.status()});}
await page.goto(origin+'/pricing',{waitUntil:'networkidle'});
for(const value of ['€30','€60','€100'])assert.ok((await page.locator('main').innerText()).replaceAll(/\s/g,'').includes(value));
await page.goto(origin+'/background',{waitUntil:'networkidle'});
await page.locator('#crypto-curriculum').scrollIntoViewIfNeeded();
await page.waitForFunction(()=>document.querySelector('main').innerText.includes('Crypto Markets Curriculum'));
const background=await page.locator('main').innerText();
for(const text of ['Marketing','Banking & Finance','In progress','Crypto Markets Curriculum','Blockchain Basics'])assert.ok(background.includes(text),text);
const links=await page.locator('a[href^="/"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))]);
for(const href of links){const response=await page.request.get(origin+href);assert.ok(response.status()<400,href);}
results.push({pricesPreserved:true,backgroundPreserved:true,localLinks:links.length});
await writeFile(`${directory}/regressions.json`,JSON.stringify(results,null,2));
await browser.close();
console.log(JSON.stringify(results,null,2));

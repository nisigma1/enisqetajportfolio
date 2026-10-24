import assert from 'node:assert/strict';
import {chromium} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';

const origin=process.argv[2]||'http://127.0.0.1:3089';
const directory=process.argv[3]||'outputs/audit-20261019/after';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const routes=['/','/background','/work','/work/barber-brothers','/work/hixhame-tina','/work/besiana-photography','/companies','/malera','/pricing','/contact','/about','/research','/markets','/build'];
const links=new Set();
for(const route of routes){
  await page.goto(origin+route,{waitUntil:'networkidle'});
  for(const href of await page.locator('a[href^="/"]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))))links.add(href);
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.getByText('Context first. Then build.',{exact:true}).waitFor({state:'visible'});
}
const checked=[];
for(const href of links){
  const response=await page.request.get(origin+href);
  assert.ok(response.status()<400,`${href}: ${response.status()}`);
  checked.push({href,status:response.status()});
}
await page.goto(origin+'/work/besiana-photography',{waitUntil:'networkidle'});
assert.equal(await page.getByRole('link',{name:'Visit live website',exact:true}).getAttribute('href'),'https://besianaphotography.com/');
await page.goto(origin+'/background',{waitUntil:'networkidle'});
await page.evaluate(()=>scrollTo({top:700,behavior:'instant'}));
await page.waitForTimeout(150);
const previousScroll=await page.evaluate(()=>scrollY);
// A real tap on the sticky button does not request scrollIntoView. Locator
// click's auto-scroll can move a sticky control's original layout position.
const menuBox=await page.getByRole('button',{name:'Menu',exact:true}).boundingBox();
await page.mouse.click(menuBox.x+menuBox.width/2,menuBox.y+menuBox.height/2);
assert.equal(await page.evaluate(()=>document.body.style.top),`-${previousScroll}px`);
await page.getByRole('dialog').getByRole('link',{name:/Work/}).click();
await page.waitForURL(origin+'/work');
await page.locator('#app-shell[aria-busy="false"]').waitFor();
await page.goBack();
await page.waitForURL(origin+'/background');
await page.waitForTimeout(700);
const restoredScroll=await page.evaluate(()=>scrollY);
assert.ok(Math.abs(previousScroll-restoredScroll)<10,`back scroll ${previousScroll} -> ${restoredScroll}`);
await page.goForward();
await page.waitForURL(origin+'/work');
assert.notEqual(await page.evaluate(()=>document.body.style.position),'fixed');
await page.emulateMedia({reducedMotion:'reduce'});
await page.getByRole('button',{name:'Menu',exact:true}).click();
await page.getByRole('dialog').getByRole('link',{name:/Contact/}).click();
await page.waitForURL(origin+'/contact');
await page.locator('#app-shell[aria-busy="false"]').waitFor();

for(const width of [390,430])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:width===390?844:932});
  await page.addInitScript(theme=>localStorage.setItem('enis-theme',theme),theme);
  await page.goto(origin+'/companies',{waitUntil:'networkidle'});
  const besiana=page.locator('.malera-proof li').filter({hasText:'Besiana Photography'});
  await besiana.locator('img').evaluate(async i=>{i.scrollIntoView();await i.decode();});
  await besiana.screenshot({path:`${directory}/besiana-proof-${width}-${theme}.png`});
  await page.goto(origin,{waitUntil:'networkidle'});
  await page.locator('.home-practice-tabs').scrollIntoViewIfNeeded();
  await page.locator('.x-research-card img').evaluate(async i=>i.decode());
  await page.locator('.home-practice-tabs').screenshot({path:`${directory}/research-contained-${width}-${theme}.png`});
  await page.goto(origin+'/work/besiana-photography',{waitUntil:'networkidle'});
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await page.locator('.site-footer').screenshot({path:`${directory}/footer-${width}-${theme}.png`});
}
await writeFile(`${directory}/links-history.json`,JSON.stringify({checked,footerVisibleOnAllRoutes:true,backForward:true,previousScroll,restoredScroll,reducedMotionNavigation:true,authenticExternalHref:true},null,2));
await browser.close();
console.log(JSON.stringify({internalLinks:checked.length,backForward:true,footerVisibleOnAllRoutes:true}));

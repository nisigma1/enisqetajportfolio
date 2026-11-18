import assert from 'node:assert/strict';
import {webkit,devices} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const origin=process.argv[2]||'http://127.0.0.1:3089';
const directory=process.argv[3]||'outputs/responsive-20261025/after-final';
await mkdir(directory,{recursive:true});
const browser=await webkit.launch({headless:true});
const results=[];
async function tap(page,locator,{sticky=false}={}){
 if(!sticky){
  await locator.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 }
 const rect=await locator.boundingBox();
 assert.ok(rect,'touch target exists');
 await page.touchscreen.tap(rect.x+rect.width/2,rect.y+rect.height/2);
}
try{
 for(const name of ['iPhone 14','iPhone 15 Pro Max','iPhone 16 Pro Max','iPhone 17 Pro Max'])for(const theme of ['light','dark']){
  const context=await browser.newContext({...devices[name],colorScheme:theme});
  await context.addInitScript(t=>localStorage.setItem('enis-theme',t),theme);
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  page.on('requestfailed',request=>console.log(JSON.stringify({device:name,theme,failedRequest:request.url(),failure:request.failure()})));
  await page.goto(origin+'/background',{waitUntil:'networkidle'});
  await page.evaluate(()=>scrollTo({top:700,behavior:'instant'}));
  await page.waitForTimeout(250);
  await tap(page,page.getByRole('button',{name:'Menu',exact:true}),{sticky:true});
  await page.getByRole('dialog').waitFor();
  assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');
  assert.equal(await page.evaluate(()=>document.body.style.top),'-700px');
  await tap(page,page.getByRole('button',{name:'Close navigation'}));
  await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.waitForFunction(()=>Math.abs(scrollY-700)<2);
  for(const [label,path]of [['Work','/work'],['Malera Studio','/companies'],['Crypto Analysis','/pricing'],['Contact','/contact'],['Background','/background']]){
   await tap(page,page.getByRole('button',{name:'Menu',exact:true}),{sticky:true});
   await tap(page,page.getByRole('dialog').getByRole('link',{name:new RegExp(label)}));
   await page.waitForURL(origin+path);
   await page.locator('#app-shell[aria-busy="false"]').waitFor();
   assert.notEqual(await page.evaluate(()=>document.body.style.position),'fixed');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  const certification=page.locator('.journey-field').nth(3);
  assert.doesNotMatch(await certification.innerText(),/hours|5-day|15 hours/i);
  for(const module of await page.locator('.curriculum-module > button').all()){
   await tap(page,module);
   await page.waitForFunction(e=>e.getAttribute('aria-expanded')==='true',await module.elementHandle());
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  }
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.waitForLoadState('networkidle');
  await page.goto(origin,{waitUntil:'networkidle'});
  const main=page.getByRole('main');
  assert.equal(await main.locator('form').count(),0);
  assert.equal(await main.getByRole('link',{name:'View selected work',exact:true}).getAttribute('href'),'/work');
  assert.equal(await main.getByRole('link',{name:'Crypto Analysis',exact:true}).getAttribute('href'),'/pricing');
  assert.equal(await main.getByRole('link',{name:'Contact Enis',exact:true}).getAttribute('href'),'/contact');
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await page.waitForLoadState('networkidle');
  await page.goto(origin+'/contact?service=crypto-analysis&plan=advanced',{waitUntil:'networkidle'});
  await page.locator('form').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('[name="project"]').value.includes('Advanced'));
  for(const field of await page.locator('form input:not([name="website"]),form select,form textarea').all())assert.ok(await field.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16),'iOS form text >=16px');
  await tap(page,page.getByRole('button',{name:'Send request',exact:true}));
  await page.locator('[aria-invalid="true"]').first().waitFor();
  assert.equal(await page.locator('[aria-invalid="true"]').count(),4);
  const sent=[];
  await page.route('**/api/contact',route=>{
   sent.push(route.request().postDataJSON());
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Safari QA simulated delivery; no email sent.'})});
  });
  await page.locator('[name="name"]').fill('Safari QA');
  await page.locator('[name="email"]').fill('qa@example.com');
  await page.locator('[name="paymentMethod"]').selectOption('Crypto payment');
  await page.locator('[name="message"]').fill('Simulated Safari contact form regression test.');
  await tap(page,page.getByRole('button',{name:'Send request',exact:true}));
  await page.getByRole('status').filter({hasText:'Safari QA simulated delivery'}).waitFor();
  assert.equal(sent[0].paymentMethod,'Crypto payment');
  await page.locator('[name="project"]').selectOption('Digital Project');
  assert.equal(await page.locator('[name="paymentMethod"]').count(),0);
  await page.locator('[name="name"]').fill('Safari QA');
  await page.locator('[name="email"]').fill('qa@example.com');
  await page.locator('[name="message"]').fill('Simulated inquiry about a digital project.');
  await tap(page,page.getByRole('button',{name:'Send email',exact:true}));
  await page.getByRole('status').filter({hasText:'Safari QA simulated delivery'}).waitFor();
  assert.equal(sent[1].project,'Digital Project');
  assert.equal(sent[1].paymentMethod,'');
  const old=await page.locator('html').getAttribute('data-vibe');
  await tap(page,page.getByRole('button',{name:'Switch the vibe',exact:true}),{sticky:true});
  await page.waitForFunction(vibe=>document.documentElement.dataset.vibe!==vibe,old);
  assert.equal(errors.length,0,JSON.stringify(errors));
  results.push({name,theme,menuScrollLock:true,navigation:true,all11CurriculumModules:true,homeLinks:true,noTrainingDuration:true,formTextAtLeast16px:true,formValidation:true,cryptoAndDigitalMockDelivery:true,themeToggle:true,errors});
  await context.close();
  console.log(`${name} ${theme}: interactions PASS`);
  await writeFile(`${directory}/safari-interactions.json`,JSON.stringify(results,null,2));
 }
}finally{await browser.close();}

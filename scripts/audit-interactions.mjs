import assert from 'node:assert/strict';
import {chromium} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const phase=process.argv[2]||'before';
const origin=process.argv[3]||'http://127.0.0.1:3089';
const directory=`outputs/audit-20261019/${phase}`;
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results={navigation:[],loads:[],checks:[],errors:[]};
for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:900},isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage();
 const cdp=await context.newCDPSession(page);
 await cdp.send('Performance.enable');
 await page.addInitScript(()=>{
  window.auditLongTasks=[];window.auditShifts=[];
  new PerformanceObserver(list=>window.auditLongTasks.push(...list.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask',buffered:true});
  new PerformanceObserver(list=>window.auditShifts.push(...list.getEntries().filter(e=>!e.hadRecentInput).map(e=>e.value))).observe({type:'layout-shift',buffered:true});
 });
 for(let run=1;run<=3;run++){
  await cdp.send('Network.clearBrowserCache');
  for(const temperature of ['cold','warm']){
   await page.goto(origin,{waitUntil:'networkidle'});
   const load=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation')[0].toJSON(),resources:performance.getEntriesByType('resource').map(e=>({name:e.name,type:e.initiatorType,transfer:e.transferSize,decoded:e.decodedBodySize})),longTasks:window.auditLongTasks,shifts:window.auditShifts}));
   results.loads.push({mobile,run,temperature,...load});
  }
 }
 for(let cycle=0;cycle<3;cycle++)for(const [label,path]of [['Background','/background'],['Work','/work'],['Malera Studio','/companies'],['Crypto Analysis','/pricing'],['Contact','/contact']]){
  if(mobile){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('dialog').waitFor();assert.equal(await page.evaluate(()=>document.body.style.position),'fixed');}
  const start=performance.now();
  const link=mobile?page.getByRole('dialog').getByRole('link',{name:new RegExp(label)}):page.getByRole('navigation',{name:'Primary navigation',exact:true}).getByRole('link',{name:label,exact:true});
  await link.click();
  await page.waitForURL(origin+path,{timeout:15000});
  await page.locator('#app-shell[aria-busy="false"]').waitFor({timeout:15000});
  await page.locator('main h1').waitFor();
  const elapsed=performance.now()-start;
  const metrics=await cdp.send('Performance.getMetrics');
  results.navigation.push({mobile,cycle,path,clickToReadyMs:elapsed,metrics:metrics.metrics.filter(m=>['JSHeapUsedSize','Nodes','JSEventListeners','LayoutCount','RecalcStyleCount','ScriptDuration'].includes(m.name))});
  await writeFile(`${directory}/interactions.json`,JSON.stringify(results,null,2));
  assert.notEqual(await page.evaluate(()=>document.body.style.position),'fixed');
 }
 await page.goto(origin+'/contact?service=crypto-analysis&plan=advanced',{waitUntil:'networkidle'});
 assert.match(await page.locator('select[name="project"]').inputValue(),/Advanced/);
 await page.getByRole('button',{name:'Send email',exact:true}).click();
 assert.equal(await page.locator('[aria-invalid="true"]').count(),4);
 await page.route('**/api/contact',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,message:'Audit mock delivery succeeded. No email sent.'})}));
 await page.locator('[name="name"]').fill('QA Test');await page.locator('[name="email"]').fill('qa@example.com');await page.locator('[name="paymentMethod"]').selectOption('Crypto payment');await page.locator('[name="message"]').fill('This is a simulated browser test of the contact form.');
 await page.getByRole('button',{name:'Send email',exact:true}).click();await page.getByRole('status').filter({hasText:'Audit mock delivery'}).waitFor();
 results.checks.push({mobile,formValidation:true,formSuccessMock:true,planPrefill:true});
 if(mobile){await page.getByRole('button',{name:'Menu',exact:true}).click();await page.getByRole('button',{name:'Close navigation'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});assert.notEqual(await page.evaluate(()=>document.body.style.position),'fixed');}
 const themeBefore=await page.locator('html').getAttribute('data-theme');
 await page.getByRole('button',{name:/Switch to .* theme/}).click();
 assert.notEqual(await page.locator('html').getAttribute('data-theme'),themeBefore);
 results.checks.push({mobile,theme:true,menuClose:true});
 await context.close();
}
await browser.close();
await writeFile(`${directory}/interactions.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({checks:results.checks,navigation:results.navigation.map(({mobile,path,clickToReadyMs})=>({mobile,path,clickToReadyMs}))},null,2));

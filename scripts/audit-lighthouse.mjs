import lighthouse from '../.tmp/audit-tools/node_modules/lighthouse/core/index.js';
import { chromium } from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const phase=process.argv[2]||'before';
const origin=process.argv[3]||'http://127.0.0.1:3089';
const directory=`outputs/audit-20261019/${phase}`;
await mkdir(directory,{recursive:true});
const results=[];
const routes=process.env.AUDIT_ROUTES?.split(',')||['/','/companies','/work/besiana-photography','/pricing','/contact'];
const devices=process.env.AUDIT_DEVICE==='mobile'?[false]:process.env.AUDIT_DEVICE==='desktop'?[true]:[false,true];
for(const route of routes){
 for(const desktop of devices){
  for(let run=1;run<=3;run++){
   const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--remote-debugging-port=9341']});
   try{
    const result=await lighthouse(origin+route,{port:9341,output:'json',onlyCategories:['performance'],logLevel:'error',...(desktop?{formFactor:'desktop',screenEmulation:{mobile:false,width:1440,height:900,deviceScaleFactor:1,disabled:false},throttling:{rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1,requestLatencyMs:0,downloadThroughputKbps:0,uploadThroughputKbps:0}}:{})});
    const {lhr}=result;
    if(lhr.runtimeError)throw Error(JSON.stringify(lhr.runtimeError));
    const values={route,device:desktop?'desktop':'mobile',run,score:lhr.categories.performance.score*100};
    for(const key of ['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index','interactive'])values[key]=lhr.audits[key]?.numericValue;
    values.resources=lhr.audits['resource-summary']?.details?.items;
    results.push(values);
    await writeFile(`${directory}/lh-${route.replaceAll('/','_')}-${values.device}-${run}.json`,JSON.stringify(lhr));
    await writeFile(`${directory}/performance.json`,JSON.stringify(results,null,2));
    console.log(JSON.stringify(values));
   }finally{await browser.close();}
  }
 }
}

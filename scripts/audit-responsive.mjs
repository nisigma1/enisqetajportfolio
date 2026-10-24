import {chromium,webkit,devices} from '../.tmp/audit-tools/node_modules/playwright/index.mjs';
import {mkdir,writeFile} from 'node:fs/promises';

const phase=process.argv[2]||'after';
const origin=process.argv[3]||'http://127.0.0.1:3089';
const directory=`outputs/responsive-20261025/${phase}`;
await mkdir(directory,{recursive:true});
const baseline=phase==='before';
const capture=process.env.AUDIT_SCREENSHOTS!=='0';
const routes=baseline?['/','/background','/work','/companies','/pricing','/contact']:['/','/background','/work','/work/barber-brothers','/work/hixhame-tina','/work/besiana-photography','/companies','/malera','/pricing','/contact','/about','/research','/markets','/build'];
const browsers={chromium:await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),webkit:await webkit.launch({headless:true})};
const profiles=baseline?[
 {engine:'webkit',name:'iPhone 15 Pro Max',options:devices['iPhone 15 Pro Max']},
 {engine:'webkit',name:'iPhone 16 Pro',options:devices['iPhone 16 Pro']},
]:[
 ...['iPhone 14','iPhone 15 Pro Max','iPhone 16','iPhone 16 Pro','iPhone 16 Pro Max','iPhone 17 Pro Max','iPhone 14 landscape'].map(name=>({engine:'webkit',name,options:devices[name]})),
 ...[[320,568],[375,812],[768,1024],[1024,768],[1280,800],[1440,900],[1920,1080]].map(([width,height])=>({engine:'chromium',name:`${width}x${height}`,options:{viewport:{width,height}}})),
];
const jobs=profiles.flatMap(profile=>['light','dark'].map(theme=>({...profile,theme})));
const results=[];
let writes=Promise.resolve();
try {
 async function worker(){while(jobs.length){
  const job=jobs.shift();
  const context=await browsers[job.engine].newContext({...job.options,colorScheme:job.theme});
  await context.addInitScript(theme=>localStorage.setItem('enis-theme',theme),job.theme);
  for(const route of routes){
   const page=await context.newPage();
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   let result={engine:job.engine,device:job.name,theme:job.theme,route};
   try {
    const response=await page.goto(origin+route,{waitUntil:'networkidle',timeout:45000});
    await page.evaluate(async()=>{
     await document.fonts.ready;
     for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,25));}
     scrollTo({top:0,behavior:'instant'});
    });
    await page.waitForTimeout(250);
    const measurements=await page.evaluate(()=>{
     const width=document.documentElement.clientWidth;
     const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&!e.closest('[aria-hidden="true"],.visually-hidden,.fold-text__sr-only');};
     const describe=e=>({tag:e.tagName,class:String(e.className).slice(0,150),text:e.textContent?.trim().slice(0,90),left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right),clientWidth:e.clientWidth,scrollWidth:e.scrollWidth});
     return {
      width,scrollWidth:document.documentElement.scrollWidth,
      outside:[...document.querySelectorAll('main *')].filter(e=>visible(e)&&(e.getBoundingClientRect().right>width+2||e.getBoundingClientRect().left< -2)).slice(0,20).map(describe),
      textOverflow:[...document.querySelectorAll('main h1,main h2,main h3,main p,main .button,main select')].filter(e=>visible(e)&&e.scrollWidth>e.clientWidth+2).map(describe),
      brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),
     };
    });
    result={...result,status:response.status(),...measurements,errors};
    if(capture&&(job.name==='iPhone 15 Pro Max'||job.name==='iPhone 16 Pro')&&['/','/background','/companies','/pricing','/contact','/work/besiana-photography'].includes(route)){
     // Paint deferred sections for a complete audit capture; layout is unchanged.
     await page.addStyleTag({content:'.site-footer, .site-section { content-visibility: visible !important; }'});
     const name=`${job.name.replaceAll(' ','-')}-${job.theme}-${route.replaceAll('/','_')}`;
     await page.screenshot({path:`${directory}/${name}.png`,fullPage:true,animations:'disabled'});
    }
   }catch(error){result={...result,failure:String(error),errors};}
   results.push(result);
   await page.close();
  }
  await context.close();
  const snapshot=JSON.stringify(results,null,2);
  writes=writes.then(()=>writeFile(`${directory}/responsive.json`,snapshot));
  await writes;
  console.log(`${phase}: ${job.engine} ${job.name} ${job.theme} complete`);
 }}
 await Promise.all([worker(),worker(),worker()]);
 await writes;
} finally {await Promise.all(Object.values(browsers).map(browser=>browser.close()));}
const failures=results.filter(r=>r.failure||r.status!==200||r.scrollWidth>r.width+1||r.outside?.length||r.textOverflow?.length||r.brokenImages?.length||r.errors?.length);
await writeFile(`${directory}/failures.json`,JSON.stringify(failures,null,2));
console.log(JSON.stringify({checks:results.length,failures:failures.length,details:`${directory}/failures.json`}));
if(failures.length)process.exitCode=1;

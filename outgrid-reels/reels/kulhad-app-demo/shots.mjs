import {createRequire} from 'module';const {chromium}=createRequire(import.meta.url)('playwright');
const b=await chromium.launch();
const url='file://'+process.cwd()+'/app/index.html';
const scale=+process.argv[2]||1, dir=process.argv[3]||'stills';
for(const n of ['splash','home','order','track','unit','dash']){
  const p=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:scale});
  await p.goto(url+(n==='splash'?'':'?splash=0'));await p.waitForTimeout(300);
  if(!['splash','home'].includes(n)){await p.evaluate(n=>window.__shot(n),n);await p.waitForTimeout(1500);}
  await p.screenshot({path:`${dir}/${n}.png`});await p.close();
}
await b.close();

import {createRequire} from 'module';import fs from 'fs';
const {chromium}=createRequire(import.meta.url)('playwright');
const scale=+process.argv[2]||3, dir='frames';
fs.rmSync(dir,{recursive:true,force:true});fs.mkdirSync(dir);
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:390*scale,height:844*scale},deviceScaleFactor:1});
await p.goto('file://'+process.cwd()+'/app/index.html?splash=0');await p.waitForTimeout(800);
const cdp=await p.context().newCDPSession(p);
const frames=[];let n=0;
cdp.on('Page.screencastFrame',async f=>{const fn=`${dir}/f${String(n++).padStart(5,'0')}.jpg`;fs.writeFileSync(fn,Buffer.from(f.data,'base64'));frames.push([fn,f.metadata.timestamp]);cdp.send('Page.screencastFrameAck',{sessionId:f.sessionId}).catch(()=>{});});
await p.goto('file://'+process.cwd()+'/app/index.html?demo=1&z='+scale+'');
await cdp.send('Page.startScreencast',{format:'jpeg',quality:95,everyNthFrame:1,maxWidth:390*scale,maxHeight:844*scale});
await p.waitForFunction(()=>window.__done===true,null,{timeout:180000,polling:200});
await p.waitForTimeout(300);await cdp.send('Page.stopScreencast');
let txt='';for(let i=0;i<frames.length;i++){const d=i<frames.length-1?frames[i+1][1]-frames[i][1]:0.5;txt+=`file '${frames[i][0].split('/')[1]}'\nduration ${d.toFixed(4)}\n`;}
txt+=`file '${frames.at(-1)[0].split('/')[1]}'\n`;fs.writeFileSync(dir+'/list.txt',txt);
console.log('frames',frames.length,'secs',(frames.at(-1)[1]-frames[0][1]).toFixed(1));
await b.close();

import {createRequire} from 'module';const {chromium}=createRequire(import.meta.url)('playwright');
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/frame.html');await p.waitForTimeout(400);await p.screenshot({path:'stills/bg.png'});await b.close();

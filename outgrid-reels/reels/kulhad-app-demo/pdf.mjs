import {createRequire} from 'module';const {chromium}=createRequire(import.meta.url)('playwright');
const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+process.cwd()+'/pdf/kulhadkart.html');await p.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth));await p.waitForTimeout(500);
await p.pdf({path:'out/KulhadKart_Concept_Note.pdf',format:'A4',printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});await b.close();

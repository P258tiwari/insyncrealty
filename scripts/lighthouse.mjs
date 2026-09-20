import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
fs.mkdirSync('audit-artifacts', {recursive:true});
const browser = await chromium.launch({channel:process.env.PW_CHANNEL || 'msedge',headless:true,args:['--remote-debugging-port=9225']});
try {
 const result = await lighthouse(process.argv[2] || 'http://localhost:3100', {port:9225,output:'json',logLevel:'error'});
 fs.writeFileSync('audit-artifacts/lighthouse-final.json',result.report);
 const r=result.lhr;
 console.log(JSON.stringify({scores:Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,v.score])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','cumulative-layout-shift','total-blocking-time','speed-index'].map(k=>[k,r.audits[k].displayValue]))},null,2));
} finally { await browser.close(); }
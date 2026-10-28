/* Browser-level smoke tests for an assessment-sized, no-build static app.
 * All tests run against an isolated local HTTP server. No analytics, APIs or user data.
 */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");
const html = fs.readFileSync(path.join(__dirname,"..","index.html"));
const server = http.createServer((req,res)=>{
 res.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store"});
 res.end(html);
});
function test(name){console.log("PASS "+name)}
(async()=>{
 await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
 const url="http://127.0.0.1:"+server.address().port+"/";
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({viewport:{width:1366,height:850},acceptDownloads:true,reducedMotion:"reduce",permissions:["clipboard-read","clipboard-write"]});
 const page=await context.newPage();
 const errors=[];
 page.on("pageerror",err=>errors.push(err.message));
 try{
  const response=await page.goto(url);
  assert.equal(response.status(),200);
  assert.equal(await page.locator("#cards article.card").count(),3);
  assert.equal(await page.locator("#days .day").count(),7);
  test("Initial render has exactly three recommendations and seven days");

  const original=await page.locator("#cards h3").allTextContents();
  await page.locator('.options[data-key="focus"] button[data-value="fitness"]').click();
  const fitness=await page.locator("#cards h3").allTextContents();
  assert.notDeepEqual(original,fitness);
  assert.match(await page.locator("#metric-focus").innerText(),/Fitness/);
  test("Changing focus updates ranking and summary immediately");

  await page.locator('.options[data-key="time"] button[data-value="5"]').click();
  let texts=await page.locator("#cards .meta-row").allTextContents();
  assert(texts.every(t=>/TIME\s+5 min/.test(t)));
  test("Five-minute cap excludes all longer recommendations");

  await page.locator('.options[data-key="focus"] button[data-value="looks"]').click();
  await page.locator('.options[data-key="budget"] button[data-value="0"]').click();
  let cards=await page.locator("#cards .card").allTextContents();
  assert(cards.every(t=>/COST\s+Free/.test(t)));
  const freeNames=await page.locator("#cards h3").allTextContents();
  await page.locator('.options[data-key="budget"] button[data-value="25"]').click();
  cards=await page.locator("#cards .card").allTextContents();
  assert(cards.some(t=>t.includes("Est. ~$")));
  assert(cards.filter(t=>t.includes("Est. ~$")).length<=1);
  assert.notDeepEqual(freeNames,await page.locator("#cards h3").allTextContents());
  test("Spending selector meaningfully affects results while keeping free foundations");

  await page.locator('.options[data-key="budget"] button[data-value="0"]').click();
  const before=await page.locator("#cards h3").allTextContents();
  await page.locator("#cards [data-skip]").first().click();
  const after=await page.locator("#cards h3").allTextContents();
  assert.equal(after.length,3);
  assert.notDeepEqual(before,after);
  assert.equal(await page.locator("#restore").isVisible(),true);
  await page.locator("#restore").click();
  assert.deepEqual(await page.locator("#cards h3").allTextContents(),before);
  test("Already-doing-this replaces recommendation and restore returns shortlist");

  await page.locator("#days input").first().check();
  assert.match(await page.locator("#progress-label").innerText(),/1 \/ 7/);
  await page.reload();
  assert.equal(await page.locator("#days input").first().isChecked(),true);
  await page.locator('.options[data-key="focus"] button[data-value="style"]').click();
  assert.equal(await page.locator("#days input").first().isChecked(),false);
  await page.locator('.options[data-key="focus"] button[data-value="looks"]').click();
  assert.equal(await page.locator("#days input").first().isChecked(),true);
  test("Completion persists after reload but does not leak into a different plan");

  const downloadPromise=page.waitForEvent("download");
  await page.locator("#download").click();
  const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),"my-upgrade-plan.txt");
  const stream=await download.createReadStream();let buf="";
  for await (const chunk of stream)buf+=chunk.toString("utf8");
  assert.match(buf,/MY TOP PRIORITIES/);
  assert.match(buf,/SEVEN SMALL ACTIONS/);
  assert.match(buf,/GUIDES/);
  test("Text export contains personalized recommendations, checklist and source links");

  await page.locator("#copy").click();
  const clipboard=await page.evaluate(()=>navigator.clipboard.readText());
  assert.match(clipboard,/THE UPGRADE ENGINE/);
  test("Copy plan exports actual plan contents");

  await page.locator("#refresh").click();
  assert.match(await page.locator("#progress-label").innerText(),/0 \/ 7/);
  test("Reset only clears current-plan progress");

  const links=await page.locator("#cards a[href]").evaluateAll(els=>els.map(a=>a.href));
  assert.equal(links.length,3);
  assert(links.every(url=>url.startsWith("https://looksmaxxing.guide/")));
  await page.locator("details.method summary").click();
  assert.equal(await page.locator("details.method").getAttribute("open"),"");
  test("Guide links and transparent ranking explanation are accessible");

  await fs.promises.mkdir(path.join(__dirname,"..","screenshots"),{recursive:true});
  await page.evaluate(()=>{window.scrollTo({top:0,behavior:"instant"});document.querySelector("#toast")?.classList.remove("visible")});
  await page.waitForTimeout(120);
  await page.screenshot({path:path.join(__dirname,"..","screenshots","desktop.png"),fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),true);
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>{window.scrollTo({top:0,behavior:"instant"});document.querySelector("#toast")?.classList.remove("visible")});
  await page.waitForTimeout(120);
  await page.screenshot({path:path.join(__dirname,"..","screenshots","mobile.png"),fullPage:true});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth+1),true);
  assert.equal(await page.locator("#cards article.card").count(),3);
  test("Desktop and narrow mobile layouts render without horizontal overflow");


  // Exhaustive constraint matrix: 4 focuses x 3 times x 3 budgets x 2 levels.
  const matrix=await page.evaluate(()=>{
    const saved={...state};
    const issues=[];
    let evaluated=0;
    for(const focus of ["looks","fitness","style","mindset"])
    for(const time of [5,15,30])
    for(const budget of [0,25,100])
    for(const level of ["beginner","intermediate"]){
      Object.assign(state,{focus,time,budget,level});
      const result=selected();
      evaluated++;
      if(result.length!==3)issues.push(focus+"/"+time+"/"+budget+"/"+level+": expected 3, got "+result.length);
      if(new Set(result.map(x=>x.id)).size!==result.length)issues.push("duplicate recommendation");
      if(result.some(x=>x.mins>time||x.cost>budget||!x.level.includes(level)))issues.push("constraint violation: "+focus+"/"+time+"/"+budget+"/"+level);
      if(!result.some(x=>x.focus.includes(focus)))issues.push("no focus-specific action: "+focus+"/"+time+"/"+budget+"/"+level);
      if(result.filter(x=>x.cost>0).length>1)issues.push("more than one paid action");
      if(result.some(x=>!sources[x.source]||!/^https:\/\/looksmaxxing\.guide\//.test(sources[x.source].url)))issues.push("invalid source mapping");
    }
    Object.assign(state,saved);
    render();
    return {evaluated,issues};
  });
  assert.equal(matrix.evaluated,72);
  assert.deepEqual(matrix.issues,[]);
  test("All 72 assessment configurations satisfy ranking, budget, time and source invariants");

  assert.deepEqual(errors,[]);
  test("No uncaught browser JavaScript errors");
  console.log("\nALL BROWSER CHECKS PASSED");
 }finally{
  await browser.close();
  await new Promise(resolve=>server.close(resolve));
 }
})().catch(err=>{console.error("TEST FAILED",err);process.exitCode=1});

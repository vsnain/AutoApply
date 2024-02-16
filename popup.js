// On click
document.getElementById("start").addEventListener("click", async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.pages()[0];
  
    await page.setBypassCSP(true);
  
    // Move mouse to search field
    await page.mouse.move(600, 300);
  
    // Click on search field 
    await page.click('input[name="q"]');
  
    // Wait a bit before typing
    await page.waitFor(1000);
  
    // Type search slowly letter by letter
    for(let c of "foo bar") {
      await page.type('input[name="q"]', c);
      await page.waitFor(50); 
    }
  
    // Press enter to search
    await page.keyboard.press('Enter');
  
    // Wait on results page  
    await page.waitForNavigation({waitUntil: 'networkidle0'});
  
    // Mouse movement
    await page.mouse.move(400, 600);  
  
    await browser.close();
  
  });
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.youtube.com/watch?v=M7lc1UVf-VE', { waitUntil: 'networkidle2' });

    // Wait for video to load and seek to desired time
    await page.waitForSelector('video');
    const video = await page.$('video');
    await video.evaluate(v => v.currentTime = 300);  // Set to specific time in seconds

    // Take a screenshot
    await page.screenshot({ path: 'screenshot.png' });

    await browser.close();
})();

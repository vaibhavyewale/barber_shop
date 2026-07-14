import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  const content = await page.content();
  console.log(content.substring(0, 500));
  await browser.close();
})();

/**
 * screenshot.js — Puppeteer screenshot workflow
 * Usage: node screenshot.js [url] [port]
 * Default: http://localhost:8080
 *
 * Saves to: temp_screenshots/
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function run() {
  const url = process.argv[2] || 'http://localhost:8080';
  const outDir = path.join(__dirname, 'temp_screenshots');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`📸 Taking screenshots of ${url}`);
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // ── Desktop (1440px) ──────────────────────────────────
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500)); // let animations settle

  await page.screenshot({
    path: path.join(outDir, 'desktop-hero.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(outDir, 'desktop-full.png'),
    fullPage: true,
  });
  console.log('  ✓ Desktop screenshots saved');

  // ── Mobile (390px — iPhone 14 Pro) ────────────────────
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({
    path: path.join(outDir, 'mobile-hero.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(outDir, 'mobile-full.png'),
    fullPage: true,
  });
  console.log('  ✓ Mobile screenshots saved');

  // ── Tablet (768px) ────────────────────────────────────
  await page.setViewport({ width: 768, height: 1024, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({
    path: path.join(outDir, 'tablet-full.png'),
    fullPage: true,
  });
  console.log('  ✓ Tablet screenshot saved');

  await browser.close();
  console.log(`\n✅ All screenshots saved to temp_screenshots/`);
}

run().catch(err => {
  console.error('Screenshot failed:', err.message);
  process.exit(1);
});

const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const base = process.env.WEDDING_TEST_URL || 'http://127.0.0.1:4173';
const swipe = async (locator, dx, dy = 0) => locator.evaluate((element, delta) => {
  const start = new Event('touchstart', { bubbles: true, cancelable: true });
  Object.defineProperty(start, 'touches', { value: [{ clientX: 200, clientY: 250 }] });
  element.dispatchEvent(start);
  const end = new Event('touchend', { bubbles: true, cancelable: true });
  Object.defineProperty(end, 'changedTouches', { value: [{ clientX: 200 + delta.dx, clientY: 250 + delta.dy }] });
  element.dispatchEvent(end);
}, { dx, dy });

(async () => {
  const defaults = (await import(pathToFileURL(path.resolve('src/config/weddingData.js')).href)).weddingData;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, hasTouch: width === 390, reducedMotion: 'reduce' });
      await context.route('**/cdn.pixabay.com/**', (route) => route.abort());
      const page = await context.newPage();
      await page.goto(base);
      await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
      await page.locator('.album-stage').scrollIntoViewIfNeeded();
      const caption = page.locator('.album-caption');
      await caption.getByText('Ảnh 7 / 9', { exact: true }).waitFor();
      const scrollBefore = await page.evaluate(() => scrollY);
      await swipe(page.locator('.album-stage'), -150, 5);
      await caption.getByText('Ảnh 8 / 9', { exact: true }).waitFor();
      await page.locator('.album-open').dispatchEvent('click');
      assert.equal(await page.locator('.gallery-dialog').count(), 0, 'Swipe must not also open the photo');
      await page.waitForTimeout(450); // Allow the synthetic click guard following a swipe to expire.
      await swipe(page.locator('.album-stage'), 8, -160);
      assert.equal(await caption.textContent().then((text) => text.includes('Ảnh 8 / 9')), true, 'Vertical gestures must not change photos');
      await page.getByRole('button', { name: 'Ảnh tiếp theo trong album', exact: true }).click();
      await caption.getByText('Ảnh 9 / 9', { exact: true }).waitFor();
      const activeBounds = await page.locator('.album-thumbnail[aria-pressed="true"]').boundingBox();
      const stripBounds = await page.locator('.album-thumbnails').boundingBox();
      assert(activeBounds.x >= stripBounds.x && activeBounds.x + activeBounds.width <= stripBounds.x + stripBounds.width + 1, 'Selected thumbnail must be visible');
      assert(Math.abs((await page.evaluate(() => scrollY)) - scrollBefore) < 2, 'Changing photos must not jump the page');
      await page.locator('.album-open').click();
      const dialog = page.getByRole('dialog', { name: 'Xem album ảnh cưới' });
      await dialog.getByText('Ảnh 9 / 9', { exact: true }).waitFor();
      await page.keyboard.press('ArrowRight');
      await dialog.getByText('Ảnh 1 / 9', { exact: true }).waitFor();
      await page.keyboard.press('Escape');
      await caption.getByText('Ảnh 1 / 9', { exact: true }).waitFor();
      await page.locator('.album-thumbnail').nth(6).click();
      await page.waitForFunction(() => document.querySelector('.album-main-image')?.naturalWidth > 0);
      await page.evaluate(() => document.fonts.ready);
      if (width === 1440) await page.locator('#gallery').screenshot({ path: path.resolve('artifacts/mobile-review/album-desktop.png') });
      await context.close();
      console.log(`PASS ${width}: inline swipe, vertical gestures, visible thumbnails, stable scroll, shared fullscreen selection`);
    }
    for (const count of [0, 1]) {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      const data = { ...defaults, gallery: defaults.gallery.slice(0, count) };
      await context.addInitScript((saved) => localStorage.setItem('wedding_custom_data', JSON.stringify(saved)), data);
      const page = await context.newPage();
      await page.goto(base);
      await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
      await page.locator('#gallery').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('.album-arrow').count(), 0);
      if (count === 0) await page.getByText('Album ảnh sẽ được cập nhật sớm.').waitFor();
      else {
        await page.locator('.album-open').click();
        await page.keyboard.press('ArrowRight');
        await page.locator('.gallery-dialog').getByText('Ảnh 1 / 1', { exact: true }).waitFor();
        await page.keyboard.press('Escape');
      }
      await context.close();
      console.log(`PASS album with ${count} photos`);
    }
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });

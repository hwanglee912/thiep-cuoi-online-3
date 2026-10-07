// Run with Playwright available on NODE_PATH, or installed locally.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const base = process.env.WEDDING_TEST_URL || 'http://127.0.0.1:3000';
const output = path.resolve('artifacts/mobile-review');
fs.mkdirSync(output, { recursive: true });

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const defaults = (await import(pathToFileURL(path.resolve('src/config/weddingData.js')).href)).weddingData;
  const failures = [];
  const widths = [[320, 568], [360, 800], [375, 667], [390, 844], [430, 932], [768, 1024], [1440, 900], [812, 375]];
  for (const [width, height] of widths) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', hasTouch: width < 768 });
    await context.route('**/cdn.pixabay.com/**', (route) => route.abort());
    const page = await context.newPage();
    page.on('pageerror', (error) => failures.push(`${width}: ${error.message}`));
    const missing = [];
    page.on('response', (response) => { if (response.status() >= 400 && !response.url().endsWith('music.mp3')) missing.push(response.url()); });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
    await page.waitForFunction(() => !document.querySelector('[aria-labelledby="envelope-title"]'));
    await page.locator('#couple').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('.hero-photo')?.naturalWidth > 0);
    assert.equal(await page.locator('.hero-photo').getAttribute('src'), '/assets/sf-img-0.webp');
    if (width < 768) {
      const dateBounds = await page.locator('.hero-date').boundingBox();
      const dockBounds = await page.locator('.mobile-dock').boundingBox();
      assert(dateBounds.y + dateBounds.height <= dockBounds.y, `${width}: date covered by bottom navigation`);
    }
    for (const id of ['hero', 'couple', 'events', 'gallery', 'rsvp']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      const geometry = await page.evaluate((sectionId) => {
        const section = document.getElementById(sectionId);
        const bounds = [...section.querySelectorAll('h1, h2, h3, p, button, input, textarea, figure')]
          .filter((el) => el.getClientRects().length)
          .map((el) => ({ text: el.textContent.slice(0, 55), rect: el.getBoundingClientRect(), clipped: el.scrollWidth > el.clientWidth + 2 }));
        return { scroll: document.documentElement.scrollWidth, width: innerWidth,
          overflow: bounds.filter(({ rect }) => rect.left < -2 || rect.right > innerWidth + 2).map((item) => item.text),
          clipped: bounds.filter((item) => item.clipped).map((item) => item.text) };
      }, id);
      assert(geometry.scroll <= geometry.width + 1, `${width} ${id}: page overflow`);
      assert.deepEqual(geometry.overflow, [], `${width} ${id}: elements outside screen`);
      assert.deepEqual(geometry.clipped, [], `${width} ${id}: text/content clipped`);
    }
    const portraits = await page.evaluate(() => {
      const left = document.querySelector('.groom-profile figure').getBoundingClientRect();
      const right = document.querySelector('.bride-profile figure').getBoundingClientRect();
      return { leftY: left.y, rightY: right.y, leftW: left.width, rightW: right.width };
    });
    assert(portraits.leftY > portraits.rightY + 80, `${width}: portraits are not offset`);
    assert(Math.abs(portraits.leftW - portraits.rightW) < 1, `${width}: unequal portrait widths`);
    assert(await page.locator('#events').getByText('THỨ NĂM', { exact: true }).count(), 'Wrong weekday for 26/11/2026');
    await page.locator('#gallery button').first().click();
    await page.getByRole('dialog', { name: 'Xem album ảnh cưới' }).waitFor();
    assert.equal(await page.evaluate(() => document.querySelector('main').inert), true);
    const modal = await page.getByRole('dialog', { name: 'Xem album ảnh cưới' }).boundingBox();
    assert.equal(Math.round(modal.width), width);
    assert.equal(Math.round(modal.height), height);
    await page.getByRole('button', { name: 'Ảnh tiếp theo' }).click();
    await page.getByText('Ảnh 2 / 9', { exact: true }).waitFor();
    await page.keyboard.press('ArrowLeft');
    await page.getByText('Ảnh 1 / 9', { exact: true }).waitFor();
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('.gallery-dialog'));
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    assert.equal(await page.evaluate(() => document.querySelector('main').inert), false);
    assert.equal(await page.locator('#gallery button').first().evaluate((el) => el === document.activeElement), true, 'Lightbox must restore focus');
    if (width === 390) {
      await page.getByRole('link', { name: 'Cặp đôi', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.mobile-dock a[href="#couple"]')?.getAttribute('aria-current') === 'location');
      await page.locator('#couple').scrollIntoViewIfNeeded();
      await page.locator('#couple').screenshot({ path: path.join(output, 'couple-390.png'), style: '.mobile-dock { visibility: hidden !important; }' });
      await page.locator('#hero').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('.mobile-dock a[href="#hero"]')?.getAttribute('aria-current') === 'location');
      await page.screenshot({ path: path.join(output, 'hero-390.png') });
      await page.getByLabel('Tên của bạn').fill('Khách kiểm tra');
      await page.getByLabel('Số điện thoại').fill('0900000000');
      await page.getByLabel('Lời chúc gửi tới đôi uyên ương').fill('Chúc hai bạn trăm năm hạnh phúc!');
      await page.getByRole('button', { name: 'LƯU XÁC NHẬN & LỜI CHÚC' }).click();
      await page.getByText('Cảm ơn Khách kiểm tra!').waitFor();
      const wish = await page.evaluate(() => JSON.parse(localStorage.getItem('wedding_wishes'))[0]);
      assert.equal(wish.phone, '0900000000');
      assert.equal(wish.eventChoice, 'both');
    }
    assert.deepEqual(missing, [], 'Unexpected missing assets');
    console.log(`PASS ${width}x${height}: layout, portraits, date, lightbox, focus and scroll lock`);
    await context.close();
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/cdn.pixabay.com/**', (route) => route.abort());
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(base);
  await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
  assert(await page.getByRole('dialog', { name: /HOÀNG DŨNG/ }).count(), 'Envelope unmounted before its animation');
  await page.waitForFunction(() => !document.querySelector('[aria-labelledby="envelope-title"]'));
  await page.locator('#couple').waitFor();
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-announcement')).opacity === '1');
  assert.equal(await page.locator('.hero-announcement').evaluate((el) => getComputedStyle(el).transform), 'matrix(1, 0, 0, 1, 0, 0)');
  await page.locator('.couple-portraits').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.couple-photo')].every((el) => getComputedStyle(el).opacity === '1'));
  await page.locator('.couple-portraits').screenshot({ path: path.join(output, 'portraits-motion.png') });
  await page.locator('#gallery button').first().click();
  await page.getByRole('dialog', { name: 'Xem album ảnh cưới' }).waitFor();
  await page.locator('.gallery-dialog').evaluate((el) => {
    const start = new Event('touchstart', { bubbles: true });
    Object.defineProperty(start, 'touches', { value: [{ clientX: 300, clientY: 300 }] });
    el.dispatchEvent(start);
    const end = new Event('touchend', { bubbles: true });
    Object.defineProperty(end, 'changedTouches', { value: [{ clientX: 100, clientY: 305 }] });
    el.dispatchEvent(end);
  });
  await page.getByText('Ảnh 2 / 9', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Đóng xem ảnh' }).click();
  await context.close();
  const legacy = structuredClone(defaults);
  legacy.couple.groom.avatar = '/assets/sf-img-5.webp';
  legacy.couple.bride.avatar = '/assets/sf-img-10.webp';
  legacy.couple.heroImage = '/assets/sf-img-25.webp';
  legacy.couple.groom.name = 'TÊN ĐÃ CHỈNH';
  legacy.gallery[0].src = '/assets/sf-img-1.webp';
  const migrationContext = await browser.newContext({ reducedMotion: 'reduce' });
  await migrationContext.addInitScript((old) => localStorage.setItem('wedding_custom_data', JSON.stringify(old)), legacy);
  const migration = await migrationContext.newPage();
  await migration.goto(base);
  await migration.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
  await migration.locator('#couple').waitFor();
  assert.equal(await migration.locator('.hero-photo').getAttribute('src'), '/assets/sf-img-0.webp');
  assert.equal(await migration.locator('.groom-profile img').getAttribute('src'), '/assets/sf-img-2.webp');
  assert.equal(await migration.locator('.bride-profile img').getAttribute('src'), '/assets/sf-img-3.webp');
  assert.equal(await migration.locator('#groom-name').textContent(), 'TÊN ĐÃ CHỈNH');
  await migration.getByRole('button', { name: 'Đăng nhập quản trị' }).click();
  await migration.locator('input[placeholder="admin"]').fill('admin');
  await migration.locator('input[type="password"]').fill('hihihaha');
  await migration.getByRole('button', { name: 'Đăng Nhập', exact: true }).click();
  await migration.getByRole('button', { name: '2 Ngày Tiệc', exact: true }).click();
  await migration.locator('input[placeholder="26"]').first().fill('27');
  await migration.getByRole('button', { name: 'Lưu Thay Đổi', exact: true }).click();
  await migration.getByText('Đã lưu thành công!').waitFor();
  await migration.getByRole('button', { name: 'Đóng quản trị', exact: true }).click();
  await migration.locator('#hero').scrollIntoViewIfNeeded();
  assert.equal(await migration.locator('.hero-date').textContent().then((text) => text.trim()), '27.11.2026');
  await migration.locator('#events').scrollIntoViewIfNeeded();
  assert.equal(await migration.locator('#events').getByText('THỨ SÁU', { exact: true }).count(), 1);
  const calendarUrl = await migration.getByTitle('Thêm vào Google Calendar').first().getAttribute('href');
  assert(new URL(calendarUrl).searchParams.get('dates').startsWith('20261127T173000/'));
  await migrationContext.close();
  const blockedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await blockedContext.route('**/cdn.pixabay.com/**', (route) => route.abort());
  await blockedContext.addInitScript(() => {
    const originalGet = Storage.prototype.getItem;
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      if (['wedding_custom_data', 'wedding_wishes'].includes(key)) return '{broken JSON';
      return originalGet.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === 'wedding_wishes') throw new DOMException('Full', 'QuotaExceededError');
      return originalSet.call(this, key, value);
    };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); },
    } });
  });
  const blocked = await blockedContext.newPage();
  blocked.on('pageerror', (error) => failures.push(error.message));
  await blocked.goto(base);
  await blocked.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
  await blocked.locator('#events').waitFor();
  await blocked.getByRole('button', { name: 'Sao chép địa chỉ', exact: true }).first().click();
  await blocked.getByText('Chưa sao chép được. Bạn có thể chọn địa chỉ ở trên để sao chép.').first().waitFor();
  assert.equal(await blocked.getByText('Đã sao chép địa chỉ', { exact: true }).count(), 0);
  await blocked.getByLabel('Tên của bạn').fill('Khách kiểm tra bộ nhớ');
  await blocked.getByRole('button', { name: 'LƯU XÁC NHẬN & LỜI CHÚC' }).click();
  await blocked.getByText('Trình duyệt không cho phép lưu lâu dài. Lời chúc hiện chỉ được giữ trong trang này.').waitFor();
  await blocked.getByRole('button', { name: 'Sao chép lời chúc gửi qua Zalo' }).click();
  await blocked.getByText('Chưa sao chép được. Bạn hãy sao chép lời chúc trong sổ lưu bút bên dưới.').waitFor();
  await blocked.getByRole('button', { name: 'Gửi thêm lời chúc khác' }).click();
  await blocked.getByLabel('Tên của bạn').fill('   ');
  await blocked.getByRole('button', { name: 'LƯU XÁC NHẬN & LỜI CHÚC' }).click();
  await blocked.getByText('Bạn vui lòng nhập tên trước khi lưu lời chúc.').waitFor();
  await blockedContext.close();
  assert.deepEqual(failures, [], 'Browser runtime errors');
  console.log('PASS entrance animations, reduced motion, swipe, navigation, legacy migration, admin date edits, clipboard/storage failures');
  await browser.close();
})().catch((error) => { console.error(error); process.exit(1); });

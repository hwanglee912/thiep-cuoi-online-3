const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.WEDDING_TEST_URL || 'http://127.0.0.1:4173';

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 320, height: 700 }, reducedMotion: 'reduce' });
    await context.route('**/cdn.pixabay.com/**', (route) => route.abort());
    const page = await context.newPage();
    await page.goto(base);
    await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
    await page.locator('.invitation-guest').waitFor({ state: 'attached' });
    assert.equal(await page.locator('.invitation-guest').textContent(), 'Khách mời');
    await page.getByRole('button', { name: 'Đăng nhập quản trị', exact: true }).click();
    await page.locator('input[placeholder="admin"]').fill('admin');
    await page.locator('input[type="password"]').fill('hihihaha');
    await page.getByRole('button', { name: 'Đăng Nhập', exact: true }).click();
    await page.getByLabel('Tên hiển thị trên lời mời', { exact: true }).fill('  Anh Minh & Chị Lan  ');
    const link = await page.getByLabel('Link mời riêng', { exact: true }).inputValue();
    assert.equal(new URL(link).searchParams.get('guest'), 'Anh Minh & Chị Lan');
    await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } }));
    await page.getByRole('button', { name: 'Sao chép link mời riêng', exact: true }).click();
    await page.getByText('Chưa sao chép được. Bạn có thể chọn đường dẫn ở trên để sao chép.', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Lưu Thay Đổi', exact: true }).click();
    await page.getByText('Đã lưu thành công!', { exact: true }).waitFor();
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Tải file weddingData.js', exact: true }).click();
    const exported = JSON.parse(fs.readFileSync(await (await pending).path(), 'utf8').match(/export const weddingData = ([\s\S]+);/)[1]);
    assert.equal(exported.invitation.guestName.trim(), 'Anh Minh & Chị Lan');
    await page.getByRole('button', { name: 'Đóng quản trị', exact: true }).click();
    assert.equal(await page.locator('.invitation-guest').textContent(), 'Anh Minh & Chị Lan');
    await page.reload();
    await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
    await page.locator('.invitation-guest').waitFor({ state: 'attached' });
    assert.equal(await page.locator('.invitation-guest').textContent(), 'Anh Minh & Chị Lan');
    for (const name of ['Gia đình Anh Nguyễn Văn Minh và Chị Trần Thị Lan', '<b>An & Bình</b>', '']) {
      const personal = new URL(base); personal.searchParams.set('guest', name);
      await page.goto(personal.toString());
      await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
      await page.locator('.invitation-guest').waitFor({ state: 'attached' });
      assert.equal(await page.locator('.invitation-guest').textContent(), name || 'Anh Minh & Chị Lan');
      assert.equal(await page.locator('.invitation-guest b').count(), 0);
      await page.locator('.invitation-guest').scrollIntoViewIfNeeded();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('wedding_custom_data')).invitation.guestName.trim()), 'Anh Minh & Chị Lan');
    }
    await context.close();
    console.log('PASS guest editing, save/reload/export, per-guest URLs, Unicode, long names, text escaping, empty fallback and clipboard failure');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });

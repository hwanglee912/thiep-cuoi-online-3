const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.WEDDING_TEST_URL || 'http://127.0.0.1:4173';
const openAdmin = async (page, login = true) => {
  await page.getByRole('button', { name: 'Đăng nhập quản trị', exact: true }).click();
  if (login) {
    await page.locator('input[placeholder="admin"]').fill('admin');
    await page.locator('input[type="password"]').fill('hihihaha');
    await page.getByRole('button', { name: 'Đăng Nhập', exact: true }).click();
  }
  await page.getByRole('button', { name: /Ảnh & Album/ }).click();
};
const getData = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('wedding_custom_data')));
const upload = async (page, title, payload) => {
  await page.getByLabel(`Tải ${title}`).setInputFiles(payload);
  await page.waitForFunction(() => ![...document.querySelectorAll('[role="status"]')].some((el) => el.textContent.includes('Đang xử lý')));
};
const downloadData = async (page) => {
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Tải file weddingData.js', exact: true }).click();
  const download = await downloadPromise;
  return JSON.parse(fs.readFileSync(await download.path(), 'utf8').match(/export const weddingData = ([\s\S]+);/)[1]);
};

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await context.route('**/cdn.pixabay.com/**', (route) => route.abort());
    await context.addInitScript(() => {
      const decode = HTMLImageElement.prototype.decode;
      HTMLImageElement.prototype.decode = async function () {
        if (this.src.startsWith('blob:')) await new Promise((resolve) => setTimeout(resolve, 450));
        return decode.call(this);
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base);
    await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
    await openAdmin(page);
    const png = await page.evaluate(() => {
      const canvas = document.createElement('canvas'); canvas.width = 2400; canvas.height = 3600;
      const context = canvas.getContext('2d'); context.fillStyle = '#907023'; context.fillRect(0, 0, 2400, 3600);
      context.fillStyle = '#fff'; context.fillRect(100, 100, 400, 400);
      return canvas.toDataURL('image/png').split(',')[1];
    });
    const payload = { name: 'test-photo.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') };
    await page.getByLabel('Tải ảnh bìa', { exact: true }).setInputFiles(payload);
    assert.equal(await page.getByRole('button', { name: 'Lưu Thay Đổi', exact: true }).isDisabled(), true);
    await page.getByRole('button', { name: 'Cặp Đôi', exact: true }).click();
    await page.getByRole('dialog', { name: 'Quản trị thiệp cưới' }).locator('input[type="text"]').first().fill('TÊN GIỮ KHI TẢI ẢNH');
    await page.waitForFunction(() => ![...document.querySelectorAll('[role="status"]')].some((el) => el.textContent.includes('Đang xử lý')));
    await page.getByRole('button', { name: /Ảnh & Album/ }).click();
    await page.getByLabel('Đường dẫn ảnh chú rể', { exact: true }).fill('/assets/sf-img-5.webp');
    await upload(page, 'ảnh cô dâu', path.resolve('public/assets/sf-img-6.webp'));
    await page.getByLabel('Đường dẫn nền lịch', { exact: true }).fill('/assets/sf-img-17.webp');
    await page.getByLabel('Vị trí dọc nền lịch', { exact: true }).fill('22');
    await page.getByLabel('Đường dẫn nền lời mời', { exact: true }).fill('/assets/sf-img-10.webp');
    await page.getByLabel('Kiểu nền lời mời', { exact: true }).selectOption('cover');
    await page.getByLabel('Đường dẫn biểu tượng nhẫn cưới', { exact: true }).fill('/assets/sf-img-24.webp');
    await page.getByLabel('Đường dẫn ảnh album 1', { exact: true }).fill('/assets/sf-img-1.webp');
    await page.getByLabel('Chú thích ảnh album 1', { exact: true }).fill('ẢNH ĐÃ THAY');
    await page.getByLabel('Mô tả ảnh album 1', { exact: true }).fill('Ảnh thử quản trị');
    await page.getByRole('button', { name: 'Đặt ảnh mở đầu album 1', exact: true }).click();
    await page.getByLabel('Đường dẫn ảnh mới', { exact: true }).fill('/assets/sf-img-9.webp');
    await page.getByRole('button', { name: 'Thêm ảnh', exact: true }).click();
    await page.getByRole('button', { name: 'Lưu Thay Đổi', exact: true }).click();
    await page.getByText('Đã lưu thành công!', { exact: true }).waitFor();
    const saved = await getData(page);
    assert.equal(saved.couple.groom.name, 'TÊN GIỮ KHI TẢI ẢNH', 'Async image upload must not discard other edits');
    assert(saved.couple.heroImage.startsWith('data:image/webp;base64,'));
    assert(saved.couple.heroImage.length < 420000);
    const dimensions = await page.evaluate(async (src) => { const image = new Image(); image.src = src; await image.decode(); return [image.naturalWidth, image.naturalHeight]; }, saved.couple.heroImage);
    assert(Math.max(...dimensions) <= 1600);
    assert.equal(saved.couple.groom.avatar, '/assets/sf-img-5.webp', 'Chosen image must not be remapped by legacy migration');
    assert(saved.couple.bride.avatar.startsWith('data:image/webp;base64,'));
    assert.equal(saved.gallery[0].src, '/assets/sf-img-1.webp');
    assert.equal(saved.gallery.length, 10);
    await page.getByLabel('Chú thích ảnh album 1', { exact: true }).fill('XUẤT CẢ BẢN CHƯA LƯU');
    const exported = await downloadData(page);
    assert.equal(exported.gallery[0].caption, 'XUẤT CẢ BẢN CHƯA LƯU');
    assert.equal(exported.couple.heroImage, saved.couple.heroImage);
    await page.getByRole('button', { name: 'Đóng quản trị', exact: true }).click();
    assert.equal(await page.locator('.hero-photo').getAttribute('src'), saved.couple.heroImage);
    assert.equal(await page.locator('.groom-profile img').getAttribute('src'), saved.couple.groom.avatar);
    assert.equal(await page.locator('.bride-profile img').getAttribute('src'), saved.couple.bride.avatar);
    assert.equal(await page.locator('.calendar-backdrop').getAttribute('src'), saved.couple.calendarImage);
    assert.equal(await page.locator('.calendar-backdrop').evaluate((el) => el.style.objectPosition), '50% 22%');
    assert.equal(await page.locator('#couple').evaluate((el) => el.style.backgroundRepeat), 'no-repeat');
    assert.equal(await page.locator('#events img[alt="Nhẫn cưới"]').first().getAttribute('src'), saved.couple.eventIconImage);
    assert.equal(await page.locator('.album-main-image').getAttribute('src'), saved.gallery[0].src);
    await page.reload();
    await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
    await page.locator('.album-main-image').waitFor({ state: 'attached' });
    assert.equal(await page.locator('.groom-profile img').getAttribute('src'), '/assets/sf-img-5.webp');
    assert.equal(await page.locator('.album-main-image').getAttribute('src'), '/assets/sf-img-1.webp');
    await openAdmin(page);
    await page.getByLabel('Tải ảnh bìa', { exact: true }).setInputFiles({ name: 'wrong.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
    await page.getByText('Bạn hãy chọn file ảnh JPG, PNG hoặc WebP.', { exact: true }).waitFor();
    await page.getByLabel('Tải ảnh bìa', { exact: true }).setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
    await page.getByText('Không mở được ảnh này. Bạn hãy dùng JPG, PNG hoặc WebP.', { exact: true }).waitFor();
    await page.getByLabel('Đường dẫn ảnh chú rể', { exact: true }).fill('javascript:alert(1)');
    await page.getByRole('button', { name: 'Lưu Thay Đổi', exact: true }).click();
    await page.getByText(/Ảnh chú rể: hãy chọn ảnh/).waitFor();
    await page.getByLabel('Đường dẫn ảnh chú rể', { exact: true }).fill('/assets/sf-img-5.webp');
    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Xóa ảnh album 1', exact: true }).click();
    const afterDelete = await downloadData(page);
    assert.equal(afterDelete.gallery.length, 9);
    assert.equal(afterDelete.galleryCoverId, afterDelete.gallery[0].id);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      const bounds = await page.getByRole('dialog', { name: 'Quản trị thiệp cưới' }).evaluate((el) => [...el.querySelectorAll('.admin-image-editor, h3, h4, h5, p, button')]
        .filter((item) => !item.closest('.overflow-x-auto')).map((item) => item.getBoundingClientRect()).filter((rect) => rect.width && (rect.left < 0 || rect.right > innerWidth)));
      assert.equal(bounds.length, 0, `${width}: admin panel must fit the screen`);
      if (width === 390) {
        await page.getByRole('dialog', { name: 'Quản trị thiệp cưới' }).locator('.overflow-y-auto').evaluate((el) => { el.scrollTop = 0; });
        await page.getByRole('dialog', { name: 'Quản trị thiệp cưới' }).screenshot({ path: path.resolve('artifacts/mobile-review/admin-images-390.png') });
      }
    }
    await page.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) { if (key === 'wedding_custom_data') throw new DOMException('Full', 'QuotaExceededError'); return original.call(this, key, value); };
    });
    await page.getByRole('button', { name: 'Lưu Thay Đổi', exact: true }).click();
    await page.getByText(/Bộ nhớ trình duyệt đã đầy/).waitFor();
    assert.equal((await downloadData(page)).gallery.length, 9, 'Export must still work when local storage is full');
    assert.deepEqual(errors, []);
    await context.close();
    console.log('PASS all image slots, uploads/resizing, crop position, cover selection, replacement/add/delete, persistence, draft export, concurrent edits, invalid files/URLs, full storage, 320/390/1440px');
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exit(1); });

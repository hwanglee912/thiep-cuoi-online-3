const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.route('**/cdn.pixabay.com/**', (route) => route.abort());
  await page.goto(process.env.WEDDING_TEST_URL || 'http://127.0.0.1:4173');
  await page.getByRole('button', { name: 'MỞ THIỆP CƯỚI' }).click();
  await page.locator('#couple').waitFor();
  await page.waitForFunction(() => !document.querySelector('[aria-labelledby="envelope-title"]'));
  await page.evaluate(() => document.fonts.ready);
  const admin = process.env.WEDDING_TEST_ADMIN === '1';
  if (admin) {
    await page.getByRole('button', { name: 'Đăng nhập quản trị', exact: true }).click();
    await page.locator('input[placeholder="admin"]').fill('admin');
    await page.locator('input[type="password"]').fill('hihihaha');
    await page.getByRole('button', { name: 'Đăng Nhập', exact: true }).click();
    await page.getByRole('button', { name: /Ảnh & Album/ }).click();
  }
  await page.addScriptTag({ path: process.env.AXE_SCRIPT || require.resolve('axe-core/axe.min.js') });
  const results = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }));
  const report = { violations: results.violations.map(({ id, impact, description, nodes }) => ({ id, impact, description,
    nodes: nodes.map(({ target, html, failureSummary }) => ({ target, html, failureSummary })) })), passedRules: results.passes.length };
  fs.writeFileSync(path.resolve(`artifacts/mobile-review/accessibility-${admin ? 'admin-images' : 'open'}.json`), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
  if (report.violations.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exit(1); });

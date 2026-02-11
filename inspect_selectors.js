const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const BASE_URL = 'https://follot-biz.web.app';
  const EMAIL = 'ss@coobal.co.jp';
  const PASSWORD = 'Coobal6030';

  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const context = await browser.newContext();
  const page = await context.newPage();

  async function probe(selectors, label) {
    console.log(`\n--- Probe: ${label}`);
    for (const s of selectors) {
      try {
        const el = await page.$(s);
        if (el) {
          const outer = await page.evaluate(e => e.outerHTML, el);
          console.log(`FOUND: ${s}`);
          console.log(outer.replace(/\n/g, '').slice(0, 400));
        } else {
          console.log(`not found: ${s}`);
        }
      } catch (e) {
        console.log(`error for selector ${s}: ${e.message}`);
      }
    }
  }

  try {
    console.log('[INFO] opening login page');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1000);
    fs.writeFileSync(path.join(process.cwd(), 'debug_login.html'), await page.content(), 'utf8');
    console.log('[INFO] saved debug_login.html');

    await probe([
      'input[type="email"]',
      'input[name="email"]',
      'input#email',
      'input[placeholder*="メール"]',
      'input[placeholder*="Email"]',
      'input[type="text"][name*="email"]'
    ], 'email inputs');

    await probe([
      'input[type="password"]',
      'input[name="password"]',
      'input#password',
      'input[placeholder*="パスワード"]'
    ], 'password inputs');

    await probe([
      'button:has-text("ログイン")',
      'button[type="submit"]',
      'button:has-text("サインイン")',
      'button:has-text("Login")'
    ], 'login buttons');

    // Try to perform login using best-guess selectors
    const emailSel = await (await page.$('input[type="email"]') ? 'input[type="email"]' : (await page.$('input[name="email"]') ? 'input[name="email"]' : null));
    const passSel = await (await page.$('input[type="password"]') ? 'input[type="password"]' : (await page.$('input[name="password"]') ? 'input[name="password"]' : null));
    const btnSel = await (await page.$('button:has-text("ログイン")') ? 'button:has-text("ログイン")' : (await page.$('button[type="submit"]') ? 'button[type="submit"]' : null));

    if (emailSel && passSel) {
      console.log('[INFO] filling credentials using', emailSel, passSel);
      await page.fill(emailSel, EMAIL);
      await page.fill(passSel, PASSWORD);
      if (btnSel) {
        console.log('[INFO] clicking login button:', btnSel);
        await Promise.all([
          page.click(btnSel),
          page.waitForLoadState('networkidle').catch(()=>{})
        ]);
      } else {
        console.log('[WARN] login button not found, submitting form with Enter');
        await page.keyboard.press('Enter');
      }
    } else {
      console.log('[ERROR] email/password selectors not found, stop login attempt');
    }

    await page.waitForTimeout(3000);
    fs.writeFileSync(path.join(process.cwd(), 'debug_post_login.html'), await page.content(), 'utf8');
    console.log('[INFO] saved debug_post_login.html');

    // Probe organization/tenant related elements
    await probe([
      'select',
      'select[name*="org"]',
      'select[name*="tenant"]',
      'text=Coobal.inc',
      'text=coobal.inc',
      'text=クーバル株式会社'
    ], 'organization/tenant candidates');

    await probe([
      'button:has-text("決定")',
      'button:has-text("次へ")',
      'button:has-text("OK")'
    ], 'decision buttons');

    // Navigate to customers page
    console.log('[INFO] navigating to /customers');
    await page.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle', timeout: 60000 }).catch(e=>console.log('[WARN] goto error', e && e.message));
    await page.waitForTimeout(2000);
    fs.writeFileSync(path.join(process.cwd(), 'debug_customers.html'), await page.content(), 'utf8');
    console.log('[INFO] saved debug_customers.html');

    await probe([
      'text=顧客管理',
      'a:has-text("顧客管理")',
      'button:has-text("新規登録")',
      'button:has-text("追加")',
      'button[aria-label*="新規"]',
      'tbody tr',
      'table tbody tr',
      '.v-data-table__tbody tr'
    ], 'customers page candidates');

    console.log('\n--- Done. Please share the generated debug HTML files or the printed selectors above.');

  } catch (e) {
    console.error('[FATAL]', e.message);
  } finally {
    console.log('[INFO] keeping browser open for manual inspection (close manually when done)');
    // Note: do not close browser so user can inspect; if headless, we close
    if (browser) {
      try {
        // if headless is true, close; but since we launched headful, keep it
        // await browser.close();
      } catch (e) {}
    }
  }
})();

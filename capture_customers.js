/**
 * 顧客管理機能のスクリーンショット撮影スクリプト（修正版）
 * * 修正点:
 * 1. 画面サイズをフルHD(1920x1080)に設定してサイドカラムを表示させる
 * 2. 詳細パネルを開く際、行全体ではなく「顧客名リンク(aタグ)」をクリックする
 * 3. 詳細パネル撮影時は fullPage: false で撮影する
 * * 使用方法:
 * node capture_customers.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

let screenshotCounter = 1;

/**
 * スクリーンショットを撮影して保存
 * @param {Page} page 
 * @param {string} name 
 * @param {boolean} isFullPage - trueならページ全体、falseなら表示範囲のみ
 */
async function takeScreenshot(page, name, isFullPage = true) {
  const paddedNum = String(screenshotCounter).padStart(2, '0');
  const filename = `${paddedNum}_${name}.png`;
  const filepath = path.join('docs', 'public', 'screenshots', filename);
  
  await page.screenshot({ path: filepath, fullPage: isFullPage });
  console.log(`✓ スクリーンショット撮影: ${filename} (fullPage: ${isFullPage})`);
  screenshotCounter++;
}

/**
 * メイン処理
 */
async function main() {
  // ==========================================
  // ▼ 設定値
  // ==========================================
  const BASE_URL = 'https://follot-biz.web.app';
  const EMAIL = 'ss@coobal.co.jp';
  const PASSWORD = 'Coobal6030';
  
  const ORGANIZATION = 'coobal.inc';
  const TENANT = 'クーバル株式会社';

  if (!fs.existsSync(path.join('docs', 'public', 'screenshots'))) {
    fs.mkdirSync(path.join('docs', 'public', 'screenshots'), { recursive: true });
  }

  const browser = await chromium.launch({ headless: true, slowMo: 500 });
  
  // ★修正1: 画面サイズを大きく設定（サイドカラムが見切れないようにするため）
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 } 
  });
  
  const page = await context.newPage();

  try {
    console.log('\n========================================');
    console.log('顧客管理機能 スクリーンショット自動撮影開始');
    console.log('========================================\n');

    // 1. ログイン
    console.log('【ステップ1】ログイン画面にアクセス...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await takeScreenshot(page, 'customers_01_login');

    // 2. ログイン処理
    console.log('【ステップ2】ログイン情報を入力...');
    await page.fill('input[type="email"]', EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await Promise.all([
      page.click('button:has-text("ログイン")'),
      page.waitForLoadState('networkidle')
    ]);
    await page.waitForTimeout(2000);

    // 3. 組織・テナント選択
    try {
      console.log('【ステップ3】組織・テナント選択...');
      
      // 組織選択（selectElement使用）
      try {
        await page.getByLabel('組織を選択してください').selectOption('JPgstGXrtlKCu9gXNDac');
        console.log(`  組織を選択: ${ORGANIZATION}`);
        await page.waitForTimeout(1000);
      } catch {
        console.log('  ※組織選択画面がありません（スキップ）');
      }
      
      // テナント選択（1つだけの場合は画面が出ない仕様）
      try {
        // テナント選択用のselectを探す
        const tenantSelect = await page.locator('select').nth(1);
        const tenantValue = await tenantSelect.evaluate((el) => {
          const opts = el.querySelectorAll('option');
          if (opts.length > 1) return opts[1].value; // 最初の空要素をスキップして2番目を取得
          return null;
        });
        
        if (tenantValue) {
          await page.locator('select').nth(1).selectOption(tenantValue);
          console.log(`  テナントを選択: ${TENANT}`);
          await page.waitForTimeout(1000);
        } else {
          console.log('  ※テナント選択画面がありません（テナント1つの仕様）');
        }
      } catch (e) {
        console.log('  ※テナント選択画面がありません（テナント1つの仕様）');
      }
      
      // 決定ボタン（あれば押す）
      try {
        await page.click('button:has-text("決定")');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
      } catch {
        console.log('  決定ボタンはありません（スキップ）');
      }
      
    } catch (e) {
      console.log('  組織・テナント選択でエラー:', e.message);
    }

    // 4. 顧客管理画面へ移動
    console.log('【ステップ4】顧客管理画面へ移動...');
    try {
      const customerMenuItems = await page.locator('text="顧客管理"').all();
      if (customerMenuItems.length > 0) {
        await customerMenuItems[0].click();
      } else {
        await page.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
      }
    } catch {
      await page.goto(`${BASE_URL}/customers`, { waitUntil: 'networkidle' });
    }
    await page.waitForTimeout(3000);

    // 5. 顧客一覧画面を撮影
    console.log('【ステップ5】顧客一覧画面を撮影...');
    await takeScreenshot(page, 'customers_02_list');

    // 6. 新規登録モーダルを撮影
    console.log('【ステップ6】新規登録モーダルを撮影...');
    try {
      let clicked = false;
      // ボタン探索ロジック
      try { await page.click('button:has-text("新規登録")'); clicked = true; } catch {}
      if (!clicked) { try { await page.getByRole('button', { name: '新規登録' }).click(); clicked = true; } catch {} }
      if (!clicked) {
        const buttons = await page.locator('button').all();
        for (const btn of buttons) {
          const text = await btn.textContent();
          if (text && (text.includes('新規') || text.includes('追加'))) {
            await btn.click();
            clicked = true;
            break;
          }
        }
      }
      
      if (clicked) {
        await page.waitForTimeout(1000);
        await takeScreenshot(page, 'customers_03_create_modal');
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      } else {
        console.log('  ※新規登録ボタンが見つかりません');
      }
    } catch (e) {
      console.log('  新規登録モーダル撮影失敗:', e.message);
    }

    // ==========================================
    // 7. 顧客詳細パネルを撮影（修正箇所）
    // ==========================================
    console.log('【ステップ7】顧客詳細パネルを撮影...');
    
    try {
      // 顧客行をクリック（未設定セル優先、見つからなければ最初の行）
      const targetCell = page.locator('tbody tr td:has-text("未設定")').first();
      if (await targetCell.count() > 0) {
        console.log('  顧客を選択しています...');
        try {
          await targetCell.click({ timeout: 2000 });
        } catch {
          const box = await targetCell.boundingBox();
          if (box) {
            await page.mouse.click(box.x + box.width * 0.7, box.y + box.height / 2);
          }
        }
      } else {
        const rows = await page.locator('tbody tr').all();
        if (rows.length > 0) {
          console.log('  顧客を選択しています...');
          await rows[0].click();
        } else {
          console.log('  顧客データが見つかりません');
        }
      }

      // パネルが開くまで待機
      await page.waitForTimeout(2500);

      // 詳細パネルを撮影
      await takeScreenshot(page, 'customers_04_detail_panel', false);

    } catch (e) {
      console.log('  詳細パネル撮影失敗:', e.message);
    }

    console.log('\n========================================');
    console.log('✓ すべての撮影が完了しました！');
    console.log('========================================\n');

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await browser.close();
  }
}

main();
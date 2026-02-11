/**
 * Follot Biz スクリーンショット自動撮影スクリプト
 * * このスクリプトは Playwright を使用して、Follot Biz の認証系機能の画面を
 * 自動的に遷移してスクリーンショットを撮影します。
 * * 使用方法:
 * node capture_screenshots.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// 撮影するスクリーンショットの設定
const screenshots = [];
let screenshotCounter = 1;

/**
 * スクリーンショットを撮影して保存
 */
async function takeScreenshot(page, name) {
  const paddedNum = String(screenshotCounter).padStart(2, '0');
  const filename = `${paddedNum}_${name}.png`;
  const filepath = path.join('docs', 'public', 'screenshots', filename);
  
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✓ スクリーンショット撮影: ${filename}`);
  screenshots.push(filename);
  screenshotCounter++;
}

/**
 * メイン処理
 */
async function main() {
  // ==========================================
  // ▼ 設定値（ここを確認してください）
  // ==========================================
  const BASE_URL = 'https://follot-biz.web.app';
  const EMAIL = 'ss@coobal.co.jp';
  const PASSWORD = 'Coobal6030';
  
  // 画面に表示されている「組織名」と「テナント名」を正確に入力してください
  const ORGANIZATION = 'coobal.inc';   // 組織選択画面でクリックする文字
  const TENANT = 'クーバル株式会社';      // プルダウンの中に表示される文字

  // screenshotsフォルダが存在しなければ作成
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots', { recursive: true });
    console.log('✓ screenshots フォルダを作成しました');
  }

  // ★変更点: headless: false にしてブラウザを表示させます
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('\n========================================');
    console.log('Follot Biz スクリーンショット自動撮影開始');
    console.log('========================================\n');

    // ==========================================
    // 1. ログイン画面へアクセス
    // ==========================================
    console.log('【ステップ1】ログイン画面にアクセス...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await takeScreenshot(page, 'login_page');

    // ==========================================
    // 2. ログイン処理
    // ==========================================
    console.log('【ステップ2】ログイン情報を入力...');
    
    await page.fill('input[type="email"]', EMAIL);
    console.log(`  メールアドレス入力: ${EMAIL}`);
    
    await page.fill('input[type="password"]', PASSWORD);
    console.log(`  パスワード入力: ********`);
    
    console.log('  ログインボタンをクリック...');
    // ログインボタン押下後の遷移を待機
    await Promise.all([
      page.click('button:has-text("ログイン")'),
      page.waitForLoadState('networkidle') // ページの読み込みが落ち着くまで待つ
    ]);
    
    console.log('  ログイン処理完了。次へ進みます...');
    await page.waitForTimeout(2000); // 画面遷移のアニメーション待ち

// ==========================================
    // 3. 組織・テナント選択 (最終決定版)
    // ==========================================
    
    // ▼ A. 組織選択
    try {
      console.log(`【ステップ3-A】組織を選択...`);
      
      // 組織選択画面の読み込み待ち
      await page.waitForTimeout(2000);

      // ★ここが「正解」のコードです
      // 特定のIDを使って、直接ズバリと選択します
      await page.getByLabel('組織を選択してください').selectOption('JPgstGXrtlKCu9gXNDac');
      
      console.log('  組織を選択しました');
      await page.waitForTimeout(2000); // 次の画面の読み込み待ち

    } catch (e) {
      console.log(`  ※組織選択でエラー: ${e.message}`);
      await takeScreenshot(page, 'error_org_select');
    }

    // ▼ B. テナント選択
    // ※前回「テナントはスムーズに進んだ」とのことなので、
    //   念のため「クリック方式」と「セレクト方式」の両方を試す最強の構えにします
    try {
      console.log(`【ステップ3-B】テナントを選択: ${TENANT}...`);
      await takeScreenshot(page, 'tenant_select_page');
      await page.waitForTimeout(1000);

      try {
        // 作戦1: もしテナントもシンプルなプルダウンなら、文字で選ぶ
        // (組織と同じタイプの可能性があります)
        await page.getByLabel('テナントを選択').selectOption({ label: TENANT });
        console.log(`  テナント(セレクト方式)で選択成功`);
      } catch {
        // 作戦2: ダメなら、前回の「クリックして開く方式」で選ぶ
        console.log('  セレクト方式失敗。クリック方式で試行します...');
        
        // プルダウンを開く（「選択してください」などをクリック）
        try {
           await page.getByText('選択してください').first().click();
        } catch {
           await page.getByRole('combobox').click();
        }
        
        await page.waitForTimeout(1000);
        // テナント名をクリック
        await page.getByText(TENANT).click();
      }

      console.log(`  テナント「${TENANT}」を選択しました`);

      // 決定ボタン・次へボタンのクリック（念のため）
      try { await page.getByRole('button', { name: '決定' }).click(); } catch {}
      try { await page.getByRole('button', { name: '次へ' }).click(); } catch {}

      // ホーム画面への遷移待ち
      await page.waitForTimeout(3000);
      await takeScreenshot(page, 'home_page');
      console.log('  ホーム画面への遷移完了');

    } catch (error) {
      console.log(`  テナント選択でエラー: ${error.message}`);
      // ここでエラーが出ても、既にホーム画面にいる可能性があるので撮影してみる
      await takeScreenshot(page, 'maybe_home_page');
    }

 

    // ==========================================
    // 完了
    // ==========================================
    console.log('\n========================================');
    console.log('撮影完了！ screenshots フォルダを確認してください');
    console.log('========================================\n');

  } catch (error) {
    console.error('\n❌ エラーが発生しました:');
    console.error(error);
  } finally {
    // ブラウザを閉じる（確認したい場合はここをコメントアウトしてください）
    await context.close();
    await browser.close();
  }
}

// 実行
main();
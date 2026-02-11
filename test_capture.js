/**
 * テスト版：console.log確認用
 */

console.log('[START] capture_customers.js が開始しました');

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

console.log('[LOAD] モジュール読み込み完了');

(async () => {
  console.log('[ASYNC] 非同期処理開始');
  
  try {
    const SCREENSHOT_DIR = path.join('docs', 'public', 'screenshots');
    
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
    
    console.log('[FOLDER] フォルダ作成確認');
    console.log('[LAUNCH] ブラウザ起動中...');
    
    const browser = await chromium.launch({ headless: true });
    console.log('[BROWSER] ブラウザ起動成功');
    
    const context = await browser.newContext();
    const page = await context.newPage();
    console.log('[PAGE] ページ作成成功');
    
    await browser.close();
    console.log('[CLOSE] ブラウザ終了');
    
    console.log('[COMPLETE] スクリプト完了');
    process.exit(0);
    
  } catch (error) {
    console.error('[ERROR]', error.message);
    console.error('[STACK]', error.stack);
    process.exit(1);
  }
})();

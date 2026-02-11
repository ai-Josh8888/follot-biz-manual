console.log('[TEST] 開始');

const { chromium } = require('playwright');

(async () => {
  try {
    console.log('[TEST] chromium.launch 実行中...');
    const browser = await chromium.launch({ headless: true });
    console.log('[TEST] ブラウザ起動成功');
    
    const page = await browser.newPage();
    console.log('[TEST] ページ作成成功');
    
    await browser.close();
    console.log('[TEST] ブラウザ閉じる成功');
  } catch (e) {
    console.error('[TEST] エラー:', e.message);
    process.exit(1);
  }
})();

/**
 * Screenshot capture script for chapter-list-redesign review map v2.0
 * Requires: npx playwright (already installed)
 * Dev server must be running on http://localhost:5173
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5173';

mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const captures = [];

async function capture(page, name, description, viewport = 'desktop') {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, type: 'png', fullPage: false });
  captures.push({ file: `${name}.png`, captureId: name, description, viewport });
  console.log(`  ✓ ${name}.png — ${description}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // ===== DESKTOP CAPTURES (1280x800) =====
  console.log('\n📸 Desktop captures (1280x800)...');
  const desktopCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const dp = await desktopCtx.newPage();

  // Auto-dismiss alerts
  dp.on('dialog', async d => await d.dismiss());

  await dp.goto(BASE_URL, { waitUntil: 'networkidle' });
  await dp.waitForTimeout(1200);

  // --- First-Time Guide (3 steps) ---
  const guideOverlay = await dp.$('.guide-overlay');
  if (guideOverlay) {
    await capture(dp, 'first-time-guide--step-1', '新手引导 - 第1步：选择你的教材');

    await dp.click('.next-btn');
    await dp.waitForTimeout(600);
    await capture(dp, 'first-time-guide--step-2', '新手引导 - 第2步：浏览章节目录');

    await dp.click('.next-btn');
    await dp.waitForTimeout(600);
    await capture(dp, 'first-time-guide--step-3', '新手引导 - 第3步：开始学习');

    // Complete guide
    await dp.click('.next-btn');
    await dp.waitForTimeout(600);
  }

  // --- Desktop default: preview tab ---
  await capture(dp, 'desktop--preview-tab', '桌面端 - 预习Tab（默认状态）');

  // --- Desktop: review tab ---
  const sceneTabs = await dp.$$('.scene-tab');
  for (const tab of sceneTabs) {
    const text = await tab.textContent();
    if (text && text.includes('复习')) {
      await tab.click();
      await dp.waitForTimeout(600);
      break;
    }
  }
  await capture(dp, 'desktop--review-tab', '桌面端 - 复习Tab');

  // --- Desktop: third scene tab ---
  const sceneTabs2 = await dp.$$('.scene-tab');
  if (sceneTabs2.length >= 3) {
    await sceneTabs2[2].click();
    await dp.waitForTimeout(600);
    const tabText = await sceneTabs2[2].textContent();
    await capture(dp, 'desktop--third-tab', `桌面端 - ${(tabText || '').trim()}Tab`);
  }

  // Switch back to preview
  const sceneTabs3 = await dp.$$('.scene-tab');
  for (const tab of sceneTabs3) {
    const text = await tab.textContent();
    if (text && text.includes('预习')) {
      await tab.click();
      await dp.waitForTimeout(500);
      break;
    }
  }

  // --- Desktop: "全部" resources mode ---
  const allBtn = await dp.$('.all-resources-btn');
  if (allBtn) {
    await allBtn.click();
    await dp.waitForTimeout(600);
    await capture(dp, 'desktop--all-resources', '桌面端 - 全部资源模式');
    await allBtn.click();
    await dp.waitForTimeout(400);
  }

  // --- Desktop: textbook selector modal ---
  const ctxBtn = await dp.$('.context-selector-btn');
  if (ctxBtn) {
    await ctxBtn.click();
    await dp.waitForTimeout(600);
    await capture(dp, 'desktop--textbook-modal', '桌面端 - 教材选择弹窗');
    // Close
    const closeBtn = await dp.$('.selector-modal .close-btn');
    if (closeBtn) {
      await closeBtn.click();
    } else {
      await dp.keyboard.press('Escape');
    }
    await dp.waitForTimeout(400);
  }

  // --- Desktop: settings page ---
  // Find settings button in action bar
  const actionBtns = await dp.$$('.action-btn');
  for (const btn of actionBtns) {
    const text = await btn.textContent();
    if (text && text.includes('设置')) {
      await btn.click();
      await dp.waitForTimeout(600);
      break;
    }
  }
  const settingsPage = await dp.$('.settings-page');
  if (settingsPage) {
    await capture(dp, 'desktop--settings', '桌面端 - 设置页');
    // Go back
    const backBtn = await dp.$('.settings-page .back-btn');
    if (backBtn) {
      await backBtn.click();
      await dp.waitForTimeout(500);
    }
  }

  // --- Desktop: learning mode modal (review tab + click knowledge card) ---
  // Switch to review tab
  const sceneTabs4 = await dp.$$('.scene-tab');
  for (const tab of sceneTabs4) {
    const text = await tab.textContent();
    if (text && text.includes('复习')) {
      await tab.click();
      await dp.waitForTimeout(600);
      break;
    }
  }

  // Set appSettings to ask-every-time to trigger modal
  await dp.evaluate(() => {
    try {
      localStorage.setItem('chapter-app-settings', JSON.stringify({
        reviewLearningMode: 'ask-every-time',
        defaultSceneTab: 'last-selected',
        practiceDifficulties: ['basic', 'medium', 'hard']
      }));
    } catch (e) { /* ignore */ }
  });

  // Reload to apply settings
  await dp.reload({ waitUntil: 'networkidle' });
  await dp.waitForTimeout(1200);

  // Skip guide again if it shows
  const guide2 = await dp.$('.guide-overlay');
  if (guide2) {
    const skipBtn = await dp.$('.skip-btn');
    if (skipBtn) await skipBtn.click();
    await dp.waitForTimeout(500);
  }

  // Switch to review tab
  const sceneTabs5 = await dp.$$('.scene-tab');
  for (const tab of sceneTabs5) {
    const text = await tab.textContent();
    if (text && text.includes('复习')) {
      await tab.click();
      await dp.waitForTimeout(600);
      break;
    }
  }

  // Click knowledge card
  const kCard = await dp.$('.knowledge-card');
  if (kCard) {
    await kCard.click();
    await dp.waitForTimeout(700);
  }
  const lmModal = await dp.$('.modal-overlay');
  if (lmModal) {
    await capture(dp, 'desktop--learning-mode-modal', '桌面端 - 学习模式选择弹窗');
    // Close
    const closeBtn = await dp.$('.modal-overlay .close-btn');
    if (closeBtn) {
      await closeBtn.click();
    } else {
      await dp.keyboard.press('Escape');
    }
    await dp.waitForTimeout(400);
  }

  // --- Desktop: scroll down to show chapter footer ---
  await dp.evaluate(() => {
    const container = document.querySelector('.resource-scroll-container');
    if (container) container.scrollTop = container.scrollHeight;
  });
  await dp.waitForTimeout(600);
  const footer = await dp.$('.chapter-footer');
  if (footer) {
    await capture(dp, 'desktop--chapter-footer', '桌面端 - 章节底部导航（上一章/下一章）');
  }

  await desktopCtx.close();

  // ===== MOBILE CAPTURES (375x812) =====
  console.log('\n📱 Mobile captures (375x812)...');
  const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mp = await mobileCtx.newPage();
  mp.on('dialog', async d => await d.dismiss());

  await mp.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mp.waitForTimeout(1200);

  // Skip guide
  const mGuide = await mp.$('.guide-overlay');
  if (mGuide) {
    const skipBtn = await mp.$('.skip-btn');
    if (skipBtn) await skipBtn.click();
    await mp.waitForTimeout(500);
  }

  // --- Mobile: default ---
  await capture(mp, 'mobile--default', '移动端 - 默认状态', 'mobile');

  // --- Mobile: sidebar open ---
  const mToggle = await mp.$('.mobile-toggle');
  if (mToggle) {
    await mToggle.click();
    await mp.waitForTimeout(600);
    await capture(mp, 'mobile--sidebar-open', '移动端 - 侧边栏展开', 'mobile');
    // Close
    const overlay = await mp.$('.sidebar-overlay');
    if (overlay) {
      await overlay.click();
      await mp.waitForTimeout(400);
    }
  }

  // --- Mobile: preview tab scrolled ---
  await mp.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = 300;
  });
  await mp.waitForTimeout(400);
  await capture(mp, 'mobile--preview-scrolled', '移动端 - 预习Tab（向下滚动）', 'mobile');

  // --- Mobile: review tab ---
  const mTabs = await mp.$$('.scene-tab');
  for (const tab of mTabs) {
    const text = await tab.textContent();
    if (text && text.includes('复习')) {
      await tab.click();
      await mp.waitForTimeout(600);
      break;
    }
  }
  await capture(mp, 'mobile--review-tab', '移动端 - 复习Tab', 'mobile');

  await mobileCtx.close();

  // ===== WRITE MANIFEST =====
  const manifest = {
    capturedAt: new Date().toISOString(),
    prototypeType: 'standard-vue',
    prototypePath: '02-prototypes/vue-apps/chapter-list-redesign/',
    screenshots: captures
  };

  writeFileSync(join(SCREENSHOTS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Done! ${captures.length} screenshots captured.`);
  console.log(`📁 Saved to: ${SCREENSHOTS_DIR}`);

  await browser.close();
}

main().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});

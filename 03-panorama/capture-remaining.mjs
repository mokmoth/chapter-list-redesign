/**
 * Supplementary capture script for missing screenshots
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCREENSHOTS_DIR = join(__dirname, 'screenshots');
const BASE_URL = 'http://localhost:5173';

// Load existing manifest
const manifest = JSON.parse(readFileSync(join(SCREENSHOTS_DIR, 'manifest.json'), 'utf-8'));

async function capture(page, name, description, viewport = 'desktop') {
  const path = join(SCREENSHOTS_DIR, `${name}.png`);
  await page.screenshot({ path, type: 'png', fullPage: false });
  manifest.screenshots.push({ file: `${name}.png`, captureId: name, description, viewport });
  console.log(`  ✓ ${name}.png — ${description}`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // --- Desktop: third tab + all resources + textbook modal + learning mode ---
  console.log('\n📸 Supplementary desktop captures...');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  page.on('dialog', async d => await d.dismiss());

  // Clear first-visit flag
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('guide_completed', 'true');
    localStorage.setItem('appSettings', JSON.stringify({
      reviewLearningMode: 'ask-every-time',
      defaultSceneTab: 'last-selected',
      practiceDifficulties: ['basic', 'medium', 'hard']
    }));
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Third tab (解题指导)
  const tabs = await page.$$('.scene-tab');
  if (tabs.length >= 2) {
    await tabs[1].click(); // 解题指导 is index 1 (after 预习)
    await page.waitForTimeout(600);
    const text = await tabs[1].textContent();
    await capture(page, 'desktop--third-tab', `桌面端 - ${(text || '').trim()}Tab`);
  }

  // Switch back to 预习
  const tabsBack = await page.$$('.scene-tab');
  if (tabsBack.length > 0) {
    await tabsBack[0].click();
    await page.waitForTimeout(500);
  }

  // 2. "全部" resources
  const allBtn = await page.$('.all-resources-btn');
  if (allBtn) {
    await allBtn.click();
    await page.waitForTimeout(600);
    await capture(page, 'desktop--all-resources', '桌面端 - 全部资源模式');
    await allBtn.click();
    await page.waitForTimeout(400);
  }

  // 3. Textbook selector
  const ctxBtn = await page.$('.context-selector-btn');
  if (ctxBtn) {
    await ctxBtn.click();
    await page.waitForTimeout(800);
    await capture(page, 'desktop--textbook-modal', '桌面端 - 教材选择弹窗');
    // Close by pressing escape or clicking overlay
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    // If still open, click the close button
    const closeBtn = await page.$('.selector-modal .close-btn');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 4. Learning mode modal — need to be on review tab and click knowledge card
  const reviewTabs = await page.$$('.scene-tab');
  for (const tab of reviewTabs) {
    const text = await tab.textContent();
    if (text && text.includes('复习')) {
      // This is math subject — scene tabs are 预习/解题指导/刷题, no 复习
      // Let's check what tabs are available
      break;
    }
  }

  // For math subject: tabs are 预习, 解题指导, 刷题. No 复习.
  // Let's switch to English subject which has 复习 tab
  // Actually, let me just check what tabs exist
  const allTabTexts = [];
  const allTabs = await page.$$('.scene-tab');
  for (const t of allTabs) {
    const txt = await t.textContent();
    allTabTexts.push((txt || '').trim());
  }
  console.log('  Available tabs:', allTabTexts.join(', '));

  // Learning mode modal only shows in review tab.
  // For 理科解题型 (math), there's no 复习 tab, so let's switch to a subject with 复习
  // Use the context selector to switch to English
  const ctxBtn2 = await page.$('.context-selector-btn');
  if (ctxBtn2) {
    await ctxBtn2.click();
    await page.waitForTimeout(800);

    // Find and click English subject
    const subjectItems = await page.$$('.subject-item');
    for (const item of subjectItems) {
      const text = await item.textContent();
      if (text && text.includes('英语')) {
        await item.click();
        await page.waitForTimeout(400);
        break;
      }
    }

    // Click confirm
    const confirmBtn = await page.$('.selector-modal .confirm-btn');
    if (confirmBtn) {
      await confirmBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // Now check tabs again
  const engTabs = await page.$$('.scene-tab');
  const engTabTexts = [];
  for (const t of engTabs) {
    const txt = await t.textContent();
    engTabTexts.push((txt || '').trim());
  }
  console.log('  English tabs:', engTabTexts.join(', '));

  // Switch to 复习 tab if available
  for (const tab of engTabs) {
    const text = await tab.textContent();
    if (text && text.includes('复习')) {
      await tab.click();
      await page.waitForTimeout(600);
      break;
    }
  }

  // Click first knowledge card to trigger learning mode modal
  const kCard = await page.$('.knowledge-card');
  if (kCard) {
    await kCard.click();
    await page.waitForTimeout(800);
  }

  // Check if modal appeared
  const modal = await page.$('.modal-overlay');
  if (modal) {
    await capture(page, 'desktop--learning-mode-modal', '桌面端 - 学习模式选择弹窗');
    const closeBtn = await page.$('.modal-overlay .close-btn');
    if (closeBtn) {
      await closeBtn.click();
      await page.waitForTimeout(400);
    }
  } else {
    console.log('  ⚠ Learning mode modal did not appear');
  }

  // 5. Capture English subject preview tab (shows ReadTextCard)
  for (const tab of engTabs) {
    const text = await tab.textContent();
    if (text && text.includes('预习')) {
      await tab.click();
      await page.waitForTimeout(600);
      break;
    }
  }
  await capture(page, 'desktop--english-preview', '桌面端 - 英语预习Tab（含朗读卡片）');

  await ctx.close();

  // --- Mobile: remaining ---
  console.log('\n📱 Supplementary mobile captures...');
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const mp = await mCtx.newPage();
  mp.on('dialog', async d => await d.dismiss());

  await mp.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mp.evaluate(() => {
    localStorage.setItem('guide_completed', 'true');
  });
  await mp.reload({ waitUntil: 'networkidle' });
  await mp.waitForTimeout(1000);

  // Mobile preview scrolled
  await mp.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = 350;
  });
  await mp.waitForTimeout(500);
  await capture(mp, 'mobile--preview-scrolled', '移动端 - 预习Tab（向下滚动）', 'mobile');

  // Mobile review tab — check what tabs exist
  const mTabs = await mp.$$('.scene-tab');
  if (mTabs.length >= 2) {
    // Click the second tab (解题指导 for math)
    await mTabs[1].click();
    await mp.waitForTimeout(600);
    const tabText = await mTabs[1].textContent();
    await capture(mp, 'mobile--second-tab', `移动端 - ${(tabText || '').trim()}Tab`, 'mobile');
  }

  await mCtx.close();

  // --- Update manifest ---
  manifest.capturedAt = new Date().toISOString();
  writeFileSync(join(SCREENSHOTS_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Supplementary captures complete! Total: ${manifest.screenshots.length} screenshots.`);

  await browser.close();
}

main().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});

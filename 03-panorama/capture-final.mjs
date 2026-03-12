/**
 * Final comprehensive screenshot capture with correct selectors
 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, 'screenshots');
const URL = 'http://localhost:5173';
mkdirSync(DIR, { recursive: true });

const shots = [];
function add(name, desc, vp = 'desktop') {
  shots.push({ file: `${name}.png`, captureId: name, description: desc, viewport: vp });
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // ========== DESKTOP (1280x800) ==========
  console.log('📸 Desktop...');
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const d = await dCtx.newPage();
  d.on('dialog', async dlg => await dlg.dismiss());

  // Fresh load with guide
  await d.goto(URL, { waitUntil: 'networkidle' });
  await d.waitForTimeout(1200);

  // -- First-time guide (3 steps) --
  const hasGuide = await d.$('.guide-overlay');
  if (hasGuide) {
    await d.screenshot({ path: join(DIR, 'first-time-guide--step-1.png') });
    add('first-time-guide--step-1', '新手引导 - 第1步：选择你的教材');
    console.log('  ✓ first-time-guide--step-1');

    await d.click('.next-btn');
    await d.waitForTimeout(600);
    await d.screenshot({ path: join(DIR, 'first-time-guide--step-2.png') });
    add('first-time-guide--step-2', '新手引导 - 第2步：浏览章节目录');
    console.log('  ✓ first-time-guide--step-2');

    await d.click('.next-btn');
    await d.waitForTimeout(600);
    await d.screenshot({ path: join(DIR, 'first-time-guide--step-3.png') });
    add('first-time-guide--step-3', '新手引导 - 第3步：开始学习');
    console.log('  ✓ first-time-guide--step-3');

    // Complete
    await d.click('.next-btn');
    await d.waitForTimeout(600);
  }

  // -- Desktop: 预习 tab (default) --
  await d.screenshot({ path: join(DIR, 'desktop--preview-tab.png') });
  add('desktop--preview-tab', '桌面端 - 预习Tab（默认状态）');
  console.log('  ✓ desktop--preview-tab');

  // -- Desktop: 解题指导 tab --
  const tabItems = await d.$$('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
  if (tabItems.length >= 2) {
    await tabItems[1].click();
    await d.waitForTimeout(600);
    await d.screenshot({ path: join(DIR, 'desktop--second-tab.png') });
    add('desktop--second-tab', '桌面端 - 解题指导Tab');
    console.log('  ✓ desktop--second-tab');
  }

  // -- Desktop: 刷题 tab --
  const tabItems2 = await d.$$('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
  if (tabItems2.length >= 3) {
    await tabItems2[2].click();
    await d.waitForTimeout(600);
    await d.screenshot({ path: join(DIR, 'desktop--third-tab.png') });
    add('desktop--third-tab', '桌面端 - 刷题Tab');
    console.log('  ✓ desktop--third-tab');
  }

  // Back to 预习
  const tabItems3 = await d.$$('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
  if (tabItems3.length >= 1) {
    await tabItems3[0].click();
    await d.waitForTimeout(500);
  }

  // -- Desktop: 全部 resources --
  const allTab = await d.$('.all-resources-tab');
  if (allTab) {
    await allTab.click();
    await d.waitForTimeout(600);
    await d.screenshot({ path: join(DIR, 'desktop--all-resources.png') });
    add('desktop--all-resources', '桌面端 - 全部资源模式');
    console.log('  ✓ desktop--all-resources');
    await allTab.click();
    await d.waitForTimeout(400);
  }

  // -- Desktop: textbook selector --
  const ctxWrapper = await d.$('.context-selector-wrapper button, .context-selector-btn');
  if (ctxWrapper) {
    await ctxWrapper.click();
    await d.waitForTimeout(800);
    await d.screenshot({ path: join(DIR, 'desktop--textbook-modal.png') });
    add('desktop--textbook-modal', '桌面端 - 教材选择弹窗');
    console.log('  ✓ desktop--textbook-modal');

    // Close - try multiple approaches
    const closeBtn = await d.$('.close-btn');
    if (closeBtn) {
      await closeBtn.click();
    } else {
      const overlay = await d.$('.selector-overlay');
      if (overlay) await overlay.click({ position: { x: 5, y: 5 } });
    }
    await d.waitForTimeout(500);
  }

  // -- Desktop: settings page --
  // Find the settings action button by text content
  await d.evaluate(() => {
    const btns = document.querySelectorAll('.action-btn');
    for (const btn of btns) {
      if (btn.textContent.includes('设置')) {
        btn.click();
        return;
      }
    }
  });
  await d.waitForTimeout(600);
  const hasSettings = await d.$('.settings-page');
  if (hasSettings) {
    await d.screenshot({ path: join(DIR, 'desktop--settings.png') });
    add('desktop--settings', '桌面端 - 设置页');
    console.log('  ✓ desktop--settings');
    // Go back
    await d.evaluate(() => {
      const back = document.querySelector('.settings-page .back-btn');
      if (back) back.click();
    });
    await d.waitForTimeout(500);
  }

  // -- Desktop: scroll to chapter footer --
  await d.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = c.scrollHeight;
  });
  await d.waitForTimeout(600);
  await d.screenshot({ path: join(DIR, 'desktop--chapter-footer.png') });
  add('desktop--chapter-footer', '桌面端 - 章节底部导航（上一章/下一章）');
  console.log('  ✓ desktop--chapter-footer');

  // -- Desktop: VIP state (scroll back up to show VIP-locked cards) --
  await d.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = 0;
  });
  await d.waitForTimeout(400);
  // Scroll to a section with VIP-locked cards
  await d.evaluate(() => {
    const badges = document.querySelectorAll('.vip-badge');
    if (badges.length > 0) {
      badges[0].closest('.subsection-group')?.scrollIntoView({ behavior: 'instant' });
    }
  });
  await d.waitForTimeout(400);
  await d.screenshot({ path: join(DIR, 'desktop--vip-state.png') });
  add('desktop--vip-state', '桌面端 - VIP锁定状态卡片');
  console.log('  ✓ desktop--vip-state');

  // -- Desktop: learning mode modal --
  // Set review mode to ask-every-time
  await d.evaluate(() => {
    localStorage.setItem('appSettings', JSON.stringify({
      reviewLearningMode: 'ask-every-time',
      defaultSceneTab: 'last-selected',
      practiceDifficulties: ['basic', 'medium', 'hard']
    }));
  });
  await d.reload({ waitUntil: 'networkidle' });
  await d.waitForTimeout(1000);

  // Skip guide if it shows
  const guide2 = await d.$('.guide-overlay');
  if (guide2) {
    await d.evaluate(() => {
      localStorage.setItem('guide_completed', 'true');
    });
    await d.reload({ waitUntil: 'networkidle' });
    await d.waitForTimeout(1000);
  }

  // Switch to English subject (which has 复习 tab)
  const ctxBtn2 = await d.$('.context-selector-wrapper button');
  if (ctxBtn2) {
    await ctxBtn2.click();
    await d.waitForTimeout(800);
    // Click English option
    await d.evaluate(() => {
      const items = document.querySelectorAll('.subject-item');
      for (const item of items) {
        if (item.textContent.includes('英语')) {
          item.click();
          return;
        }
      }
    });
    await d.waitForTimeout(400);
    // Confirm
    await d.evaluate(() => {
      const btn = document.querySelector('.confirm-btn');
      if (btn) btn.click();
    });
    await d.waitForTimeout(800);
  }

  // Capture English preview (with ReadTextCard)
  await d.screenshot({ path: join(DIR, 'desktop--english-preview.png') });
  add('desktop--english-preview', '桌面端 - 英语预习Tab（含朗读卡片）');
  console.log('  ✓ desktop--english-preview');

  // Check available tabs for English
  const engTabTexts = await d.evaluate(() => {
    const tabs = document.querySelectorAll('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
    return [...tabs].map(t => t.textContent.trim());
  });
  console.log('  English tabs:', engTabTexts.join(', '));

  // Switch to 复习 tab if available
  const hasReview = engTabTexts.some(t => t.includes('复习'));
  if (hasReview) {
    await d.evaluate(() => {
      const tabs = document.querySelectorAll('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
      for (const tab of tabs) {
        if (tab.textContent.includes('复习')) {
          tab.click();
          return;
        }
      }
    });
    await d.waitForTimeout(600);

    await d.screenshot({ path: join(DIR, 'desktop--english-review.png') });
    add('desktop--english-review', '桌面端 - 英语复习Tab');
    console.log('  ✓ desktop--english-review');

    // Click knowledge card to trigger learning mode modal
    await d.evaluate(() => {
      const card = document.querySelector('.knowledge-card');
      if (card) card.click();
    });
    await d.waitForTimeout(800);

    const lmModal = await d.$('.modal-overlay');
    if (lmModal) {
      await d.screenshot({ path: join(DIR, 'desktop--learning-mode-modal.png') });
      add('desktop--learning-mode-modal', '桌面端 - 学习模式选择弹窗');
      console.log('  ✓ desktop--learning-mode-modal');
      // Close
      await d.evaluate(() => {
        const btn = document.querySelector('.modal-overlay .close-btn');
        if (btn) btn.click();
      });
      await d.waitForTimeout(400);
    } else {
      console.log('  ⚠ Learning mode modal not triggered');
    }
  }

  // -- Desktop: English with vocab entry visible in sidebar --
  await d.screenshot({ path: join(DIR, 'desktop--vocab-entry.png') });
  add('desktop--vocab-entry', '桌面端 - 英语侧边栏（含背单词入口）');
  console.log('  ✓ desktop--vocab-entry');

  await dCtx.close();

  // ========== MOBILE (375x812) ==========
  console.log('\n📱 Mobile...');
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const m = await mCtx.newPage();
  m.on('dialog', async dlg => await dlg.dismiss());

  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.evaluate(() => { localStorage.setItem('guide_completed', 'true'); });
  await m.reload({ waitUntil: 'networkidle' });
  await m.waitForTimeout(1000);

  // -- Mobile: default --
  await m.screenshot({ path: join(DIR, 'mobile--default.png') });
  add('mobile--default', '移动端 - 默认状态', 'mobile');
  console.log('  ✓ mobile--default');

  // -- Mobile: sidebar open --
  const mToggle = await m.$('.mobile-toggle');
  if (mToggle) {
    await mToggle.click();
    await m.waitForTimeout(600);
    await m.screenshot({ path: join(DIR, 'mobile--sidebar-open.png') });
    add('mobile--sidebar-open', '移动端 - 侧边栏展开', 'mobile');
    console.log('  ✓ mobile--sidebar-open');
    // Close by clicking overlay
    await m.evaluate(() => {
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.click();
    });
    await m.waitForTimeout(500);
  }

  // -- Mobile: scrolled --
  await m.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = 350;
  });
  await m.waitForTimeout(500);
  await m.screenshot({ path: join(DIR, 'mobile--preview-scrolled.png') });
  add('mobile--preview-scrolled', '移动端 - 预习Tab（向下滚动）', 'mobile');
  console.log('  ✓ mobile--preview-scrolled');

  // -- Mobile: second tab --
  await m.evaluate(() => {
    const tabs = document.querySelectorAll('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
    if (tabs.length >= 2) tabs[1].click();
  });
  await m.waitForTimeout(600);
  await m.screenshot({ path: join(DIR, 'mobile--second-tab.png') });
  add('mobile--second-tab', '移动端 - 解题指导Tab', 'mobile');
  console.log('  ✓ mobile--second-tab');

  // -- Mobile: hamburger menu --
  const moreBtn = await m.$('.more-menu-btn');
  if (moreBtn) {
    await moreBtn.click();
    await m.waitForTimeout(500);
    await m.screenshot({ path: join(DIR, 'mobile--more-menu.png') });
    add('mobile--more-menu', '移动端 - 更多菜单展开', 'mobile');
    console.log('  ✓ mobile--more-menu');
  }

  await mCtx.close();

  // ========== WRITE MANIFEST ==========
  const manifest = {
    capturedAt: new Date().toISOString(),
    prototypeType: 'standard-vue',
    prototypePath: '02-prototypes/vue-apps/chapter-list-redesign/',
    screenshots: shots
  };
  writeFileSync(join(DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`\n✅ Done! ${shots.length} screenshots captured.`);

  await browser.close();
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});

/**
 * Feature-level element screenshot capture
 * Captures cropped screenshots of individual UI features using CSS selectors
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, 'screenshots');
const URL = 'http://localhost:5173';
mkdirSync(DIR, { recursive: true });

const captured = [];

async function captureElement(page, selector, filename, label, { scrollInContainer = false, padding = 8 } = {}) {
  try {
    // If element is inside .resource-scroll-container, scroll it into view within that container
    if (scrollInContainer) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      }, selector);
      await page.waitForTimeout(500);
    }

    const el = page.locator(selector).first();
    const visible = await el.isVisible({ timeout: 2000 }).catch(() => false);
    if (!visible) {
      console.log(`  ⚠ ${filename} - selector "${selector}" not visible, skipping`);
      return false;
    }
    await el.screenshot({
      path: join(DIR, filename),
      padding: { top: padding, right: padding, bottom: padding, left: padding }
    });
    captured.push({ file: filename, selector, label });
    console.log(`  ✓ ${filename}`);
    return true;
  } catch (err) {
    console.log(`  ⚠ ${filename} - ${err.message.slice(0, 100)}`);
    return false;
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // ========== DESKTOP (1280x800) ==========
  console.log('📸 Desktop feature screenshots...');
  const dCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const d = await dCtx.newPage();
  d.on('dialog', async dlg => await dlg.dismiss());

  // Skip guide, load page
  await d.goto(URL, { waitUntil: 'networkidle' });
  await d.evaluate(() => { localStorage.setItem('guide_completed', 'true'); });
  await d.reload({ waitUntil: 'networkidle' });
  await d.waitForTimeout(1200);

  // Scroll resource container to top
  await d.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = 0;
  });
  await d.waitForTimeout(300);

  // -- Desktop features (预习 Tab default) --
  await captureElement(d, '.global-header', 'feat--dt-feat-01.png', '全局头部');
  await captureElement(d, '.scene-tabs', 'feat--dt-feat-02.png', '场景 Tab 栏');
  await captureElement(d, '.function-bar', 'feat--dt-feat-03.png', '快捷入口栏');
  await captureElement(d, '.sidebar', 'feat--dt-feat-04.png', '章节目录树');
  await captureElement(d, '.switch-btn', 'feat--dt-feat-05.png', '切换教材按钮');
  await captureElement(d, '.learning-guide', 'feat--dt-feat-06.png', '学习方法指引', { scrollInContainer: true });
  await captureElement(d, '.knowledge-card', 'feat--dt-feat-07.png', '知识点视频卡片', { scrollInContainer: true });

  // Note: guide-card, summary-note-card, premium-hook-card are defined in code
  // but not rendered in current mock data. Practice-card only appears in 刷题 tab.
  // These will be captured in their respective tab/state below.

  // NEW badge - small element, larger padding
  await captureElement(d, '.new-badge', 'feat--dt-feat-13.png', 'NEW 新内容标识', { scrollInContainer: true, padding: 16 });

  // -- Switch to 刷题 Tab for practice card + premium hook card --
  console.log('\n  Switching to 刷题 Tab...');
  const thirdTab = await d.$$('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
  if (thirdTab.length >= 3) {
    await thirdTab[2].click();
    await d.waitForTimeout(800);
    // Practice cards only appear on 刷题 tab
    await captureElement(d, '.practice-card', 'feat--dt-feat-08.png', '练习卡片', { scrollInContainer: true });
    await captureElement(d, '.premium-hook-card', 'feat--dt-feat-11.png', 'VIP钩子卡片', { scrollInContainer: true });
  }

  // -- Scroll to bottom for chapter footer --
  console.log('\n  Scrolling to chapter footer...');
  // Back to first tab
  const firstTab = await d.$$('.tab-item:not(.all-resources-tab):not(.fixed-tab)');
  if (firstTab.length >= 1) {
    await firstTab[0].click();
    await d.waitForTimeout(500);
  }
  await d.evaluate(() => {
    const c = document.querySelector('.resource-scroll-container');
    if (c) c.scrollTop = c.scrollHeight;
  });
  await d.waitForTimeout(600);
  await captureElement(d, '.chapter-footer', 'feat--dt-feat-12.png', '章节底部导航');

  await dCtx.close();

  // ========== MOBILE (375x812) ==========
  console.log('\n📱 Mobile feature screenshots...');
  const mCtx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const m = await mCtx.newPage();
  m.on('dialog', async dlg => await dlg.dismiss());

  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.evaluate(() => { localStorage.setItem('guide_completed', 'true'); });
  await m.reload({ waitUntil: 'networkidle' });
  await m.waitForTimeout(1000);

  // Mobile toggle (sidebar pull tab)
  await captureElement(m, '.mobile-toggle', 'feat--mb-feat-01.png', '侧边栏拉手', { padding: 16 });

  // More menu wrapper
  await captureElement(m, '.more-menu-wrapper', 'feat--mb-feat-03.png', '移动端更多菜单', { padding: 12 });

  // Open sidebar for sidebar screenshot
  const toggle = await m.$('.mobile-toggle');
  if (toggle) {
    await toggle.click();
    await m.waitForTimeout(600);
    // Capture the sidebar when it has is-open class
    const sidebarOpen = await m.$('.sidebar.is-open');
    if (sidebarOpen) {
      await captureElement(m, '.sidebar.is-open', 'feat--mb-feat-02.png', '抽屉式侧边栏');
    } else {
      // Try just .sidebar
      await captureElement(m, '.sidebar', 'feat--mb-feat-02.png', '抽屉式侧边栏');
    }
    // Close
    await m.evaluate(() => {
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.click();
    });
    await m.waitForTimeout(400);
  }

  await mCtx.close();

  // ========== TEXTBOOK MODAL features ==========
  console.log('\n📸 Textbook modal feature screenshots...');
  const tCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const t = await tCtx.newPage();
  t.on('dialog', async dlg => await dlg.dismiss());

  await t.goto(URL, { waitUntil: 'networkidle' });
  await t.evaluate(() => { localStorage.setItem('guide_completed', 'true'); });
  await t.reload({ waitUntil: 'networkidle' });
  await t.waitForTimeout(1000);

  // Open textbook modal
  const ctxBtn = await t.$('.context-selector-wrapper button, .context-selector-btn');
  if (ctxBtn) {
    await ctxBtn.click();
    await t.waitForTimeout(800);
    await captureElement(t, '.context-selector', 'feat--tb-modal.png', '教材切换弹窗', { padding: 4 });
  }

  await tCtx.close();

  // ========== FIRST-TIME GUIDE features ==========
  console.log('\n📸 First-time guide feature screenshots...');
  const gCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const g = await gCtx.newPage();
  g.on('dialog', async dlg => await dlg.dismiss());

  // Fresh load WITHOUT guide_completed to show guide
  await g.goto(URL, { waitUntil: 'networkidle' });
  await g.waitForTimeout(1200);

  const hasGuide = await g.$('.guide-overlay');
  if (hasGuide) {
    await captureElement(g, '.guide-content', 'feat--fg-guide-card.png', '引导内容卡片');
    await captureElement(g, '.step-indicator', 'feat--fg-step-indicator.png', '步骤指示器', { padding: 12 });
  }

  await gCtx.close();

  console.log(`\n✅ Done! ${captured.length} feature screenshots captured.`);
  console.log('\nCaptured features:');
  for (const c of captured) {
    console.log(`  ${c.file} → ${c.label}`);
  }

  await browser.close();
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});

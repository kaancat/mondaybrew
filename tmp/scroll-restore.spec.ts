import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

async function openMenu(page: Page) {
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(page.locator('[data-slot="sheet-content"]').first()).toHaveAttribute('data-state', 'open');
}

async function closeMenu(page: Page) {
  await page.getByRole('button', { name: 'Luk menu' }).click();
  await expect(page.locator('[data-slot="sheet-content"]').first()).toHaveAttribute('data-state', 'closed');
}

test('scroll position restores exactly (home)', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

  // Scroll to a reliable mid point
  await page.evaluate(() => window.scrollTo({ top: 1800, left: 0, behavior: 'auto' }));
  const before = await page.evaluate(() => window.scrollY);

  await openMenu(page);
  await closeMenu(page);

  // Allow any pending rAF timers to run
  await page.waitForTimeout(80);
  const after = await page.evaluate(() => window.scrollY);

  expect(Math.abs(after - before)).toBeLessThan(1);
});

test('scroll position restores exactly (kontakt)', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('http://localhost:3000/kontakt', { waitUntil: 'networkidle' });

  await page.evaluate(() => window.scrollTo({ top: 1200, left: 0, behavior: 'auto' }));
  const before = await page.evaluate(() => window.scrollY);

  await openMenu(page);
  await closeMenu(page);

  await page.waitForTimeout(80);
  const after = await page.evaluate(() => window.scrollY);
  expect(Math.abs(after - before)).toBeLessThan(1);
});

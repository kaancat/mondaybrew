import { test, expect } from '@playwright/test';

test('open/close mirrors on homepage', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  const sheet = page.locator('[data-slot="sheet-content"]').first();

  const openBtn = page.getByRole('button', { name: 'Open menu' });
  const closeBtn = page.getByRole('button', { name: 'Luk menu' });

  const t0 = Date.now();
  await openBtn.click();
  await expect(sheet).toHaveAttribute('data-state', 'open');
  const t1 = Date.now();

  await closeBtn.click();
  await expect(sheet).toHaveAttribute('data-state', 'closed');
  const t2 = Date.now();

  const openMs = t1 - t0;
  const closeMs = t2 - t1;
  expect(Math.abs(closeMs - openMs)).toBeLessThan(180);
});

test('open/close mirrors on /kontakt', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('http://localhost:3000/kontakt', { waitUntil: 'networkidle' });
  const sheet = page.locator('[data-slot="sheet-content"]').first();

  const openBtn = page.getByRole('button', { name: 'Open menu' });
  const closeBtn = page.getByRole('button', { name: 'Luk menu' });

  const t0 = Date.now();
  await openBtn.click();
  await expect(sheet).toHaveAttribute('data-state', 'open');
  const t1 = Date.now();

  await closeBtn.click();
  await expect(sheet).toHaveAttribute('data-state', 'closed');
  const t2 = Date.now();

  const openMs = t1 - t0;
  const closeMs = t2 - t1;
  expect(Math.abs(closeMs - openMs)).toBeLessThan(180);
});

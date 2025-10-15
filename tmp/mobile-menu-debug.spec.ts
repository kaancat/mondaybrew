import { test, expect } from '@playwright/test';

test('open mobile menu on homepage', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 932 });
  await page.goto('http://localhost:4000/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'tmp/home-menu.png', fullPage: true });
});


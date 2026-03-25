import { test, expect } from '@playwright/test';

test('landing page loads correctly', async ({ page }) => {
  await page.goto('/');
  // Basic check: header/footer/title
  await expect(page).toHaveTitle(/feat\./i);
  
  // Ensure no horizontal overflow (mobile-first requirement)
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(overflow).toBe(false);
});

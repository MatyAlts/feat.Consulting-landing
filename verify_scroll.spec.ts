import { test, expect } from '@playwright/test';

test.use({
  viewport: { width: 390, height: 844 }, // iPhone 12/13
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1',
});

test('scroll restoration on mobile', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Wait for content to load
  await page.waitForSelector('main');
  
  // Scroll down to Services or DecisionStage
  await page.evaluate(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 1000;
  });
  
  // Wait for scroll to settle
  await page.waitForTimeout(500);
  
  const initialScrollTop = await page.evaluate(() => document.querySelector('main')?.scrollTop);
  console.log(`Initial scroll top: ${initialScrollTop}`);
  
  // Click "Let's talk" in StickyFooter
  const letsTalkButton = page.locator('button:has-text("Let\'s talk")').first();
  await letsTalkButton.click();
  
  // Verify we are on /contact or seeing the form
  await expect(page).toHaveURL(/.*contact/);
  await page.waitForSelector('h1:has-text("Turn your traction")');
  
  // Click close button (X)
  const closeButton = page.locator('aria-label=Close');
  await closeButton.click();
  
  // Wait for restoration
  await page.waitForTimeout(1000); // Wait for the restoration setTimeout in MobileLayout
  
  const restoredScrollTop = await page.evaluate(() => document.querySelector('main')?.scrollTop);
  console.log(`Restored scroll top: ${restoredScrollTop}`);
  
  // It should be close to the initial one
  expect(Math.abs((restoredScrollTop || 0) - (initialScrollTop || 0))).toBeLessThan(100);
});

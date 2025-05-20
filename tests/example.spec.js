import { test, expect } from '@playwright/test';

test('홈페이지가 열리는지', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle(/Vite/);
});

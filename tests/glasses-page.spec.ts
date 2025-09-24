import { test, expect } from '@playwright/test';

test.describe('Bike Glasses Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/glasses.html');
  });

  test('should load glasses page with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Premium Bike Glasses/);
  });

  test('should display main heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bike Glasses Collection');
    await expect(page.locator('.subtitle')).toContainText('Premium cycling eyewear for every adventure');
  });

  test('should display protection benefits section', async ({ page }) => {
    const protectionCards = page.locator('.protection-card');
    await expect(protectionCards).toHaveCount(4);

    // Check specific protection features
    await expect(page.getByText('UV Protection')).toBeVisible();
    await expect(page.getByText('Wind Shield')).toBeVisible();
    await expect(page.getByText('Weather Resistant')).toBeVisible();
    await expect(page.getByText('Impact Resistant')).toBeVisible();
  });

  test('should display all 6 glasses products with prices', async ({ page }) => {
    const glassesCards = page.locator('.glasses-card');
    await expect(glassesCards).toHaveCount(6);

    // Check that all cards have prices
    const prices = page.locator('.price');
    await expect(prices).toHaveCount(6);

    // Check specific product
    await expect(page.getByText('Aero Racing Pro')).toBeVisible();
    await expect(page.getByText('$189.99')).toBeVisible();
  });

  test('should have working back navigation to helmets page', async ({ page }) => {
    const backLink = page.locator('a[data-track="back-to-helmets"]');
    await expect(backLink).toBeVisible();
    await expect(backLink).toContainText('Back to Helmets');

    await backLink.click();
    await expect(page).toHaveURL(/^\/$|index\.html$/);
    await expect(page).toHaveTitle(/Beautiful Bike Helmets/);
  });

  test('should have working bottom navigation', async ({ page }) => {
    const helmetsLink = page.locator('a[data-track="view-helmets-from-glasses"]');
    await expect(helmetsLink).toBeVisible();
    await expect(helmetsLink).toContainText('View Helmets');
  });

  test('should display lens information for each product', async ({ page }) => {
    const lensInfoSections = page.locator('.lens-info');
    await expect(lensInfoSections).toHaveCount(6);

    // Check that lens info contains expected text
    await expect(page.getByText('VLT:', { exact: false })).toHaveCount(6);
  });

  test('should have proper color scheme (pink/coral theme)', async ({ page }) => {
    // Check that the page has the pink gradient background
    const body = page.locator('body');
    const bgColor = await body.evaluate((el) => {
      return window.getComputedStyle(el).backgroundImage;
    });
    expect(bgColor).toContain('linear-gradient');
  });

  test('should have all required glasses features', async ({ page }) => {
    const glassesCards = page.locator('.glasses-card');

    for (let i = 0; i < await glassesCards.count(); i++) {
      const card = glassesCards.nth(i);
      await expect(card.locator('.glasses-image')).toBeVisible();
      await expect(card.locator('.glasses-title')).toBeVisible();
      await expect(card.locator('.price')).toBeVisible();
      await expect(card.locator('.glasses-description')).toBeVisible();
      await expect(card.locator('.features')).toBeVisible();
      await expect(card.locator('.lens-info')).toBeVisible();
    }
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.glasses-grid')).toBeVisible();
    await expect(page.locator('.protection-grid')).toBeVisible();
  });
});
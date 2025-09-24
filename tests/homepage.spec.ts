import { test, expect } from '@playwright/test';

test.describe('Bike Helmets Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the homepage with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Beautiful Bike Helmets/);
  });

  test('should display main heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Beautiful Bike Helmets');
    await expect(page.locator('.subtitle')).toContainText('Safety meets style on every ride');
  });

  test('should display all 6 helmet cards', async ({ page }) => {
    const helmetCards = page.locator('.helmet-card');
    await expect(helmetCards).toHaveCount(6);

    // Check specific helmet titles
    await expect(page.locator('.helmet-title').first()).toContainText('Aero Pro Racing');
    await expect(page.locator('.helmet-title').last()).toContainText('Youth Adventure');
  });

  test('should have working navigation to glasses page', async ({ page }) => {
    const glassesLink = page.locator('a[data-track="view-glasses"]');
    await expect(glassesLink).toBeVisible();
    await expect(glassesLink).toHaveText('View Bike Glasses');

    await glassesLink.click();
    await expect(page).toHaveURL(/glasses\.html/);
    await expect(page).toHaveTitle(/Bike Glasses/);
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const grid = page.locator('.helmet-grid');
    await expect(grid).toBeVisible();

    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(grid).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have all helmet cards with required elements', async ({ page }) => {
    const helmetCards = page.locator('.helmet-card');

    for (let i = 0; i < await helmetCards.count(); i++) {
      const card = helmetCards.nth(i);
      await expect(card.locator('.helmet-image')).toBeVisible();
      await expect(card.locator('.helmet-title')).toBeVisible();
      await expect(card.locator('.helmet-description')).toBeVisible();
      await expect(card.locator('.features')).toBeVisible();
    }
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    const title = await page.locator('title').textContent();
    expect(title).toContain('Beautiful Bike Helmets');
    expect(title).toContain('Premium Cycling Safety Gear');

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /bike helmets.*cycling safety/);

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Beautiful Bike Helmets/);
  });
});
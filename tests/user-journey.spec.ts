import { test, expect } from '@playwright/test';

test.describe('User Journey Tests', () => {
  test('complete user journey: homepage → glasses → back to homepage', async ({ page }) => {
    // Start journey on homepage
    await page.goto('/');
    await expect(page).toHaveTitle(/Beautiful Bike Helmets/);

    // User reads main content
    await expect(page.locator('h1')).toContainText('Beautiful Bike Helmets');
    await expect(page.locator('.subtitle')).toContainText('Safety meets style on every ride');

    // User explores helmet options
    const helmetCards = page.locator('.helmet-card');
    await expect(helmetCards).toHaveCount(6);

    // User is interested in the first helmet
    const firstHelmet = helmetCards.first();
    await expect(firstHelmet.locator('.helmet-title')).toContainText('Aero Pro Racing');
    await expect(firstHelmet.locator('.helmet-description')).toBeVisible();

    // User scrolls down to see all helmets (simulate scrolling behavior)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    // User decides to check out glasses as well
    const glassesButton = page.locator('a[data-track="view-glasses"]');
    await expect(glassesButton).toBeVisible();
    await glassesButton.click();

    // Journey continues on glasses page
    await expect(page).toHaveURL(/glasses\.html/);
    await expect(page).toHaveTitle(/Premium Bike Glasses/);

    // User reads glasses page content
    await expect(page.locator('h1')).toContainText('Bike Glasses Collection');

    // User explores protection features
    const protectionCards = page.locator('.protection-card');
    await expect(protectionCards).toHaveCount(4);
    await expect(page.getByText('UV Protection')).toBeVisible();
    await expect(page.getByText('Wind Shield')).toBeVisible();

    // User looks at glasses products
    const glassesCards = page.locator('.glasses-card');
    await expect(glassesCards).toHaveCount(6);

    // User is interested in the racing glasses
    const racingGlasses = page.getByText('Aero Racing Pro').locator('..');
    await expect(racingGlasses.locator('.price')).toContainText('$189.99');

    // User scrolls to see all glasses options
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(500);

    // User considers shopping
    const shopButton = page.locator('a[data-track="shop-glasses-collection"]');
    await expect(shopButton).toBeVisible();

    // User decides to go back to helmets to compare
    const backButton = page.locator('a[data-track="back-to-helmets"]');
    await expect(backButton).toContainText('Back to Helmets');
    await backButton.click();

    // User is back on homepage
    await expect(page).toHaveURL(/^\/$|index\.html$/);
    await expect(page.locator('h1')).toContainText('Beautiful Bike Helmets');

    // User now has context from both pages and might explore collection
    const exploreButton = page.locator('a[data-track="explore-collection"]');
    await expect(exploreButton).toBeVisible();

    // Complete user journey - user has seen both helmet and glasses options
    await expect(page.locator('.cta-section')).toBeVisible();
  });

  test('mobile user journey with touch interactions', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Mobile user starts on homepage
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Mobile user scrolls through helmets
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(300);

    // Check responsive design
    const helmetGrid = page.locator('.helmet-grid');
    await expect(helmetGrid).toBeVisible();

    // Mobile user taps to go to glasses
    await page.tap('a[data-track="view-glasses"]');
    await expect(page).toHaveURL(/glasses\.html/);

    // Mobile user explores glasses on small screen
    await expect(page.locator('.glasses-grid')).toBeVisible();

    // Mobile user scrolls through protection features
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(300);

    // Mobile user navigates back
    await page.tap('a[data-track="back-to-helmets"]');
    await expect(page).toHaveURL(/^\/$|index\.html$/);
  });

  test('analytics tracking throughout user journey', async ({ page }) => {
    // Clear any existing analytics data
    await page.evaluate(() => localStorage.clear());

    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // User's first interaction - explore collection
    await page.click('a[data-track="explore-collection"]');

    let analyticsData = await page.evaluate(() => {
      return window.bikeGearAnalytics.getAnalyticsData();
    });
    expect(analyticsData.totalClicks).toBe(1);

    // User navigates to glasses page
    await page.click('a[data-track="view-glasses"]');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Analytics should persist across pages
    analyticsData = await page.evaluate(() => {
      return window.bikeGearAnalytics.getAnalyticsData();
    });
    expect(analyticsData.totalClicks).toBeGreaterThanOrEqual(1);

    // User shops glasses collection
    await page.click('a[data-track="shop-glasses-collection"]');

    // Check final analytics state
    analyticsData = await page.evaluate(() => {
      return window.bikeGearAnalytics.getAnalyticsData();
    });
    expect(analyticsData.totalClicks).toBeGreaterThanOrEqual(2);
    expect(analyticsData.clicks['shop-glasses-collection']).toBeDefined();
  });

  test('user journey with slow network conditions', async ({ page }) => {
    // Simulate slow 3G connection
    await page.route('**/*', route => {
      // Add delay to simulate slow network
      setTimeout(() => route.continue(), 100);
    });

    const startTime = Date.now();
    await page.goto('/');

    // Page should still load within reasonable time even on slow connection
    await expect(page.locator('h1')).toBeVisible();
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000); // 5 seconds max on slow connection

    // Navigation should work on slow connection
    await page.click('a[data-track="view-glasses"]');
    await expect(page.locator('h1')).toContainText('Bike Glasses Collection');
  });

  test('user journey with JavaScript disabled', async ({ page }) => {
    // Disable JavaScript to test graceful degradation
    await page.setJavaScriptEnabled(false);

    // User can still navigate basic content
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.helmet-card')).toHaveCount(6);

    // Basic navigation should work without JavaScript
    await page.click('a[href="glasses.html"]');
    await expect(page).toHaveURL(/glasses\.html/);
    await expect(page.locator('h1')).toContainText('Bike Glasses Collection');

    // User can navigate back
    await page.click('a[href="index.html"]');
    await expect(page).toHaveURL(/index\.html/);
  });

  test('user journey error handling', async ({ page }) => {
    // Test what happens if user tries to access non-existent page
    const response = await page.goto('/non-existent-page.html');
    expect(response?.status()).toBe(404);

    // User goes back to working homepage
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    // Normal user journey should work after error
    await page.click('a[data-track="view-glasses"]');
    await expect(page).toHaveURL(/glasses\.html/);
  });

  test('complete shopping research journey', async ({ page }) => {
    // User researching gear for new cycling hobby
    await page.goto('/');

    // Step 1: User reads about helmet safety features
    const mountainHelmet = page.locator('.helmet-card').filter({ hasText: 'Mountain Explorer' });
    await expect(mountainHelmet.locator('.features li')).toContainText(['MIPS safety technology']);

    // Step 2: User compares helmet prices (implicit - just viewing)
    const premiumHelmet = page.locator('.helmet-card').filter({ hasText: 'Premium Classic' });
    await expect(premiumHelmet).toBeVisible();

    // Step 3: User wants to see eye protection options
    await page.click('a[data-track="view-glasses"]');

    // Step 4: User learns about UV protection
    await expect(page.getByText('100% UV400 protection shields your eyes from harmful rays')).toBeVisible();

    // Step 5: User compares glasses prices
    const budgetGlasses = page.locator('.glasses-card').filter({ hasText: 'Youth Adventure' });
    await expect(budgetGlasses.locator('.price')).toContainText('$59.99');

    const premiumGlasses = page.locator('.glasses-card').filter({ hasText: 'Endurance Pro' });
    await expect(premiumGlasses.locator('.price')).toContainText('$229.99');

    // Step 6: User ready to make informed decision
    await expect(page.locator('.cta-section')).toBeVisible();
    await expect(page.getByText('Protect Your Vision')).toBeVisible();

    // User journey complete - they have enough information to purchase
  });

  test('accessibility-focused user journey', async ({ page }) => {
    // Simulate user with keyboard navigation only
    await page.goto('/');

    // User tabs through the page
    await page.keyboard.press('Tab'); // Focus first focusable element
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // User finds the glasses link and activates with Enter
    const activeElement = await page.evaluate(() => document.activeElement?.textContent);

    // User can navigate using keyboard
    await page.keyboard.press('Enter');

    // Should work for screen reader users
    await expect(page.locator('h1')).toHaveAttribute('role');
  });
});
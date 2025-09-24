import { test, expect } from '@playwright/test';

test.describe('Analytics Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test('should initialize analytics system on homepage', async ({ page }) => {
    await page.goto('/');

    // Wait for analytics to initialize
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Check that analytics object exists
    const analyticsExists = await page.evaluate(() => {
      return typeof window.bikeGearAnalytics === 'object';
    });
    expect(analyticsExists).toBe(true);
  });

  test('should track button clicks on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Click the "Explore Collection" button
    await page.click('a[data-track="explore-collection"]');

    // Check that click was tracked
    const clickData = await page.evaluate(() => {
      return window.bikeGearAnalytics.getAnalyticsData();
    });

    expect(clickData.totalClicks).toBe(1);
    expect(clickData.clicks['explore-collection']).toBeDefined();
    expect(clickData.clicks['explore-collection']).toHaveLength(1);
  });

  test('should track button clicks on glasses page', async ({ page }) => {
    await page.goto('/glasses.html');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Click the "Shop Collection" button
    await page.click('a[data-track="shop-glasses-collection"]');

    // Check that click was tracked
    const clickData = await page.evaluate(() => {
      return window.bikeGearAnalytics.getAnalyticsData();
    });

    expect(clickData.totalClicks).toBe(1);
    expect(clickData.clicks['shop-glasses-collection']).toBeDefined();
  });

  test('should persist analytics data across page navigation', async ({ page }) => {
    // Start on homepage and track a click
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);
    await page.click('a[data-track="explore-collection"]');

    // Navigate to glasses page and track another click
    await page.click('a[data-track="view-glasses"]');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);
    await page.click('a[data-track="shop-glasses-collection"]');

    // Check that both clicks are tracked
    const clickData = await page.evaluate(() => {
      return window.bikeGearAnalytics.getAnalyticsData();
    });

    expect(clickData.totalClicks).toBe(2);
    expect(clickData.clicks['explore-collection']).toBeDefined();
    expect(clickData.clicks['shop-glasses-collection']).toBeDefined();
  });

  test('should display analytics popup notification', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Check that analytics popup appears and disappears
    const analyticsInfo = page.locator('#analytics-info');
    await expect(analyticsInfo).toHaveClass(/show/);

    // Wait for popup to auto-hide
    await page.waitForTimeout(3500);
    await expect(analyticsInfo).not.toHaveClass(/show/);
  });

  test('should update click counter in real-time', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Initial count should be 0
    const initialCount = await page.locator('#click-count').textContent();
    expect(initialCount).toBe('0');

    // Click a button
    await page.click('a[data-track="explore-collection"]');

    // Check that counter updated
    const updatedCount = await page.locator('#click-count').textContent();
    expect(updatedCount).toBe('1');
  });

  test('should log analytics data to console', async ({ page }) => {
    const consoleMessages: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'log' && msg.text().includes('Analytics:')) {
        consoleMessages.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);
    await page.click('a[data-track="explore-collection"]');

    // Check that console log was created
    expect(consoleMessages).toHaveLength(1);
    expect(consoleMessages[0]).toContain('Button clicked - explore-collection');
    expect(consoleMessages[0]).toContain('helmets page');
  });

  test('should handle localStorage errors gracefully', async ({ page }) => {
    // Disable localStorage
    await page.addInitScript(() => {
      // Mock localStorage to throw errors
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: () => { throw new Error('localStorage disabled'); },
          getItem: () => null,
          removeItem: () => { throw new Error('localStorage disabled'); }
        },
        writable: false
      });
    });

    await page.goto('/');

    // Page should still load and function
    await expect(page.locator('h1')).toBeVisible();

    // Analytics might not work but page shouldn't crash
    const hasErrors = await page.evaluate(() => {
      return window.onerror !== null;
    });
    expect(hasErrors).toBeFalsy();
  });
});
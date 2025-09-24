import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');

    // Wait for main content to be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.helmet-card').first()).toBeVisible();

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds on local server
    expect(loadTime).toBeLessThan(3000);
  });

  test('glasses page should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/glasses.html');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.glasses-card').first()).toBeVisible();

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });

  test('navigation between pages should be fast', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();

    const startTime = Date.now();
    await page.click('a[data-track="view-glasses"]');
    await expect(page.locator('h1')).toContainText('Bike Glasses Collection');

    const navigationTime = Date.now() - startTime;
    expect(navigationTime).toBeLessThan(1000);
  });

  test('analytics should not impact page performance significantly', async ({ page }) => {
    // Test page load without analytics
    await page.addInitScript(() => {
      window.localStorage.clear();
    });

    const startTime = Date.now();
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    const loadTimeWithAnalytics = Date.now() - startTime;

    // Test multiple analytics operations
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    const operationStart = Date.now();
    for (let i = 0; i < 10; i++) {
      await page.click('a[data-track="explore-collection"]', { force: true });
    }
    const analyticsOperationTime = Date.now() - operationStart;

    // Analytics operations should be fast
    expect(analyticsOperationTime).toBeLessThan(500);

    // Page should still be responsive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('images should not cause layout shifts', async ({ page }) => {
    await page.goto('/');

    // Wait for page to stabilize
    await page.waitForTimeout(1000);

    // Get initial positions of elements
    const initialPositions = await page.evaluate(() => {
      const elements = document.querySelectorAll('.helmet-card');
      return Array.from(elements).map((el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      });
    });

    // Wait a bit more to see if anything shifts
    await page.waitForTimeout(2000);

    // Get final positions
    const finalPositions = await page.evaluate(() => {
      const elements = document.querySelectorAll('.helmet-card');
      return Array.from(elements).map((el) => {
        const rect = el.getBoundingClientRect();
        return { top: rect.top, left: rect.left };
      });
    });

    // Positions should not have changed (no layout shift)
    expect(finalPositions).toEqual(initialPositions);
  });

  test('CSS animations should be smooth', async ({ page }) => {
    await page.goto('/');

    // Test hover animations
    const helmetCard = page.locator('.helmet-card').first();

    await helmetCard.hover();

    // Check that transform is applied
    const hasTransform = await helmetCard.evaluate((el) => {
      const transform = window.getComputedStyle(el).transform;
      return transform !== 'none';
    });

    expect(hasTransform).toBe(true);
  });

  test('localStorage operations should be efficient', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Time localStorage operations
    const operationTime = await page.evaluate(() => {
      const startTime = performance.now();

      // Simulate multiple analytics operations
      for (let i = 0; i < 100; i++) {
        localStorage.setItem(`test-${i}`, JSON.stringify({
          timestamp: new Date().toISOString(),
          data: 'test data'.repeat(10)
        }));
      }

      // Clear test data
      for (let i = 0; i < 100; i++) {
        localStorage.removeItem(`test-${i}`);
      }

      return performance.now() - startTime;
    });

    // Should complete quickly
    expect(operationTime).toBeLessThan(100);
  });

  test('page should handle rapid user interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Rapidly click multiple buttons
    const buttons = page.locator('a[data-track]');
    const buttonCount = Math.min(await buttons.count(), 5);

    const startTime = Date.now();
    for (let i = 0; i < buttonCount; i++) {
      await buttons.nth(i).click({ force: true });
      // Small delay to prevent overwhelming
      await page.waitForTimeout(50);
    }
    const interactionTime = Date.now() - startTime;

    // Should handle rapid interactions smoothly
    expect(interactionTime).toBeLessThan(1000);

    // Page should still be responsive
    await expect(page.locator('h1')).toBeVisible();
  });

  test('memory usage should be reasonable', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => window.bikeGearAnalytics !== undefined);

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Perform many analytics operations
    for (let i = 0; i < 50; i++) {
      await page.click('a[data-track="explore-collection"]', { force: true });
    }

    // Get final memory usage
    const finalMemory = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize;
      }
      return 0;
    });

    // Memory increase should be reasonable (less than 10MB)
    if (initialMemory > 0 && finalMemory > 0) {
      const memoryIncrease = finalMemory - initialMemory;
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 10MB
    }
  });
});
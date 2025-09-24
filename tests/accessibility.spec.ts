import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('homepage should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check heading structure (h1 -> h2 -> h3)
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Beautiful Bike Helmets');

    const h2 = page.locator('h2');
    await expect(h2).toHaveCount(1);
    await expect(h2).toContainText('Find Your Perfect Helmet');

    const h3 = page.locator('h3');
    await expect(h3).toHaveCount(6); // One for each helmet card
  });

  test('glasses page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/glasses.html');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Bike Glasses Collection');

    const h2 = page.locator('h2');
    await expect(h2).toHaveCount(1);

    const h3 = page.locator('h3');
    await expect(h3).toHaveCount(10); // 4 protection cards + 6 product cards
  });

  test('all buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through all interactive elements
    const buttons = page.locator('a[data-track]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      await button.focus();

      // Check that button is focusable
      const isFocused = await button.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);

      // Check that Enter key works
      await page.keyboard.press('Enter');
    }
  });

  test('images should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    const helmetImages = page.locator('.helmet-image');
    const count = await helmetImages.count();

    for (let i = 0; i < count; i++) {
      const image = helmetImages.nth(i);
      await expect(image).toHaveAttribute('role', 'img');
      await expect(image).toHaveAttribute('aria-label');
    }
  });

  test('glasses page images should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/glasses.html');

    const glassesImages = page.locator('.glasses-image');
    const count = await glassesImages.count();

    for (let i = 0; i < count; i++) {
      const image = glassesImages.nth(i);
      await expect(image).toHaveAttribute('role', 'img');
      await expect(image).toHaveAttribute('aria-label');
    }
  });

  test('navigation links should have descriptive text', async ({ page }) => {
    await page.goto('/');

    const glassesLink = page.locator('a[data-track="view-glasses"]');
    await expect(glassesLink).toHaveText('View Bike Glasses');

    await page.goto('/glasses.html');

    const backLink = page.locator('a[data-track="back-to-helmets"]');
    await expect(backLink).toContainText('Back to Helmets');

    const helmetsLink = page.locator('a[data-track="view-helmets-from-glasses"]');
    await expect(helmetsLink).toHaveText('View Helmets');
  });

  test('color contrast should be sufficient', async ({ page }) => {
    await page.goto('/');

    // Test main text color against background
    const textElements = [
      page.locator('h1'),
      page.locator('.helmet-description').first(),
      page.locator('.cta-text')
    ];

    for (const element of textElements) {
      await expect(element).toBeVisible();

      // Get computed styles
      const styles = await element.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          color: computed.color,
          backgroundColor: computed.backgroundColor
        };
      });

      // Basic check that color and background are different
      expect(styles.color).not.toBe(styles.backgroundColor);
    }
  });

  test('page should work without JavaScript', async ({ page }) => {
    // Disable JavaScript
    await page.setJavaScriptEnabled(false);

    await page.goto('/');

    // Basic content should still be visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.helmet-card')).toHaveCount(6);

    // Navigation should still work
    await page.click('a[href="glasses.html"]');
    await expect(page).toHaveURL(/glasses\.html/);
    await expect(page.locator('h1')).toContainText('Bike Glasses Collection');
  });

  test('forms and interactive elements should have proper labels', async ({ page }) => {
    await page.goto('/');

    // Check that all clickable elements have accessible names
    const clickableElements = page.locator('a, button');
    const count = await clickableElements.count();

    for (let i = 0; i < count; i++) {
      const element = clickableElements.nth(i);
      const text = await element.textContent();
      const ariaLabel = await element.getAttribute('aria-label');
      const title = await element.getAttribute('title');

      // Element should have accessible text content, aria-label, or title
      expect(text || ariaLabel || title).toBeTruthy();
    }
  });

  test('page should be usable at 200% zoom', async ({ page }) => {
    // Set zoom to 200%
    await page.setViewportSize({ width: 640, height: 400 });

    await page.goto('/');

    // Main content should still be accessible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.helmet-card').first()).toBeVisible();

    // Navigation should still work
    const glassesLink = page.locator('a[data-track="view-glasses"]');
    await expect(glassesLink).toBeVisible();

    await glassesLink.click();
    await expect(page).toHaveURL(/glasses\.html/);
  });
});
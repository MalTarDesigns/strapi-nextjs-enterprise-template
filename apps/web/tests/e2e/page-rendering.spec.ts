import { test, expect } from '@playwright/test';

test.describe('Page Rendering E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any necessary cookies or authentication
    await page.goto('/');
  });

  test('should render homepage with proper structure', async ({ page }) => {
    await page.goto('/');

    // Check for basic page structure
    await expect(page.locator('html')).toHaveAttribute('lang', /en|cs/);
    await expect(page.locator('head title')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();

    // Check for navigation
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();

    // Check for main content area
    const main = page.locator('main, [role="main"]').first();
    await expect(main).toBeVisible();

    // Check for footer
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer).toBeVisible();
  });

  test('should handle different page types correctly', async ({ page }) => {
    // Test regular page
    await page.goto('/about');
    await expect(page.locator('h1')).toBeVisible();
    
    // Test blog post page (if exists)
    await page.goto('/blog');
    const blogExists = await page.locator('h1').isVisible({ timeout: 5000 });
    if (blogExists) {
      await expect(page.locator('h1')).toContainText(/blog|posts/i);
    }
  });

  test('should render dynamic zone blocks correctly', async ({ page }) => {
    await page.goto('/');

    // Test hero section
    const heroSection = page.locator('[data-testid="hero-section"], section:has(h1)').first();
    if (await heroSection.isVisible()) {
      await expect(heroSection.locator('h1')).toBeVisible();
    }

    // Test content sections
    const contentSections = page.locator('section, article');
    const sectionCount = await contentSections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test('should load images properly', async ({ page }) => {
    await page.goto('/');

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      // Check that images have proper attributes
      for (let i = 0; i < Math.min(imageCount, 5); i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('src');
        
        // Check if image loaded successfully
        const src = await img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          const response = await page.request.get(src);
          expect(response.status()).toBeLessThan(400);
        }
      }
    }
  });

  test('should handle theme tokens correctly', async ({ page }) => {
    await page.goto('/');

    // Check that CSS custom properties are applied
    const documentElement = page.locator('html');
    
    const styles = await page.evaluate(() => {
      const computedStyles = window.getComputedStyle(document.documentElement);
      const customProps: Record<string, string> = {};
      
      // Get all custom properties (CSS variables)
      for (let i = 0; i < computedStyles.length; i++) {
        const prop = computedStyles[i];
        if (prop.startsWith('--')) {
          customProps[prop] = computedStyles.getPropertyValue(prop).trim();
        }
      }
      
      return customProps;
    });

    // Verify that theme tokens are applied
    const hasThemeTokens = Object.keys(styles).length > 0;
    if (hasThemeTokens) {
      // Common theme token patterns
      const commonTokens = ['--primary', '--secondary', '--background', '--foreground'];
      const foundCommonTokens = commonTokens.some(token => 
        Object.keys(styles).some(key => key.includes(token.replace('--', '')))
      );
      
      expect(foundCommonTokens || Object.keys(styles).length > 10).toBeTruthy();
    }
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility requirements
    await expect(page.locator('html')).toHaveAttribute('lang');
    
    // Check for skip links
    const skipLink = page.locator('a[href="#main"], a[href="#content"]');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();
    }

    // Check that interactive elements are keyboard accessible
    const focusableElements = page.locator('a, button, input, textarea, select, [tabindex]');
    const focusableCount = await focusableElements.count();
    
    if (focusableCount > 0) {
      // Test keyboard navigation on first few elements
      for (let i = 0; i < Math.min(focusableCount, 3); i++) {
        const element = focusableElements.nth(i);
        await element.focus();
        await expect(element).toBeFocused();
      }
    }

    // Check for alt attributes on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const hasAlt = await img.getAttribute('alt') !== null;
      const isDecorative = await img.getAttribute('role') === 'presentation';
      
      expect(hasAlt || isDecorative).toBeTruthy();
    }
  });

  test('should handle form interactions', async ({ page }) => {
    await page.goto('/');

    // Look for contact forms
    const contactForm = page.locator('form, [data-testid="contact-form"]').first();
    
    if (await contactForm.isVisible()) {
      // Check form fields
      const nameField = contactForm.locator('input[name="name"], input[type="text"]').first();
      const emailField = contactForm.locator('input[name="email"], input[type="email"]').first();
      const submitButton = contactForm.locator('button[type="submit"], input[type="submit"]').first();

      if (await nameField.isVisible()) {
        await nameField.fill('Test User');
        await expect(nameField).toHaveValue('Test User');
      }

      if (await emailField.isVisible()) {
        await emailField.fill('test@example.com');
        await expect(emailField).toHaveValue('test@example.com');
      }

      // Don't actually submit the form in tests
      await expect(submitButton).toBeVisible();
    }

    // Look for newsletter forms
    const newsletterForm = page.locator('form:has(input[type="email"]), [data-testid="newsletter-form"]').first();
    
    if (await newsletterForm.isVisible()) {
      const emailInput = newsletterForm.locator('input[type="email"]').first();
      
      if (await emailInput.isVisible()) {
        await emailInput.fill('newsletter@example.com');
        await expect(emailInput).toHaveValue('newsletter@example.com');
      }
    }
  });

  test('should handle navigation correctly', async ({ page }) => {
    await page.goto('/');

    // Get navigation links
    const navLinks = page.locator('nav a, [role="navigation"] a');
    const linkCount = await navLinks.count();

    if (linkCount > 0) {
      // Test internal navigation links
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = navLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          // Click the link and verify navigation
          await link.click();
          await page.waitForLoadState('networkidle');
          
          // Verify we navigated to a new page
          const currentUrl = page.url();
          expect(currentUrl).toContain(href);
          
          // Go back for next test
          await page.goBack();
        }
      }
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that page renders properly on desktop
    const desktopNav = page.locator('nav, [role="navigation"]').first();
    await expect(desktopNav).toBeVisible();

    // Test tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);

    // Check that navigation is still accessible (might be hamburger menu)
    const tabletNav = page.locator('nav, [role="navigation"], button[aria-label*="menu"]').first();
    await expect(tabletNav).toBeVisible();

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    // Check that mobile navigation works
    const mobileMenuButton = page.locator('button[aria-label*="menu"], button:has([data-testid="menu-icon"])').first();
    
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      // Check if mobile menu opened
      const mobileMenu = page.locator('[role="dialog"], .mobile-menu, [data-testid="mobile-menu"]').first();
      if (await mobileMenu.isVisible()) {
        await expect(mobileMenu).toBeVisible();
        
        // Close the menu
        await mobileMenuButton.click();
      }
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    
    // Should show 404 page or redirect
    const is404 = page.url().includes('404') || 
                  await page.locator('h1:has-text("404"), h1:has-text("Not Found")').isVisible() ||
                  await page.locator('[data-testid="404-page"]').isVisible();
    
    expect(is404).toBeTruthy();
  });

  test('should load page metadata correctly', async ({ page }) => {
    await page.goto('/');

    // Check basic meta tags
    await expect(page.locator('title')).not.toBeEmpty();
    
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.isVisible()) {
      await expect(metaDescription).toHaveAttribute('content');
    }

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    if (await ogTitle.isVisible()) {
      await expect(ogTitle).toHaveAttribute('content');
    }

    const ogDescription = page.locator('meta[property="og:description"]');
    if (await ogDescription.isVisible()) {
      await expect(ogDescription).toHaveAttribute('content');
    }

    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    if (await canonical.isVisible()) {
      await expect(canonical).toHaveAttribute('href');
    }
  });

  test('should handle JavaScript interactions', async ({ page }) => {
    await page.goto('/');

    // Test theme toggle if it exists
    const themeToggle = page.locator('button[aria-label*="theme"], button:has([data-testid="theme-toggle"])').first();
    
    if (await themeToggle.isVisible()) {
      // Get initial theme
      const initialTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 
               document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      await themeToggle.click();
      await page.waitForTimeout(500);

      // Check if theme changed
      const newTheme = await page.evaluate(() => {
        return document.documentElement.getAttribute('data-theme') || 
               document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      });

      expect(newTheme).not.toBe(initialTheme);
    }

    // Test accordion/collapsible content
    const accordionTrigger = page.locator('[data-testid="accordion-trigger"], button[aria-expanded]').first();
    
    if (await accordionTrigger.isVisible()) {
      const isExpanded = await accordionTrigger.getAttribute('aria-expanded') === 'true';
      
      await accordionTrigger.click();
      await page.waitForTimeout(300);
      
      const newExpanded = await accordionTrigger.getAttribute('aria-expanded') === 'true';
      expect(newExpanded).toBe(!isExpanded);
    }
  });
});
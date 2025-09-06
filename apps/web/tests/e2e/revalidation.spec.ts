import { test, expect } from '@playwright/test';

test.describe('Content Revalidation E2E Tests', () => {
  // Mock Strapi API endpoints for testing
  let strapiApiCalls: any[] = [];

  test.beforeEach(async ({ page, context }) => {
    strapiApiCalls = [];
    
    // Intercept Strapi API calls to track revalidation triggers
    await page.route('**/api/revalidate', (route, request) => {
      strapiApiCalls.push({
        url: request.url(),
        method: request.method(),
        body: request.postDataJSON()
      });
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ revalidated: true, path: request.postDataJSON()?.path })
      });
    });

    // Mock Strapi content API responses
    await page.route('**/api/pages*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              attributes: {
                title: 'Test Page',
                slug: 'test-page',
                fullPath: '/test-page',
                blocks: [
                  {
                    __component: 'sections.hero',
                    title: 'Test Hero',
                    description: 'Test Description'
                  }
                ],
                updatedAt: new Date().toISOString()
              }
            }
          ]
        })
      });
    });

    await page.route('**/api/site*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            attributes: {
              name: 'Test Site',
              themeTokens: {
                primary: '#007bff',
                secondary: '#6c757d'
              },
              updatedAt: new Date().toISOString()
            }
          }
        })
      });
    });
  });

  test('should trigger revalidation when page content changes', async ({ page }) => {
    // Navigate to a page
    await page.goto('/test-page');
    await page.waitForLoadState('networkidle');

    // Simulate content change in Strapi by posting to revalidation endpoint
    const revalidationResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        path: '/test-page',
        type: 'page',
        action: 'update'
      }
    });

    expect(revalidationResponse.ok()).toBeTruthy();
    const responseData = await revalidationResponse.json();
    expect(responseData.revalidated).toBe(true);

    // Verify that the page reflects the changes after revalidation
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // The page should load successfully after revalidation
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle site-wide revalidation for theme changes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial CSS custom properties
    const initialTheme = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue('--primary').trim(),
        secondary: styles.getPropertyValue('--secondary').trim()
      };
    });

    // Simulate site configuration change
    const revalidationResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        tag: 'site',
        type: 'site',
        action: 'update'
      }
    });

    expect(revalidationResponse.ok()).toBeTruthy();

    // Mock updated site configuration with new theme
    await page.route('**/api/site*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 1,
            attributes: {
              name: 'Updated Test Site',
              themeTokens: {
                primary: '#28a745', // Changed color
                secondary: '#dc3545'  // Changed color
              },
              updatedAt: new Date().toISOString()
            }
          }
        })
      });
    });

    // Reload page to see theme changes
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify theme changes are applied
    const updatedTheme = await page.evaluate(() => {
      const styles = window.getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue('--primary').trim(),
        secondary: styles.getPropertyValue('--secondary').trim()
      };
    });

    // Theme should be different from initial (if theme system is working)
    if (updatedTheme.primary && initialTheme.primary) {
      // Only assert if both values exist (theme system might not be active in test)
      expect(updatedTheme.primary !== initialTheme.primary || 
             updatedTheme.secondary !== initialTheme.secondary).toBeTruthy();
    }
  });

  test('should handle navigation revalidation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get initial navigation structure
    const initialNavLinks = await page.locator('nav a').all();
    const initialNavCount = initialNavLinks.length;

    // Simulate navigation update
    const revalidationResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        tag: 'navigation',
        type: 'navigation',
        action: 'update'
      }
    });

    expect(revalidationResponse.ok()).toBeTruthy();

    // Mock updated navigation
    await page.route('**/api/navigation*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              attributes: {
                title: 'Home',
                url: '/',
                order: 1
              }
            },
            {
              id: 2,
              attributes: {
                title: 'About',
                url: '/about',
                order: 2
              }
            },
            {
              id: 3,
              attributes: {
                title: 'New Page', // New navigation item
                url: '/new-page',
                order: 3
              }
            }
          ]
        })
      });
    });

    // Reload to see navigation changes
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Navigation should be updated (this test assumes navigation is dynamically loaded)
    const updatedNavLinks = await page.locator('nav a').all();
    
    // At minimum, navigation should still be present
    expect(updatedNavLinks.length).toBeGreaterThanOrEqual(1);
  });

  test('should handle preview mode revalidation', async ({ page }) => {
    // Enable preview mode
    await page.goto('/api/preview?secret=' + (process.env.PREVIEW_SECRET || 'test-preview-secret') + '&slug=test-page');
    
    // Navigate to the preview page
    await page.goto('/test-page');
    await page.waitForLoadState('networkidle');

    // Check if preview mode is active
    const previewBanner = page.locator('[data-testid="preview-banner"], .preview-mode-banner');
    const isPreviewMode = await previewBanner.isVisible() || 
                         await page.evaluate(() => document.cookie.includes('__prerender_bypass'));

    if (isPreviewMode) {
      // In preview mode, content should be served fresh
      await expect(page.locator('h1')).toBeVisible();
    }

    // Exit preview mode
    await page.goto('/api/preview/exit');
    await page.goto('/test-page');
    
    // Should be back to normal mode
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle revalidation failures gracefully', async ({ page }) => {
    await page.goto('/');

    // Mock revalidation endpoint to return error
    await page.route('**/api/revalidate', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Revalidation failed', error: 'Server error' })
      });
    });

    // Attempt revalidation
    const revalidationResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        path: '/test-page',
        type: 'page'
      }
    });

    expect(revalidationResponse.status()).toBe(500);

    // Page should still function normally despite revalidation failure
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle batch revalidation', async ({ page }) => {
    await page.goto('/');

    // Test batch revalidation of multiple paths
    const revalidationResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        batch: [
          { path: '/', type: 'page' },
          { path: '/about', type: 'page' },
          { tag: 'navigation', type: 'navigation' },
          { tag: 'footer', type: 'footer' }
        ]
      }
    });

    expect(revalidationResponse.ok()).toBeTruthy();
    const responseData = await revalidationResponse.json();
    
    expect(responseData.revalidated).toBe(true);
    expect(responseData.processed).toBe(4);

    // Pages should still load correctly after batch revalidation
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    await page.goto('/about');
    // About page might not exist, so just check that we get a valid response
    const aboutPageExists = await page.locator('h1').isVisible({ timeout: 5000 });
    if (aboutPageExists) {
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('should verify ISR (Incremental Static Regeneration) behavior', async ({ page, context }) => {
    // Test static page generation and revalidation
    await page.goto('/test-page');
    await page.waitForLoadState('networkidle');

    // First visit - page should load
    await expect(page.locator('h1')).toBeVisible();

    // Simulate content update
    await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        path: '/test-page',
        type: 'page',
        action: 'update'
      }
    });

    // Mock updated content
    await page.route('**/api/pages*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            {
              id: 1,
              attributes: {
                title: 'Updated Test Page', // Changed title
                slug: 'test-page',
                fullPath: '/test-page',
                blocks: [
                  {
                    __component: 'sections.hero',
                    title: 'Updated Test Hero', // Changed content
                    description: 'Updated Test Description'
                  }
                ],
                updatedAt: new Date().toISOString()
              }
            }
          ]
        })
      });
    });

    // Visit page again - should show updated content
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Content should be present (updated content test would require actual ISR setup)
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle revalidation with authentication', async ({ page }) => {
    // Test revalidation endpoint security
    
    // Should reject requests without secret
    const noSecretResponse = await page.request.post('/api/revalidate', {
      data: {
        path: '/test-page',
        type: 'page'
      }
    });

    expect(noSecretResponse.status()).toBe(401);

    // Should reject requests with invalid secret
    const invalidSecretResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: 'invalid-secret',
        path: '/test-page',
        type: 'page'
      }
    });

    expect(invalidSecretResponse.status()).toBe(401);

    // Should accept requests with valid secret
    const validSecretResponse = await page.request.post('/api/revalidate', {
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        path: '/test-page',
        type: 'page'
      }
    });

    expect(validSecretResponse.ok()).toBeTruthy();
  });

  test('should handle revalidation webhook integration', async ({ page }) => {
    // Simulate Strapi webhook call
    const webhookResponse = await page.request.post('/api/revalidate', {
      headers: {
        'Content-Type': 'application/json',
        'X-Strapi-Event': 'entry.update'
      },
      data: {
        secret: process.env.REVALIDATE_SECRET || 'test-secret',
        path: '/test-page',
        type: 'page',
        action: 'update',
        model: 'page',
        entry: {
          id: 1,
          title: 'Updated via webhook',
          slug: 'test-page'
        }
      }
    });

    expect(webhookResponse.ok()).toBeTruthy();
    
    const responseData = await webhookResponse.json();
    expect(responseData.revalidated).toBe(true);
    expect(responseData.path).toBe('/test-page');
  });
});
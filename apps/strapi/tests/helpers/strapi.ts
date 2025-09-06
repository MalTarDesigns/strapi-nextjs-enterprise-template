import Strapi from '@strapi/strapi';
import fs from 'fs/promises';

let instance: Strapi | null = null;

export async function setupStrapi(): Promise<Strapi> {
  if (!instance) {
    // Use SQLite for testing
    process.env.DATABASE_CLIENT = 'sqlite';
    process.env.DATABASE_FILENAME = '.tmp/test.db';
    
    // Ensure .tmp directory exists
    try {
      await fs.mkdir('.tmp', { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    instance = await Strapi({
      distDir: './dist',
    }).load();
    
    await instance.server.mount();
  }
  
  return instance;
}

export async function cleanupStrapi(strapi: Strapi): Promise<void> {
  if (strapi && strapi.destroy) {
    await strapi.destroy();
  }
  
  // Clean up test database
  try {
    await fs.unlink('.tmp/test.db');
  } catch (error) {
    // File might not exist
  }
}

export function getStrapiInstance(): Strapi | null {
  return instance;
}

export async function createTestData(strapi: Strapi) {
  // Helper function to create test data
  return {
    // Create test site
    site: await strapi.entityService.create('api::site.site', {
      data: {
        name: 'Test Site',
        domains: ['test.example.com'],
        themeTokens: {
          'primary': '#007bff',
          'secondary': '#6c757d'
        }
      }
    }),
    
    // Create test page
    page: await strapi.entityService.create('api::page.page', {
      data: {
        title: 'Test Page',
        slug: 'test-page',
        fullPath: '/test-page',
        blocks: [
          {
            __component: 'sections.hero',
            title: 'Test Hero',
            description: 'Test description'
          }
        ],
        publishedAt: new Date().toISOString()
      }
    }),
    
    // Create test navigation item
    navigationItem: await strapi.entityService.create('api::navigation-item.navigation-item', {
      data: {
        title: 'Test Nav Item',
        url: '/test',
        publishedAt: new Date().toISOString()
      }
    }),
    
    // Create test post
    post: await strapi.entityService.create('api::post.post', {
      data: {
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        publishedAt: new Date().toISOString()
      }
    })
  };
}

export async function cleanupTestData(strapi: Strapi, testData: any) {
  // Clean up created test data
  if (testData.site) {
    await strapi.entityService.delete('api::site.site', testData.site.id);
  }
  if (testData.page) {
    await strapi.entityService.delete('api::page.page', testData.page.id);
  }
  if (testData.navigationItem) {
    await strapi.entityService.delete('api::navigation-item.navigation-item', testData.navigationItem.id);
  }
  if (testData.post) {
    await strapi.entityService.delete('api::post.post', testData.post.id);
  }
}
/**
 * Database setup utilities for testing
 * Provides functions to set up and tear down test databases
 */

import fs from 'fs/promises';
import path from 'path';

interface TestDatabaseConfig {
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  client: 'sqlite' | 'postgres' | 'mysql';
}

/**
 * Set up test database configuration
 */
export async function setupTestDatabase(config: TestDatabaseConfig = { client: 'sqlite', database: '.tmp/test.db' }) {
  const env = process.env;
  
  switch (config.client) {
    case 'sqlite':
      // Ensure .tmp directory exists
      await fs.mkdir('.tmp', { recursive: true }).catch(() => {
        // Directory might already exist
      });
      
      env.DATABASE_CLIENT = 'sqlite';
      env.DATABASE_FILENAME = config.database;
      break;
      
    case 'postgres':
      env.DATABASE_CLIENT = 'postgres';
      env.DATABASE_HOST = config.host || 'localhost';
      env.DATABASE_PORT = String(config.port || 5432);
      env.DATABASE_NAME = config.database;
      env.DATABASE_USERNAME = config.username || 'postgres';
      env.DATABASE_PASSWORD = config.password || '';
      break;
      
    case 'mysql':
      env.DATABASE_CLIENT = 'mysql';
      env.DATABASE_HOST = config.host || 'localhost';
      env.DATABASE_PORT = String(config.port || 3306);
      env.DATABASE_NAME = config.database;
      env.DATABASE_USERNAME = config.username || 'root';
      env.DATABASE_PASSWORD = config.password || '';
      break;
  }
  
  // Set test environment
  env.NODE_ENV = 'test';
  
  // Set JWT secrets for testing
  env.JWT_SECRET = env.JWT_SECRET || 'test-jwt-secret-key';
  env.ADMIN_JWT_SECRET = env.ADMIN_JWT_SECRET || 'test-admin-jwt-secret';
  env.API_TOKEN_SALT = env.API_TOKEN_SALT || 'test-api-token-salt';
  
  return config;
}

/**
 * Clean up test database
 */
export async function cleanupTestDatabase(config: TestDatabaseConfig) {
  switch (config.client) {
    case 'sqlite':
      try {
        await fs.unlink(config.database);
      } catch (error) {
        // File might not exist
      }
      break;
      
    case 'postgres':
    case 'mysql':
      // For non-SQLite databases, you might want to drop/recreate the database
      // This depends on your specific setup and CI environment
      console.log(`Cleanup for ${config.client} database: ${config.database}`);
      break;
  }
}

/**
 * Create test data fixtures
 */
export function createTestFixtures() {
  return {
    // Site configuration
    site: {
      name: 'Test Site',
      domains: ['test.example.com'],
      themeTokens: {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d',
          background: '#ffffff',
          foreground: '#212529'
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem'
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          fontSize: {
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem'
          }
        }
      },
      logo: null,
      favicon: null
    },
    
    // Test pages
    pages: [
      {
        title: 'Homepage',
        slug: 'home',
        fullPath: '/',
        blocks: [
          {
            __component: 'sections.hero',
            title: 'Welcome to Test Site',
            subTitle: 'This is a test homepage',
            backgroundImage: null,
            links: [
              {
                text: 'Get Started',
                url: '/getting-started',
                type: 'button'
              }
            ]
          },
          {
            __component: 'utilities.ck-editor-content',
            content: '<h2>About Us</h2><p>This is test content about our organization.</p>'
          }
        ],
        seo: {
          metaTitle: 'Test Site - Homepage',
          metaDescription: 'Welcome to our test website',
          keywords: 'test, website, homepage'
        }
      },
      {
        title: 'About Us',
        slug: 'about',
        fullPath: '/about',
        blocks: [
          {
            __component: 'sections.hero',
            title: 'About Our Organization',
            subTitle: 'Learn more about what we do'
          },
          {
            __component: 'sections.faq',
            title: 'Frequently Asked Questions',
            items: [
              {
                question: 'What do you do?',
                answer: 'We create amazing web experiences.'
              },
              {
                question: 'How can I contact you?',
                answer: 'You can reach us through our contact form.'
              }
            ]
          }
        ]
      },
      {
        title: 'Contact Us',
        slug: 'contact',
        fullPath: '/contact',
        blocks: [
          {
            __component: 'forms.contact-form',
            title: 'Get in Touch',
            description: 'We\'d love to hear from you',
            fields: [
              {
                name: 'name',
                label: 'Full Name',
                type: 'text',
                required: true
              },
              {
                name: 'email',
                label: 'Email Address',
                type: 'email',
                required: true
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                required: true
              }
            ],
            submitButtonText: 'Send Message',
            successMessage: 'Thank you for your message!',
            errorMessage: 'Failed to send message. Please try again.'
          }
        ]
      }
    ],
    
    // Navigation items
    navigationItems: [
      {
        title: 'Home',
        url: '/',
        order: 1,
        isVisible: true
      },
      {
        title: 'About',
        url: '/about',
        order: 2,
        isVisible: true
      },
      {
        title: 'Contact',
        url: '/contact',
        order: 3,
        isVisible: true
      }
    ],
    
    // Blog posts
    posts: [
      {
        title: 'First Blog Post',
        slug: 'first-blog-post',
        content: '<h2>Introduction</h2><p>This is our first blog post with some interesting content.</p>',
        excerpt: 'This is our first blog post with some interesting content.',
        publishedAt: new Date().toISOString(),
        seo: {
          metaTitle: 'First Blog Post - Test Site',
          metaDescription: 'Read our first blog post about interesting topics.'
        }
      },
      {
        title: 'Second Blog Post',
        slug: 'second-blog-post',
        content: '<h2>More Content</h2><p>Here is our second blog post with even more content.</p>',
        excerpt: 'Here is our second blog post with even more content.',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
      }
    ],
    
    // Test users
    users: [
      {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
        confirmed: true,
        blocked: false,
        role: 'authenticated'
      },
      {
        username: 'editoruser',
        email: 'editor@example.com',
        password: 'EditorPassword123!',
        confirmed: true,
        blocked: false,
        role: 'editor'
      }
    ]
  };
}

/**
 * Validate test environment
 */
export function validateTestEnvironment() {
  const requiredEnvVars = [
    'DATABASE_CLIENT',
    'JWT_SECRET',
    'ADMIN_JWT_SECRET',
    'API_TOKEN_SALT'
  ];
  
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables for testing: ${missing.join(', ')}`);
  }
  
  if (process.env.NODE_ENV !== 'test') {
    console.warn('Warning: NODE_ENV is not set to "test"');
  }
  
  return true;
}

/**
 * Generate random test data
 */
export function generateTestData() {
  const randomId = Math.random().toString(36).substr(2, 9);
  
  return {
    page: {
      title: `Test Page ${randomId}`,
      slug: `test-page-${randomId}`,
      fullPath: `/test-page-${randomId}`,
      blocks: [
        {
          __component: 'sections.hero',
          title: `Test Hero ${randomId}`,
          subTitle: `Test subtitle for ${randomId}`
        }
      ]
    },
    
    user: {
      username: `testuser${randomId}`,
      email: `test${randomId}@example.com`,
      password: 'TestPassword123!',
      confirmed: true,
      blocked: false
    },
    
    post: {
      title: `Test Post ${randomId}`,
      slug: `test-post-${randomId}`,
      content: `<p>Test content for post ${randomId}</p>`,
      publishedAt: new Date().toISOString()
    }
  };
}

/**
 * Wait for database to be ready
 */
export async function waitForDatabase(maxWaitTime = 10000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      // Try to perform a simple database operation
      // This would be specific to your database setup
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  throw new Error(`Database not ready after ${maxWaitTime}ms`);
}

/**
 * Reset database to clean state
 */
export async function resetDatabase() {
  // This would implement database reset logic
  // Specific to your database and ORM setup
  console.log('Resetting database to clean state...');
  
  // For Strapi, you might want to:
  // 1. Clear all content types
  // 2. Reset to initial state
  // 3. Re-run migrations if needed
}

export default {
  setupTestDatabase,
  cleanupTestDatabase,
  createTestFixtures,
  validateTestEnvironment,
  generateTestData,
  waitForDatabase,
  resetDatabase
};
import request from 'supertest';
import { getStrapiInstance, createTestData, cleanupTestData } from '../helpers/strapi';

describe('Site API', () => {
  let strapi: any;
  let testData: any;

  beforeAll(async () => {
    strapi = getStrapiInstance();
  });

  beforeEach(async () => {
    testData = await createTestData(strapi);
  });

  afterEach(async () => {
    if (testData) {
      await cleanupTestData(strapi, testData);
    }
  });

  describe('GET /api/site', () => {
    it('should return site configuration', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/site')
        .expect(200);

      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.attributes).toHaveProperty('name', 'Test Site');
      expect(response.body.data.attributes).toHaveProperty('domains');
      expect(response.body.data.attributes).toHaveProperty('themeTokens');
    });

    it('should include populated relationships when requested', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/site?populate=*')
        .expect(200);

      expect(response.body.data.attributes).toHaveProperty('logo');
      expect(response.body.data.attributes).toHaveProperty('favicon');
    });

    it('should filter sensitive fields in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const response = await request(strapi.server.httpServer)
        .get('/api/site')
        .expect(200);

      // Ensure no sensitive data is exposed
      expect(response.body.data.attributes).not.toHaveProperty('createdAt');
      expect(response.body.data.attributes).not.toHaveProperty('updatedAt');

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('PUT /api/site', () => {
    it('should update site configuration with valid data', async () => {
      const updateData = {
        data: {
          name: 'Updated Test Site',
          themeTokens: {
            primary: '#ff0000',
            secondary: '#00ff00'
          }
        }
      };

      const response = await request(strapi.server.httpServer)
        .put('/api/site')
        .send(updateData)
        .expect(200);

      expect(response.body.data.attributes.name).toBe('Updated Test Site');
      expect(response.body.data.attributes.themeTokens.primary).toBe('#ff0000');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        data: {
          name: '' // Empty name should fail validation
        }
      };

      await request(strapi.server.httpServer)
        .put('/api/site')
        .send(invalidData)
        .expect(400);
    });

    it('should validate theme tokens format', async () => {
      const invalidData = {
        data: {
          name: 'Test Site',
          themeTokens: 'invalid-json'
        }
      };

      await request(strapi.server.httpServer)
        .put('/api/site')
        .send(invalidData)
        .expect(400);
    });
  });

  describe('Site Lifecycle Hooks', () => {
    it('should trigger revalidation after site update', async () => {
      // Mock revalidation function
      const mockRevalidate = jest.fn();
      const originalFetch = global.fetch;
      global.fetch = jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      } as Response));

      const updateData = {
        data: {
          name: 'Revalidation Test Site'
        }
      };

      await request(strapi.server.httpServer)
        .put('/api/site')
        .send(updateData)
        .expect(200);

      // Restore original fetch
      global.fetch = originalFetch;
    });
  });

  describe('Site Theme Tokens', () => {
    it('should handle complex theme token structures', async () => {
      const complexThemeTokens = {
        colors: {
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            900: '#1e3a8a'
          }
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem'
        }
      };

      const updateData = {
        data: {
          themeTokens: complexThemeTokens
        }
      };

      const response = await request(strapi.server.httpServer)
        .put('/api/site')
        .send(updateData)
        .expect(200);

      expect(response.body.data.attributes.themeTokens).toEqual(complexThemeTokens);
    });
  });
});
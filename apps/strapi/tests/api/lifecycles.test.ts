import request from 'supertest';
import { getStrapiInstance } from '../helpers/strapi';

describe('Lifecycle Hooks and Revalidation', () => {
  let strapi: any;
  let mockRevalidateEndpoint: jest.Mock;
  let originalFetch: typeof global.fetch;

  beforeAll(async () => {
    strapi = getStrapiInstance();
    
    // Mock fetch for revalidation calls
    originalFetch = global.fetch;
    mockRevalidateEndpoint = jest.fn();
    global.fetch = jest.fn().mockImplementation((url: string, options: any) => {
      if (url.includes('/api/revalidate')) {
        mockRevalidateEndpoint(url, options);
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ revalidated: true })
        } as Response);
      }
      return originalFetch(url, options);
    });
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    mockRevalidateEndpoint.mockClear();
  });

  describe('Page Lifecycle Hooks', () => {
    it('should trigger revalidation on page creation', async () => {
      const pageData = {
        data: {
          title: 'New Page for Revalidation',
          slug: 'new-page-revalidation',
          fullPath: '/new-page-revalidation',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'Hero Title'
            }
          ]
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(pageData)
        .expect(200);

      // Check that revalidation was triggered
      expect(mockRevalidateEndpoint).toHaveBeenCalled();
      
      const revalidationCall = mockRevalidateEndpoint.mock.calls[0];
      expect(revalidationCall[0]).toContain('/api/revalidate');
      expect(revalidationCall[1].method).toBe('POST');
      
      const body = JSON.parse(revalidationCall[1].body);
      expect(body).toHaveProperty('path', '/new-page-revalidation');
      expect(body).toHaveProperty('type', 'page');
    });

    it('should trigger revalidation on page update', async () => {
      // Create a page first
      const pageResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Update Test Page',
            slug: 'update-test-page',
            fullPath: '/update-test-page',
            blocks: []
          }
        })
        .expect(200);

      const pageId = pageResponse.body.data.id;
      mockRevalidateEndpoint.mockClear();

      // Update the page
      const updateData = {
        data: {
          title: 'Updated Page Title',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'Updated Hero'
            }
          ]
        }
      };

      await request(strapi.server.httpServer)
        .put(`/api/pages/${pageId}`)
        .send(updateData)
        .expect(200);

      // Check that revalidation was triggered
      expect(mockRevalidateEndpoint).toHaveBeenCalled();
      
      const revalidationCall = mockRevalidateEndpoint.mock.calls[0];
      expect(revalidationCall[0]).toContain('/api/revalidate');
      
      const body = JSON.parse(revalidationCall[1].body);
      expect(body).toHaveProperty('path', '/update-test-page');
      expect(body).toHaveProperty('type', 'page');
    });

    it('should trigger revalidation on page deletion', async () => {
      // Create a page first
      const pageResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Delete Test Page',
            slug: 'delete-test-page',
            fullPath: '/delete-test-page',
            blocks: []
          }
        })
        .expect(200);

      const pageId = pageResponse.body.data.id;
      mockRevalidateEndpoint.mockClear();

      // Delete the page
      await request(strapi.server.httpServer)
        .delete(`/api/pages/${pageId}`)
        .expect(200);

      // Check that revalidation was triggered
      expect(mockRevalidateEndpoint).toHaveBeenCalled();
      
      const revalidationCall = mockRevalidateEndpoint.mock.calls[0];
      expect(revalidationCall[0]).toContain('/api/revalidate');
      
      const body = JSON.parse(revalidationCall[1].body);
      expect(body).toHaveProperty('path', '/delete-test-page');
      expect(body).toHaveProperty('type', 'page');
      expect(body).toHaveProperty('action', 'delete');
    });

    it('should handle revalidation errors gracefully', async () => {
      // Mock fetch to return error
      global.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Revalidation failed' })
        } as Response);
      });

      const pageData = {
        data: {
          title: 'Revalidation Error Test',
          slug: 'revalidation-error-test',
          fullPath: '/revalidation-error-test',
          blocks: []
        }
      };

      // Page creation should still succeed even if revalidation fails
      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(pageData)
        .expect(200);

      // Reset fetch mock
      global.fetch = jest.fn().mockImplementation((url: string, options: any) => {
        if (url.includes('/api/revalidate')) {
          mockRevalidateEndpoint(url, options);
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ revalidated: true })
          } as Response);
        }
        return originalFetch(url, options);
      });
    });
  });

  describe('Site Lifecycle Hooks', () => {
    it('should trigger revalidation on site update', async () => {
      // Create a site first
      const siteResponse = await request(strapi.server.httpServer)
        .post('/api/site')
        .send({
          data: {
            name: 'Test Site for Revalidation',
            domains: ['test.example.com'],
            themeTokens: {
              primary: '#007bff'
            }
          }
        })
        .expect(200);

      const siteId = siteResponse.body.data.id;
      mockRevalidateEndpoint.mockClear();

      // Update the site
      const updateData = {
        data: {
          name: 'Updated Site Name',
          themeTokens: {
            primary: '#ff0000',
            secondary: '#00ff00'
          }
        }
      };

      await request(strapi.server.httpServer)
        .put(`/api/site`)
        .send(updateData)
        .expect(200);

      // Check that revalidation was triggered
      expect(mockRevalidateEndpoint).toHaveBeenCalled();
      
      const revalidationCall = mockRevalidateEndpoint.mock.calls[0];
      expect(revalidationCall[0]).toContain('/api/revalidate');
      
      const body = JSON.parse(revalidationCall[1].body);
      expect(body).toHaveProperty('type', 'site');
    });
  });

  describe('Navigation Item Lifecycle Hooks', () => {
    it('should trigger revalidation on navigation item changes', async () => {
      const navItemData = {
        data: {
          title: 'Nav Item for Revalidation',
          url: '/nav-revalidation',
          order: 1
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/navigation-items')
        .send(navItemData)
        .expect(200);

      // Check that revalidation was triggered
      expect(mockRevalidateEndpoint).toHaveBeenCalled();
      
      const revalidationCall = mockRevalidateEndpoint.mock.calls[0];
      expect(revalidationCall[0]).toContain('/api/revalidate');
      
      const body = JSON.parse(revalidationCall[1].body);
      expect(body).toHaveProperty('type', 'navigation');
    });
  });

  describe('Breadcrumb Generation', () => {
    it('should generate breadcrumbs for nested pages', async () => {
      // Create parent page
      const parentResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Parent Page',
            slug: 'parent',
            fullPath: '/parent',
            blocks: []
          }
        })
        .expect(200);

      const parentId = parentResponse.body.data.id;

      // Create child page
      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Child Page',
            slug: 'child',
            fullPath: '/parent/child',
            parent: parentId,
            blocks: []
          }
        })
        .expect(200);

      // Request page with breadcrumbs
      const response = await request(strapi.server.httpServer)
        .get('/api/pages?filters[fullPath][$eq]=/parent/child&populate[parent]=*')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta).toHaveProperty('breadcrumbs');
      expect(response.body.meta.breadcrumbs).toBeInstanceOf(Array);
      expect(response.body.meta.breadcrumbs.length).toBeGreaterThan(0);
    });

    it('should generate breadcrumbs for deeply nested pages', async () => {
      // Create grandparent page
      const grandparentResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Grandparent',
            slug: 'grandparent',
            fullPath: '/grandparent',
            blocks: []
          }
        })
        .expect(200);

      const grandparentId = grandparentResponse.body.data.id;

      // Create parent page
      const parentResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Parent',
            slug: 'parent',
            fullPath: '/grandparent/parent',
            parent: grandparentId,
            blocks: []
          }
        })
        .expect(200);

      const parentId = parentResponse.body.data.id;

      // Create child page
      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Child',
            slug: 'child',
            fullPath: '/grandparent/parent/child',
            parent: parentId,
            blocks: []
          }
        })
        .expect(200);

      // Request deeply nested page with breadcrumbs
      const response = await request(strapi.server.httpServer)
        .get('/api/pages?filters[fullPath][$eq]=/grandparent/parent/child')
        .expect(200);

      expect(response.body.meta).toHaveProperty('breadcrumbs');
      expect(response.body.meta.breadcrumbs).toHaveLength(3); // grandparent, parent, child
      
      const breadcrumbs = response.body.meta.breadcrumbs;
      expect(breadcrumbs[0]).toHaveProperty('title', 'Grandparent');
      expect(breadcrumbs[1]).toHaveProperty('title', 'Parent');
      expect(breadcrumbs[2]).toHaveProperty('title', 'Child');
    });
  });

  describe('Slug Auto-generation', () => {
    it('should auto-generate slug from title on page creation', async () => {
      const pageData = {
        data: {
          title: 'Auto Generated Slug Page Title',
          // No slug provided, should be generated from title
          blocks: []
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(pageData)
        .expect(200);

      expect(response.body.data.attributes.slug).toBe('auto-generated-slug-page-title');
      expect(response.body.data.attributes.fullPath).toBe('/auto-generated-slug-page-title');
    });

    it('should handle duplicate slugs by appending numbers', async () => {
      const basePageData = {
        data: {
          title: 'Duplicate Slug Test',
          blocks: []
        }
      };

      // Create first page
      const firstResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(basePageData)
        .expect(200);

      expect(firstResponse.body.data.attributes.slug).toBe('duplicate-slug-test');

      // Create second page with same title
      const secondResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(basePageData)
        .expect(200);

      // Should have different slug
      expect(secondResponse.body.data.attributes.slug).toBe('duplicate-slug-test-1');
      expect(secondResponse.body.data.attributes.fullPath).toBe('/duplicate-slug-test-1');
    });

    it('should sanitize slug from special characters', async () => {
      const pageData = {
        data: {
          title: 'Special!@#$%^&*()Characters_In-Title.test',
          blocks: []
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(pageData)
        .expect(200);

      // Slug should be sanitized
      const slug = response.body.data.attributes.slug;
      expect(slug).toMatch(/^[a-z0-9-]+$/); // Only lowercase letters, numbers, and hyphens
      expect(slug).not.toContain('!@#$%^&*()');
    });
  });

  describe('Full Path Generation', () => {
    it('should generate fullPath based on parent hierarchy', async () => {
      // Create parent page
      const parentResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Services',
            slug: 'services',
            blocks: []
          }
        })
        .expect(200);

      const parentId = parentResponse.body.data.id;
      expect(parentResponse.body.data.attributes.fullPath).toBe('/services');

      // Create child page
      const childResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Web Development',
            slug: 'web-development',
            parent: parentId,
            blocks: []
          }
        })
        .expect(200);

      expect(childResponse.body.data.attributes.fullPath).toBe('/services/web-development');

      // Create grandchild page
      const grandchildResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'React Development',
            slug: 'react-development',
            parent: childResponse.body.data.id,
            blocks: []
          }
        })
        .expect(200);

      expect(grandchildResponse.body.data.attributes.fullPath).toBe('/services/web-development/react-development');
    });

    it('should update fullPath when parent changes', async () => {
      // Create two potential parents
      const parent1Response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Category A',
            slug: 'category-a',
            blocks: []
          }
        })
        .expect(200);

      const parent2Response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Category B',
            slug: 'category-b',
            blocks: []
          }
        })
        .expect(200);

      // Create child under parent1
      const childResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send({
          data: {
            title: 'Child Page',
            slug: 'child-page',
            parent: parent1Response.body.data.id,
            blocks: []
          }
        })
        .expect(200);

      expect(childResponse.body.data.attributes.fullPath).toBe('/category-a/child-page');

      // Move child to parent2
      const updateResponse = await request(strapi.server.httpServer)
        .put(`/api/pages/${childResponse.body.data.id}`)
        .send({
          data: {
            parent: parent2Response.body.data.id
          }
        })
        .expect(200);

      expect(updateResponse.body.data.attributes.fullPath).toBe('/category-b/child-page');
    });
  });
});
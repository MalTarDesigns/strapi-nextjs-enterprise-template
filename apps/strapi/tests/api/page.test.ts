import request from 'supertest';
import { getStrapiInstance, createTestData, cleanupTestData } from '../helpers/strapi';

describe('Page API', () => {
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

  describe('GET /api/pages', () => {
    it('should return list of pages', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/pages')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.meta).toHaveProperty('pagination');
    });

    it('should filter pages by fullPath', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/pages?filters[fullPath][$eq]=/test-page')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].attributes.fullPath).toBe('/test-page');
      expect(response.body.meta).toHaveProperty('breadcrumbs');
    });

    it('should populate dynamic zone blocks', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/pages?populate[blocks][populate]=*')
        .expect(200);

      const page = response.body.data[0];
      expect(page.attributes.blocks).toBeInstanceOf(Array);
      expect(page.attributes.blocks[0]).toHaveProperty('__component');
    });

    it('should include SEO data when populated', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/pages?populate[seo]=*')
        .expect(200);

      const page = response.body.data[0];
      expect(page.attributes).toHaveProperty('seo');
    });
  });

  describe('POST /api/pages', () => {
    it('should create a new page with valid data', async () => {
      const newPageData = {
        data: {
          title: 'New Test Page',
          slug: 'new-test-page',
          fullPath: '/new-test-page',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'New Hero',
              description: 'New description'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(newPageData)
        .expect(200);

      expect(response.body.data.attributes.title).toBe('New Test Page');
      expect(response.body.data.attributes.blocks).toHaveLength(1);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        data: {
          // Missing required title and slug
          fullPath: '/invalid-page'
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(invalidData)
        .expect(400);
    });

    it('should validate unique fullPath', async () => {
      const duplicateData = {
        data: {
          title: 'Duplicate Page',
          slug: 'duplicate-page',
          fullPath: '/test-page' // This fullPath already exists
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(duplicateData)
        .expect(400);
    });

    it('should validate dynamic zone components', async () => {
      const invalidBlockData = {
        data: {
          title: 'Page with Invalid Block',
          slug: 'invalid-block-page',
          fullPath: '/invalid-block-page',
          blocks: [
            {
              __component: 'invalid.component',
              title: 'Invalid Component'
            }
          ]
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(invalidBlockData)
        .expect(400);
    });
  });

  describe('PUT /api/pages/:id', () => {
    it('should update an existing page', async () => {
      const updateData = {
        data: {
          title: 'Updated Test Page',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'Updated Hero',
              description: 'Updated description'
            },
            {
              __component: 'utilities.ck-editor-content',
              content: '<p>Updated content</p>'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/pages/${testData.page.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.attributes.title).toBe('Updated Test Page');
      expect(response.body.data.attributes.blocks).toHaveLength(2);
    });
  });

  describe('DELETE /api/pages/:id', () => {
    it('should delete a page', async () => {
      await request(strapi.server.httpServer)
        .delete(`/api/pages/${testData.page.id}`)
        .expect(200);

      // Verify page is deleted
      await request(strapi.server.httpServer)
        .get(`/api/pages/${testData.page.id}`)
        .expect(404);
    });
  });

  describe('Page Hierarchical Structure', () => {
    it('should handle parent-child relationships', async () => {
      // Create parent page
      const parentData = {
        data: {
          title: 'Parent Page',
          slug: 'parent-page',
          fullPath: '/parent-page'
        }
      };

      const parentResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(parentData)
        .expect(200);

      const parentId = parentResponse.body.data.id;

      // Create child page
      const childData = {
        data: {
          title: 'Child Page',
          slug: 'child-page',
          fullPath: '/parent-page/child-page',
          parent: parentId
        }
      };

      const childResponse = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(childData)
        .expect(200);

      // Verify relationship
      const populatedResponse = await request(strapi.server.httpServer)
        .get(`/api/pages/${parentId}?populate[children]=*`)
        .expect(200);

      expect(populatedResponse.body.data.attributes.children.data).toHaveLength(1);
      expect(populatedResponse.body.data.attributes.children.data[0].id).toBe(childResponse.body.data.id);
    });
  });

  describe('Page Breadcrumbs', () => {
    it('should generate breadcrumbs for nested pages', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/pages?filters[fullPath][$eq]=/test-page')
        .expect(200);

      expect(response.body.meta).toHaveProperty('breadcrumbs');
      expect(response.body.meta.breadcrumbs).toBeInstanceOf(Array);
    });
  });

  describe('Dynamic Zone Block Validation', () => {
    it('should validate all supported block components', async () => {
      const validBlocks = [
        {
          __component: 'sections.hero',
          title: 'Hero Title',
          description: 'Hero Description'
        },
        {
          __component: 'sections.faq',
          title: 'FAQ Section'
        },
        {
          __component: 'forms.contact-form',
          title: 'Contact Form'
        },
        {
          __component: 'utilities.ck-editor-content',
          content: '<p>Rich text content</p>'
        }
      ];

      const pageData = {
        data: {
          title: 'Multi-Block Page',
          slug: 'multi-block-page',
          fullPath: '/multi-block-page',
          blocks: validBlocks
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(pageData)
        .expect(200);

      expect(response.body.data.attributes.blocks).toHaveLength(4);
      validBlocks.forEach((block, index) => {
        expect(response.body.data.attributes.blocks[index].__component).toBe(block.__component);
      });
    });
  });
});
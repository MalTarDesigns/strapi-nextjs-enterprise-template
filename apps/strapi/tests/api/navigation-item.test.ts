import request from 'supertest';
import { getStrapiInstance, createTestData, cleanupTestData } from '../helpers/strapi';

describe('Navigation Item API', () => {
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

  describe('GET /api/navigation-items', () => {
    it('should return list of navigation items', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/navigation-items')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].attributes).toHaveProperty('title');
      expect(response.body.data[0].attributes).toHaveProperty('url');
    });

    it('should filter navigation items by visibility', async () => {
      // Create a hidden navigation item
      await strapi.entityService.create('api::navigation-item.navigation-item', {
        data: {
          title: 'Hidden Nav Item',
          url: '/hidden',
          isVisible: false,
          publishedAt: new Date().toISOString()
        }
      });

      const response = await request(strapi.server.httpServer)
        .get('/api/navigation-items?filters[isVisible][$eq]=true')
        .expect(200);

      response.body.data.forEach((item: any) => {
        expect(item.attributes.isVisible).toBe(true);
      });
    });

    it('should populate nested navigation items', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/navigation-items?populate[children]=*')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/navigation-items', () => {
    it('should create a new navigation item', async () => {
      const navItemData = {
        data: {
          title: 'New Nav Item',
          url: '/new-page',
          order: 1,
          isVisible: true
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/navigation-items')
        .send(navItemData)
        .expect(200);

      expect(response.body.data.attributes.title).toBe('New Nav Item');
      expect(response.body.data.attributes.url).toBe('/new-page');
      expect(response.body.data.attributes.order).toBe(1);
    });

    it('should validate required fields', async () => {
      const invalidData = {
        data: {
          url: '/incomplete' // Missing title
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/navigation-items')
        .send(invalidData)
        .expect(400);
    });

    it('should validate URL format', async () => {
      const invalidUrlData = {
        data: {
          title: 'Invalid URL Item',
          url: 'invalid-url' // Should start with /
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/navigation-items')
        .send(invalidUrlData)
        .expect(400);
    });
  });

  describe('PUT /api/navigation-items/:id', () => {
    it('should update navigation item order', async () => {
      const updateData = {
        data: {
          order: 5
        }
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/navigation-items/${testData.navigationItem.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.attributes.order).toBe(5);
    });

    it('should update navigation item visibility', async () => {
      const updateData = {
        data: {
          isVisible: false
        }
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/navigation-items/${testData.navigationItem.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.attributes.isVisible).toBe(false);
    });
  });

  describe('DELETE /api/navigation-items/:id', () => {
    it('should delete a navigation item', async () => {
      await request(strapi.server.httpServer)
        .delete(`/api/navigation-items/${testData.navigationItem.id}`)
        .expect(200);

      // Verify item is deleted
      await request(strapi.server.httpServer)
        .get(`/api/navigation-items/${testData.navigationItem.id}`)
        .expect(404);
    });
  });

  describe('Navigation Item Hierarchical Structure', () => {
    it('should handle parent-child relationships', async () => {
      // Create parent navigation item
      const parentData = {
        data: {
          title: 'Parent Nav',
          url: '/parent',
          order: 1
        }
      };

      const parentResponse = await request(strapi.server.httpServer)
        .post('/api/navigation-items')
        .send(parentData)
        .expect(200);

      const parentId = parentResponse.body.data.id;

      // Create child navigation item
      const childData = {
        data: {
          title: 'Child Nav',
          url: '/parent/child',
          order: 1,
          parent: parentId
        }
      };

      const childResponse = await request(strapi.server.httpServer)
        .post('/api/navigation-items')
        .send(childData)
        .expect(200);

      // Verify relationship
      const populatedResponse = await request(strapi.server.httpServer)
        .get(`/api/navigation-items/${parentId}?populate[children]=*`)
        .expect(200);

      expect(populatedResponse.body.data.attributes.children.data).toHaveLength(1);
      expect(populatedResponse.body.data.attributes.children.data[0].id).toBe(childResponse.body.data.id);
    });

    it('should maintain correct ordering', async () => {
      // Create multiple navigation items with different orders
      const items = [
        { title: 'Third Item', url: '/third', order: 3 },
        { title: 'First Item', url: '/first', order: 1 },
        { title: 'Second Item', url: '/second', order: 2 }
      ];

      for (const item of items) {
        await request(strapi.server.httpServer)
          .post('/api/navigation-items')
          .send({ data: item })
          .expect(200);
      }

      const response = await request(strapi.server.httpServer)
        .get('/api/navigation-items?sort=order:asc')
        .expect(200);

      // Verify items are returned in correct order
      const titles = response.body.data.map((item: any) => item.attributes.title);
      expect(titles).toEqual(expect.arrayContaining(['First Item', 'Second Item', 'Third Item']));
    });
  });
});
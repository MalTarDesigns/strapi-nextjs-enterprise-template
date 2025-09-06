import request from 'supertest';
import { getStrapiInstance, createTestData, cleanupTestData } from '../helpers/strapi';

describe('Post API', () => {
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

  describe('GET /api/posts', () => {
    it('should return list of published posts', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/posts')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].attributes).toHaveProperty('title');
      expect(response.body.data[0].attributes).toHaveProperty('slug');
      expect(response.body.data[0].attributes).toHaveProperty('content');
    });

    it('should filter posts by slug', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/posts?filters[slug][$eq]=test-post')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].attributes.slug).toBe('test-post');
    });

    it('should include author information when populated', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/posts?populate[author][populate]=*')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      // Author data structure depends on your user model
    });

    it('should include featured image when populated', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/posts?populate[featuredImage]=*')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should support pagination', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/posts?pagination[page]=1&pagination[pageSize]=5')
        .expect(200);

      expect(response.body.meta).toHaveProperty('pagination');
      expect(response.body.meta.pagination).toHaveProperty('page', 1);
      expect(response.body.meta.pagination).toHaveProperty('pageSize', 5);
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should return a single post', async () => {
      const response = await request(strapi.server.httpServer)
        .get(`/api/posts/${testData.post.id}`)
        .expect(200);

      expect(response.body.data.id).toBe(testData.post.id.toString());
      expect(response.body.data.attributes.title).toBe('Test Post');
    });

    it('should return 404 for non-existent post', async () => {
      await request(strapi.server.httpServer)
        .get('/api/posts/999999')
        .expect(404);
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid data', async () => {
      const postData = {
        data: {
          title: 'New Test Post',
          slug: 'new-test-post',
          content: 'This is a new test post content',
          excerpt: 'A short excerpt',
          publishedAt: new Date().toISOString()
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(postData)
        .expect(200);

      expect(response.body.data.attributes.title).toBe('New Test Post');
      expect(response.body.data.attributes.slug).toBe('new-test-post');
      expect(response.body.data.attributes.content).toBe('This is a new test post content');
    });

    it('should validate required fields', async () => {
      const invalidData = {
        data: {
          content: 'Content without title or slug'
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(invalidData)
        .expect(400);
    });

    it('should validate unique slug', async () => {
      const duplicateData = {
        data: {
          title: 'Duplicate Post',
          slug: 'test-post', // This slug already exists
          content: 'Duplicate content'
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(duplicateData)
        .expect(400);
    });

    it('should auto-generate slug from title if not provided', async () => {
      const postData = {
        data: {
          title: 'Auto Generated Slug Post',
          content: 'Content for auto slug generation'
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(postData)
        .expect(200);

      expect(response.body.data.attributes.slug).toBe('auto-generated-slug-post');
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update an existing post', async () => {
      const updateData = {
        data: {
          title: 'Updated Test Post',
          content: 'Updated content'
        }
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${testData.post.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.data.attributes.title).toBe('Updated Test Post');
      expect(response.body.data.attributes.content).toBe('Updated content');
    });

    it('should not allow updating slug to existing value', async () => {
      // Create another post first
      const anotherPost = await strapi.entityService.create('api::post.post', {
        data: {
          title: 'Another Post',
          slug: 'another-post',
          content: 'Another content',
          publishedAt: new Date().toISOString()
        }
      });

      const updateData = {
        data: {
          slug: 'another-post' // Try to use existing slug
        }
      };

      await request(strapi.server.httpServer)
        .put(`/api/posts/${testData.post.id}`)
        .send(updateData)
        .expect(400);

      // Cleanup
      await strapi.entityService.delete('api::post.post', anotherPost.id);
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post', async () => {
      await request(strapi.server.httpServer)
        .delete(`/api/posts/${testData.post.id}`)
        .expect(200);

      // Verify post is deleted
      await request(strapi.server.httpServer)
        .get(`/api/posts/${testData.post.id}`)
        .expect(404);
    });
  });

  describe('Post SEO and Meta', () => {
    it('should handle SEO metadata', async () => {
      const seoData = {
        data: {
          title: 'SEO Optimized Post',
          slug: 'seo-post',
          content: 'SEO content',
          seo: {
            metaTitle: 'SEO Title',
            metaDescription: 'SEO Description',
            keywords: 'seo, test, post'
          }
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(seoData)
        .expect(200);

      expect(response.body.data.attributes).toHaveProperty('seo');
    });
  });

  describe('Post Categories and Tags', () => {
    it('should handle post categorization', async () => {
      const categorizedData = {
        data: {
          title: 'Categorized Post',
          slug: 'categorized-post',
          content: 'Categorized content',
          categories: [], // Depends on your category model
          tags: [] // Depends on your tag model
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(categorizedData)
        .expect(200);

      expect(response.body.data.attributes.title).toBe('Categorized Post');
    });
  });

  describe('Post Status and Publishing', () => {
    it('should handle draft status', async () => {
      const draftData = {
        data: {
          title: 'Draft Post',
          slug: 'draft-post',
          content: 'Draft content'
          // No publishedAt means it's a draft
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/posts')
        .send(draftData)
        .expect(200);

      expect(response.body.data.attributes.publishedAt).toBeNull();
    });

    it('should publish a draft post', async () => {
      // Create a draft first
      const draftPost = await strapi.entityService.create('api::post.post', {
        data: {
          title: 'Draft to Publish',
          slug: 'draft-to-publish',
          content: 'Draft content'
        }
      });

      const publishData = {
        data: {
          publishedAt: new Date().toISOString()
        }
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/posts/${draftPost.id}`)
        .send(publishData)
        .expect(200);

      expect(response.body.data.attributes.publishedAt).not.toBeNull();

      // Cleanup
      await strapi.entityService.delete('api::post.post', draftPost.id);
    });
  });
});
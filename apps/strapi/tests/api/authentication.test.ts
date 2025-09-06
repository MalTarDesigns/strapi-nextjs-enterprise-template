import request from 'supertest';
import { getStrapiInstance } from '../helpers/strapi';

describe('Authentication API', () => {
  let strapi: any;
  let testUser: any;
  let jwt: string;

  beforeAll(async () => {
    strapi = getStrapiInstance();
  });

  beforeEach(async () => {
    // Create a test user
    testUser = await strapi.plugins['users-permissions'].services.user.add({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123!',
      confirmed: true,
      blocked: false,
      role: 1 // Authenticated role
    });
  });

  afterEach(async () => {
    // Clean up test user
    if (testUser) {
      await strapi.plugins['users-permissions'].services.user.remove({ id: testUser.id });
    }
  });

  describe('POST /api/auth/local', () => {
    it('should authenticate user with valid credentials', async () => {
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'TestPassword123!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.username).toBe('testuser');

      jwt = response.body.jwt;
    });

    it('should reject authentication with invalid password', async () => {
      await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'WrongPassword123!'
        })
        .expect(400);
    });

    it('should reject authentication with non-existent user', async () => {
      await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'nonexistent@example.com',
          password: 'TestPassword123!'
        })
        .expect(400);
    });

    it('should reject authentication with blocked user', async () => {
      // Block the user
      await strapi.plugins['users-permissions'].services.user.edit(
        { id: testUser.id },
        { blocked: true }
      );

      await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'TestPassword123!'
        })
        .expect(400);
    });

    it('should reject authentication with unconfirmed user', async () => {
      // Set user as unconfirmed
      await strapi.plugins['users-permissions'].services.user.edit(
        { id: testUser.id },
        { confirmed: false }
      );

      await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'TestPassword123!'
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/local/register', () => {
    it('should register a new user', async () => {
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/local/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'NewPassword123!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe('newuser@example.com');
      expect(response.body.user.username).toBe('newuser');

      // Clean up
      await strapi.plugins['users-permissions'].services.user.remove({ id: response.body.user.id });
    });

    it('should reject registration with existing email', async () => {
      await request(strapi.server.httpServer)
        .post('/api/auth/local/register')
        .send({
          username: 'duplicate',
          email: 'test@example.com', // This email already exists
          password: 'Password123!'
        })
        .expect(400);
    });

    it('should reject registration with weak password', async () => {
      await request(strapi.server.httpServer)
        .post('/api/auth/local/register')
        .send({
          username: 'weakpassuser',
          email: 'weak@example.com',
          password: '123' // Too weak
        })
        .expect(400);
    });

    it('should validate email format', async () => {
      await request(strapi.server.httpServer)
        .post('/api/auth/local/register')
        .send({
          username: 'invalidemailuser',
          email: 'invalid-email', // Invalid format
          password: 'ValidPassword123!'
        })
        .expect(400);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should send password reset email for valid user', async () => {
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@example.com'
        })
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });

    it('should not reveal non-existent email addresses', async () => {
      // Should return success even for non-existent email (security best practice)
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com'
        })
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password with valid reset token', async () => {
      // First, get a reset token
      const resetTokenUser = await strapi.plugins['users-permissions'].services.user.edit(
        { id: testUser.id },
        { resetPasswordToken: 'valid-reset-token' }
      );

      const response = await request(strapi.server.httpServer)
        .post('/api/auth/reset-password')
        .send({
          code: 'valid-reset-token',
          password: 'NewPassword123!',
          passwordConfirmation: 'NewPassword123!'
        })
        .expect(200);

      expect(response.body).toHaveProperty('jwt');
      expect(response.body).toHaveProperty('user');
    });

    it('should reject password reset with invalid token', async () => {
      await request(strapi.server.httpServer)
        .post('/api/auth/reset-password')
        .send({
          code: 'invalid-token',
          password: 'NewPassword123!',
          passwordConfirmation: 'NewPassword123!'
        })
        .expect(400);
    });

    it('should validate password confirmation match', async () => {
      await strapi.plugins['users-permissions'].services.user.edit(
        { id: testUser.id },
        { resetPasswordToken: 'valid-reset-token-2' }
      );

      await request(strapi.server.httpServer)
        .post('/api/auth/reset-password')
        .send({
          code: 'valid-reset-token-2',
          password: 'NewPassword123!',
          passwordConfirmation: 'DifferentPassword123!'
        })
        .expect(400);
    });
  });

  describe('JWT Token Validation', () => {
    beforeEach(async () => {
      // Get a valid JWT token
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'TestPassword123!'
        });
      jwt = response.body.jwt;
    });

    it('should access protected endpoint with valid JWT', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${jwt}`)
        .expect(200);

      expect(response.body.id).toBe(testUser.id);
      expect(response.body.email).toBe('test@example.com');
    });

    it('should reject access with invalid JWT', async () => {
      await request(strapi.server.httpServer)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-jwt-token')
        .expect(401);
    });

    it('should reject access without JWT', async () => {
      await request(strapi.server.httpServer)
        .get('/api/users/me')
        .expect(401);
    });

    it('should reject expired JWT', async () => {
      // Create an expired token (this is a simplified test - in reality you'd need to mock time)
      const expiredJwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: testUser.id
      }, { expiresIn: -1 });

      await request(strapi.server.httpServer)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${expiredJwt}`)
        .expect(401);
    });
  });

  describe('Role-based Access Control', () => {
    let editorUser: any;
    let editorJwt: string;

    beforeEach(async () => {
      // Create an editor role if it doesn't exist
      let editorRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { name: 'Editor' }
      });

      if (!editorRole) {
        editorRole = await strapi.query('plugin::users-permissions.role').create({
          data: {
            name: 'Editor',
            description: 'Editor role for testing',
            type: 'editor'
          }
        });
      }

      // Create an editor user
      editorUser = await strapi.plugins['users-permissions'].services.user.add({
        username: 'editoruser',
        email: 'editor@example.com',
        password: 'EditorPassword123!',
        confirmed: true,
        blocked: false,
        role: editorRole.id
      });

      // Get JWT for editor
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'editor@example.com',
          password: 'EditorPassword123!'
        });
      editorJwt = response.body.jwt;
    });

    afterEach(async () => {
      if (editorUser) {
        await strapi.plugins['users-permissions'].services.user.remove({ id: editorUser.id });
      }
    });

    it('should allow editor to access editor-only endpoints', async () => {
      // This test depends on your specific permission configuration
      // You would test endpoints that require editor role
      await request(strapi.server.httpServer)
        .get('/api/pages')
        .set('Authorization', `Bearer ${editorJwt}`)
        .expect(200);
    });

    it('should restrict regular user from editor-only endpoints', async () => {
      // This depends on your permission configuration
      // Test that regular authenticated users can't access editor-only resources
    });
  });

  describe('User Profile Management', () => {
    beforeEach(async () => {
      const response = await request(strapi.server.httpServer)
        .post('/api/auth/local')
        .send({
          identifier: 'test@example.com',
          password: 'TestPassword123!'
        });
      jwt = response.body.jwt;
    });

    it('should allow user to update their profile', async () => {
      const updateData = {
        username: 'updateduser',
        email: 'updated@example.com'
      };

      const response = await request(strapi.server.httpServer)
        .put(`/api/users/${testUser.id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send(updateData)
        .expect(200);

      expect(response.body.username).toBe('updateduser');
      expect(response.body.email).toBe('updated@example.com');
    });

    it('should prevent user from updating others profiles', async () => {
      const otherUser = await strapi.plugins['users-permissions'].services.user.add({
        username: 'otheruser',
        email: 'other@example.com',
        password: 'OtherPassword123!',
        confirmed: true,
        blocked: false,
        role: 1
      });

      await request(strapi.server.httpServer)
        .put(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${jwt}`)
        .send({ username: 'hacker' })
        .expect(403);

      // Clean up
      await strapi.plugins['users-permissions'].services.user.remove({ id: otherUser.id });
    });
  });
});
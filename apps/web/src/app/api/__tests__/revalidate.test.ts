import { NextRequest } from 'next/server';
import { POST } from '../revalidate/route';

// Mock Next.js revalidateTag and revalidatePath
const mockRevalidateTag = jest.fn();
const mockRevalidatePath = jest.fn();

jest.mock('next/cache', () => ({
  revalidateTag: mockRevalidateTag,
  revalidatePath: mockRevalidatePath,
}));

// Mock environment variables
const originalEnv = process.env;

describe('/api/revalidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      REVALIDATE_SECRET: 'test-secret-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should revalidate path successfully with valid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        path: '/test-page',
        type: 'page'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ revalidated: true, path: '/test-page' });
    expect(mockRevalidatePath).toHaveBeenCalledWith('/test-page');
  });

  it('should revalidate tag successfully with valid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        tag: 'navigation',
        type: 'navigation'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ revalidated: true, tag: 'navigation' });
    expect(mockRevalidateTag).toHaveBeenCalledWith('navigation');
  });

  it('should return 401 for invalid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'invalid-secret',
        path: '/test-page',
        type: 'page'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Invalid secret' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it('should return 401 for missing secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path: '/test-page',
        type: 'page'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ message: 'Invalid secret' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('should return 400 for missing path and tag', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        type: 'page'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ message: 'Missing path or tag parameter' });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it('should handle site revalidation', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        tag: 'site',
        type: 'site'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ revalidated: true, tag: 'site' });
    expect(mockRevalidateTag).toHaveBeenCalledWith('site');
  });

  it('should handle navigation revalidation', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        tag: 'navigation',
        type: 'navigation'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ revalidated: true, tag: 'navigation' });
    expect(mockRevalidateTag).toHaveBeenCalledWith('navigation');
  });

  it('should handle multiple path revalidation', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        paths: ['/page1', '/page2', '/page3'],
        type: 'multiple'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ revalidated: true, paths: ['/page1', '/page2', '/page3'] });
    expect(mockRevalidatePath).toHaveBeenCalledTimes(3);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/page1');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/page2');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/page3');
  });

  it('should handle revalidation errors gracefully', async () => {
    mockRevalidatePath.mockImplementation(() => {
      throw new Error('Revalidation failed');
    });

    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'test-secret-key',
        path: '/error-page',
        type: 'page'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ 
      message: 'Error revalidating',
      error: 'Revalidation failed'
    });
  });

  it('should handle invalid JSON body', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid-json'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('message');
    expect(data.message).toContain('Invalid JSON');
  });

  it('should handle empty request body', async () => {
    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: ''
    });

    const response = await POST(request);
    
    expect(response.status).toBe(400);
  });

  it('should validate required environment variable', async () => {
    delete process.env.REVALIDATE_SECRET;

    const request = new NextRequest('http://localhost:3000/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: 'any-secret',
        path: '/test-page',
        type: 'page'
      })
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ 
      message: 'Server configuration error'
    });
  });

  describe('Content Type Handling', () => {
    it('should handle page content revalidation', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: 'test-secret-key',
          path: '/about',
          type: 'page',
          action: 'update'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalledWith('/about');
    });

    it('should handle blog post revalidation', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: 'test-secret-key',
          path: '/blog/my-post',
          type: 'post',
          action: 'publish'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalledWith('/blog/my-post');
    });

    it('should handle deletion revalidation', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: 'test-secret-key',
          path: '/deleted-page',
          type: 'page',
          action: 'delete'
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(mockRevalidatePath).toHaveBeenCalledWith('/deleted-page');
    });
  });

  describe('Batch Operations', () => {
    it('should handle batch revalidation with mixed paths and tags', async () => {
      const request = new NextRequest('http://localhost:3000/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: 'test-secret-key',
          batch: [
            { path: '/page1', type: 'page' },
            { tag: 'navigation', type: 'navigation' },
            { path: '/page2', type: 'page' },
            { tag: 'footer', type: 'footer' }
          ]
        })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.processed).toBe(4);
      
      expect(mockRevalidatePath).toHaveBeenCalledWith('/page1');
      expect(mockRevalidatePath).toHaveBeenCalledWith('/page2');
      expect(mockRevalidateTag).toHaveBeenCalledWith('navigation');
      expect(mockRevalidateTag).toHaveBeenCalledWith('footer');
    });
  });
});
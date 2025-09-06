import type { Core } from '@strapi/strapi';

const rateLimitMap = new Map();

interface RateLimitConfig {
  max: number;
  windowMs: number;
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  admin: { max: 200, windowMs: 15 * 60 * 1000 }, // 200 requests per 15 minutes for admin
  api: { max: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes for API
  upload: { max: 20, windowMs: 15 * 60 * 1000 }, // 20 requests per 15 minutes for uploads
};

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    const clientIp = ctx.request.ip || ctx.request.socket.remoteAddress;
    const userAgent = ctx.request.get('user-agent') || 'unknown';
    const key = `${clientIp}_${userAgent}`;
    
    // Determine rate limit based on path
    let limitConfig = rateLimitConfigs.api;
    if (ctx.request.path.startsWith('/admin')) {
      limitConfig = rateLimitConfigs.admin;
    } else if (ctx.request.path.startsWith('/upload')) {
      limitConfig = rateLimitConfigs.upload;
    }

    const now = Date.now();
    const windowStart = now - limitConfig.windowMs;

    // Get or create rate limit data for this key
    if (!rateLimitMap.has(key)) {
      rateLimitMap.set(key, []);
    }

    const requests = rateLimitMap.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter((timestamp: number) => timestamp > windowStart);
    
    // Check if limit exceeded
    if (validRequests.length >= limitConfig.max) {
      ctx.status = 429;
      ctx.body = {
        error: 'Too Many Requests',
        message: `Rate limit exceeded. Max ${limitConfig.max} requests per ${limitConfig.windowMs / 1000} seconds.`,
        retryAfter: Math.ceil(limitConfig.windowMs / 1000),
      };
      
      // Log rate limit violation
      strapi.log.warn(`Rate limit exceeded for IP: ${clientIp}, Path: ${ctx.request.path}`);
      return;
    }

    // Add current request
    validRequests.push(now);
    rateLimitMap.set(key, validRequests);

    // Set rate limit headers
    ctx.set({
      'X-RateLimit-Limit': limitConfig.max.toString(),
      'X-RateLimit-Remaining': Math.max(0, limitConfig.max - validRequests.length).toString(),
      'X-RateLimit-Reset': Math.ceil((now + limitConfig.windowMs) / 1000).toString(),
    });

    await next();
  };
};
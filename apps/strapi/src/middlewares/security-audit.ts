import type { Core } from '@strapi/strapi';

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    const startTime = Date.now();
    
    // Extract security-relevant information
    const securityInfo = {
      timestamp: new Date().toISOString(),
      ip: ctx.request.ip || ctx.request.socket.remoteAddress,
      userAgent: ctx.request.get('user-agent'),
      method: ctx.request.method,
      path: ctx.request.path,
      query: ctx.request.query,
      referer: ctx.request.get('referer'),
      origin: ctx.request.get('origin'),
      userId: ctx.state?.user?.id || null,
      userRole: ctx.state?.user?.role?.name || null,
    };

    // Log security events for sensitive operations
    const sensitiveOperations = [
      'POST',
      'PUT', 
      'PATCH',
      'DELETE'
    ];

    const sensitiveEndpoints = [
      '/admin',
      '/api/auth',
      '/upload',
      '/users-permissions',
    ];

    const isSensitiveOperation = sensitiveOperations.includes(ctx.request.method);
    const isSensitiveEndpoint = sensitiveEndpoints.some(endpoint => 
      ctx.request.path.startsWith(endpoint)
    );

    if (isSensitiveOperation || isSensitiveEndpoint) {
      strapi.log.info('Security Audit', {
        ...securityInfo,
        type: 'SENSITIVE_OPERATION',
      });
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\.\.\//,  // Directory traversal
      /<script/i, // XSS attempts
      /union.*select/i, // SQL injection
      /javascript:/i, // JavaScript injection
      /data:text\/html/i, // Data URI XSS
    ];

    const requestData = JSON.stringify({
      path: ctx.request.path,
      query: ctx.request.query,
      body: ctx.request.body,
      headers: ctx.request.headers,
    });

    const foundSuspiciousPattern = suspiciousPatterns.some(pattern => 
      pattern.test(requestData)
    );

    if (foundSuspiciousPattern) {
      strapi.log.warn('Security Alert: Suspicious request detected', {
        ...securityInfo,
        type: 'SUSPICIOUS_PATTERN',
        requestData: requestData.slice(0, 1000), // Limit log size
      });
    }

    try {
      await next();

      // Log successful operations on sensitive endpoints
      if (isSensitiveOperation && isSensitiveEndpoint) {
        const duration = Date.now() - startTime;
        strapi.log.info('Security Audit: Operation completed', {
          ...securityInfo,
          type: 'OPERATION_SUCCESS',
          statusCode: ctx.response.status,
          duration,
        });
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log failed operations
      strapi.log.error('Security Audit: Operation failed', {
        ...securityInfo,
        type: 'OPERATION_ERROR',
        error: error.message,
        statusCode: ctx.response.status || 500,
        duration,
      });

      throw error;
    }
  };
};
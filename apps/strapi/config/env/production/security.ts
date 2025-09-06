export default ({ env }) => ({
  // Content Security Policy for enhanced security
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "connect-src": ["'self'", "https:"],
      "img-src": [
        "'self'",
        "data:",
        "blob:",
        "market-assets.strapi.io",
        // Add your CDN domains here
        env("CDN_URL") ? new URL(env("CDN_URL")).hostname : "",
        // Add your S3 bucket domain
        env("AWS_BUCKET") ? `${env("AWS_BUCKET")}.s3.amazonaws.com` : "",
        env("AWS_BUCKET") ? `${env("AWS_BUCKET")}.s3.${env("AWS_REGION", "us-east-1")}.amazonaws.com` : "",
      ].filter(Boolean),
      "media-src": [
        "'self'",
        "data:",
        "blob:",
        // Add your CDN domains here
        env("CDN_URL") ? new URL(env("CDN_URL")).hostname : "",
        // Add your S3 bucket domain
        env("AWS_BUCKET") ? `${env("AWS_BUCKET")}.s3.amazonaws.com` : "",
        env("AWS_BUCKET") ? `${env("AWS_BUCKET")}.s3.${env("AWS_REGION", "us-east-1")}.amazonaws.com` : "",
      ].filter(Boolean),
      upgradeInsecureRequests: null,
    },
  },
  
  // CORS configuration for production
  cors: {
    enabled: true,
    headers: "*",
    origin: env("CORS_ORIGINS") 
      ? env("CORS_ORIGINS").split(",").map(origin => origin.trim())
      : [
          env("CLIENT_URL"),
          env("FRONTEND_URL"),
          // Add your production domains
          "https://your-domain.com",
          "https://www.your-domain.com",
        ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
    keepHeaderOnError: true,
  },

  // Enhanced security settings for production
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    timeout: 1800000, // 30 minutes session timeout
    renewWindow: 300000, // Refresh token 5 minutes before expiry
  },
  
  // API token security
  apiToken: {
    salt: env('API_TOKEN_SALT', 'default_salt_please_change_in_production'),
    expiry: '7d', // API tokens expire after 7 days
  },

  // Transfer token security  
  transferToken: {
    salt: env('TRANSFER_TOKEN_SALT', 'default_transfer_salt_please_change'),
    expiry: '24h', // Transfer tokens expire after 24 hours
  },

  // Password policy
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    maxAge: 90, // Force password change every 90 days
    preventReuse: 5, // Prevent reusing last 5 passwords
  },

  // Account lockout policy
  accountLockout: {
    enabled: true,
    maxAttempts: 5,
    lockoutDuration: 900000, // 15 minutes lockout
    resetTimer: 900000, // Reset attempt counter after 15 minutes
  },

  // Session security
  session: {
    rolling: true, // Extend session on activity
    maxAge: 1800000, // 30 minutes
    secureProxy: true,
    httpOnly: true,
    signed: true,
  },

  // HTTPS enforcement
  https: {
    enabled: true,
    forceRedirect: true,
    hsts: {
      enabled: true,
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
  },

  // Rate limiting for API protection
  rateLimit: {
    max: parseInt(env("RATE_LIMIT_MAX", "100"), 10),
    duration: parseInt(env("RATE_LIMIT_DURATION", "60000"), 10), // 1 minute
    delayAfter: 50,
    delayMs: 500,
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyResolver: (request) => {
      // Use IP address as the key
      return request.ip || request.connection.remoteAddress;
    },
    onLimitReached: (request, response, options) => {
      console.warn(`Rate limit exceeded for IP: ${request.ip}`);
    },
  },

  // Additional security headers
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // Prevent clickjacking
  frameguard: {
    action: "deny",
  },

  // XSS protection
  xss: {
    enabled: true,
  },

  // Prevent MIME type sniffing
  noSniff: true,

  // Disable X-Powered-By header
  poweredBy: false,

  // IP filtering (if needed)
  ip: {
    whitelist: env("IP_WHITELIST") ? env("IP_WHITELIST").split(",") : [],
    blacklist: env("IP_BLACKLIST") ? env("IP_BLACKLIST").split(",") : [],
  },

  // Audit logging
  auditLog: {
    enabled: true,
    retentionDays: 365, // Keep audit logs for 1 year
    logLevel: 'info',
    sensitiveFields: ['password', 'token', 'secret', 'key'],
  },
});
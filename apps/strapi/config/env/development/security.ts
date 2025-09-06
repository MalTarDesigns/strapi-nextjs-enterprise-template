export default ({ env }) => ({
  // Relaxed security settings for development
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    timeout: 3600000, // 1 hour session timeout for development
    renewWindow: 600000, // Refresh token 10 minutes before expiry
  },
  
  // API token security
  apiToken: {
    salt: env('API_TOKEN_SALT', 'development_salt'),
    expiry: '30d', // Longer expiry for development
  },

  // Transfer token security
  transferToken: {
    salt: env('TRANSFER_TOKEN_SALT', 'development_transfer_salt'),
    expiry: '7d', // Longer expiry for development
  },

  // Relaxed password policy for development
  passwordPolicy: {
    minLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    maxAge: null, // No password expiration in development
    preventReuse: 0, // Allow password reuse in development
  },

  // Relaxed account lockout for development
  accountLockout: {
    enabled: false, // Disabled for development convenience
    maxAttempts: 10,
    lockoutDuration: 300000, // 5 minutes lockout
    resetTimer: 300000, // Reset counter after 5 minutes
  },

  // Session security
  session: {
    rolling: true,
    maxAge: 3600000, // 1 hour
    secureProxy: false,
    httpOnly: true,
    signed: true,
  },

  // HTTPS not enforced in development
  https: {
    enabled: false,
    forceRedirect: false,
    hsts: {
      enabled: false,
      maxAge: 0,
      includeSubDomains: false,
      preload: false,
    },
  },

  // Audit logging
  auditLog: {
    enabled: true,
    retentionDays: 30, // Shorter retention for development
    logLevel: 'debug',
    sensitiveFields: ['password', 'token', 'secret', 'key'],
  },
});
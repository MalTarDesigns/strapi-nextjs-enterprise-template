# Security Configuration Guide

## Overview

This Strapi application has been configured with comprehensive security measures to protect against common web vulnerabilities and provide role-based access control.

## Implemented Security Features

### 1. Enhanced Editor Role Configuration

The Editor role has been restricted to only manage content, with the following permissions:

**Allowed Actions:**
- Create, read, update, delete, and publish **Pages**
- Create, read, update, delete, and publish **Posts**
- Upload and manage **Media files**
- Access internationalization (i18n) locales

**Restricted Actions:**
- No access to site configuration (Footer, Navbar)
- No access to user management
- No access to roles and permissions
- No access to API tokens or webhooks
- No access to plugin settings
- No access to content schema modifications
- No access to system settings

### 2. Security Middleware Stack

#### Rate Limiting
- **Admin endpoints**: 200 requests per 15 minutes
- **API endpoints**: 100 requests per 15 minutes  
- **Upload endpoints**: 20 requests per 15 minutes
- Rate limit headers included in responses
- IP and User-Agent based tracking

#### Security Headers
- **Content Security Policy (CSP)**: Prevents XSS attacks
- **HSTS**: Enforces HTTPS connections
- **Frame Options**: Prevents clickjacking (`X-Frame-Options: DENY`)
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Controls referrer information
- **Cross-Origin policies**: Configured for security

#### Schema Protection
- Middleware blocks Editor role from accessing:
  - Content Type Builder
  - Admin settings and configuration
  - Plugin management
  - System configuration endpoints

### 3. CORS Configuration

Properly configured CORS with:
- Allowed origins from environment variables
- Specific HTTP methods allowed
- Credentials support enabled
- 24-hour preflight cache

### 4. Audit Logging

Comprehensive logging system that tracks:
- Content creation, updates, and deletions
- User authentication events
- Sensitive operations attempts
- Suspicious request patterns
- Role-based access violations

### 5. Request Body Limits

- JSON limit: 256KB
- Form limit: 256KB
- Text limit: 256KB
- File upload: 200MB maximum

### 6. Session Security

- HTTP-only cookies
- Signed sessions
- 24-hour session expiration
- Secure flag in production
- SameSite policy configured

## Environment-Specific Configuration

### Production Security
- 30-minute session timeout
- Strict password policy (12+ characters, mixed case, numbers, symbols)
- Account lockout after 5 failed attempts
- HTTPS enforcement with HSTS
- 7-day API token expiry
- 1-year audit log retention

### Development Security
- 1-hour session timeout
- Relaxed password requirements
- No account lockout
- HTTP allowed
- 30-day API token expiry
- 30-day audit log retention

## File Structure

```
apps/strapi/
├── config/
│   ├── middlewares.ts                    # Security middleware configuration
│   ├── api.ts                           # API response filtering
│   ├── env/
│   │   ├── production/security.ts       # Production security config
│   │   └── development/security.ts      # Development security config
│   └── sync/
│       └── admin-role.strapi-editor.json # Editor role permissions
├── src/
│   ├── middlewares/
│   │   ├── rate-limiter.ts              # Custom rate limiting
│   │   ├── security-audit.ts            # Security event logging
│   │   └── schema-protection.ts         # Editor access restrictions
│   └── api/
│       ├── page/content-types/page/lifecycles.ts  # Page audit logging
│       └── post/content-types/post/lifecycles.ts  # Post audit logging
└── SECURITY.md                          # This documentation file
```

## Environment Variables Required

```bash
# Required for production
ADMIN_JWT_SECRET=your_admin_jwt_secret_here
API_TOKEN_SALT=your_api_token_salt_here
TRANSFER_TOKEN_SALT=your_transfer_token_salt_here
FRONTEND_URL=https://your-frontend-domain.com
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=your_jwt_secret_here
```

## Security Best Practices Implemented

1. **Principle of Least Privilege**: Editor role has minimal necessary permissions
2. **Defense in Depth**: Multiple layers of security controls
3. **Fail Secure**: Default deny for restricted operations
4. **Audit Trail**: Comprehensive logging of all sensitive operations
5. **Rate Limiting**: Protection against brute force and DoS attacks
6. **Input Validation**: CSP and request size limits
7. **Session Management**: Secure session handling with appropriate timeouts

## Monitoring and Alerting

The security audit middleware logs the following events:

- **INFO**: Normal content operations (create, read, update)
- **WARN**: Deletions, suspicious patterns, access violations
- **ERROR**: Failed operations and system errors

Monitor your logs for:
- Multiple failed authentication attempts
- Repeated rate limit violations
- Attempts to access restricted endpoints
- Unusual request patterns

## Security Testing

To test the security configuration:

1. **Role-based Access Control**: 
   - Create an Editor user
   - Verify they can only access Pages, Posts, and Media
   - Confirm they cannot access admin settings

2. **Rate Limiting**:
   - Send rapid requests to test endpoints
   - Verify 429 responses after limits exceeded

3. **Schema Protection**:
   - Attempt to access `/content-type-builder` as Editor
   - Should receive 403 Forbidden response

## Incident Response

In case of security incidents:

1. **Check audit logs** for suspicious activities
2. **Review rate limit violations** for potential attacks
3. **Monitor failed authentication attempts**
4. **Check for schema modification attempts** by non-admin users
5. **Review content deletion events** for unauthorized changes

## Regular Security Maintenance

1. **Review and rotate secrets** regularly (every 90 days)
2. **Update dependencies** to patch security vulnerabilities
3. **Review user permissions** and remove unused accounts
4. **Monitor audit logs** for unusual patterns
5. **Test backup and recovery** procedures
6. **Review and update security policies** as needed

## Compliance Considerations

This configuration helps meet security requirements for:
- **OWASP Top 10** protection
- **GDPR** audit trail requirements
- **SOC 2** access control standards
- **NIST** security framework guidelines

## Support

For security-related questions or to report vulnerabilities:
- Review audit logs in your application logs
- Check the middleware configuration files
- Consult Strapi security documentation
- Consider professional security assessment for production deployments
# Production Security Checklist

This document provides a comprehensive security checklist for deploying your Strapi + Next.js application to production.

## Pre-Deployment Security

### Environment Variables & Secrets

- [ ] **All production secrets are unique and strong**
  - Generated using cryptographically secure methods
  - Never use example/default values in production
  - Different secrets for staging and production environments

- [ ] **Database credentials are secure**
  - Strong database password (minimum 16 characters, mixed case, numbers, symbols)
  - Database connection uses SSL/TLS encryption
  - Database user has minimal required permissions

- [ ] **API secrets are properly configured**
  - `APP_KEYS` contains 4 unique, strong keys
  - `ADMIN_JWT_SECRET` is unique and never shared
  - `API_TOKEN_SALT` is cryptographically secure
  - `NEXTAUTH_SECRET` is strong and unique

- [ ] **File storage is secure**
  - AWS IAM user has minimal S3 permissions
  - S3 bucket has proper CORS configuration
  - No public write access to storage buckets

### Code & Configuration Security

- [ ] **Dependencies are up to date**
  ```bash
  pnpm audit
  pnpm update
  ```

- [ ] **Security headers are configured**
  - Content Security Policy (CSP) enabled
  - HSTS headers configured
  - X-Frame-Options set to DENY
  - X-Content-Type-Options set to nosniff

- [ ] **CORS is properly configured**
  - Only specific domains allowed in production
  - No wildcard (*) origins in production
  - Credentials properly handled

## Strapi CMS Security

### Authentication & Authorization

- [ ] **Admin account security**
  - Default admin changed from development
  - Strong admin password policy enforced
  - Two-factor authentication enabled (if available)
  - Admin session timeout configured (30 minutes)

- [ ] **User permissions are minimal**
  - API tokens have specific, limited permissions
  - Read-only tokens for frontend consumption
  - Custom tokens with minimal required access
  - Regular audit of user permissions

- [ ] **Rate limiting is enabled**
  - API endpoints have appropriate rate limits
  - Protection against brute force attacks
  - IP-based throttling configured

### Content & Data Security

- [ ] **Input validation and sanitization**
  - All user inputs are validated
  - HTML content is properly sanitized
  - File uploads are restricted and validated
  - Maximum upload sizes configured

- [ ] **Database security**
  - Database backups are encrypted
  - Backup retention policy implemented
  - Database access is logged and monitored
  - Connection pooling properly configured

### Plugin & Extension Security

- [ ] **Third-party plugins are verified**
  - Only essential plugins installed
  - All plugins are from trusted sources
  - Plugin permissions are reviewed
  - Regular plugin updates applied

## Next.js Frontend Security

### Authentication & Sessions

- [ ] **NextAuth.js is properly configured**
  - Strong session secret
  - Secure session cookies (httpOnly, secure, sameSite)
  - Appropriate session timeout
  - CSRF protection enabled

- [ ] **API route security**
  - Authentication middleware on protected routes
  - Input validation on all API endpoints
  - Rate limiting on sensitive endpoints
  - Proper error handling (no sensitive data leaked)

### Client-Side Security

- [ ] **Content Security Policy**
  - Strict CSP headers configured
  - Inline scripts avoided or properly nonce'd
  - External resources from trusted domains only
  - Regular CSP policy review

- [ ] **Sensitive data protection**
  - No API keys in client-side code
  - Sensitive operations server-side only
  - Proper data masking in UI
  - No sensitive data in browser storage

## Infrastructure Security

### Network Security

- [ ] **HTTPS everywhere**
  - SSL certificates properly configured
  - HTTP to HTTPS redirects enabled
  - HSTS headers configured
  - Certificate auto-renewal set up

- [ ] **DNS security**
  - DNS over HTTPS (DoH) configured
  - CAA records configured
  - Subdomain security considered
  - Domain monitoring enabled

### Hosting Platform Security

- [ ] **Vercel security settings**
  - Environment variables properly secured
  - Domain verification completed
  - Deployment protection enabled
  - Access logs monitored

- [ ] **Strapi Cloud security**
  - Project access properly controlled
  - Database encryption at rest enabled
  - Backup encryption enabled
  - Network security groups configured

## Monitoring & Incident Response

### Error Monitoring

- [ ] **Sentry is configured**
  - Error tracking enabled for both frontend and backend
  - Performance monitoring configured
  - Sensitive data filtering enabled
  - Alert thresholds configured

- [ ] **Application logging**
  - Security events logged
  - Failed authentication attempts tracked
  - Unusual API usage monitored
  - Log retention policy implemented

### Health Monitoring

- [ ] **Uptime monitoring**
  - Health check endpoints monitored
  - Response time tracking
  - Error rate monitoring
  - Automated alerting configured

- [ ] **Security monitoring**
  - Unusual traffic patterns detected
  - Failed login attempts monitored
  - File upload anomalies tracked
  - Database connection monitoring

## Backup & Recovery

### Data Protection

- [ ] **Automated backups configured**
  - Database backups daily
  - File storage backups enabled
  - Configuration backups included
  - Backup integrity verification

- [ ] **Recovery procedures tested**
  - Disaster recovery plan documented
  - Recovery procedures tested regularly
  - RTO and RPO defined and achievable
  - Backup restoration tested

### Business Continuity

- [ ] **Failover procedures**
  - Database failover configured
  - CDN failover available
  - DNS failover configured
  - Communication plan for outages

## Compliance & Governance

### Data Privacy

- [ ] **GDPR/Privacy compliance** (if applicable)
  - Privacy policy updated
  - Cookie consent implemented
  - Data retention policies configured
  - User data export/deletion features

- [ ] **Data handling procedures**
  - Personal data identified and protected
  - Data minimization principles applied
  - Data encryption in transit and at rest
  - Access logging for personal data

### Security Governance

- [ ] **Security policies documented**
  - Incident response procedures
  - Security contact information
  - Vulnerability disclosure policy
  - Security update procedures

- [ ] **Regular security reviews**
  - Monthly security checklist review
  - Quarterly penetration testing
  - Annual security audit
  - Dependency vulnerability scanning

## Post-Deployment Security

### Ongoing Maintenance

- [ ] **Regular updates scheduled**
  - Weekly dependency updates
  - Monthly security patches
  - Quarterly major version updates
  - Annual security architecture review

- [ ] **Security monitoring active**
  - 24/7 uptime monitoring
  - Real-time error tracking
  - Security alert subscriptions
  - Performance degradation alerts

### Incident Response

- [ ] **Response procedures defined**
  - Security incident escalation path
  - Communication templates prepared
  - Recovery procedures documented
  - Post-incident review process

## Security Tools & Commands

### Security Scanning

```bash
# Audit dependencies
pnpm audit
pnpm audit --fix

# Security linting
pnpm lint:security

# Check for known vulnerabilities
npx better-npm-audit audit
```

### Secret Generation

```bash
# Generate strong secrets
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate multiple app keys
node -e "console.log(Array.from({length:4}, () => require('crypto').randomBytes(32).toString('base64')).join(','))"
```

### Security Testing

```bash
# SSL/TLS testing
curl -I https://your-domain.com

# Security headers check
curl -I https://your-domain.com | grep -i security

# Health check testing
curl -f https://your-strapi.strapiapp.com/_health
curl -f https://your-domain.com/api/health
```

## Emergency Contacts

Document your security contacts:

- **Security Team Lead**: [contact information]
- **Infrastructure Team**: [contact information]  
- **Hosting Platform Support**: 
  - Vercel: https://vercel.com/support
  - Strapi Cloud: https://support.strapi.io
- **Security Incident Response**: [emergency contact]

## Regular Security Reviews

Schedule and track regular security activities:

- [ ] **Weekly**: Dependency updates and vulnerability scans
- [ ] **Monthly**: Security checklist review and testing
- [ ] **Quarterly**: Penetration testing and security audit
- [ ] **Annually**: Comprehensive security architecture review

---

## Notes

- This checklist should be customized based on your specific requirements
- Regularly update this checklist as new security threats emerge
- Ensure all team members are familiar with security procedures
- Consider hiring external security experts for comprehensive audits

**Remember**: Security is an ongoing process, not a one-time setup. Regular monitoring and updates are essential for maintaining a secure production environment.
# Production Deployment Guide

This guide provides step-by-step instructions for deploying your Strapi + Next.js application to production using Vercel and Strapi Cloud.

## Overview

The deployment process consists of:
1. **Backend (Strapi CMS)** - Deployed to Strapi Cloud or self-hosted
2. **Frontend (Next.js)** - Deployed to Vercel
3. **Database** - PostgreSQL (managed by Strapi Cloud or external provider)
4. **File Storage** - AWS S3 for media uploads
5. **Email Service** - Mailgun for transactional emails

## Pre-Deployment Checklist

### Required Accounts
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] Strapi Cloud account ([cloud.strapi.io](https://cloud.strapi.io))
- [ ] AWS account for S3 storage
- [ ] Mailgun account for email delivery
- [ ] Sentry account for error monitoring (optional)

### Required Tools
- [ ] Node.js 22.x
- [ ] pnpm package manager
- [ ] Git repository
- [ ] Vercel CLI (`npm install -g vercel`)

### Environment Setup
- [ ] Copy `.env.production.example` files and configure all variables
- [ ] Generate strong secrets for production
- [ ] Set up AWS S3 bucket and IAM user
- [ ] Configure Mailgun domain

## Quick Deployment

For a full automated deployment:

```bash
# Deploy both services sequentially
pnpm deploy

# Deploy both services in parallel (faster)
pnpm deploy:parallel

# Deploy preview/staging version
pnpm deploy:preview
```

## Step-by-Step Manual Deployment

### Step 1: Environment Configuration

#### 1.1 Strapi Environment Setup

Copy the production environment template:
```bash
cp apps/strapi/.env.production.example apps/strapi/.env.production
```

Configure the following critical variables:

```bash
# Generate new secrets using:
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Database (will be provided by Strapi Cloud)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Security secrets (generate new ones!)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
JWT_SECRET=your_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_ACCESS_SECRET=your_secret_access_key
AWS_REGION=us-east-1
AWS_BUCKET=your-production-bucket

# Email Configuration
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your-domain.com

# Frontend Integration
CLIENT_URL=https://your-domain.com
STRAPI_PREVIEW_SECRET=your_preview_secret
REVALIDATE_SECRET=your_revalidation_secret
```

#### 1.2 Next.js Environment Setup

Copy the production environment template:
```bash
cp apps/web/.env.production.example apps/web/.env.production
```

Configure the following variables:

```bash
# Production URLs
NEXTAUTH_URL=https://your-domain.com
APP_PUBLIC_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Security
NEXTAUTH_SECRET=your_strong_nextauth_secret

# Strapi Connection
STRAPI_URL=https://your-strapi-instance.strapiapp.com
STRAPI_REST_READONLY_API_KEY=your_readonly_api_key
STRAPI_REST_CUSTOM_API_KEY=your_custom_api_key

# Preview & Revalidation
STRAPI_PREVIEW_SECRET=your_preview_secret
REVALIDATE_SECRET=your_revalidation_secret

# Optional: Error Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

### Step 2: AWS S3 Setup

#### 2.1 Create S3 Bucket

1. Go to AWS S3 Console
2. Create a new bucket with public read access
3. Configure CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

#### 2.2 Create IAM User

Create an IAM user with the following policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name"
    }
  ]
}
```

### Step 3: Deploy Strapi to Strapi Cloud

#### 3.1 Create Strapi Cloud Project

1. Log in to [Strapi Cloud](https://cloud.strapi.io)
2. Create a new project
3. Connect your Git repository
4. Select the `apps/strapi` directory as the project root

#### 3.2 Configure Environment Variables

In your Strapi Cloud project settings, add all environment variables from your `.env.production` file.

#### 3.3 Deploy Strapi

Either use the Strapi Cloud dashboard or deploy via script:

```bash
pnpm deploy:strapi
```

#### 3.4 Post-Deployment Setup

1. Access your Strapi admin panel
2. Create API tokens:
   - Go to Settings > API Tokens
   - Create a "Read-only" token for frontend
   - Create a "Custom" token with specific permissions
3. Set up webhooks:
   - Go to Settings > Webhooks
   - Create webhook for frontend revalidation:
     - Name: "Frontend Revalidation"
     - URL: `https://your-domain.com/api/revalidate`
     - Events: Entry create, update, delete, publish, unpublish
     - Headers: `Authorization: Bearer your_revalidation_secret`

### Step 4: Deploy Next.js to Vercel

#### 4.1 Connect to Vercel

```bash
vercel login
cd apps/web
vercel
```

Follow the prompts to connect your project.

#### 4.2 Configure Environment Variables

In your Vercel project dashboard, add all environment variables from your `.env.production` file.

#### 4.3 Deploy to Production

```bash
pnpm deploy:vercel
```

Or use the Vercel dashboard to deploy from your Git branch.

### Step 5: Domain Configuration

#### 5.1 Configure Custom Domain in Vercel

1. Go to your Vercel project settings
2. Add your custom domain
3. Follow DNS configuration instructions

#### 5.2 Update Environment Variables

Update the following variables in both applications with your actual domain:
- `NEXTAUTH_URL`
- `APP_PUBLIC_URL`
- `CLIENT_URL`
- `NEXT_REVALIDATE_URL`

#### 5.3 SSL Certificate

Vercel automatically provisions SSL certificates. For custom configurations, use their SSL settings.

## Advanced Deployment Options

### Parallel Deployment

Deploy both services simultaneously for faster deployment:

```bash
pnpm deploy:parallel
```

### Preview/Staging Deployments

Deploy to staging environment:

```bash
pnpm deploy:preview
```

This creates preview deployments on both platforms for testing.

### Individual Service Deployment

Deploy services individually:

```bash
# Deploy only Strapi
pnpm deploy:strapi

# Deploy only Next.js
pnpm deploy:vercel
```

### Vercel Plan Compatibility

This template is designed to work with both Vercel Hobby and Pro plans:

#### Hobby Plan (Free Tier)
- **Limitation**: Cron jobs can only run once per day
- **Configuration**: Template defaults to Hobby-compatible cron schedules
- **Cron jobs**: 
  - Sitemap regeneration: `0 2 * * *` (daily at 2 AM)
  - Cache revalidation: `0 */6 * * *` (every 6 hours, but treated as daily by Hobby plan)

#### Pro Plan (Paid Tier)  
- **Advantage**: Can run frequent cron jobs
- **Configuration**: Set `ENABLE_FREQUENT_CRON=true` in environment variables
- **Frequent revalidation**: Enable `*/30 * * * *` (every 30 minutes) for better cache management

#### Environment Configuration

Add these variables to your Vercel project environment:

```bash
# Required for cron job authentication
CRON_SECRET=your-unique-cron-secret

# Plan compatibility (set false for Hobby plan)
ENABLE_FREQUENT_CRON=false

# Custom schedule (optional, defaults to 6-hour intervals)  
CUSTOM_REVALIDATE_CRON_SCHEDULE=0 */6 * * *
```

**Note**: The template automatically uses Hobby-compatible schedules by default. Upgrade to Pro plan and set `ENABLE_FREQUENT_CRON=true` for more frequent cache revalidation.

## Monitoring and Maintenance

### Health Checks

Both deployments include health check endpoints:
- Strapi: `https://your-strapi.strapiapp.com/_health`
- Next.js: `https://your-domain.com/api/health`

### Error Monitoring

Configure Sentry for both applications:

1. Create Sentry projects for both frontend and backend
2. Add Sentry DSN to environment variables
3. Configure error reporting and performance monitoring

### Database Backups

Strapi Cloud provides automatic backups. For additional safety:
1. Enable daily backups in Strapi Cloud settings
2. Set up monitoring for backup success/failure
3. Test backup restoration process

### Performance Monitoring

- Use Vercel Analytics for frontend performance
- Monitor Strapi Cloud metrics for backend performance
- Set up alerts for high error rates or slow response times

## Troubleshooting

### Common Issues

#### Build Failures

**Strapi Build Fails:**
```bash
# Check dependencies
pnpm install --frozen-lockfile

# Verify environment variables
node -e "console.log(process.env.DATABASE_URL ? 'DB configured' : 'Missing DATABASE_URL')"

# Test database connection
cd apps/strapi && pnpm build
```

**Next.js Build Fails:**
```bash
# Run type checking
cd apps/web && pnpm typecheck

# Check environment variables
node -e "console.log(process.env.STRAPI_URL ? 'Strapi configured' : 'Missing STRAPI_URL')"

# Test build locally
pnpm build
```

#### Runtime Issues

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check database server availability
- Ensure SSL settings match database requirements

**CORS Errors:**
- Update CORS_ORIGINS in Strapi environment
- Check security.ts configuration
- Verify domain configuration

**File Upload Issues:**
- Verify AWS credentials and permissions
- Check S3 bucket CORS configuration
- Ensure bucket policy allows public reads

### Getting Help

1. Check deployment logs in respective platforms
2. Review environment variable configuration
3. Test individual components locally
4. Consult platform-specific documentation:
   - [Vercel Documentation](https://vercel.com/docs)
   - [Strapi Cloud Documentation](https://docs.strapi.io/cloud)

## Security Considerations

### Production Security Checklist

- [ ] All secrets are generated uniquely (never use example values)
- [ ] Database uses SSL encryption
- [ ] API tokens have minimal required permissions
- [ ] CORS is configured for specific domains only
- [ ] Security headers are properly configured
- [ ] Rate limiting is enabled
- [ ] File uploads are scanned and validated
- [ ] Regular security updates are applied

### Monitoring and Alerts

Set up monitoring for:
- Unusual API usage patterns
- Failed authentication attempts
- File upload anomalies
- Database connection issues
- SSL certificate expiration

---

## Support

For deployment support:
1. Check the troubleshooting section above
2. Review platform-specific logs
3. Consult the official documentation
4. Create an issue in the project repository

**Note:** Always test your deployment process in a staging environment before deploying to production.
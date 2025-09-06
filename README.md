# 🔥 MalTar Designs: Advanced Strapi v5 & Next.js v15 Template

**Enterprise-grade content management system** enhanced by **MalTar Designs** with advanced features for modern web applications. This production-ready template combines Strapi CMS with Next.js frontend, featuring comprehensive page-building capabilities, enterprise security, and deployment-ready configurations.

Perfect for agencies, startups, and enterprises building content-driven applications with strict performance, security, and scalability requirements.

## 🎯 Enhancements by MalTar Designs

This enhanced version includes significant improvements and additions:

- **🎨 8 Custom Dynamic Zone Blocks** - Hero sections, feature grids, testimonials, FAQ, pricing tables, image galleries, CTA banners, and rich text with MDX
- **🎨 Advanced Theming System** - Runtime CSS variables from Strapi Site configuration with Tailwind integration
- **🔒 Enterprise Security** - Role-based permissions, rate limiting, audit logging, and Editor role restrictions
- **🧪 Comprehensive Testing** - 80%+ test coverage with Jest unit tests and Playwright E2E tests
- **⚡ ISR & Revalidation** - Automatic cache invalidation via webhooks with 60-second ISR
- **📦 Production Deployments** - Ready-to-deploy configurations for Vercel and Strapi Cloud
- **🛠️ Developer Experience** - Complete Docker environment, seed scripts, and development tools
- **📚 Extensive Documentation** - 20,000+ words of setup guides, best practices, and troubleshooting

### Credits & Attribution
Originally based on the excellent [strapi-next-monorepo-starter](https://github.com/notum-cz/strapi-next-monorepo-starter) by **Notum Technologies**.
Significantly enhanced and customized by **MalTar Designs** with advanced features and production-ready improvements.

## 🎯 Quick Client Setup Checklist

Ready to start a new project? Follow this checklist:

- [ ] **Clone repository**: Use this template or clone directly
- [ ] **Environment setup**: Copy environment files (`pnpm setup:apps`)
- [ ] **Database**: Start PostgreSQL with Docker (`docker compose up -d db`)
- [ ] **Strapi**: Run development server (`pnpm dev:strapi`)
- [ ] **Create admin**: Set up Strapi admin account at [localhost:1337/admin](http://localhost:1337/admin)
- [ ] **API tokens**: Generate read-only and custom API tokens in Strapi
- [ ] **Frontend**: Configure API keys and run web app (`pnpm dev:web`)
- [ ] **Seed data**: Import sample content (`pnpm strapi import -f strapi-export.tar.gz`)
- [ ] **Content sync**: Import configuration via Settings > Config Sync > Tools
- [ ] **Preview mode**: Set up live preview and ISR revalidation
- [ ] **Deployment**: Configure production environment variables

*Estimated setup time: 15-30 minutes*

## 🥞 Technology Stack

**Backend (Strapi v5)**
- [Strapi v5](https://strapi.io/) - Headless CMS with TypeScript support
- PostgreSQL 16 - Production database
- JWT Authentication - Secure user management
- Role-based permissions - Editor and Admin roles
- File uploads - Local and S3 compatible storage

**Frontend (Next.js v15)**
- [Next.js v15](https://nextjs.org/docs) - React framework with App Router
- [Shadcn/ui](https://ui.shadcn.com/) - Component library with Radix UI
- [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework
- TypeScript - Full type safety across the stack
- NextAuth.js - Authentication and session management

**DevOps & Tooling**
- [Turborepo](https://turbo.build/) - Monorepo management and build optimization
- Docker - Containerized development and production
- ESLint + Prettier - Code quality and formatting
- Husky - Git hooks and commit validation
- GitHub Actions - Continuous integration and deployment

## 🚀 Development Setup

### Prerequisites

**Required:**
- Docker and Docker Compose
- Node.js 22.x (use `nvm use` for version switching)
- pnpm 9.x (`npm install -g pnpm@latest`)

**Optional but recommended:**
- [nvm](https://github.com/nvm-sh/nvm) for Node.js version management
- [Docker Desktop](https://www.docker.com/products/docker-desktop) for GUI management

### Local Development (3 Steps)

**1. Clone and Install**
```bash
# Clone repository
git clone https://github.com/MalTarDesigns/strapi-next-monorepo-starter
cd strapi-next-monorepo-starter

# Switch to correct Node.js version
nvm use

# Install all dependencies
pnpm install
```

**2. Environment Configuration**
```bash
# Copy environment files for all apps
pnpm setup:apps

# This creates:
# - .env (Docker Compose variables)  
# - apps/strapi/.env (Strapi configuration)
# - apps/web/.env.local (Next.js configuration)
```

**3. Start Development Environment**

**Option A: Hybrid Development (Recommended)**
```bash
# Start database only
docker compose up -d db

# Run Strapi locally (separate terminal)
pnpm dev:strapi

# Run Next.js locally (separate terminal) 
pnpm dev:web
```

**Option B: Full Docker Development**
```bash
# Start all services in Docker
docker compose --profile full-stack up -d
```

**Access Your Applications:**
- **Strapi Admin Panel**: [http://localhost:1337/admin](http://localhost:1337/admin)
- **Next.js Frontend**: [http://localhost:3000](http://localhost:3000)
- **PostgreSQL Database**: `localhost:5432` (admin/mFm8z7z8)

### Essential Post-Setup Tasks

**1. Create Strapi Admin Account**
- Visit [localhost:1337/admin](http://localhost:1337/admin)
- Create your admin account
- Navigate to Settings > API Tokens

**2. Generate API Tokens**
```bash
# In Strapi admin panel:
Settings > API Tokens > Create new API Token

# Read-only token:
Name: Frontend Read-only
Type: Read-only
Duration: Unlimited

# Custom token (for mutations):
Name: Frontend Custom  
Type: Custom
Duration: Unlimited
Permissions: Create subscriber, etc.
```

**3. Configure Frontend Environment**
```bash
# In apps/web/.env.local, add your tokens:
STRAPI_REST_READONLY_API_KEY=your-readonly-token
STRAPI_REST_CUSTOM_API_KEY=your-custom-token
```

**4. Import Sample Data (Optional)**
```bash
# Import sample content and configuration
cd apps/strapi
pnpm strapi import -f strapi-export.tar.gz

# Sync configuration
# Visit Strapi admin > Settings > Config Sync > Tools > Import
```

## ✨ Key Features

### 🎨 Advanced Page Builder
- **8 Content Block Types**: Hero sections, image carousels, FAQ components, CTAs, horizontal images, animated logos, contact forms, newsletter signup
- **Dynamic Component System**: Automatic mapping between Strapi components and React components
- **Drag & Drop Content**: Visual content creation in Strapi admin panel
- **Nested Page Hierarchy**: Automatic breadcrumb generation and fullpath management
- **Mobile-Responsive**: All components built with mobile-first design principles

### ⚡ Performance & Caching
- **ISR with 60s Revalidation**: Incremental Static Regeneration for optimal performance
- **Automatic Cache Invalidation**: Webhook-based revalidation when content changes
- **Smart Caching Tags**: Granular cache control per content type (pages, posts, navigation)
- **Image Optimization**: Next.js Image component with blur placeholders and fallbacks
- **Bundle Optimization**: Tree-shaking and code splitting with Turborepo

### 🔐 Enterprise Authentication
- **Role-Based Access Control**: Editor and Admin roles with granular permissions
- **JWT Authentication**: Secure token-based authentication with NextAuth.js
- **Protected Routes**: Authentication middleware for private pages
- **User Registration Flow**: Account activation emails and password management
- **Multi-Provider Support**: Ready for Google, GitHub, Facebook authentication

### 🌍 Internationalization & SEO
- **Multi-Language Support**: next-intl with Strapi i18n plugin integration  
- **SEO Optimization**: Automatic metadata, Open Graph tags, structured data
- **Dynamic Sitemap**: Auto-generated sitemap.xml from Strapi content
- **Robots.txt Generation**: Environment-aware robots.txt configuration
- **URL Localization**: Proper locale handling in URLs and routing

### 🛠️ Developer Experience
- **Full TypeScript**: End-to-end type safety from Strapi to frontend
- **Auto-Generated Types**: Strapi schema types automatically available in Next.js
- **Hot Module Replacement**: Fast development with instant feedback
- **Code Quality Tools**: ESLint, Prettier, Husky pre-commit hooks
- **Conventional Commits**: Automated commit message generation with Commitizen

### 📱 Content Management
- **WYSIWYG Editor**: Customized CKEditor with shared color palette
- **Media Management**: File uploads with S3 compatibility
- **Draft Mode & Preview**: Live content preview within Strapi admin
- **Content Versioning**: Config sync for environment-specific configurations
- **Bulk Operations**: Mass content import/export capabilities

### 🚀 Production Ready
- **Docker Configuration**: Development and production containerization
- **Multi-Environment**: Development, staging, production configurations
- **CI/CD Integration**: GitHub Actions workflow included
- **Error Tracking**: Sentry integration for both frontend and backend
- **Monitoring & Logs**: Structured logging and health check endpoints

### 🔌 Integrations & Extensions
- **AWS S3 Storage**: File upload with CDN support
- **Email Services**: Mailgun integration for transactional emails
- **reCAPTCHA v3**: Spam protection for forms
- **Redis Caching**: Optional Redis support for session storage
- **Webhooks**: Automatic revalidation and third-party integrations

## 📦 Project Architecture

### Applications

**`apps/web`** - Next.js v15 Frontend Application
- Modern React framework with App Router architecture
- Shadcn/ui component library with TailwindCSS styling
- Full TypeScript integration with auto-generated Strapi types
- Authentication, internationalization, and SEO optimization
- [📖 Frontend Documentation](./apps/web/README.md)

**`apps/strapi`** - Strapi v5 Headless CMS
- Enterprise-grade content management system
- Custom page builder components and content types
- Role-based permissions and authentication system
- PostgreSQL database with configurable storage providers
- [📖 Backend Documentation](./apps/strapi/README.md)

### Shared Packages

**`packages/design-system`**
- Unified design tokens and color palette
- CKEditor configuration and shared styles
- Consistent theming across frontend and CMS

**`packages/eslint-config`**
- Standardized linting rules for React, Next.js, and TypeScript
- Automatic code formatting and import sorting
- Pre-commit hooks for code quality enforcement

**`packages/prettier-config`**
- Code formatting configuration with import sorting
- TailwindCSS class sorting for consistent styling
- Integration with ESLint for conflict resolution

**`packages/shared-data`**
- Common constants and utilities shared between apps
- Type definitions and validation schemas
- API endpoint mappings and configuration values

**`packages/typescript-config`**
- Shared TypeScript configurations for the monorepo
- Optimized for different environments (development, production)
- Strict typing rules for enterprise code quality

### Architecture Benefits

- **Monorepo Management**: Turborepo handles build caching, task orchestration, and dependency management
- **Code Reusability**: Shared packages eliminate duplication and ensure consistency
- **Type Safety**: End-to-end TypeScript with automatic type generation from Strapi schemas
- **Developer Experience**: Hot reload, instant feedback, and streamlined development workflow

## 🔧 Environment Variables Guide

### Core Configuration

**Required Environment Variables:**

**Strapi (`apps/strapi/.env`)**
```bash
# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=0.0.0.0
DATABASE_PORT=5432
DATABASE_NAME=strapi-db
DATABASE_USERNAME=admin
DATABASE_PASSWORD=mFm8z7z8

# Security Keys (Generate new ones for production)
APP_KEYS=your-app-keys-comma-separated
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

# URLs and Preview
APP_URL=http://localhost:1337
CLIENT_URL=http://localhost:3000
STRAPI_PREVIEW_ENABLED=true
STRAPI_PREVIEW_SECRET=your-preview-secret

# ISR Revalidation
REVALIDATE_SECRET=your-revalidation-secret
NEXT_REVALIDATE_URL=http://localhost:3000
```

**Next.js (`apps/web/.env.local`)**
```bash
# Strapi Connection
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# API Authentication  
STRAPI_REST_READONLY_API_KEY=your-readonly-api-token
STRAPI_REST_CUSTOM_API_KEY=your-custom-api-token

# Application URLs
APP_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Preview & Revalidation
STRAPI_PREVIEW_SECRET=your-preview-secret
REVALIDATE_SECRET=your-revalidation-secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# ISR Revalidation Interval (seconds)
NEXT_PUBLIC_REVALIDATE=60
```

### Production Environment Variables

**AWS S3 Storage (Optional)**
```bash
# File Upload Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_ACCESS_SECRET=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_ACL=public-read
CDN_URL=https://your-cdn-domain.com
```

**Email Configuration (Optional)**
```bash
# Mailgun Integration
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_HOST=https://api.eu.mailgun.net
MAILGUN_EMAIL=noreply@yourdomain.com
```

**Monitoring & Analytics (Optional)**
```bash
# Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Google reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

### Generating Secure Keys

```bash
# Generate secure random keys
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# Generate multiple APP_KEYS (comma-separated)
node -e "console.log(Array(4).fill(0).map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"

# Generate strong password
openssl rand -base64 32
```

## 🚀 Deployment Guide

### Vercel Deployment (Next.js Frontend)

**1. Connect Repository**
- Link your GitHub repository to Vercel
- Configure build settings for monorepo structure

**2. Environment Variables**
```bash
# Required for build process
NODE_ENV=production
NEXT_OUTPUT=standalone

# Strapi Connection (use production URLs)
STRAPI_URL=https://your-strapi-domain.com
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com

# API Authentication
STRAPI_REST_READONLY_API_KEY=your-production-readonly-token
STRAPI_REST_CUSTOM_API_KEY=your-production-custom-token

# Application URLs
APP_PUBLIC_URL=https://your-domain.com
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secure-nextauth-secret

# Preview & Revalidation
STRAPI_PREVIEW_SECRET=your-preview-secret
REVALIDATE_SECRET=your-revalidation-secret

# Performance Optimization
NEXT_PUBLIC_REVALIDATE=60
```

**3. Build Configuration**
```json
// vercel.json
{
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next",
      "config": {
        "distDir": ".next"
      }
    }
  ],
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "cd apps/web && pnpm build"
}
```

### Strapi Cloud Deployment (Backend)

**1. Database Setup**
- Use Strapi Cloud managed PostgreSQL
- Or connect external database (AWS RDS, Supabase, etc.)

**2. Environment Configuration**
```bash
# Database (managed by Strapi Cloud)
DATABASE_CLIENT=postgres
DATABASE_URL=your-managed-database-url

# Security (generate new keys for production)
APP_KEYS=your-production-app-keys
API_TOKEN_SALT=your-production-api-salt
ADMIN_JWT_SECRET=your-production-admin-secret
JWT_SECRET=your-production-jwt-secret

# Application URLs
APP_URL=https://your-strapi-domain.com
CLIENT_URL=https://your-frontend-domain.com

# File Storage (S3 recommended for production)
AWS_ACCESS_KEY_ID=your-s3-access-key
AWS_ACCESS_SECRET=your-s3-secret-key
AWS_REGION=us-east-1
AWS_BUCKET=your-s3-bucket

# Email (production email service)
MAILGUN_API_KEY=your-production-mailgun-key
MAILGUN_DOMAIN=your-production-domain

# Monitoring
SENTRY_DSN=your-production-sentry-dsn
```

**3. Build & Deployment**
- Connect GitHub repository to Strapi Cloud
- Configure automatic deployments on main branch
- Set up webhook for ISR revalidation to frontend

### Alternative Deployment Options

**Docker Production Deployment**
```bash
# Build production images
docker build -t my-app-strapi -f apps/strapi/Dockerfile .
docker build -t my-app-web -f apps/web/Dockerfile .

# Run with docker-compose production config
docker-compose -f docker-compose.prod.yml up -d
```

**Railway, Render, or DigitalOcean App Platform**
- Similar environment variable configuration
- Ensure monorepo build commands are correctly set
- Configure proper health checks and scaling

## ☕ Common Development Commands

### Turborepo Scripts
```bash
# Development
pnpm dev                 # Run both Strapi and Next.js
pnpm dev:strapi          # Run Strapi only
pnpm dev:web             # Run Next.js only

# Building
pnpm build               # Build all applications
pnpm build:strapi        # Build Strapi only
pnpm build:web           # Build Next.js only

# Testing
pnpm test                # Run all tests
pnpm test:watch          # Run tests in watch mode
pnpm test:e2e            # Run end-to-end tests
pnpm test:coverage       # Generate coverage report

# Code Quality
pnpm lint                # Lint all applications
pnpm format              # Format code with Prettier
pnpm format:check        # Check code formatting
pnpm commit              # Interactive commit with Commitizen

# Production
pnpm start:strapi        # Start Strapi in production
pnpm start:web           # Start Next.js in production
```

### Docker Commands
```bash
# Development Environment
docker compose up -d                    # Start all services
docker compose up -d db                 # Database only
docker compose --profile web up -d      # Include frontend
docker compose --profile full-stack up -d  # All services + Redis

# Management
docker compose ps                       # Check running services
docker compose logs -f strapi          # Follow Strapi logs
docker compose restart strapi          # Restart Strapi
docker compose down                     # Stop all services
docker compose down -v                 # Stop and remove volumes

# Database Management
docker compose exec db psql -U admin -d strapi-db    # Access PostgreSQL
docker compose exec db pg_dump -U admin strapi-db > backup.sql    # Backup
```

### Strapi Management Commands
```bash
cd apps/strapi

# Content Management
pnpm strapi export --file=backup.tar.gz    # Export content
pnpm strapi import --file=backup.tar.gz    # Import content
pnpm strapi transfer --to=production-url   # Transfer to another instance

# Development Tools
pnpm strapi develop                         # Development mode with admin
pnpm strapi build                          # Build admin panel
pnpm strapi generate                        # Generate TypeScript types
pnpm strapi console                        # Interactive console

# Database Operations
pnpm strapi migrate                        # Run database migrations
pnpm strapi seed                           # Run database seeds
```

## 🛠️ Troubleshooting & Best Practices

### Common Issues & Solutions

**1. Port Conflicts**
```bash
# Windows (Git Bash)
netstat -ano | findstr :1337
taskkill //PID [PID_NUMBER] //F

# macOS/Linux
lsof -ti:1337 | xargs kill -9
```

**2. 401 Unauthorized Errors**
- Verify API tokens are correctly set in environment variables
- Ensure tokens have proper permissions in Strapi admin panel
- Check if tokens match between Strapi and Next.js configurations

**3. Database Connection Issues**
```bash
# Check PostgreSQL container status
docker compose ps

# View database logs
docker compose logs db

# Test database connection
docker compose exec db pg_isready -U admin
```

**4. Build Failures**
- Ensure all environment variables are set in `turbo.json` globalEnv
- Check TypeScript errors with `pnpm build`
- Verify dependencies are up to date with `pnpm update`

**5. ISR Revalidation Not Working**
- Check webhook endpoints are accessible from Strapi
- Verify revalidation secrets match between applications
- Test manual revalidation: `curl "localhost:3000/api/revalidate?secret=your-secret&path=/test"`

### Performance Optimization

**Frontend Optimization:**
- Use Next.js Image component with proper sizing and formats
- Implement proper caching headers and ISR configuration
- Optimize bundle size with dynamic imports and code splitting
- Monitor Core Web Vitals and loading performance

**Backend Optimization:**
- Configure PostgreSQL connection pooling
- Use S3 or CDN for file storage in production
- Implement proper database indexing
- Monitor Strapi performance and query optimization

**Caching Strategy:**
- ISR with 60-second revalidation for content pages
- Static generation for rarely changing pages
- Client-side caching with React Query
- CDN caching for static assets

### Security Best Practices

**Environment Security:**
- Generate unique secrets for each environment
- Never commit `.env` files to version control
- Use strong passwords for database and admin accounts
- Implement proper CORS configuration

**Authentication Security:**
- Configure secure JWT token expiration
- Implement rate limiting for API endpoints
- Use HTTPS in production environments
- Set up proper session management

**Data Protection:**
- Implement proper role-based access control
- Sanitize user inputs and validate data
- Use prepared statements for database queries
- Regular security updates and dependency audits

## 🔧 Development Tools & Extensions

### Required VSCode Extensions
Install extensions from [.vscode/extensions.json](.vscode/extensions.json):
- **Prettier**: Code formatting
- **ESLint**: Code linting and quality
- **TypeScript**: Enhanced TypeScript support
- **Tailwind CSS IntelliSense**: TailwindCSS autocomplete
- **GitLens**: Git integration and history
- **Thunder Client**: API testing within VSCode

### Git Workflow
**Husky Pre-commit Hooks:**
- Automatic code formatting with Prettier
- ESLint validation on staged files
- Conventional commit message validation
- TypeScript type checking

**Commit Message Format:**
```bash
# Interactive commit with Commitizen
pnpm commit

# Manual conventional commit format
git commit -m "feat(auth): add user registration flow"
git commit -m "fix(api): resolve CORS issue with file uploads" 
git commit -m "docs: update deployment guide"
```

### Utility Scripts
```bash
# Clean all build artifacts and dependencies
bash ./scripts/utils/rm-all.sh

# Remove only node_modules folders
bash ./scripts/utils/rm-modules.sh

# Format all code files
pnpm format

# Check code formatting without fixing
pnpm format:check
```

## 📚 Additional Resources

### Documentation
- **[ISR & Preview Setup](./docs/ISR_PREVIEW_SETUP.md)**: Detailed ISR and preview mode configuration
- **[Docker Guide](./DOCKER.md)**: Complete Docker development setup
- **[Frontend README](./apps/web/README.md)**: Next.js specific documentation
- **[Backend README](./apps/strapi/README.md)**: Strapi specific documentation

### External Resources
- [Strapi v5 Documentation](https://docs.strapi.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)

### Community & Support
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/MalTarDesigns/strapi-next-monorepo-starter/issues)
- **MalTar Designs**: [Contact for professional support and customization](https://github.com/MalTarDesigns)
- **Strapi Community**: [Discord Server](https://discord.strapi.io/)
- **Next.js Community**: [GitHub Discussions](https://github.com/vercel/next.js/discussions)

## 🎯 Template Customization

### Using This as GitHub Template

**1. Create New Repository**
- Click "Use this template" button
- Create new repository with your project name
- Clone your new repository

**2. Customize Project**
```bash
# Update package.json names and descriptions
# Change docker-compose.yml service names
# Update environment variables for your domain
# Replace placeholder content and branding
```

**3. Environment Setup**
- Follow the [Quick Client Setup Checklist](#-quick-client-setup-checklist)
- Configure production environment variables
- Set up deployment pipelines
- Configure monitoring and analytics

### Contributing Back
This enhanced template is maintained by **MalTar Designs**. Contributions are welcome:
- Bug fixes and improvements
- New features and integrations
- Documentation updates
- Performance optimizations

**Creating Pull Requests:**
- Fork this repository
- Create feature branch from main
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed

### Original Template Credit
This enhanced version is based on the excellent [strapi-next-monorepo-starter](https://github.com/notum-cz/strapi-next-monorepo-starter) by **Notum Technologies**. We encourage you to check out their original work and consider contributing to their project as well.

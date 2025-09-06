# Development Workflow Guide

## Quick Start

### Prerequisites
- **Node.js**: 22.x.x (required)
- **PNPM**: >= 9.0.0 (package manager)
- **PostgreSQL**: 12+ (production database)
- **Docker**: Optional for containerized development

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd strapi-next-starter

# Install dependencies
pnpm install

# Set up environment files
pnpm run setup:apps

# Start development environment
pnpm dev
```

---

## Environment Configuration

### Strapi Backend (`apps/strapi/.env`)
```bash
# Copy example environment file
cd apps/strapi
cp .env.example .env
```

**Key Configuration Options:**
```env
# Server Configuration
HOST=0.0.0.0
PORT=1337
APP_URL=http://localhost:1337

# Security Keys (generate new ones for production)
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret

# Database Configuration
DATABASE_CLIENT=postgres  # or sqlite for development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi-db
DATABASE_USERNAME=admin
DATABASE_PASSWORD=your-password

# Frontend Integration
CLIENT_URL=http://localhost:3000
STRAPI_PREVIEW_ENABLED=true
STRAPI_PREVIEW_SECRET=your-secret-key
```

### Next.js Frontend (`apps/web/.env.local`)
```bash
# Copy example environment file
cd apps/web
cp .env.local.example .env.local
```

**Key Configuration Options:**
```env
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Strapi Integration
STRAPI_URL=http://127.0.0.1:1337
STRAPI_REST_READONLY_API_KEY=your-readonly-api-key
STRAPI_REST_CUSTOM_API_KEY=your-custom-api-key

# Preview and Revalidation
STRAPI_PREVIEW_SECRET=your-secret-key
REVALIDATE_SECRET=your-revalidation-secret

# Application URLs
APP_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Development Commands

### Main Commands
```bash
# Start both Strapi and Next.js in development
pnpm dev

# Start individual services
pnpm dev:strapi        # Start Strapi only
pnpm dev:web          # Start Next.js only

# Production builds
pnpm build            # Build all packages
pnpm build:strapi     # Build Strapi only
pnpm build:web        # Build Next.js only
```

### Database Management
```bash
# Start PostgreSQL with Docker
pnpm docker:db

# Start full Docker environment
pnpm docker:up

# Reset Docker environment
pnpm docker:reset

# View Docker logs
pnpm docker:logs
```

### Code Quality
```bash
# Linting
pnpm lint             # Lint all packages
pnpm lint:fix         # Fix linting issues

# Code formatting
pnpm format           # Format all files
pnpm format:check     # Check formatting

# Testing
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run end-to-end tests
```

---

## Database Setup

### PostgreSQL (Recommended for Production)
1. **Using Docker (Easiest)**:
   ```bash
   pnpm docker:db
   ```

2. **Local Installation**:
   ```bash
   # macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # Create database and user
   createdb strapi-db
   createuser admin --password
   ```

### SQLite (Development Only)
```bash
# Update apps/strapi/.env
DATABASE_CLIENT=sqlite
# Comment out other DATABASE_* variables
```

---

## First Time Setup

### 1. Start Development Servers
```bash
# Terminal 1: Start database (if using Docker)
pnpm docker:db

# Terminal 2: Start development servers
pnpm dev
```

### 2. Strapi Admin Setup
1. Navigate to http://localhost:1337/admin
2. Create your first admin user
3. Complete the onboarding process

### 3. API Token Configuration
1. Go to **Settings** → **API Tokens**
2. Create a **Read-only** token for public content
3. Create a **Custom** token with specific permissions
4. Update your `apps/web/.env.local` with these tokens

### 4. Content Type Setup
1. Create your first **Page** content type
2. Add some **Block Components** to test
3. Publish content to see it on the frontend

---

## Development Workflow

### Daily Development Process
1. **Start Services**:
   ```bash
   pnpm dev
   ```

2. **Develop Content in Strapi**:
   - Access admin: http://localhost:1337/admin
   - Create/edit content
   - Configure content types

3. **Develop Frontend**:
   - Access website: http://localhost:3000
   - Edit components in `apps/web/src/components/`
   - Customize styling in `packages/design-system/`

4. **Testing**:
   ```bash
   # Run tests while developing
   pnpm test:watch
   
   # Check code quality
   pnpm lint
   pnpm format
   ```

### Component Development
1. **Create New Component**:
   ```bash
   # Create component file
   touch apps/web/src/components/page-builder/components/sections/MyNewComponent.tsx
   ```

2. **Register Component**:
   ```tsx
   // apps/web/src/components/page-builder/index.tsx
   export const PageContentComponents = {
     // ... existing components
     "sections.my-new-component": MyNewComponent,
   }
   ```

3. **Create Strapi Component**:
   - Go to Strapi admin
   - **Content-Types Builder** → **Components**
   - Create matching component structure

### Content Management Workflow
1. **Content Types** (Collection Types):
   - Pages, Posts, Products, etc.
   - Define fields and relationships

2. **Components** (Reusable Blocks):
   - Hero sections, carousels, forms
   - Nested in content types

3. **Single Types** (Global Content):
   - Navigation, footer, site settings
   - One instance per type

---

## Deployment Preparation

### Environment Variables Checklist
- [ ] Generate new security keys for production
- [ ] Configure production database URL
- [ ] Set up proper CORS settings
- [ ] Configure CDN URLs for media
- [ ] Set up monitoring and logging

### Build Verification
```bash
# Test production builds locally
pnpm build

# Start production servers
pnpm start:strapi
pnpm start:web
```

### Database Migration
```bash
# Export development data
cd apps/strapi
pnpm strapi export

# Import to production
pnpm strapi import
```

---

## Troubleshooting

### Common Issues

#### Port Conflicts
```bash
# Check what's running on ports
netstat -ano | findstr ":3000"
netstat -ano | findstr ":1337"

# Kill processes if needed (Windows)
taskkill //PID [PID_NUMBER] //F
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker ps                    # If using Docker
pg_isready -h localhost      # If local installation

# Reset database connection
pnpm docker:reset
```

#### Environment Variable Issues
```bash
# Verify environment files exist
ls apps/strapi/.env
ls apps/web/.env.local

# Check for missing quotes around values
cat apps/strapi/.env | grep -v "^#"
```

#### Build Errors
```bash
# Clear all caches and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install

# Clear Next.js cache
rm -rf apps/web/.next

# Clear Turbo cache
rm -rf .turbo
```

### Debug Mode

#### Strapi Debug
```bash
# Enable debug logging
cd apps/strapi
DEBUG=strapi:* pnpm dev
```

#### Next.js Debug
```bash
# Enable verbose logging
cd apps/web
DEBUG=* pnpm dev
```

---

## Performance Optimization

### Development Performance
```bash
# Use Turbo for faster builds
pnpm build --cache-dir=.turbo

# Parallel development (if you have enough RAM)
pnpm dev --parallel
```

### Production Optimization
1. **Enable ISR** (Incremental Static Regeneration)
2. **Configure CDN** for static assets
3. **Set up Redis** for caching (optional)
4. **Enable Gzip/Brotli** compression

---

## Git Workflow

### Branch Strategy
```bash
# Feature development
git checkout -b feature/new-component
git add .
git commit -m "feat: add new hero component"

# Bug fixes
git checkout -b fix/carousel-navigation
git commit -m "fix: carousel navigation on mobile"

# Hotfixes
git checkout -b hotfix/security-update
git commit -m "fix: update dependencies for security"
```

### Commit Message Format
Following conventional commits:
```
type(scope): description

# Examples:
feat(components): add new carousel component
fix(auth): resolve login redirect issue
docs(readme): update setup instructions
style(design): update primary color palette
refactor(api): simplify content fetching logic
test(forms): add validation tests
```

### Pre-commit Hooks
The project includes automatic code quality checks:
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Commitlint**: Commit message format

---

## Team Development

### Code Review Process
1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Develop and Test**: Ensure all tests pass
3. **Create Pull Request**: Include description and screenshots
4. **Code Review**: At least one team member reviews
5. **Merge**: Squash and merge to main branch

### Documentation Standards
- **Components**: Include JSDoc comments
- **APIs**: Document endpoints and responses
- **Setup**: Keep README.md updated
- **Changes**: Update CHANGELOG.md

### Environment Consistency
```bash
# Use exact Node.js version
node --version  # Should match .nvmrc
pnpm --version  # Should match package.json engines

# Use shared configurations
# - ESLint config in packages/eslint-config
# - Prettier config in packages/prettier-config
# - TypeScript config in packages/typescript-config
```

---

This development workflow guide ensures consistent, efficient development practices across your team and provides clear steps for setting up, developing, and maintaining your Strapi Next.js application.
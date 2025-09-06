# Strapi Next.js Starter Template - Complete UI Documentation

## Overview
This template provides a comprehensive full-stack solution combining Strapi CMS with Next.js 15, featuring a modern design system, 8 reusable UI block components, and a robust theming system.

## Architecture

### Monorepo Structure
```
strapi-next-starter/
├── apps/
│   ├── strapi/          # Headless CMS backend
│   └── web/             # Next.js 15 frontend
├── packages/
│   ├── design-system/   # Shared UI design tokens
│   ├── eslint-config/   # Shared linting configuration
│   ├── prettier-config/ # Code formatting rules
│   ├── shared-data/     # Type definitions and data
│   └── typescript-config/ # Shared TypeScript config
└── docs/               # Documentation files
```

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **Backend**: Strapi 5 with GraphQL API
- **Database**: PostgreSQL (production) / SQLite (development)
- **Design System**: Custom CSS with TailwindCSS integration
- **Authentication**: NextAuth.js with Strapi integration
- **Deployment**: Docker support, Vercel/Heroku ready

## UI Block Components

### 1. Hero Section (`StrapiHero`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiHero.tsx`

**Features**:
- Responsive grid layout (12-column)
- Dynamic background color support
- Title, subtitle, and call-to-action buttons
- Image integration with rounded styling
- Step-by-step list with check icons

**Props Structure**:
```typescript
interface HeroComponent {
  title: string
  subTitle?: string
  bgColor?: string
  steps?: { id: string, text: string }[]
  links?: LinkComponent[]
  image?: { media: ImageData }
}
```

**Usage Example**:
```jsx
<StrapiHero 
  component={{
    title: "Welcome to Our Platform",
    subTitle: "Build amazing experiences",
    bgColor: "#f8fafc",
    steps: [
      { id: "1", text: "Easy setup process" },
      { id: "2", text: "Powerful features" }
    ],
    links: [{ url: "/get-started", text: "Get Started" }],
    image: { media: heroImage }
  }}
/>
```

### 2. Image Carousel (`StrapiCarousel`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiCarousel.tsx`

**Features**:
- Responsive image carousel with navigation
- Supports multiple images per slide
- Touch/swipe gestures
- Previous/next controls
- Responsive breakpoints (1 item mobile, 2 tablet, 3 desktop)

**Props Structure**:
```typescript
interface CarouselComponent {
  images: { 
    id: string
    image: { media: ImageData }
  }[]
}
```

### 3. FAQ Section (`StrapiFaq`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiFaq.tsx`

**Features**:
- Collapsible question/answer format
- Smooth animations
- Rich text support for answers
- SEO-optimized structure

### 4. Heading with CTA (`StrapiHeadingWithCTAButton`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiHeadingWithCTAButton.tsx`

**Features**:
- Centered layout with heading
- Call-to-action button integration
- Typography variants support
- Responsive spacing

### 5. Horizontal Images (`StrapiHorizontalImages`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiHorizontalImages.tsx`

**Features**:
- Side-by-side image layout
- Responsive design
- Image optimization
- Flexible sizing options

### 6. Image with CTA (`StrapiImageWithCTAButton`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiImageWithCTAButton.tsx`

**Features**:
- Image and text combination
- Call-to-action integration
- Flexible positioning
- Responsive behavior

### 7. Animated Logo Row (`StrapiAnimatedLogoRow`)
**Location**: `apps/web/src/components/page-builder/components/sections/StrapiAnimatedLogoRow.tsx`

**Features**:
- Horizontal scrolling logos
- Animation effects
- Brand showcase functionality
- Responsive sizing

### 8. Contact Form (`StrapiContactForm`)
**Location**: `apps/web/src/components/page-builder/components/forms/StrapiContactForm.tsx`

**Features**:
- Multi-field form validation
- Email integration
- ReCAPTCHA support
- Success/error handling

## Design System

### Theme Configuration
**Location**: `packages/design-system/src/theme.css`

The design system uses CSS custom properties for consistent theming:

#### Color System
- **Primary Colors**: 50-950 scale using OKLCH color space
- **Secondary Colors**: Complete gray scale
- **Semantic Colors**: Success, warning, error states
- **Brand Colors**: Customizable primary and secondary palettes

#### Typography Scale
```css
--text-xs: 0.75em      /* 12px */
--text-sm: 0.875em     /* 14px */
--text-base: 1em       /* 16px */
--text-lg: 1.125em     /* 18px */
--text-xl: 1.25em      /* 20px */
--text-2xl: 1.5em      /* 24px */
--text-3xl: 1.875em    /* 30px */
--text-4xl: 2.25em     /* 36px */
--text-5xl: 3em        /* 48px */
```

#### Spacing System
- **Base Unit**: 0.25em (4px equivalent)
- **Consistent Ratios**: Powers of 2 and Fibonacci-inspired scale
- **Responsive Containers**: 7 size variants from 3xs to 7xl

#### Border Radius
```css
--radius-sm: 0.125rem  /* 2px */
--radius-md: 0.375rem  /* 6px */
--radius-lg: 0.5rem    /* 8px */
--radius-xl: 0.75rem   /* 12px */
```

### Customization

#### Theme Overrides
Override CSS custom properties in your application:

```css
:root {
  --color-primary-500: your-brand-color;
  --font-family-primary: "Your Font", sans-serif;
  --radius-md: 1rem; /* More rounded corners */
}
```

#### Component Styling
Each component accepts `className` prop for custom styling:

```jsx
<StrapiHero 
  className="custom-hero-styles"
  component={heroData}
/>
```

## Responsive Design

### Breakpoint System
```css
--breakpoint-sm: 40em   /* 640px */
--breakpoint-md: 48em   /* 768px */
--breakpoint-lg: 64em   /* 1024px */
--breakpoint-xl: 80em   /* 1280px */
--breakpoint-2xl: 96em  /* 1536px */
```

### Component Responsiveness
- **Mobile-First**: All components designed for mobile and scaled up
- **Grid Layouts**: 12-column grid system with responsive breakpoints
- **Typography**: Fluid typography with responsive scaling
- **Images**: Automatic optimization and responsive sizing

## Development Workflow

### Environment Setup
1. **Prerequisites**: Node.js 22.x, PNPM 9+
2. **Database**: PostgreSQL for production, SQLite for development
3. **Environment Files**: Copy `.env.example` files and configure

### Development Commands
```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev                 # Both Strapi and Web
pnpm dev:strapi         # Strapi only
pnpm dev:web            # Next.js only

# Database management
pnpm docker:db          # Start PostgreSQL
pnpm docker:reset       # Reset database

# Code quality
pnpm lint               # ESLint all packages
pnpm format             # Prettier formatting
pnpm test               # Run all tests

# Production builds
pnpm build              # Build all packages
pnpm build:strapi       # Build Strapi only
pnpm build:web          # Build Next.js only
```

### Content Management

#### Strapi Admin Setup
1. Access admin panel: `http://localhost:1337/admin`
2. Create admin user on first run
3. Configure content types and permissions
4. Set up API tokens for frontend access

#### Content Types
- **Pages**: Dynamic page content with block components
- **Navigation**: Site navigation structure
- **Global Settings**: Site-wide configuration
- **Media Library**: Image and file management

## Performance Optimizations

### Next.js Features
- **App Router**: Latest Next.js routing system
- **Image Optimization**: Automatic WebP conversion and lazy loading
- **Static Generation**: ISR (Incremental Static Regeneration)
- **Code Splitting**: Automatic component-level splitting

### Design System Benefits
- **CSS Custom Properties**: Runtime theme switching
- **Minimal Bundle**: Tree-shaking optimized
- **Performance**: Optimized animations and interactions

## Deployment

### Docker Support
```bash
# Build and run with Docker
docker compose up --build

# Production deployment
docker compose -f docker-compose.prod.yml up
```

### Platform Support
- **Vercel**: Next.js optimized deployment
- **Heroku**: Full-stack deployment with PostgreSQL
- **AWS**: ECS/Fargate container deployment
- **DigitalOcean**: App Platform deployment

## File Structure Reference

### Key Files
```
apps/web/src/
├── app/                      # Next.js app router pages
│   ├── [locale]/            # Internationalization
│   └── api/                 # API routes
├── components/
│   ├── elementary/          # Basic UI components
│   ├── forms/               # Form components
│   ├── page-builder/        # Block components
│   │   ├── components/
│   │   │   ├── forms/       # Form blocks
│   │   │   ├── sections/    # Content blocks
│   │   │   └── utilities/   # Helper components
│   │   └── index.tsx        # Component registry
│   ├── providers/           # Context providers
│   ├── typography/          # Text components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utility functions
├── styles/                  # Global styles
└── types/                   # TypeScript definitions
```

### Configuration Files
- `next.config.mjs`: Next.js configuration
- `tailwind.config.ts`: TailwindCSS setup
- `tsconfig.json`: TypeScript configuration
- `package.json`: Dependencies and scripts

## Project Statistics

### Component Count
- **8 Block Components**: Hero, Carousel, FAQ, etc.
- **15+ UI Components**: Forms, buttons, navigation
- **10+ Utility Components**: Images, links, containers

### Code Quality
- **TypeScript**: 100% type coverage
- **ESLint**: Strict linting rules
- **Prettier**: Consistent code formatting
- **Testing**: Unit and integration tests

### Bundle Analysis
- **Optimized Bundle**: Tree-shaking enabled
- **Code Splitting**: Route and component level
- **Performance**: Lighthouse scores 90+

## Getting Started Checklist

1. **Environment Setup**
   - [ ] Install Node.js 22.x and PNPM
   - [ ] Clone repository
   - [ ] Copy environment files
   - [ ] Install dependencies

2. **Development Server**
   - [ ] Start database (PostgreSQL or use SQLite)
   - [ ] Run Strapi development server
   - [ ] Run Next.js development server
   - [ ] Access applications

3. **Content Configuration**
   - [ ] Set up Strapi admin user
   - [ ] Create content types
   - [ ] Configure permissions
   - [ ] Add sample content

4. **Customization**
   - [ ] Update theme colors
   - [ ] Customize typography
   - [ ] Add custom components
   - [ ] Configure deployment

## Support and Resources

- **Documentation**: Located in `/docs` directory
- **Component Stories**: Storybook integration available
- **API Documentation**: Auto-generated from Strapi schema
- **Community**: GitHub issues and discussions

---

This template provides a solid foundation for building modern, scalable web applications with a focus on developer experience, performance, and maintainability.
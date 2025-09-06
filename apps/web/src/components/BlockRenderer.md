# BlockRenderer Component & Typed Strapi Client

This document explains how to use the new BlockRenderer component and typed Strapi client library.

## BlockRenderer Component

### Overview
The BlockRenderer component provides a centralized way to render Strapi dynamic zones with error boundaries, loading states, and fallback components.

### Features
- **Error Boundaries**: Individual components are wrapped in error boundaries
- **Loading States**: Support for Suspense-based loading components  
- **Fallback Components**: Customizable error and missing component fallbacks
- **Type Safety**: Full TypeScript support with proper typing
- **Automatic Component Mapping**: Uses existing PageContentComponents mapping

### Usage

```tsx
import { BlockRenderer } from "@/components/BlockRenderer"

// In your page component
<BlockRenderer
  blocks={content}           // Array of Strapi block components
  pageParams={params}        // Page parameters to pass to components
  page={restPageData}       // Page data to pass to components
  className="custom-class"   // Optional CSS class
  fallbackComponent={CustomErrorComponent}  // Optional custom error component
  loadingComponent={CustomLoadingComponent} // Optional custom loading component
/>
```

### Props

- `blocks?: StrapiBlockProps[] | null` - Array of Strapi block components
- `className?: string` - CSS class for the container
- `fallbackComponent?: React.ComponentType<{ error: Error }>` - Custom error component
- `loadingComponent?: React.ComponentType` - Custom loading component
- `pageParams?: any` - Parameters passed to each block component
- `page?: any` - Page data passed to each block component

## Typed Strapi Client

### Overview
The typed Strapi client provides type-safe API calls with Zod validation and caching support.

### Features
- **Zod Validation**: Runtime validation of all API responses
- **TypeScript Types**: Full type safety for all content types
- **Caching**: Built-in ISR cache support with revalidation tags
- **Error Handling**: Proper error handling and logging
- **Authentication**: Support for both public and private API calls

### Usage

```tsx
// Import the client
import { strapiClient, getPage, type Page } from "@/lib/strapi"

// In server components
const page = await getPage('/about', 'en', {
  revalidate: 3600,        // Cache for 1 hour
  tags: ['pages', 'about'] // Revalidation tags
})

// Alternative usage
const page = await strapiClient.getPage('/about', 'en', {
  revalidate: 3600,
  tags: ['pages', 'about']
})
```

### Available Methods

- `getPage(fullPath, locale, options)` - Fetch single page
- `getPages(locale, options)` - Fetch all pages
- `getNavbar(locale, options)` - Fetch navigation
- `getFooter(locale, options)` - Fetch footer
- `getSeo(fullPath, locale, options)` - Fetch SEO data
- `revalidate(tags)` - Revalidate cache tags

### Enhanced Server Functions

New typed server functions are available in `/lib/strapi-api/content/server.ts`:

```tsx
import { 
  fetchTypedPage, 
  fetchTypedPages, 
  fetchTypedNavbar,
  fetchTypedFooter,
  fetchTypedSeo 
} from "@/lib/strapi-api/content/server"

// These functions include draft mode support and better caching
const page = await fetchTypedPage('/about', 'en', {
  revalidate: 60,
  tags: ['pages']
})
```

## TypeScript Interfaces

### Location
All Strapi-related TypeScript interfaces are available in:
- `/lib/strapi.ts` - Main types and schemas
- `/types/strapi.ts` - Additional interfaces and extended types

### Key Types

```tsx
import type {
  Page,
  BlockComponent,
  SectionsHero,
  FormsContactForm,
  StrapiImageMedia,
  BlockComponentProps
} from "@/lib/strapi"

// Or from the types file
import type {
  PageWithContext,
  PostWithMeta,
  NavigationStructure
} from "@/types/strapi"
```

## Block Component Development

### Creating New Block Components

1. Add your component to `/components/page-builder/components/`
2. Export it from `/components/page-builder/index.tsx`
3. Add the mapping to `PageContentComponents`
4. Update the Zod schema in `/lib/strapi.ts`

Example:
```tsx
// In PageContentComponents
export const PageContentComponents = {
  // ... existing components
  "sections.my-new-section": MyNewSectionComponent,
}

// Component receives these props
interface Props {
  component: SectionsMyNewSection  // Typed component data
  pageParams?: any                 // Page parameters
  page?: any                      // Page data
}
```

## Migration Guide

### From Old Implementation
```tsx
// Old way
{content
  .filter((comp) => comp != null)
  .map((comp) => {
    const Component = PageContentComponents[comp.__component]
    if (!Component) return <div>Missing component</div>
    
    return (
      <ErrorBoundary key={`${comp.__component}-${comp.id}`}>
        <Component component={comp} pageParams={params} page={data} />
      </ErrorBoundary>
    )
  })
}

// New way
<BlockRenderer
  blocks={content}
  pageParams={params}
  page={data}
/>
```

### Benefits of Migration
- Centralized error handling
- Consistent loading states
- Better fallback components
- Reduced boilerplate code
- Type safety improvements
- Better developer experience

## Cache Management

### Revalidation Tags
The typed client automatically assigns cache tags:
- `pages` - For all page content
- `navbar` - For navigation data
- `footer` - For footer data
- `seo` - For SEO data

### Manual Revalidation
```tsx
import { revalidateStrapi } from "@/lib/strapi"

// Revalidate specific content
await revalidateStrapi(['pages', 'navbar'])
```
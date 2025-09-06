// ============================================================================
// STRAPI CONTENT TYPES INTERFACES
// ============================================================================
// Re-export from the main strapi client for convenience

export type {
  // Media and utilities
  StrapiImageMedia,
  UtilityLink,
  UtilityBasicImage,
  UtilityImageWithLink,
  UtilityText,
  UtilityAccordion,
  
  // SEO types
  SeoUtilitiesSeo,
  
  // Block component types
  SectionsHero,
  SectionsHeadingWithCtaButton,
  SectionsImageWithCtaButton,
  SectionsHorizontalImages,
  SectionsFaq,
  SectionsCarousel,
  SectionsAnimatedLogoRow,
  FormsContactForm,
  FormsNewsletterForm,
  UtilitiesCkEditorContent,
  BlockComponent,
  
  // Main content types
  Page,
  Site,
  NavigationItem,
  Post,
  
  // Client types
  StrapiClientOptions,
} from '@/lib/strapi'

// ============================================================================
// ADDITIONAL CONTENT TYPE INTERFACES
// ============================================================================

import type { UID } from "@repo/strapi"

// Extended block props that include page context
export interface StrapiBlockProps {
  id: number | string
  __component: UID.Component
  [key: string]: any
}

// Props passed to each block component
export interface BlockComponentProps {
  component: StrapiBlockProps
  pageParams?: any
  page?: any
}

// Enhanced page interface with navigation context
export interface PageWithContext extends Omit<import('@/lib/strapi').Page, 'content'> {
  content?: StrapiBlockProps[]
  breadcrumbs?: Array<{
    title: string
    fullPath: string
  }>
  parent?: PageWithContext | null
  children?: PageWithContext[]
}

// Site configuration interface
export interface SiteConfig {
  title?: string
  description?: string
  favicon?: import('@/lib/strapi').StrapiImageMedia
  logo?: import('@/lib/strapi').StrapiImageMedia
  defaultSeo?: import('@/lib/strapi').SeoUtilitiesSeo
}

// Navigation structure
export interface NavigationStructure {
  main: import('@/lib/strapi').NavigationItem[]
  footer: import('@/lib/strapi').NavigationItem[]
  mobile?: import('@/lib/strapi').NavigationItem[]
}

// Post with category and tags
export interface PostWithMeta extends import('@/lib/strapi').Post {
  category?: {
    id: number
    name: string
    slug: string
  }
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
  author?: {
    id: number
    name: string
    email?: string
    avatar?: import('@/lib/strapi').StrapiImageMedia
  }
  featuredImage?: import('@/lib/strapi').StrapiImageMedia
  readingTime?: number
}

// Collection response with pagination
export interface CollectionResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Single response
export interface SingleResponse<T> {
  data: T | null
  meta: Record<string, any>
}

// Strapi API error
export interface StrapiError {
  status: number
  name: string
  message: string
  details?: Record<string, any>
}

// Locale information
export interface LocaleInfo {
  code: string
  name: string
  isDefault: boolean
}

// Search/filter parameters
export interface SearchParams {
  query?: string
  category?: string
  tags?: string[]
  publishedAfter?: string
  publishedBefore?: string
  limit?: number
  offset?: number
}

// Breadcrumb item
export interface BreadcrumbItem {
  title: string
  fullPath: string
  isActive?: boolean
}

// Form submission interfaces
export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
  gdprAccepted: boolean
}

export interface NewsletterFormData {
  email: string
  gdprAccepted: boolean
}

// CMS preview interfaces
export interface PreviewData {
  slug?: string
  secret?: string
  contentType?: string
  id?: string
}

// Dynamic zone content
export interface DynamicZoneContent {
  __component: UID.Component
  id: number
  [key: string]: any
}

// Component mapping type
export type ComponentMap = {
  [K in UID.Component]?: React.ComponentType<BlockComponentProps>
}

// Content status
export type ContentStatus = 'published' | 'draft' | 'archived'

// Media formats available in Strapi
export type MediaFormat = 'thumbnail' | 'small' | 'medium' | 'large'

// Available component UIDs for type safety
export type AvailableComponents = 
  | 'sections.hero'
  | 'sections.heading-with-cta-button'
  | 'sections.image-with-cta-button'
  | 'sections.horizontal-images'
  | 'sections.faq'
  | 'sections.carousel'
  | 'sections.animated-logo-row'
  | 'forms.contact-form'
  | 'forms.newsletter-form'
  | 'utilities.ck-editor-content'
import { z } from "zod"
import { PublicStrapiClient, PrivateStrapiClient } from "@/lib/strapi-api"
import type { AppLocale, CustomFetchOptions } from "@/types/general"
import type { APIResponse, APIResponseCollection, StrapiImageMedia } from "@/types/api"

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

// Base Strapi schemas
const StrapiImageMediaSchema = z.object({
  documentId: z.string(),
  id: z.number(),
  name: z.string().optional(),
  alternativeText: z.string().optional(),
  caption: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  publishedAt: z.string().optional(),
  formats: z.object({
    large: z.object({
      ext: z.string().optional(),
      url: z.string().optional(),
      hash: z.string().optional(),
      mime: z.string().optional(),
      name: z.string().optional(),
      path: z.string().optional(),
      size: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }),
    small: z.object({
      ext: z.string().optional(),
      url: z.string().optional(),
      hash: z.string().optional(),
      mime: z.string().optional(),
      name: z.string().optional(),
      path: z.string().optional(),
      size: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }),
    medium: z.object({
      ext: z.string().optional(),
      url: z.string().optional(),
      hash: z.string().optional(),
      mime: z.string().optional(),
      name: z.string().optional(),
      path: z.string().optional(),
      size: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }),
    thumbnail: z.object({
      ext: z.string().optional(),
      url: z.string().optional(),
      hash: z.string().optional(),
      mime: z.string().optional(),
      name: z.string().optional(),
      path: z.string().optional(),
      size: z.number().optional(),
      width: z.number().optional(),
      height: z.number().optional(),
    }),
  }),
  hash: z.string().optional(),
  ext: z.string().optional(),
  mime: z.string().optional(),
  size: z.number().optional(),
  url: z.string().optional(),
  previewUrl: z.string().optional(),
  provider: z.string().optional(),
  provider_metadata: z.string().optional(),
})

// Utility schemas
const UtilityLinkSchema = z.object({
  id: z.number(),
  href: z.string(),
  target: z.enum(["_self", "_blank"]).optional(),
  text: z.string(),
  isExternal: z.boolean().optional(),
})

const UtilityBasicImageSchema = z.object({
  id: z.number(),
  image: StrapiImageMediaSchema,
  alternativeText: z.string().optional(),
})

const UtilityImageWithLinkSchema = z.object({
  id: z.number(),
  image: StrapiImageMediaSchema,
  link: UtilityLinkSchema.optional(),
  alternativeText: z.string().optional(),
})

const UtilityTextSchema = z.object({
  id: z.number(),
  text: z.string(),
})

const UtilityAccordionSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
})

// SEO schemas
const SeoUtilitiesSeoSchema = z.object({
  id: z.number(),
  applicationName: z.string().optional(),
  canonicalUrl: z.string().optional(),
  email: z.string().optional(),
  keywords: z.string().optional(),
  metaDescription: z.string().optional(),
  metaImage: StrapiImageMediaSchema.optional(),
  metaRobots: z.enum([
    "all",
    "index",
    "index,follow", 
    "noindex",
    "noindex,follow",
    "noindex,nofollow",
    "none",
    "noarchive",
    "nosnippet",
    "max-snippet",
  ]).optional(),
  metaTitle: z.string().optional(),
  structuredData: z.any().optional(),
})

// Block component schemas
const SectionsHeroSchema = z.object({
  __component: z.literal("sections.hero"),
  id: z.number(),
  title: z.string(),
  subTitle: z.string().optional(),
  bgColor: z.string().optional(),
  image: UtilityBasicImageSchema.optional(),
  links: z.array(UtilityLinkSchema),
  steps: z.array(UtilityTextSchema),
})

const SectionsHeadingWithCtaButtonSchema = z.object({
  __component: z.literal("sections.heading-with-cta-button"),
  id: z.number(),
  title: z.string(),
  subText: z.string().optional(),
  cta: UtilityLinkSchema.optional(),
})

const SectionsImageWithCtaButtonSchema = z.object({
  __component: z.literal("sections.image-with-cta-button"),
  id: z.number(),
  title: z.string(),
  subText: z.string().optional(),
  image: UtilityBasicImageSchema.optional(),
  link: UtilityLinkSchema.optional(),
})

const SectionsHorizontalImagesSchema = z.object({
  __component: z.literal("sections.horizontal-images"),
  id: z.number(),
  title: z.string(),
  images: z.array(UtilityImageWithLinkSchema),
  fixedImageHeight: z.number().optional(),
  fixedImageWidth: z.number().optional(),
  imageRadius: z.enum(["sm", "md", "lg", "xl", "full"]).optional(),
  spacing: z.number().min(0).max(20).optional(),
})

const SectionsFaqSchema = z.object({
  __component: z.literal("sections.faq"),
  id: z.number(),
  title: z.string(),
  subTitle: z.string().optional(),
  accordions: z.array(UtilityAccordionSchema),
})

const SectionsCarouselSchema = z.object({
  __component: z.literal("sections.carousel"),
  id: z.number(),
  images: z.array(UtilityImageWithLinkSchema),
  radius: z.enum(["sm", "md", "lg", "xl", "full"]).optional(),
})

const SectionsAnimatedLogoRowSchema = z.object({
  __component: z.literal("sections.animated-logo-row"),
  id: z.number(),
  text: z.string(),
  logos: z.array(UtilityBasicImageSchema),
})

const FormsContactFormSchema = z.object({
  __component: z.literal("forms.contact-form"),
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  gdpr: UtilityLinkSchema.optional(),
})

const FormsNewsletterFormSchema = z.object({
  __component: z.literal("forms.newsletter-form"),
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  gdpr: UtilityLinkSchema.optional(),
})

const UtilitiesCkEditorContentSchema = z.object({
  __component: z.literal("utilities.ck-editor-content"),
  id: z.number(),
  content: z.string(),
})

// Union of all block types
export const BlockComponentSchema = z.union([
  SectionsHeroSchema,
  SectionsHeadingWithCtaButtonSchema,
  SectionsImageWithCtaButtonSchema,
  SectionsHorizontalImagesSchema,
  SectionsFaqSchema,
  SectionsCarouselSchema,
  SectionsAnimatedLogoRowSchema,
  FormsContactFormSchema,
  FormsNewsletterFormSchema,
  UtilitiesCkEditorContentSchema,
])

// Content type schemas
export const PageSchema = z.object({
  documentId: z.string(),
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  fullPath: z.string(),
  breadcrumbTitle: z.string().optional(),
  content: z.array(BlockComponentSchema).optional(),
  seo: SeoUtilitiesSeoSchema.optional(),
  locale: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
  localizations: z.array(z.any()).optional(),
})

export const SiteSchema = z.object({
  documentId: z.string(),
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  locale: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
})

export const NavigationItemSchema = z.object({
  documentId: z.string(),
  id: z.number(),
  title: z.string(),
  path: z.string().optional(),
  target: z.string().optional(),
  isExternal: z.boolean().optional(),
  locale: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  publishedAt: z.string().optional(),
})

export const PostSchema = z.object({
  documentId: z.string(),
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  content: z.array(BlockComponentSchema).optional(),
  excerpt: z.string().optional(),
  publishedAt: z.string().optional(),
  locale: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

// ============================================================================
// TYPESCRIPT INTERFACES (Generated from Zod schemas)
// ============================================================================

// StrapiImageMedia is imported from @/types/api
export type UtilityLink = z.infer<typeof UtilityLinkSchema>
export type UtilityBasicImage = z.infer<typeof UtilityBasicImageSchema>
export type UtilityImageWithLink = z.infer<typeof UtilityImageWithLinkSchema>
export type UtilityText = z.infer<typeof UtilityTextSchema>
export type UtilityAccordion = z.infer<typeof UtilityAccordionSchema>

// SEO types
export type SeoUtilitiesSeo = z.infer<typeof SeoUtilitiesSeoSchema>

// Block component types
export type SectionsHero = z.infer<typeof SectionsHeroSchema>
export type SectionsHeadingWithCtaButton = z.infer<typeof SectionsHeadingWithCtaButtonSchema>
export type SectionsImageWithCtaButton = z.infer<typeof SectionsImageWithCtaButtonSchema>
export type SectionsHorizontalImages = z.infer<typeof SectionsHorizontalImagesSchema>
export type SectionsFaq = z.infer<typeof SectionsFaqSchema>
export type SectionsCarousel = z.infer<typeof SectionsCarouselSchema>
export type SectionsAnimatedLogoRow = z.infer<typeof SectionsAnimatedLogoRowSchema>
export type FormsContactForm = z.infer<typeof FormsContactFormSchema>
export type FormsNewsletterForm = z.infer<typeof FormsNewsletterFormSchema>
export type UtilitiesCkEditorContent = z.infer<typeof UtilitiesCkEditorContentSchema>

export type BlockComponent = z.infer<typeof BlockComponentSchema>

// Content type interfaces
export type Page = z.infer<typeof PageSchema>
export type Site = z.infer<typeof SiteSchema>
export type NavigationItem = z.infer<typeof NavigationItemSchema>
export type Post = z.infer<typeof PostSchema>

// ============================================================================
// TYPED STRAPI CLIENT
// ============================================================================

export interface StrapiClientOptions {
  revalidate?: number | false
  tags?: string[]
  cache?: RequestCache
}

export class TypedStrapiClient {
  private publicClient = PublicStrapiClient
  private privateClient = PrivateStrapiClient

  /**
   * Validates and returns typed data from Strapi response
   */
  private validateResponse<T>(data: any, schema: z.ZodSchema<T>, type: string): T {
    try {
      return schema.parse(data)
    } catch (error) {
      console.error(`Validation failed for ${type}:`, error)
      throw new Error(`Invalid ${type} data structure from Strapi`)
    }
  }

  /**
   * Fetch a single page by full path
   */
  async getPage(
    fullPath: string,
    locale: AppLocale,
    options: StrapiClientOptions = {}
  ): Promise<Page | null> {
    try {
      const requestInit: RequestInit = {
        next: {
          revalidate: options.revalidate ?? 60,
          tags: options.tags ? [...options.tags, 'pages'] : ['pages'],
        },
        cache: options.cache,
      }

      const response = await this.publicClient.fetchOneByFullPath(
        "api::page.page",
        fullPath,
        {
          locale,
          populate: {
            content: true,
            seo: true,
          },
          middlewarePopulate: ["content", "seo"],
        },
        requestInit
      )

      if (!response?.data) return null

      return this.validateResponse(response.data, PageSchema, 'Page')
    } catch (error) {
      console.error(`Error fetching page '${fullPath}' for locale '${locale}':`, error)
      return null
    }
  }

  /**
   * Fetch all pages
   */
  async getPages(
    locale: AppLocale,
    options: StrapiClientOptions = {}
  ): Promise<Page[]> {
    try {
      const requestInit: RequestInit = {
        next: {
          revalidate: options.revalidate ?? 300,
          tags: options.tags ? [...options.tags, 'pages'] : ['pages'],
        },
        cache: options.cache,
      }

      const response = await this.publicClient.fetchAll(
        "api::page.page",
        {
          locale,
          fields: ["title", "slug", "fullPath", "locale", "updatedAt", "createdAt", "publishedAt"],
          populate: {},
          status: "published",
        },
        requestInit
      )

      if (!response?.data) return []

      return response.data.map(page => 
        this.validateResponse(page, PageSchema, 'Page')
      )
    } catch (error) {
      console.error(`Error fetching pages for locale '${locale}':`, error)
      return []
    }
  }

  /**
   * Fetch navigation/navbar
   */
  async getNavbar(
    locale: AppLocale,
    options: StrapiClientOptions = {}
  ): Promise<any | null> {
    try {
      const requestInit: RequestInit = {
        next: {
          revalidate: options.revalidate ?? 3600,
          tags: options.tags ? [...options.tags, 'navbar'] : ['navbar'],
        },
        cache: options.cache,
      }

      const response = await this.publicClient.fetchOne(
        "api::navbar.navbar",
        undefined,
        {
          locale,
          populate: {
            links: true,
            logoImage: { populate: { image: true, link: true } },
          },
        },
        requestInit
      )

      return response?.data || null
    } catch (error) {
      console.error(`Error fetching navbar for locale '${locale}':`, error)
      return null
    }
  }

  /**
   * Fetch footer
   */
  async getFooter(
    locale: AppLocale,
    options: StrapiClientOptions = {}
  ): Promise<any | null> {
    try {
      const requestInit: RequestInit = {
        next: {
          revalidate: options.revalidate ?? 3600,
          tags: options.tags ? [...options.tags, 'footer'] : ['footer'],
        },
        cache: options.cache,
      }

      const response = await this.publicClient.fetchOne(
        "api::footer.footer",
        undefined,
        {
          locale,
          populate: {
            sections: { populate: { links: true } },
            logoImage: { populate: { image: true, link: true } },
            links: true,
          },
        },
        requestInit
      )

      return response?.data || null
    } catch (error) {
      console.error(`Error fetching footer for locale '${locale}':`, error)
      return null
    }
  }

  /**
   * Fetch SEO data for a specific path
   */
  async getSeo(
    fullPath: string,
    locale: AppLocale,
    options: StrapiClientOptions = {}
  ): Promise<SeoUtilitiesSeo | null> {
    try {
      const requestInit: RequestInit = {
        next: {
          revalidate: options.revalidate ?? 3600,
          tags: options.tags ? [...options.tags, 'seo'] : ['seo'],
        },
        cache: options.cache,
      }

      const response = await this.publicClient.fetchOneByFullPath(
        "api::page.page",
        fullPath,
        {
          locale,
          populate: {
            seo: {
              populate: {
                metaImage: true,
                twitter: { populate: { images: true } },
              },
            },
          },
          fields: [],
        },
        requestInit
      )

      if (!response?.data?.seo) return null

      return this.validateResponse(response.data.seo, SeoUtilitiesSeoSchema, 'SEO')
    } catch (error) {
      console.error(`Error fetching SEO for '${fullPath}' in locale '${locale}':`, error)
      return null
    }
  }

  /**
   * Revalidate specific cache tags
   */
  async revalidate(tags: string[]): Promise<void> {
    if (typeof window !== 'undefined') {
      console.warn('Cache revalidation can only be called server-side')
      return
    }

    try {
      const { revalidateTag } = await import('next/cache')
      tags.forEach(tag => revalidateTag(tag))
    } catch (error) {
      console.error('Error revalidating cache tags:', error)
    }
  }
}

// Export singleton instance
export const strapiClient = new TypedStrapiClient()

// Export convenience functions
export const getPage = strapiClient.getPage.bind(strapiClient)
export const getPages = strapiClient.getPages.bind(strapiClient)
export const getNavbar = strapiClient.getNavbar.bind(strapiClient)
export const getFooter = strapiClient.getFooter.bind(strapiClient)
export const getSeo = strapiClient.getSeo.bind(strapiClient)
export const revalidateStrapi = strapiClient.revalidate.bind(strapiClient)
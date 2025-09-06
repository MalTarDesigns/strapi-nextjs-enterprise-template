import "server-only"

import { draftMode } from "next/headers"
import { UID } from "@repo/strapi"

import type { AppLocale, CustomFetchOptions } from "@/types/general"

import { PublicStrapiClient } from "@/lib/strapi-api"
import { strapiClient, type Page, type StrapiClientOptions } from "@/lib/strapi"

// ------ Page fetching functions

export async function fetchPage(
  fullPath: string,
  locale: AppLocale,
  requestInit?: RequestInit,
  options?: CustomFetchOptions
) {
  const dm = await draftMode()

  try {
    return await PublicStrapiClient.fetchOneByFullPath(
      "api::page.page",
      fullPath,
      {
        locale,
        status: dm.isEnabled ? "draft" : "published",
        populate: {
          content: true, // ensures typing is valid on the resulting object
          seo: true,
        },
        middlewarePopulate: ["content", "seo"], // ensures the middleware is triggered and the populate object is replaced
      },
      requestInit,
      options
    )
  } catch (e: any) {
    console.error({
      message: `Error fetching page '${fullPath}' for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

export async function fetchAllPages(
  uid: Extract = "api::page.page",
  locale: AppLocale
) {
  try {
    return await PublicStrapiClient.fetchAll(uid, {
      locale,
      fields: ["fullPath", "locale", "updatedAt", "createdAt", "slug"],
      populate: {},
      status: "published",
    })
  } catch (e: any) {
    console.error({
      message: `Error fetching all pages for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
    return { data: [] }
  }
}

// ------ SEO fetching functions

export async function fetchSeo(
  uid: Extract = "api::page.page",
  fullPath: string | null,
  locale: AppLocale
) {
  try {
    return await PublicStrapiClient.fetchOneByFullPath(uid, fullPath, {
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
    })
  } catch (e: any) {
    console.error({
      message: `Error fetching SEO for '${uid}' with fullPath '${fullPath}' for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

// ------ Navbar fetching functions

export async function fetchNavbar(locale: AppLocale) {
  try {
    return await PublicStrapiClient.fetchOne("api::navbar.navbar", undefined, {
      locale,
      populate: {
        links: true,
        logoImage: { populate: { image: true, link: true } },
      },
    })
  } catch (e: any) {
    console.error({
      message: `Error fetching navbar for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

// ------ Footer fetching functions

export async function fetchFooter(locale: AppLocale) {
  try {
    return await PublicStrapiClient.fetchOne("api::footer.footer", undefined, {
      locale,
      populate: {
        sections: { populate: { links: true } },
        logoImage: { populate: { image: true, link: true } },
        links: true,
      },
    })
  } catch (e: any) {
    console.error({
      message: `Error fetching footer for locale '${locale}'`,
      error: {
        error: e?.message,
        stack: e?.stack,
      },
    })
  }
}

// ============================================================================
// TYPED STRAPI CLIENT FUNCTIONS (NEW)
// ============================================================================

/**
 * Enhanced page fetching with Zod validation and better type safety
 */
export async function fetchTypedPage(
  fullPath: string,
  locale: AppLocale,
  options: StrapiClientOptions = {}
): Promise<Page | null> {
  const dm = await draftMode()
  
  const clientOptions: StrapiClientOptions = {
    revalidate: dm.isEnabled ? 0 : options.revalidate ?? 60,
    tags: options.tags || ['pages'],
    cache: dm.isEnabled ? 'no-store' : options.cache,
  }

  return await strapiClient.getPage(fullPath, locale, clientOptions)
}

/**
 * Enhanced pages listing with type safety
 */
export async function fetchTypedPages(
  locale: AppLocale,
  options: StrapiClientOptions = {}
): Promise<Page[]> {
  const clientOptions: StrapiClientOptions = {
    revalidate: options.revalidate ?? 300,
    tags: options.tags || ['pages'],
    cache: options.cache,
  }

  return await strapiClient.getPages(locale, clientOptions)
}

/**
 * Enhanced navbar fetching with caching
 */
export async function fetchTypedNavbar(
  locale: AppLocale,
  options: StrapiClientOptions = {}
) {
  const clientOptions: StrapiClientOptions = {
    revalidate: options.revalidate ?? 3600,
    tags: options.tags || ['navbar'],
    cache: options.cache,
  }

  return await strapiClient.getNavbar(locale, clientOptions)
}

/**
 * Enhanced footer fetching with caching
 */
export async function fetchTypedFooter(
  locale: AppLocale,
  options: StrapiClientOptions = {}
) {
  const clientOptions: StrapiClientOptions = {
    revalidate: options.revalidate ?? 3600,
    tags: options.tags || ['footer'],
    cache: options.cache,
  }

  return await strapiClient.getFooter(locale, clientOptions)
}

/**
 * Enhanced SEO fetching with validation
 */
export async function fetchTypedSeo(
  fullPath: string,
  locale: AppLocale,
  options: StrapiClientOptions = {}
) {
  const clientOptions: StrapiClientOptions = {
    revalidate: options.revalidate ?? 3600,
    tags: options.tags || ['seo'],
    cache: options.cache,
  }

  return await strapiClient.getSeo(fullPath, locale, clientOptions)
}

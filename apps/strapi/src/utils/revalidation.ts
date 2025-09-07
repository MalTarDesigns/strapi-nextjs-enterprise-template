interface RevalidationPayload {
  event: 'entry.create' | 'entry.update' | 'entry.delete' | 'entry.publish' | 'entry.unpublish'
  model: string
  entry: {
    id: number
    slug?: string
    url?: string
    locale?: string
    localizations?: Array<{ locale: string, url?: string, slug?: string }>
  }
  paths?: string[]
  tags?: string[]
  revalidateAll?: boolean
}

/**
 * Sends a webhook to the Next.js revalidation endpoint
 */
export async function triggerRevalidation(payload: RevalidationPayload): Promise<void> {
  try {
    const revalidateUrl = process.env.NEXT_REVALIDATE_URL || process.env.FRONTEND_URL
    const revalidateSecret = process.env.REVALIDATE_SECRET

    if (!revalidateUrl || !revalidateSecret) {
      console.warn('[REVALIDATION]: Missing NEXT_REVALIDATE_URL or REVALIDATE_SECRET environment variables')
      return
    }

    const webhookUrl = `${revalidateUrl.replace(/\/$/, '')}/api/revalidate`

    console.log(`[REVALIDATION]: Triggering revalidation for ${payload.model} (${payload.event})`, {
      entryId: payload.entry.id,
      paths: payload.paths,
      tags: payload.tags,
    })

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${revalidateSecret}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[REVALIDATION]: Webhook failed with status ${response.status}:`, errorText)
      return
    }

    const result = await response.json()
    console.log(`[REVALIDATION]: Webhook successful:`, result)

  } catch (error) {
    console.error(`[REVALIDATION]: Error sending revalidation webhook:`, error)
  }
}

/**
 * Creates revalidation payload for a page content type
 */
export function createPageRevalidationPayload(
  event: RevalidationPayload['event'],
  entry: any
): RevalidationPayload {
  const paths: string[] = []

  // Add the specific page URL
  if (entry.url) {
    paths.push(entry.url)
  }

  // Add localization URLs
  if (entry.localizations && Array.isArray(entry.localizations)) {
    for (const localization of entry.localizations) {
      if (localization.url) {
        paths.push(localization.url)
      }
    }
  }

  // Handle homepage specifically
  if (entry.slug === 'index' || entry.url === '/') {
    paths.push('/')
  }

  return {
    event,
    model: 'page',
    entry: {
      id: entry.id,
      slug: entry.slug,
      url: entry.url,
      locale: entry.locale,
      localizations: entry.localizations?.map((loc: any) => ({
        locale: loc.locale,
        url: loc.url,
        slug: loc.slug,
      })),
    },
    paths,
    tags: ['pages'],
  }
}

/**
 * Creates revalidation payload for navigation content type
 */
export function createNavigationRevalidationPayload(
  event: RevalidationPayload['event'],
  entry: any
): RevalidationPayload {
  return {
    event,
    model: 'navbar',
    entry: {
      id: entry.id,
      locale: entry.locale,
    },
    tags: ['navigation'],
    revalidateAll: true, // Navigation changes affect all pages
  }
}

/**
 * Creates revalidation payload for footer content type
 */
export function createFooterRevalidationPayload(
  event: RevalidationPayload['event'],
  entry: any
): RevalidationPayload {
  return {
    event,
    model: 'footer',
    entry: {
      id: entry.id,
      locale: entry.locale,
    },
    tags: ['footer'],
    revalidateAll: true, // Footer changes affect all pages
  }
}

/**
 * Creates revalidation payload for site/global content type
 */
export function createSiteRevalidationPayload(
  event: RevalidationPayload['event'],
  entry: any
): RevalidationPayload {
  return {
    event,
    model: 'site',
    entry: {
      id: entry.id,
      locale: entry.locale,
    },
    tags: ['site-config'],
    revalidateAll: true, // Site config changes affect all pages
  }
}

/**
 * Creates revalidation payload for post content type
 */
export function createPostRevalidationPayload(
  event: RevalidationPayload['event'],
  entry: any
): RevalidationPayload {
  const paths: string[] = []

  // Add the specific post URL
  if (entry.url) {
    paths.push(entry.url)
  }

  // Add blog listing page
  paths.push('/blog')

  // Add localization URLs
  if (entry.localizations && Array.isArray(entry.localizations)) {
    for (const localization of entry.localizations) {
      if (localization.url) {
        paths.push(localization.url)
      }
    }
  }

  return {
    event,
    model: 'post',
    entry: {
      id: entry.id,
      slug: entry.slug,
      url: entry.url,
      locale: entry.locale,
      localizations: entry.localizations?.map((loc: any) => ({
        locale: loc.locale,
        url: loc.url,
        slug: loc.slug,
      })),
    },
    paths,
    tags: ['posts'],
  }
}

/**
 * Creates revalidation payload for redirect content type
 */
export function createRedirectRevalidationPayload(
  event: RevalidationPayload['event'],
  entry: any
): RevalidationPayload {
  const paths: string[] = []

  // When a redirect is created/updated, revalidate the source path
  if (entry.source) {
    paths.push(entry.source)
  }

  // When a redirect is deleted, revalidate the source path as it's no longer redirected
  if (event === 'entry.delete' && entry.source) {
    paths.push(entry.source)
  }

  return {
    event,
    model: 'redirect',
    entry: {
      id: entry.id,
    },
    paths,
    tags: ['redirects'],
  }
}

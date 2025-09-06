/* eslint-disable no-console */
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { env } from "@/env.mjs"

// Type definitions for webhook payload
interface RevalidateWebhookPayload {
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

export async function POST(request: NextRequest) {
  try {
    // Validate revalidation secret
    if (!env.REVALIDATE_SECRET) {
      console.error("[REVALIDATE]: REVALIDATE_SECRET not configured")
      return NextResponse.json(
        { error: "Revalidation not configured" },
        { status: 500 }
      )
    }

    // Check authorization header
    const authHeader = request.headers.get("authorization")
    const providedSecret = authHeader?.replace("Bearer ", "")

    if (providedSecret !== env.REVALIDATE_SECRET) {
      console.error("[REVALIDATE]: Invalid revalidation secret")
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 }
      )
    }

    const body = await request.json() as RevalidateWebhookPayload
    console.log(`[REVALIDATE]: Received webhook for ${body.model} (${body.event})`, {
      entryId: body.entry.id,
      slug: body.entry.slug,
      url: body.entry.url,
    })

    const revalidatedPaths: string[] = []
    const revalidatedTags: string[] = []

    // Handle bulk revalidation (e.g., for site-wide changes like theme updates)
    if (body.revalidateAll) {
      console.log("[REVALIDATE]: Performing bulk revalidation")
      
      // Revalidate common cache tags
      const bulkTags = ['pages', 'posts', 'navigation', 'footer', 'site-config']
      for (const tag of bulkTags) {
        revalidateTag(tag)
        revalidatedTags.push(tag)
      }

      // Revalidate root paths
      const bulkPaths = ['/', '/[locale]']
      for (const path of bulkPaths) {
        revalidatePath(path, 'layout')
        revalidatedPaths.push(path)
      }
    }

    // Handle specific tag revalidation
    if (body.tags && body.tags.length > 0) {
      for (const tag of body.tags) {
        revalidateTag(tag)
        revalidatedTags.push(tag)
        console.log(`[REVALIDATE]: Revalidated tag: ${tag}`)
      }
    }

    // Handle specific path revalidation
    if (body.paths && body.paths.length > 0) {
      for (const path of body.paths) {
        revalidatePath(path)
        revalidatedPaths.push(path)
        console.log(`[REVALIDATE]: Revalidated path: ${path}`)
      }
    }

    // Handle model-specific revalidation logic
    await handleModelSpecificRevalidation(body, revalidatedPaths, revalidatedTags)

    const response = {
      revalidated: true,
      timestamp: new Date().toISOString(),
      event: body.event,
      model: body.model,
      entryId: body.entry.id,
      revalidatedPaths,
      revalidatedTags,
    }

    console.log("[REVALIDATE]: Revalidation completed", response)
    return NextResponse.json(response)

  } catch (error) {
    console.error("[REVALIDATE]: Error processing revalidation:", error)
    return NextResponse.json(
      { 
        error: "Revalidation failed",
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

async function handleModelSpecificRevalidation(
  payload: RevalidateWebhookPayload,
  revalidatedPaths: string[],
  revalidatedTags: string[]
) {
  const { model, entry, event } = payload

  switch (model) {
    case 'page':
      // Revalidate specific page and its localizations
      if (entry.url) {
        revalidatePath(entry.url)
        revalidatedPaths.push(entry.url)
      }

      // Handle localizations
      if (entry.localizations) {
        for (const localization of entry.localizations) {
          if (localization.url) {
            revalidatePath(localization.url)
            revalidatedPaths.push(localization.url)
          }
        }
      }

      // Revalidate pages cache tag
      revalidateTag('pages')
      revalidatedTags.push('pages')

      // If it's the homepage, also revalidate root
      if (entry.slug === 'index' || entry.url === '/') {
        revalidatePath('/', 'layout')
        revalidatedPaths.push('/ (layout)')
      }
      break

    case 'post':
    case 'article':
      // Revalidate specific post
      if (entry.url) {
        revalidatePath(entry.url)
        revalidatedPaths.push(entry.url)
      }

      // Revalidate post listings and related pages
      revalidateTag('posts')
      revalidatedTags.push('posts')

      // Revalidate blog index if it exists
      revalidatePath('/blog')
      revalidatedPaths.push('/blog')
      break

    case 'navbar':
    case 'navigation':
      // Global navigation changes affect all pages
      revalidateTag('navigation')
      revalidatedTags.push('navigation')
      
      // Revalidate layout to update navigation
      revalidatePath('/', 'layout')
      revalidatedPaths.push('/ (layout)')
      break

    case 'footer':
      // Global footer changes affect all pages
      revalidateTag('footer')
      revalidatedTags.push('footer')
      
      // Revalidate layout to update footer
      revalidatePath('/', 'layout')
      revalidatedPaths.push('/ (layout)')
      break

    case 'site':
    case 'global':
      // Site-wide configuration changes
      revalidateTag('site-config')
      revalidatedTags.push('site-config')
      
      // Revalidate entire site layout
      revalidatePath('/', 'layout')
      revalidatedPaths.push('/ (layout)')
      break

    case 'redirect':
      // Handle redirect changes - may need to revalidate affected paths
      if (event === 'entry.delete') {
        // When a redirect is deleted, we might need to revalidate the source path
        // This depends on your redirect implementation
        console.log("[REVALIDATE]: Redirect deleted, consider manual revalidation of affected paths")
      }
      break

    default:
      console.log(`[REVALIDATE]: No specific handler for model: ${model}`)
      
      // Generic fallback - revalidate based on URL if available
      if (entry.url) {
        revalidatePath(entry.url)
        revalidatedPaths.push(entry.url)
      }
      
      // Revalidate generic content tag
      revalidateTag('content')
      revalidatedTags.push('content')
      break
  }
}

// Alternative endpoint for manual revalidation (GET request)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")
  const path = searchParams.get("path")
  const tag = searchParams.get("tag")

  if (!env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Revalidation not configured" },
      { status: 500 }
    )
  }

  if (secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Invalid revalidation secret" },
      { status: 401 }
    )
  }

  try {
    if (path) {
      revalidatePath(path)
      console.log(`[REVALIDATE]: Manual path revalidation: ${path}`)
      return NextResponse.json({ revalidated: true, path })
    }

    if (tag) {
      revalidateTag(tag)
      console.log(`[REVALIDATE]: Manual tag revalidation: ${tag}`)
      return NextResponse.json({ revalidated: true, tag })
    }

    return NextResponse.json(
      { error: "Missing path or tag parameter" },
      { status: 400 }
    )
  } catch (error) {
    console.error("[REVALIDATE]: Manual revalidation error:", error)
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 }
    )
  }
}
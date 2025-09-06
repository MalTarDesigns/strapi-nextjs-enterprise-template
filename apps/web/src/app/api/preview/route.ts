/* eslint-disable no-console */
import { cookies, draftMode } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { env } from "@/env.mjs"
import { ROOT_PAGE_PATH } from "@repo/shared-data"

import { redirect, routing } from "@/lib/navigation"

// Type definitions for preview request
interface PreviewParams {
  secret: string
  url: string
  status: 'draft' | 'published'
  locale?: string
  contentType?: string
  id?: string
}

export async function GET(request: NextRequest) {
  try {
    // Validate configuration
    if (!env.STRAPI_PREVIEW_SECRET) {
      console.error(
        "[STRAPI_PREVIEW]: Preview request received, but [STRAPI_PREVIEW_SECRET] has not been configured."
      )
      return NextResponse.json(
        { error: "Preview mode not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    
    // Extract and validate parameters
    const params = extractPreviewParams(searchParams)
    const validationError = validatePreviewParams(params)
    
    if (validationError) {
      console.error(`[STRAPI_PREVIEW]: ${validationError.message}`)
      return NextResponse.json(
        { error: validationError.message },
        { status: validationError.status }
      )
    }

    const { secret, url, status, locale, contentType, id } = params

    // Verify secret
    if (secret !== env.STRAPI_PREVIEW_SECRET) {
      console.error(
        "[STRAPI_PREVIEW]: Preview request received, but [secret] does not match [STRAPI_PREVIEW_SECRET]."
      )
      return NextResponse.json(
        { error: "Invalid preview token" },
        { status: 401 }
      )
    }

    // Configure draft mode based on status
    const dm = await draftMode()
    if (status === "published") {
      dm.disable()
      console.log("[STRAPI_PREVIEW]: Draft mode disabled for published content")
    } else {
      dm.enable()
      console.log("[STRAPI_PREVIEW]: Draft mode enabled for draft content")
    }

    // Handle cross-origin iframe support for Strapi preview
    await configureCrossOriginCookies()

    // Determine final locale
    const finalLocale = routing.locales.includes(locale as never)
      ? locale
      : routing.defaultLocale

    // Log preview request details
    const previewDetails = {
      locale: finalLocale,
      url,
      status,
      contentType,
      id,
      timestamp: new Date().toISOString(),
    }
    
    console.log(`[STRAPI_PREVIEW]: Preview request processed successfully`, previewDetails)

    // Redirect to the preview page
    redirect({ href: `${url}`, locale: finalLocale })

  } catch (error) {
    console.error("[STRAPI_PREVIEW]: Unexpected error during preview processing:", error)
    return NextResponse.json(
      { 
        error: "Preview processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// Handle preview exit/disable
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'exit') {
      const dm = await draftMode()
      dm.disable()
      
      console.log("[STRAPI_PREVIEW]: Draft mode disabled via exit action")
      
      // Clear cross-origin cookies
      const cookieStore = await cookies()
      cookieStore.set({
        name: draftModePrerenderCookieKey,
        value: "",
        expires: 0,
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
      })

      return NextResponse.json({ 
        success: true, 
        message: "Preview mode disabled",
        timestamp: new Date().toISOString()
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )

  } catch (error) {
    console.error("[STRAPI_PREVIEW]: Error disabling preview mode:", error)
    return NextResponse.json(
      { error: "Failed to disable preview mode" },
      { status: 500 }
    )
  }
}

function extractPreviewParams(searchParams: URLSearchParams): PreviewParams {
  return {
    secret: searchParams.get("secret") || "",
    url: searchParams.get("url") || "",
    status: (searchParams.get("status") as 'draft' | 'published') || "published",
    locale: searchParams.get("locale") || undefined,
    contentType: searchParams.get("contentType") || searchParams.get("type") || undefined,
    id: searchParams.get("id") || undefined,
  }
}

function validatePreviewParams(params: PreviewParams): { message: string; status: number } | null {
  if (!params.secret) {
    return { message: "Missing preview secret", status: 400 }
  }

  if (!params.url) {
    return { message: "Missing preview URL", status: 400 }
  }

  // Validate URL format
  if (!params.url.match(validPageUrlRegex)) {
    return { message: "Invalid URL format", status: 400 }
  }

  // Validate status
  if (!validPageStatusKeys.includes(params.status)) {
    return { message: "Invalid status parameter", status: 400 }
  }

  return null
}

async function configureCrossOriginCookies() {
  // Workaround for iframe embedding issues with draft mode cookies
  const cookieStore = await cookies()
  const draftCookie = cookieStore.get(draftModePrerenderCookieKey)
  
  // Configure cookie with cross-origin iframe support
  cookieStore.set({
    name: draftModePrerenderCookieKey,
    value: draftCookie?.value || "",
    expires: draftCookie?.value ? undefined : 0,
    httpOnly: true,
    path: "/",
    secure: true,
    sameSite: "none", // Essential for cross-origin iframe support
  })
}
const validPageStatusKeys = ["draft", "published"] as const
const draftModePrerenderCookieKey = "__prerender_bypass"

const validPageUrlRegex = new RegExp(
  String.raw`^(${ROOT_PAGE_PATH}[a-zA-Z0-9-/%]*)+$`,
  "g"
)

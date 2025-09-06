import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"

export async function GET(request: NextRequest) {
  try {
    // Verify this is being called by Vercel Cron
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[CRON REVALIDATE]: Starting scheduled revalidation")

    // Revalidate common cache tags
    const tags = ['pages', 'posts', 'navigation', 'footer', 'site-config', 'content']
    for (const tag of tags) {
      revalidateTag(tag)
    }

    // Revalidate critical paths
    const paths = ['/', '/blog']
    for (const path of paths) {
      revalidatePath(path, 'layout')
    }

    const response = {
      revalidated: true,
      timestamp: new Date().toISOString(),
      type: 'scheduled',
      revalidatedTags: tags,
      revalidatedPaths: paths
    }

    console.log("[CRON REVALIDATE]: Scheduled revalidation completed", response)
    return NextResponse.json(response)

  } catch (error) {
    console.error("[CRON REVALIDATE]: Error during scheduled revalidation:", error)
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
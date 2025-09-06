import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function GET(request: NextRequest) {
  try {
    // Verify this is being called by Vercel Cron
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[CRON SITEMAP]: Starting sitemap regeneration")

    // Revalidate sitemap endpoints
    revalidatePath('/sitemap.xml')
    revalidatePath('/robots.txt')

    const response = {
      revalidated: true,
      timestamp: new Date().toISOString(),
      type: 'sitemap',
      revalidatedPaths: ['/sitemap.xml', '/robots.txt']
    }

    console.log("[CRON SITEMAP]: Sitemap regeneration completed", response)
    return NextResponse.json(response)

  } catch (error) {
    console.error("[CRON SITEMAP]: Error during sitemap regeneration:", error)
    return NextResponse.json(
      { 
        error: "Sitemap regeneration failed",
        timestamp: new Date().toISOString(),
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
import { SiteConfig, ThemeTokens } from "./types"

const DEFAULT_THEME_TOKENS: ThemeTokens = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe", 
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  secondary: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0", 
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  font: {
    family: "Inter",
    fallback: ["system-ui", "sans-serif"]
  },
  radius: {
    sm: "0.125rem",
    md: "0.375rem", 
    lg: "0.5rem",
    xl: "0.75rem"
  }
}

/**
 * Fetches the Site configuration from Strapi
 */
export async function getSiteConfig(locale: string = "en"): Promise<SiteConfig | null> {
  try {
    const baseUrl = process.env.STRAPI_API_URL || "http://localhost:1337"
    const token = process.env.STRAPI_API_TOKEN
    
    const url = new URL(`${baseUrl}/api/site`)
    url.searchParams.set("locale", locale)
    url.searchParams.set("populate", "*")

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url.toString(), {
      headers,
      next: { revalidate: 60 } // Revalidate every minute
    })

    if (!response.ok) {
      console.warn(`Failed to fetch site config: ${response.status} ${response.statusText}`)
      return null
    }

    const { data } = await response.json()
    
    if (!data) {
      return null
    }

    return {
      id: data.id,
      name: data.name,
      domains: data.domains,
      themeTokens: data.themeTokens || DEFAULT_THEME_TOKENS,
      logo: data.logo ? {
        url: data.logo.url,
        alternativeText: data.logo.alternativeText
      } : undefined,
      favicon: data.favicon ? {
        url: data.favicon.url,
        alternativeText: data.favicon.alternativeText
      } : undefined
    }
  } catch (error) {
    console.error("Error fetching site config:", error)
    return null
  }
}

/**
 * Gets theme tokens with fallback to defaults
 */
export function getThemeTokens(siteConfig: SiteConfig | null): ThemeTokens {
  return siteConfig?.themeTokens || DEFAULT_THEME_TOKENS
}
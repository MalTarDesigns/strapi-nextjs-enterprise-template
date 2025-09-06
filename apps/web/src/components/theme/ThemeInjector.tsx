import { getSiteConfig, getThemeTokens } from "@/lib/theme/site-config"
import { generateThemeCSS } from "@/lib/theme/theme-injection"

interface ThemeInjectorProps {
  locale: string
}

/**
 * Server component that injects theme CSS variables into the document head
 */
export async function ThemeInjector({ locale }: ThemeInjectorProps) {
  const siteConfig = await getSiteConfig(locale)
  const themeTokens = getThemeTokens(siteConfig)
  const themeCSS = generateThemeCSS(themeTokens)

  return (
    <style
      id="theme-variables"
      dangerouslySetInnerHTML={{ __html: themeCSS }}
    />
  )
}
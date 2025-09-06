import { ThemeTokens } from "./types"

/**
 * Converts theme tokens to CSS variables
 */
export function generateCSSVariables(themeTokens: ThemeTokens): Record<string, string> {
  const cssVars: Record<string, string> = {}

  // Primary color variables
  Object.entries(themeTokens.primary).forEach(([shade, value]) => {
    cssVars[`--color-primary-${shade}`] = value
  })

  // Secondary color variables
  Object.entries(themeTokens.secondary).forEach(([shade, value]) => {
    cssVars[`--color-secondary-${shade}`] = value
  })

  // Font variables
  cssVars["--font-family-primary"] = `${themeTokens.font.family}, ${themeTokens.font.fallback.join(", ")}`

  // Radius variables
  Object.entries(themeTokens.radius).forEach(([size, value]) => {
    cssVars[`--radius-${size}`] = value
  })

  return cssVars
}

/**
 * Injects CSS variables into document head
 */
export function injectThemeVariables(themeTokens: ThemeTokens): void {
  const cssVars = generateCSSVariables(themeTokens)
  
  // Create or update the theme style element
  let themeStyleElement = document.getElementById("theme-variables") as HTMLStyleElement
  
  if (!themeStyleElement) {
    themeStyleElement = document.createElement("style")
    themeStyleElement.id = "theme-variables"
    document.head.appendChild(themeStyleElement)
  }

  // Build CSS rule
  const cssRules = Object.entries(cssVars)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n")

  themeStyleElement.textContent = `:root {\n${cssRules}\n}`
}

/**
 * Server-side CSS variable generation for SSR
 */
export function generateThemeCSS(themeTokens: ThemeTokens): string {
  const cssVars = generateCSSVariables(themeTokens)
  
  const cssRules = Object.entries(cssVars)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join("\n")

  return `:root {\n${cssRules}\n}`
}
export interface ThemeTokens {
  primary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  secondary: {
    50: string
    100: string
    200: string
    300: string
    400: string
    500: string
    600: string
    700: string
    800: string
    900: string
    950: string
  }
  font: {
    family: string
    fallback: string[]
  }
  radius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}

export interface SiteConfig {
  id?: number
  name: string
  domains?: string[]
  themeTokens?: ThemeTokens
  logo?: {
    url: string
    alternativeText?: string
  }
  favicon?: {
    url: string
    alternativeText?: string
  }
}
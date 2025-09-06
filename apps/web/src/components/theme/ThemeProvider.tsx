"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import { SiteConfig, ThemeTokens } from "@/lib/theme/types"
import { getSiteConfig, getThemeTokens } from "@/lib/theme/site-config"
import { injectThemeVariables } from "@/lib/theme/theme-injection"

interface ThemeContextValue {
  siteConfig: SiteConfig | null
  themeTokens: ThemeTokens
  isLoading: boolean
  updateTheme: (tokens: ThemeTokens) => void
  refreshSiteConfig: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  locale: string
  initialSiteConfig?: SiteConfig | null
}

export function SiteThemeProvider({ 
  children, 
  locale, 
  initialSiteConfig = null 
}: ThemeProviderProps) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(initialSiteConfig)
  const [isLoading, setIsLoading] = useState(!initialSiteConfig)
  
  const themeTokens = getThemeTokens(siteConfig)

  const updateTheme = (tokens: ThemeTokens) => {
    if (typeof window !== "undefined") {
      injectThemeVariables(tokens)
    }
  }

  const refreshSiteConfig = async () => {
    setIsLoading(true)
    try {
      const config = await getSiteConfig(locale)
      setSiteConfig(config)
      
      // Apply new theme if config was loaded
      if (config?.themeTokens) {
        updateTheme(config.themeTokens)
      }
    } catch (error) {
      console.error("Error refreshing site config:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load site config on mount if not provided
  useEffect(() => {
    if (!initialSiteConfig && typeof window !== "undefined") {
      refreshSiteConfig()
    }
  }, [locale, initialSiteConfig, refreshSiteConfig])

  // Apply theme variables on theme token changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      updateTheme(themeTokens)
    }
  }, [themeTokens])

  const contextValue: ThemeContextValue = {
    siteConfig,
    themeTokens,
    isLoading,
    updateTheme,
    refreshSiteConfig
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useSiteTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useSiteTheme must be used within a SiteThemeProvider")
  }
  return context
}
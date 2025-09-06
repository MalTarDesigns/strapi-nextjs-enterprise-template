"use client"

import React from "react"

import { useSiteTheme } from "./ThemeProvider"

/**
 * Demo component showing how to use the site theming system
 */
export function ThemeDemo() {
  const { siteConfig, themeTokens, isLoading } = useSiteTheme()

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-300 rounded-md">
        <p>Loading theme configuration...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Theme Configuration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Site Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Site Information</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p><strong>Site Name:</strong> {siteConfig?.name || "Default Site"}</p>
            <p><strong>Locale:</strong> {siteConfig?.id ? "Loaded from Strapi" : "Using defaults"}</p>
          </div>
        </div>

        {/* Theme Colors Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Theme Colors</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="text-xs text-center">Primary</div>
              <div className="h-8 bg-primary-200 rounded"></div>
              <div className="h-8 bg-primary-500 rounded"></div>
              <div className="h-8 bg-primary-700 rounded"></div>
              <div className="h-8 bg-primary-900 rounded"></div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="text-xs text-center">Secondary</div>
              <div className="h-8 bg-secondary-200 rounded"></div>
              <div className="h-8 bg-secondary-500 rounded"></div>
              <div className="h-8 bg-secondary-700 rounded"></div>
              <div className="h-8 bg-secondary-900 rounded"></div>
            </div>
          </div>
        </div>

        {/* Font Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Typography</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p style={{ fontFamily: "var(--font-family-primary)" }}>
              This text uses the configured primary font family: {themeTokens.font.family}
            </p>
          </div>
        </div>

        {/* Border Radius Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Border Radius</h3>
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-primary-500" style={{ borderRadius: "var(--radius-sm)" }}>
              <span className="sr-only">Small radius</span>
            </div>
            <div className="w-12 h-12 bg-primary-500" style={{ borderRadius: "var(--radius-md)" }}>
              <span className="sr-only">Medium radius</span>
            </div>
            <div className="w-12 h-12 bg-primary-500" style={{ borderRadius: "var(--radius-lg)" }}>
              <span className="sr-only">Large radius</span>
            </div>
            <div className="w-12 h-12 bg-primary-500" style={{ borderRadius: "var(--radius-xl)" }}>
              <span className="sr-only">Extra large radius</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
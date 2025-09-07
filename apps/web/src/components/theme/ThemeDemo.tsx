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
      <div className="rounded-md border border-gray-300 p-4">
        <p>Loading theme configuration...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Theme Configuration</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Site Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">
            Site Information
          </h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <p>
              <strong>Site Name:</strong> {siteConfig?.name || "Default Site"}
            </p>
            <p>
              <strong>Locale:</strong>{" "}
              {siteConfig?.id ? "Loaded from Strapi" : "Using defaults"}
            </p>
          </div>
        </div>

        {/* Theme Colors Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Theme Colors</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center text-xs">Primary</div>
              <div className="bg-primary-200 h-8 rounded" />
              <div className="bg-primary-500 h-8 rounded" />
              <div className="bg-primary-700 h-8 rounded" />
              <div className="bg-primary-900 h-8 rounded" />
            </div>
            <div className="grid grid-cols-5 gap-2">
              <div className="text-center text-xs">Secondary</div>
              <div className="bg-secondary-200 h-8 rounded" />
              <div className="bg-secondary-500 h-8 rounded" />
              <div className="bg-secondary-700 h-8 rounded" />
              <div className="bg-secondary-900 h-8 rounded" />
            </div>
          </div>
        </div>

        {/* Font Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Typography</h3>
          <div className="rounded-lg bg-gray-50 p-4">
            <p style={{ fontFamily: "var(--font-family-primary)" }}>
              This text uses the configured primary font family:{" "}
              {themeTokens.font.family}
            </p>
          </div>
        </div>

        {/* Border Radius Demo */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Border Radius</h3>
          <div className="flex gap-3">
            <div
              className="bg-primary-500 h-12 w-12"
              style={{ borderRadius: "var(--radius-sm)" }}
            >
              <span className="sr-only">Small radius</span>
            </div>
            <div
              className="bg-primary-500 h-12 w-12"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <span className="sr-only">Medium radius</span>
            </div>
            <div
              className="bg-primary-500 h-12 w-12"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <span className="sr-only">Large radius</span>
            </div>
            <div
              className="bg-primary-500 h-12 w-12"
              style={{ borderRadius: "var(--radius-xl)" }}
            >
              <span className="sr-only">Extra large radius</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

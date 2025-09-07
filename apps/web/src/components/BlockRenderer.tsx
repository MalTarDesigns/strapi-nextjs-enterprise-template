"use client"

import React, { Suspense } from "react"
// Using string type instead of UID.Component since UID is not available

import { PageContentComponents } from "@/components/page-builder"
import { Spinner } from "@/components/elementary/Spinner"

// Types for block data structure
export interface StrapiBlockProps {
  id: number | string
  __component: string
  [key: string]: any
}

export interface BlockRendererProps {
  blocks?: StrapiBlockProps[] | null
  className?: string
  fallbackComponent?: React.ComponentType<{ error: Error }>
  loadingComponent?: React.ComponentType
  pageParams?: any
  page?: any
}

// Default fallback component for errors
const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="rounded-md border border-red-200 bg-red-50 p-4">
    <div className="flex">
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Component Error</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>Failed to render component: {error.message}</p>
        </div>
      </div>
    </div>
  </div>
)

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <Spinner />
  </div>
)

// Individual block error boundary
class BlockErrorBoundary extends React.Component<
  {
    children: React.ReactNode
    fallback: React.ComponentType<{ error: Error }>
    componentName: string
    componentId: string | number
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `Error in block component "${this.props.componentName}" (ID: ${this.props.componentId}):`,
      error,
      errorInfo
    )
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback
      return <FallbackComponent error={this.state.error} />
    }

    return this.props.children
  }
}

// Individual block renderer
const BlockItem: React.FC<{
  block: StrapiBlockProps
  fallbackComponent: React.ComponentType<{ error: Error }>
  loadingComponent: React.ComponentType
  pageParams?: any
  page?: any
}> = ({ block, fallbackComponent, loadingComponent, pageParams, page }) => {
  const componentName = block.__component
  const componentId = block.id
  const key = `${componentName}-${componentId}`

  // Get the React component for this Strapi component
  const Component = PageContentComponents[componentName]

  if (!Component) {
    console.warn(`Unknown component "${componentName}" with id "${componentId}".`)
    
    return (
      <div key={key} className="rounded-md border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Missing Component
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Component &quot;{componentName}&quot; (ID: {componentId}) is not
                implemented in the frontend.
              </p>
              <p className="mt-1 text-xs">
                Add this component to PageContentComponents in /components/page-builder/index.tsx
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <BlockErrorBoundary
      componentName={componentName}
      componentId={componentId}
      fallback={fallbackComponent}
    >
      <Suspense fallback={loadingComponent ? <>{loadingComponent}</> : <Spinner className="mx-auto h-8 w-8" />}>
        <div className="mb-4 md:mb-12 lg:mb-16">
          <Component
            {...{ component: block, pageParams, page } as any}
          />
        </div>
      </Suspense>
    </BlockErrorBoundary>
  )
}

// Main BlockRenderer component
export const BlockRenderer: React.FC<BlockRendererProps> = ({
  blocks,
  className = "",
  fallbackComponent = DefaultErrorFallback,
  loadingComponent = DefaultLoadingComponent,
  pageParams,
  page,
}) => {
  // Handle empty or null blocks
  if (!blocks || blocks.length === 0) {
    return (
      <div className={`empty-blocks ${className}`}>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">No content blocks to display.</p>
        </div>
      </div>
    )
  }

  // Filter out null/undefined blocks
  const validBlocks = blocks.filter((block) => block != null)

  if (validBlocks.length === 0) {
    return (
      <div className={`empty-blocks ${className}`}>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500">No valid content blocks found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`block-renderer ${className}`}>
      {validBlocks.map((block, index) => {
        const key = `${block.__component}-${block.id}-${index}`
        
        return (
          <BlockItem
            key={key}
            block={block}
            fallbackComponent={fallbackComponent}
            loadingComponent={loadingComponent}
            pageParams={pageParams}
            page={page}
          />
        )
      })}
    </div>
  )
}

export default BlockRenderer
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { ImageProps } from "next/image"

import { AppLocale } from "./general"

export interface LayoutProps<TParams = {}> {
  children: React.ReactNode
  params: Promise
}

export interface PageProps<TParams = {}> {
  params: Promise
  searchParams: Promise
}

export type ImageExtendedProps = Omit & {
  fallbackSrc?: string
  src: string | StaticImport
}

import { notFound } from "next/navigation"
import { ROOT_PAGE_PATH } from "@repo/shared-data"
import { setRequestLocale } from "next-intl/server"

import type { PageProps } from "@/types/next"

import { isDevelopment } from "@/lib/general-helpers"
import { getMetadataFromStrapi } from "@/lib/metadata"
import { routing } from "@/lib/navigation"
import { fetchAllPages, fetchPage } from "@/lib/strapi-api/content/server"
import { cn } from "@/lib/styles"
import { Breadcrumbs } from "@/components/elementary/Breadcrumbs"
import { Container } from "@/components/elementary/Container"
import { BlockRenderer } from "@/components/BlockRenderer"
import StrapiStructuredData from "@/components/page-builder/components/seo-utilities/StrapiStructuredData"

export async function generateStaticParams() {
  if (isDevelopment()) {
    // do not prefetch all locales when developing
    return []
  }

  const promises = routing.locales.map((locale) =>
    fetchAllPages("api::page.page", locale)
  )

  const results = await Promise.allSettled(promises)

  const params = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value.data)
    .map((page) => ({
      locale: page.locale,
      rest: [page.slug],
    }))

  return params
}

type Props = PageProps

export async function generateMetadata(props: Props) {
  const params = await props.params
  const fullPath = ROOT_PAGE_PATH + (params.rest ?? []).join("/")

  return getMetadataFromStrapi({ fullPath, locale: params.locale })
}

export default async function StrapiPage(props: Props) {
  const params = await props.params

  setRequestLocale(params.locale)

  const fullPath = ROOT_PAGE_PATH + (params.rest ?? []).join("/")
  const response = await fetchPage(fullPath, params.locale)

  const data = response?.data

  if (data?.content == null) {
    notFound()
  }

  const { content, ...restPageData } = data

  return (
    <>
      <StrapiStructuredData structuredData={data?.seo?.structuredData} />

      <main className={cn("flex w-full flex-col overflow-hidden")}>
        <Container>
          <Breadcrumbs
            breadcrumbs={response?.meta?.breadcrumbs}
            className="mt-6 mb-6"
          />
        </Container>

        <BlockRenderer
          blocks={content}
          pageParams={params}
          page={restPageData}
        />
      </main>
    </>
  )
}

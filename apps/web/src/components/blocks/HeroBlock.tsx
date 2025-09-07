import { Data } from "@repo/strapi"
import { Check } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"

export interface HeroBlockProps {
  readonly title: string
  readonly subTitle?: string
  readonly bgColor?: string
  readonly image?: Data.Component | null
  readonly links?: Data.Component[] | null
  readonly steps?: Data.Component[] | null
}

export function HeroBlock({
  title,
  subTitle,
  bgColor,
  image,
  links,
  steps,
}: HeroBlockProps) {
  return (
    <section style={{ backgroundColor: bgColor ?? "transparent" }}>
      <Container className="grid gap-6 px-4 py-8 md:grid-cols-12 lg:py-12 xl:gap-0">
        <div className="mr-auto flex w-full flex-col justify-center md:col-span-6">
          <Heading
            tag="h1"
            variant="heading1"
            className="mb-4 max-w-2xl text-center lg:text-start"
          >
            {title}
          </Heading>
          {subTitle && (
            <Paragraph className="mb-6 max-w-2xl text-center lg:text-start">
              {subTitle}
            </Paragraph>
          )}
          {steps &&
            steps.length > 0 &&
            steps.map((step: any) => (
              <div key={step.id} className="flex items-center gap-1 py-2">
                <Check className="text-primary-500" />
                <Paragraph>{step.text}</Paragraph>
              </div>
            ))}

          {links && (
            <div className="space-x flex flex-col gap-2 pt-4 lg:flex-row">
              {links.map((link: any, i: number) => (
                <StrapiLink
                  key={i}
                  component={link}
                  className="focus:ring-primary-300 bg-primary mr-3 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-center text-base font-medium text-white focus:ring-4 lg:w-fit"
                />
              ))}
            </div>
          )}
        </div>

        {image?.media && (
          <div className="hidden md:col-span-6 md:mt-0 md:flex">
            <StrapiBasicImage
              component={image}
              className="rounded-3xl object-contain"
              forcedSizes={{ height: 500 }}
            />
          </div>
        )}
      </Container>
    </section>
  )
}

HeroBlock.displayName = "HeroBlock"

export default HeroBlock

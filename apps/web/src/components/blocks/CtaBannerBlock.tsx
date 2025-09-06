import { Data } from "@repo/strapi"
import { ArrowRight, ExternalLink } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"
import { Button } from "@/components/ui/button"

export interface CtaBannerBlockProps {
  readonly title: string
  readonly description?: string
  readonly primaryButton?: {
    label: string
    href: string
    newTab?: boolean
  }
  readonly secondaryButton?: {
    label: string
    href: string
    newTab?: boolean
  }
  readonly backgroundImage?: Data.Component | null
  readonly backgroundColor?: string
  readonly textColor?: "light" | "dark"
  readonly layout?: "centered" | "split" | "image-left" | "image-right"
  readonly size?: "small" | "medium" | "large"
}

export function CtaBannerBlock({
  title,
  description,
  primaryButton,
  secondaryButton,
  backgroundImage,
  backgroundColor,
  textColor = "dark",
  layout = "centered",
  size = "medium",
}: CtaBannerBlockProps) {
  const sizeClasses = {
    small: "py-8 lg:py-12",
    medium: "py-12 lg:py-16",
    large: "py-16 lg:py-24",
  }

  const textColorClasses = {
    light: "text-white",
    dark: "text-foreground",
  }

  const renderContent = () => (
    <div className={`text-center ${layout === "split" ? "md:text-left" : ""} ${layout === "image-left" ? "md:text-left" : ""} ${layout === "image-right" ? "md:text-right" : ""}`}>
      <Heading
        tag="h2"
        variant="heading2"
        className={`mb-4 ${textColorClasses[textColor]}`}
      >
        {title}
      </Heading>
      
      {description && (
        <Paragraph
          className={`mb-6 text-lg ${textColorClasses[textColor]} ${textColor === "light" ? "text-white/90" : "text-muted-foreground"}`}
        >
          {description}
        </Paragraph>
      )}
      
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {primaryButton && (
          <Button asChild size="lg" className="group">
            <a
              href={primaryButton.href}
              target={primaryButton.newTab ? "_blank" : undefined}
              rel={primaryButton.newTab ? "noopener noreferrer" : undefined}
            >
              {primaryButton.label}
              {primaryButton.newTab ? (
                <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </a>
          </Button>
        )}
        
        {secondaryButton && (
          <Button asChild variant="outline" size="lg">
            <a
              href={secondaryButton.href}
              target={secondaryButton.newTab ? "_blank" : undefined}
              rel={secondaryButton.newTab ? "noopener noreferrer" : undefined}
            >
              {secondaryButton.label}
              {secondaryButton.newTab && (
                <ExternalLink className="ml-2 h-4 w-4" />
              )}
            </a>
          </Button>
        )}
      </div>
    </div>
  )

  const renderImage = () => 
    backgroundImage && (
      <div className={`relative ${layout === "split" ? "md:col-span-6" : ""} ${layout === "image-left" ? "md:order-first" : ""} ${layout === "image-right" ? "md:order-last" : ""}`}>
        <StrapiBasicImage
          component={backgroundImage}
          className="rounded-xl object-cover"
          forcedSizes={{ height: 300 }}
        />
      </div>
    )

  if (layout === "split" || layout === "image-left" || layout === "image-right") {
    return (
      <section
        className={sizeClasses[size]}
        style={{ backgroundColor: backgroundColor ?? "transparent" }}
      >
        <Container>
          <div className={`grid gap-8 items-center ${backgroundImage ? "md:grid-cols-12" : ""}`}>
            <div className={`${backgroundImage ? "md:col-span-6" : ""} ${layout === "image-right" ? "md:order-first" : ""}`}>
              {renderContent()}
            </div>
            {backgroundImage && (
              <div className={`md:col-span-6 ${layout === "image-left" ? "md:order-first" : ""}`}>
                <StrapiBasicImage
                  component={backgroundImage}
                  className="rounded-xl object-cover"
                  forcedSizes={{ height: 400 }}
                />
              </div>
            )}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section
      className={`relative overflow-hidden ${sizeClasses[size]}`}
      style={{ backgroundColor: backgroundColor ?? "transparent" }}
    >
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <StrapiBasicImage
            component={backgroundImage}
            className="object-cover"
            fill
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      
      <Container className="relative z-10">
        {renderContent()}
      </Container>
    </section>
  )
}

CtaBannerBlock.displayName = "CtaBannerBlock"

export default CtaBannerBlock
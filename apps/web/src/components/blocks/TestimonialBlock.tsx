import { Data } from "@repo/strapi"
import { Quote, Star } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"
import { Card, CardContent } from "@/components/ui/card"

export interface TestimonialItem {
  readonly id: number
  readonly content: string
  readonly authorName: string
  readonly authorTitle?: string
  readonly authorCompany?: string
  readonly authorImage?: Data.Component | null
  readonly rating?: number
}

export interface TestimonialBlockProps {
  readonly title?: string
  readonly subTitle?: string
  readonly testimonials: TestimonialItem[]
  readonly layout?: "grid" | "carousel" | "single"
  readonly columns?: 1 | 2 | 3
  readonly showRating?: boolean
  readonly showQuotes?: boolean
}

export function TestimonialBlock({
  title,
  subTitle,
  testimonials,
  layout = "grid",
  columns = 3,
  showRating = true,
  showQuotes = true,
}: TestimonialBlockProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
        }`}
      />
    ))
  }

  const renderTestimonial = (testimonial: TestimonialItem) => (
    <Card
      key={testimonial.id}
      className="bg-background/60 h-full border-0 backdrop-blur-sm"
    >
      <CardContent className="p-6">
        {showQuotes && <Quote className="text-primary/20 mb-4 h-8 w-8" />}

        {showRating && testimonial.rating && (
          <div className="mb-4 flex items-center gap-1">
            {renderStars(testimonial.rating)}
          </div>
        )}

        <Paragraph className="mb-6 text-base leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </Paragraph>

        <div className="flex items-center gap-3">
          {testimonial.authorImage && (
            <div className="h-12 w-12 overflow-hidden rounded-full">
              <StrapiBasicImage
                component={testimonial.authorImage}
                className="h-full w-full object-cover"
                forcedSizes={{ width: 48, height: 48 }}
              />
            </div>
          )}
          <div>
            <p className="text-foreground font-semibold">
              {testimonial.authorName}
            </p>
            {(testimonial.authorTitle || testimonial.authorCompany) && (
              <p className="text-muted-foreground text-sm">
                {testimonial.authorTitle}
                {testimonial.authorTitle && testimonial.authorCompany && " at "}
                {testimonial.authorCompany}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="py-12 lg:py-20">
      <Container>
        {(title || subTitle) && (
          <div className="mb-12 text-center">
            {title && (
              <Heading tag="h2" variant="heading2" className="mb-4">
                {title}
              </Heading>
            )}
            {subTitle && (
              <Paragraph className="text-muted-foreground mx-auto max-w-3xl">
                {subTitle}
              </Paragraph>
            )}
          </div>
        )}

        {layout === "single" && testimonials.length > 0 && testimonials[0] ? (
          <div className="mx-auto max-w-4xl">
            {renderTestimonial(testimonials[0])}
          </div>
        ) : layout === "grid" ? (
          <div className={`grid gap-6 ${gridCols[columns]} lg:gap-8`}>
            {testimonials.map(renderTestimonial)}
          </div>
        ) : (
          // Carousel layout - for now, we'll render as grid
          // In a real implementation, you might want to add carousel functionality
          <div className={`grid gap-6 ${gridCols[columns]} lg:gap-8`}>
            {testimonials.map(renderTestimonial)}
          </div>
        )}
      </Container>
    </section>
  )
}

TestimonialBlock.displayName = "TestimonialBlock"

export default TestimonialBlock

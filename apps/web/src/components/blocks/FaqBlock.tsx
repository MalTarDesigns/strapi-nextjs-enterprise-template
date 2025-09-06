import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface FaqItem {
  readonly id: number
  readonly question: string
  readonly answer: string
}

export interface FaqBlockProps {
  readonly title?: string
  readonly subTitle?: string
  readonly faqs: FaqItem[]
  readonly defaultOpenItems?: string[]
  readonly allowMultipleOpen?: boolean
  readonly maxWidth?: "narrow" | "medium" | "wide" | "full"
}

export function FaqBlock({
  title,
  subTitle,
  faqs,
  defaultOpenItems,
  allowMultipleOpen = false,
  maxWidth = "medium",
}: FaqBlockProps) {
  const maxWidthClasses = {
    narrow: "max-w-2xl",
    medium: "max-w-4xl",
    wide: "max-w-6xl",
    full: "max-w-none",
  }

  return (
    <section className="py-12 lg:py-20">
      <Container>
        <div className={`mx-auto ${maxWidthClasses[maxWidth]}`}>
          {(title || subTitle) && (
            <div className="mb-12 text-center">
              {title && (
                <Heading tag="h2" variant="heading2" className="mb-4">
                  {title}
                </Heading>
              )}
              {subTitle && (
                <Paragraph className="text-muted-foreground max-w-3xl mx-auto">
                  {subTitle}
                </Paragraph>
              )}
            </div>
          )}

          <Accordion
            type={allowMultipleOpen ? "multiple" : "single"}
            collapsible
            defaultValue={defaultOpenItems}
            className="w-full space-y-2"
          >
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={`item-${faq.id}`}
                className="border border-border/50 rounded-lg px-6 bg-background/50 backdrop-blur-sm"
              >
                <AccordionTrigger className="py-4 text-left text-base font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 pt-0">
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-gray">
                    <Paragraph className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </Paragraph>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}

// Variant that works with Strapi accordion components
export interface StrapiFaqBlockProps {
  readonly title?: string
  readonly subTitle?: string
  readonly accordions: Data.Component[]
  readonly defaultOpenItems?: string[]
  readonly allowMultipleOpen?: boolean
  readonly maxWidth?: "narrow" | "medium" | "wide" | "full"
}

export function StrapiFaqBlock({
  title,
  subTitle,
  accordions,
  defaultOpenItems,
  allowMultipleOpen = false,
  maxWidth = "medium",
}: StrapiFaqBlockProps) {
  // Transform Strapi accordion components to FaqItem format
  const faqs: FaqItem[] = accordions.map((accordion: any, index: number) => ({
    id: accordion.id || index,
    question: accordion.question,
    answer: accordion.answer,
  }))

  return (
    <FaqBlock
      title={title}
      subTitle={subTitle}
      faqs={faqs}
      defaultOpenItems={defaultOpenItems}
      allowMultipleOpen={allowMultipleOpen}
      maxWidth={maxWidth}
    />
  )
}

FaqBlock.displayName = "FaqBlock"
StrapiFaqBlock.displayName = "StrapiFaqBlock"

export default FaqBlock
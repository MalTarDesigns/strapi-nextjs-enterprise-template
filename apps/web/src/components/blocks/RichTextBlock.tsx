import { Data } from "@repo/strapi"

import { Container } from "@/components/elementary/Container"
import CkEditorSSRRenderer from "@/components/elementary/ck-editor/CkEditorSSRRenderer"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"

export interface RichTextBlockProps {
  readonly content: string
  readonly title?: string
  readonly subTitle?: string
  readonly containerWidth?: "full" | "narrow" | "medium"
  readonly textAlign?: "left" | "center" | "right"
  readonly className?: string
}

export function RichTextBlock({
  content,
  title,
  subTitle,
  containerWidth = "medium",
  textAlign = "left",
  className,
}: RichTextBlockProps) {
  const containerClasses = {
    full: "max-w-none",
    narrow: "max-w-3xl mx-auto",
    medium: "max-w-4xl mx-auto",
  }

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <section className={`py-12 lg:py-20 ${className || ""}`}>
      <Container>
        <div className={`${containerClasses[containerWidth]} ${textAlignClasses[textAlign]}`}>
          {(title || subTitle) && (
            <div className="mb-8">
              {title && (
                <Heading 
                  tag="h2" 
                  variant="heading2" 
                  className={`mb-4 ${textAlignClasses[textAlign]}`}
                >
                  {title}
                </Heading>
              )}
              {subTitle && (
                <Paragraph className={`text-muted-foreground ${textAlignClasses[textAlign]}`}>
                  {subTitle}
                </Paragraph>
              )}
            </div>
          )}
          
          <div className={`prose prose-gray max-w-none dark:prose-invert ${textAlignClasses[textAlign]}`}>
            <CkEditorSSRRenderer htmlContent={content} />
          </div>
        </div>
      </Container>
    </section>
  )
}

// Alternative component for Strapi component usage
export interface StrapiRichTextBlockProps {
  readonly component: Data.Component
  readonly title?: string
  readonly subTitle?: string
  readonly containerWidth?: "full" | "narrow" | "medium"
  readonly textAlign?: "left" | "center" | "right"
  readonly className?: string
}

export function StrapiRichTextBlock({
  component,
  title,
  subTitle,
  containerWidth = "medium",
  textAlign = "left",
  className,
}: StrapiRichTextBlockProps) {
  return (
    <RichTextBlock
      content={component.content}
      title={title}
      subTitle={subTitle}
      containerWidth={containerWidth}
      textAlign={textAlign}
      className={className}
    />
  )
}

RichTextBlock.displayName = "RichTextBlock"
StrapiRichTextBlock.displayName = "StrapiRichTextBlock"

export default RichTextBlock
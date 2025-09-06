import { Data } from "@repo/strapi"
import { Check, X, Star, Zap } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface PricingFeature {
  readonly id: number
  readonly name: string
  readonly included: boolean
  readonly description?: string
}

export interface PricingPlan {
  readonly id: number
  readonly name: string
  readonly description?: string
  readonly price: number
  readonly currency?: string
  readonly billingPeriod?: string
  readonly originalPrice?: number
  readonly features: PricingFeature[]
  readonly ctaLabel?: string
  readonly ctaLink?: string
  readonly ctaNewTab?: boolean
  readonly isPopular?: boolean
  readonly badge?: string
}

export interface PricingTableBlockProps {
  readonly title?: string
  readonly subTitle?: string
  readonly plans: PricingPlan[]
  readonly columns?: 2 | 3 | 4
  readonly showAnnualDiscount?: boolean
  readonly highlightPopular?: boolean
}

export function PricingTableBlock({
  title,
  subTitle,
  plans,
  columns = 3,
  showAnnualDiscount = false,
  highlightPopular = true,
}: PricingTableBlockProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3", 
    4: "md:grid-cols-4",
  }

  const formatPrice = (price: number, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    }).format(price)
  }

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
              <Paragraph className="text-muted-foreground max-w-3xl mx-auto">
                {subTitle}
              </Paragraph>
            )}
          </div>
        )}

        <div className={`grid gap-8 ${gridCols[columns]} lg:gap-8`}>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative h-full transition-all duration-300 hover:shadow-lg ${
                highlightPopular && plan.isPopular
                  ? "border-2 border-primary scale-105 shadow-xl"
                  : "border border-border/50"
              }`}
            >
              {highlightPopular && plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    {plan.badge || "Most Popular"}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heading tag="h3" variant="heading4">
                    {plan.name}
                  </Heading>
                  {plan.isPopular && !highlightPopular && (
                    <Zap className="h-4 w-4 text-primary fill-current" />
                  )}
                </div>
                
                {plan.description && (
                  <Paragraph className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </Paragraph>
                )}

                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    {plan.billingPeriod && (
                      <span className="text-sm text-muted-foreground">
                        /{plan.billingPeriod}
                      </span>
                    )}
                  </div>
                  
                  {plan.originalPrice && plan.originalPrice > plan.price && (
                    <div className="mt-1">
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(plan.originalPrice, plan.currency)}
                      </span>
                      <span className="ml-2 text-sm font-medium text-green-600">
                        Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {plan.ctaLabel && (
                  <Button 
                    asChild 
                    className={`w-full ${
                      highlightPopular && plan.isPopular 
                        ? "bg-primary hover:bg-primary/90" 
                        : ""
                    }`}
                  >
                    <a
                      href={plan.ctaLink || "#"}
                      target={plan.ctaNewTab ? "_blank" : undefined}
                      rel={plan.ctaNewTab ? "noopener noreferrer" : undefined}
                    >
                      {plan.ctaLabel}
                    </a>
                  </Button>
                )}
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      <div>
                        <span className={`text-sm ${
                          feature.included 
                            ? "text-foreground" 
                            : "text-muted-foreground line-through"
                        }`}>
                          {feature.name}
                        </span>
                        {feature.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {showAnnualDiscount && (
          <div className="mt-8 text-center">
            <Paragraph className="text-sm text-muted-foreground">
              💰 Save up to 20% with annual billing
            </Paragraph>
          </div>
        )}
      </Container>
    </section>
  )
}

PricingTableBlock.displayName = "PricingTableBlock"

export default PricingTableBlock
import { Data } from "@repo/strapi"
import {
  CheckCircle,
  Clock,
  Globe,
  Heart,
  Lightbulb,
  Lock,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const iconMap = {
  zap: Zap,
  shield: Shield,
  users: Users,
  smartphone: Smartphone,
  clock: Clock,
  star: Star,
  checkCircle: CheckCircle,
  trendingUp: TrendingUp,
  globe: Globe,
  lock: Lock,
  heart: Heart,
  lightbulb: Lightbulb,
}

export interface FeatureItem {
  readonly id: number
  readonly title: string
  readonly description: string
  readonly icon?: keyof typeof iconMap
  readonly image?: Data.Component | null
  readonly link?: Data.Component | null
}

export interface FeatureGridBlockProps {
  readonly title?: string
  readonly subTitle?: string
  readonly features: FeatureItem[]
  readonly columns?: 2 | 3 | 4
  readonly showIcons?: boolean
}

export function FeatureGridBlock({
  title,
  subTitle,
  features,
  columns = 3,
  showIcons = true,
}: FeatureGridBlockProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
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
              <Paragraph className="text-muted-foreground mx-auto max-w-3xl">
                {subTitle}
              </Paragraph>
            )}
          </div>
        )}

        <div
          className={`grid gap-6 sm:grid-cols-2 ${gridCols[columns]} lg:gap-8`}
        >
          {features.map((feature) => {
            const IconComponent = feature.icon ? iconMap[feature.icon] : null

            return (
              <Card
                key={feature.id}
                className="group bg-background/60 hover:bg-background/80 h-full border-0 backdrop-blur-sm transition-all hover:shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    {showIcons && (IconComponent || feature.image) && (
                      <div className="flex-shrink-0">
                        {IconComponent ? (
                          <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg transition-colors">
                            <IconComponent className="h-6 w-6" />
                          </div>
                        ) : feature.image ? (
                          <div className="h-12 w-12 overflow-hidden rounded-lg">
                            <StrapiBasicImage
                              component={feature.image}
                              className="h-full w-full object-cover"
                              forcedSizes={{ width: 48, height: 48 }}
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <Heading tag="h3" variant="heading4" className="mb-2">
                        {feature.title}
                      </Heading>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Paragraph className="text-muted-foreground mb-4">
                    {feature.description}
                  </Paragraph>
                  {feature.link && (
                    <StrapiLink
                      component={feature.link}
                      className="text-primary inline-flex items-center text-sm font-medium hover:underline"
                    />
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

FeatureGridBlock.displayName = "FeatureGridBlock"

export default FeatureGridBlock

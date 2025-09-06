import { Data } from "@repo/strapi"

import { removeThisWhenYouNeedMe } from "@/lib/general-helpers"

import { BasicImageProps, StrapiBasicImage } from "./StrapiBasicImage"
import { StrapiLink, StrapiLinkProps } from "./StrapiLink"

interface Props {
  readonly component: Data.Component | undefined | null
  readonly imageProps?: Omit
  readonly linkProps?: Omit
}

export function StrapiImageWithLink({
  component,
  imageProps,
  linkProps,
}: Props) {
  removeThisWhenYouNeedMe("StrapiImageWithLink")

  return (
    <StrapiLink component={component?.link} {...linkProps}>
      <StrapiBasicImage component={component?.image} {...imageProps} />
    </StrapiLink>
  )
}

StrapiImageWithLink.displayName = "StrapiImageWithLink"

export default StrapiImageWithLink

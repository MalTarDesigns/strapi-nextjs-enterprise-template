import { useState } from "react"
import { Data } from "@repo/strapi"
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react"

import { Container } from "@/components/elementary/Container"
import { StrapiBasicImage } from "@/components/page-builder/components/utilities/StrapiBasicImage"
import StrapiLink from "@/components/page-builder/components/utilities/StrapiLink"
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export interface GalleryImage {
  readonly id: number
  readonly image: Data.Component
  readonly title?: string
  readonly description?: string
  readonly link?: Data.Component | null
}

export interface ImageGalleryBlockProps {
  readonly title?: string
  readonly subTitle?: string
  readonly images: GalleryImage[]
  readonly columns?: 2 | 3 | 4 | 5
  readonly aspectRatio?: "square" | "landscape" | "portrait" | "auto"
  readonly showTitles?: boolean
  readonly showDescriptions?: boolean
  readonly enableLightbox?: boolean
  readonly spacing?: "tight" | "normal" | "loose"
}

export function ImageGalleryBlock({
  title,
  subTitle,
  images,
  columns = 3,
  aspectRatio = "square",
  showTitles = false,
  showDescriptions = false,
  enableLightbox = true,
  spacing = "normal",
}: ImageGalleryBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
    5: "md:grid-cols-5",
  }

  const aspectRatioClasses = {
    square: "aspect-square",
    landscape: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  }

  const spacingClasses = {
    tight: "gap-2",
    normal: "gap-4",
    loose: "gap-6",
  }

  const openLightbox = (index: number) => {
    if (enableLightbox) {
      setCurrentImageIndex(index)
      setLightboxOpen(true)
    }
  }

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    )
  }

  const currentImage = images[currentImageIndex]

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

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols[columns]} ${spacingClasses[spacing]}`}>
          {images.map((galleryImage, index) => (
            <div key={galleryImage.id} className="group relative">
              <div 
                className={`relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 ${aspectRatioClasses[aspectRatio]} ${
                  enableLightbox ? "cursor-pointer" : ""
                }`}
                onClick={() => openLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <StrapiBasicImage
                  component={galleryImage.image}
                  className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                    aspectRatio === "auto" ? "h-auto w-full" : "h-full w-full"
                  }`}
                  forcedSizes={aspectRatio === "auto" ? undefined : { width: 400, height: 400 }}
                />
                
                {enableLightbox && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/20">
                    <Expand className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" size={24} />
                  </div>
                )}
              </div>
              
              {(showTitles || showDescriptions || galleryImage.link) && (
                <div className="mt-3">
                  {showTitles && galleryImage.title && (
                    <h3 className="font-semibold text-foreground mb-1">
                      {galleryImage.title}
                    </h3>
                  )}
                  {showDescriptions && galleryImage.description && (
                    <Paragraph className="text-sm text-muted-foreground mb-2">
                      {galleryImage.description}
                    </Paragraph>
                  )}
                  {galleryImage.link && (
                    <StrapiLink
                      component={galleryImage.link}
                      className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {enableLightbox && (
          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <DialogContent className="max-w-7xl w-full p-0 bg-black/90 border-none">
              <div className="relative flex items-center justify-center min-h-[60vh] max-h-[90vh]">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                  onClick={() => setLightboxOpen(false)}
                >
                  <X size={24} />
                </Button>
                
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20"
                      onClick={previousImage}
                    >
                      <ChevronLeft size={32} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-40 text-white hover:bg-white/20"
                      onClick={nextImage}
                    >
                      <ChevronRight size={32} />
                    </Button>
                  </>
                )}
                
                <div className="relative w-full h-full flex items-center justify-center p-8">
                  <StrapiBasicImage
                    component={currentImage?.image}
                    className="max-w-full max-h-full object-contain"
                    useNativeNextImageOnly
                  />
                </div>
                
                {(currentImage?.title || currentImage?.description) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    {currentImage.title && (
                      <h3 className="text-xl font-semibold mb-2">
                        {currentImage.title}
                      </h3>
                    )}
                    {currentImage.description && (
                      <p className="text-white/90">
                        {currentImage.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </Container>
    </section>
  )
}

ImageGalleryBlock.displayName = "ImageGalleryBlock"

export default ImageGalleryBlock
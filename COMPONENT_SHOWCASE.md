# Component Showcase - UI Block Library

## Overview
This document provides detailed examples and usage patterns for all 8 UI block components in the Strapi Next.js starter template. Each component is designed to be flexible, accessible, and responsive.

---

## 1. Hero Section (`StrapiHero`)

### Visual Description
The Hero component creates an impactful landing section with a 2-column layout featuring:
- Left column: Title, subtitle, feature list with checkmarks, and CTA buttons
- Right column: Featured image with rounded corners
- Full-width background color support
- Mobile-first responsive design

### Component Structure
```tsx
// File: apps/web/src/components/page-builder/components/sections/StrapiHero.tsx
export function StrapiHero({ component }: { readonly component: Data.Component }) {
  return (
    <section style={{ backgroundColor: component.bgColor ?? "transparent" }}>
      <Container className="grid gap-6 px-4 py-8 md:grid-cols-12 lg:py-12 xl:gap-0">
        <div className="mr-auto flex w-full flex-col justify-center md:col-span-6">
          <Heading tag="h1" variant="heading1" className="mb-4 max-w-2xl text-center lg:text-start">
            {component.title}
          </Heading>
          {/* Additional content */}
        </div>
        {component.image?.media && (
          <div className="hidden md:col-span-6 md:mt-0 md:flex">
            <StrapiBasicImage component={component.image} className="rounded-3xl object-contain" forcedSizes={{ height: 500 }} />
          </div>
        )}
      </Container>
    </section>
  )
}
```

### Usage Examples

#### Basic Hero
```json
{
  "__component": "sections.hero",
  "title": "Transform Your Business Today",
  "subTitle": "Leverage cutting-edge technology to accelerate growth and streamline operations.",
  "bgColor": "#f8fafc"
}
```

#### Hero with Features and CTA
```json
{
  "__component": "sections.hero",
  "title": "Complete Solution for Modern Teams",
  "subTitle": "Everything you need to build, deploy, and scale your applications.",
  "bgColor": "#1e293b",
  "steps": [
    { "id": "1", "text": "Lightning-fast development" },
    { "id": "2", "text": "Enterprise-grade security" },
    { "id": "3", "text": "24/7 support included" }
  ],
  "links": [
    { "url": "/get-started", "text": "Get Started Free", "variant": "primary" },
    { "url": "/demo", "text": "Watch Demo", "variant": "secondary" }
  ],
  "image": { "media": { "url": "/hero-image.jpg", "alt": "Platform Dashboard" } }
}
```

### Responsive Behavior
- **Mobile**: Single column, centered text, hidden image
- **Tablet**: Two columns, left-aligned text, visible image
- **Desktop**: Enhanced spacing, larger typography

---

## 2. Image Carousel (`StrapiCarousel`)

### Visual Description
A responsive image carousel featuring:
- Multiple images per view (1 mobile, 2 tablet, 3 desktop)
- Previous/next navigation arrows
- Touch/swipe support
- Smooth transitions
- Consistent image sizing (384px height)

### Component Structure
```tsx
// File: apps/web/src/components/page-builder/components/sections/StrapiCarousel.tsx
export function StrapiCarousel({ component }: { readonly component: Data.Component }) {
  return (
    <section>
      <Container className="flex justify-center px-4 py-8">
        <Carousel className="w-full">
          <CarouselContent className="-ml-1">
            {component.images?.map((item, index) => (
              <CarouselItem key={String(item.id) + index} className="px-2 pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="relative h-96 w-full lg:w-96">
                  <StrapiBasicImage component={item.image} className="object-contain" fill />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </Container>
    </section>
  )
}
```

### Usage Examples

#### Product Gallery
```json
{
  "__component": "sections.carousel",
  "images": [
    { "id": "1", "image": { "media": { "url": "/product-1.jpg", "alt": "Product View 1" } } },
    { "id": "2", "image": { "media": { "url": "/product-2.jpg", "alt": "Product View 2" } } },
    { "id": "3", "image": { "media": { "url": "/product-3.jpg", "alt": "Product View 3" } } },
    { "id": "4", "image": { "media": { "url": "/product-4.jpg", "alt": "Product View 4" } } }
  ]
}
```

#### Client Testimonials with Photos
```json
{
  "__component": "sections.carousel",
  "images": [
    { "id": "1", "image": { "media": { "url": "/client-1.jpg", "alt": "Happy Client" } } },
    { "id": "2", "image": { "media": { "url": "/client-2.jpg", "alt": "Satisfied Customer" } } },
    { "id": "3", "image": { "media": { "url": "/client-3.jpg", "alt": "Success Story" } } }
  ]
}
```

---

## 3. FAQ Section (`StrapiFaq`)

### Visual Description
An accessible accordion-style FAQ section with:
- Centered layout with title and subtitle
- Collapsible question/answer pairs
- Smooth expand/collapse animations
- Single-item expansion (radio-style)
- Rich text support in answers

### Component Structure
```tsx
// File: apps/web/src/components/page-builder/components/sections/StrapiFaq.tsx
export function StrapiFaq({ component }: { readonly component: Data.Component }) {
  return (
    <section>
      <Container className="py-8">
        <div className="flex flex-col items-center">
          <h2 className="mb-2 text-center text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl">
            {component.title}
          </h2>
          <p className="mb-6 text-center tracking-tight text-gray-900">
            {component.subTitle}
          </p>
          {component.accordions && (
            <div className="w-full">
              <Accordion type="single" collapsible className="w-full">
                {component.accordions.map((x) => (
                  <AccordionItem key={x.id} value={x.id.toString()}>
                    <AccordionTrigger>{x.question}</AccordionTrigger>
                    <AccordionContent>{x.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
```

### Usage Examples

#### Product FAQ
```json
{
  "__component": "sections.faq",
  "title": "Frequently Asked Questions",
  "subTitle": "Everything you need to know about our product",
  "accordions": [
    {
      "id": "1",
      "question": "What is included in the starter package?",
      "answer": "The starter package includes full access to all components, documentation, and 6 months of updates."
    },
    {
      "id": "2",
      "question": "Do you offer technical support?",
      "answer": "Yes! We provide email support within 24 hours and priority support for enterprise customers."
    },
    {
      "id": "3",
      "question": "Can I customize the design system?",
      "answer": "Absolutely. The design system is built with CSS custom properties, making it easy to customize colors, typography, and spacing."
    }
  ]
}
```

#### Support Center FAQ
```json
{
  "__component": "sections.faq",
  "title": "Support Center",
  "subTitle": "Quick answers to common questions",
  "accordions": [
    {
      "id": "1",
      "question": "How do I reset my password?",
      "answer": "Click on 'Forgot Password' on the login page and follow the instructions sent to your email."
    },
    {
      "id": "2",
      "question": "How can I upgrade my plan?",
      "answer": "Visit your account settings and select 'Upgrade Plan' to see available options."
    }
  ]
}
```

---

## 4. Newsletter Form (`StrapiNewsletterForm`)

### Visual Description
A two-column newsletter subscription section featuring:
- Left column: Title and description
- Right column: Email input and subscribe button
- GDPR compliance link
- Responsive layout (stacks on mobile)
- Light blue background styling

### Component Structure
```tsx
// File: apps/web/src/components/page-builder/components/forms/StrapiNewsletterForm.tsx
export function StrapiNewsletterForm({ component }: { readonly component: Data.Component }) {
  return (
    <div className="bg-blue-light pb-10">
      <Container className="flex flex-col justify-between gap-y-10 lg:flex-row">
        <div className="flex w-full max-w-[510px] flex-1 flex-col gap-10">
          <h1 className="text-3xl font-bold">{component.title}</h1>
          <p>{component.description}</p>
        </div>
        <div className="flex w-full max-w-[560px] flex-1 items-end align-bottom">
          <div className="w-fll mt-1 flex w-full flex-col gap-1">
            <NewsletterForm />
            {component.gdpr?.href && (
              <AppLink openExternalInNewTab={Boolean(component.gdpr.newTab)} className="text-blue-700 underline" href={component.gdpr.href}>
                {component.gdpr.label}
              </AppLink>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
```

### Usage Examples

#### Marketing Newsletter
```json
{
  "__component": "forms.newsletter-form",
  "title": "Stay Updated",
  "description": "Get the latest news, updates, and exclusive offers delivered straight to your inbox.",
  "gdpr": {
    "href": "/privacy-policy",
    "label": "Privacy Policy",
    "newTab": true
  }
}
```

#### Product Updates
```json
{
  "__component": "forms.newsletter-form",
  "title": "Product Updates",
  "description": "Be the first to know about new features, improvements, and product releases.",
  "gdpr": {
    "href": "/terms",
    "label": "Terms & Conditions",
    "newTab": false
  }
}
```

---

## 5. Contact Form (`StrapiContactForm`)

### Visual Description
A comprehensive contact form with:
- Multiple input fields (name, email, message)
- Form validation and error handling
- ReCAPTCHA integration for spam protection
- Success/error state management
- Responsive design

### Usage Examples

#### Basic Contact Form
```json
{
  "__component": "forms.contact-form",
  "title": "Get In Touch",
  "description": "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  "submitText": "Send Message",
  "fields": [
    { "name": "firstName", "label": "First Name", "type": "text", "required": true },
    { "name": "lastName", "label": "Last Name", "type": "text", "required": true },
    { "name": "email", "label": "Email Address", "type": "email", "required": true },
    { "name": "subject", "label": "Subject", "type": "text", "required": false },
    { "name": "message", "label": "Message", "type": "textarea", "required": true }
  ]
}
```

---

## 6. Heading with CTA (`StrapiHeadingWithCTAButton`)

### Visual Description
A centered content section with:
- Large heading text
- Optional subtitle
- Prominent call-to-action button
- Responsive typography scaling

### Usage Examples

#### Call to Action Section
```json
{
  "__component": "sections.heading-with-cta-button",
  "title": "Ready to Get Started?",
  "subTitle": "Join thousands of satisfied customers today",
  "button": {
    "text": "Start Free Trial",
    "url": "/signup",
    "variant": "primary"
  }
}
```

---

## 7. Horizontal Images (`StrapiHorizontalImages`)

### Visual Description
A side-by-side image layout perfect for:
- Before/after comparisons
- Product variations
- Feature demonstrations
- Visual storytelling

### Usage Examples

#### Product Comparison
```json
{
  "__component": "sections.horizontal-images",
  "images": [
    {
      "id": "1",
      "image": { "media": { "url": "/before.jpg", "alt": "Before" } },
      "caption": "Before optimization"
    },
    {
      "id": "2", 
      "image": { "media": { "url": "/after.jpg", "alt": "After" } },
      "caption": "After optimization"
    }
  ]
}
```

---

## 8. Image with CTA (`StrapiImageWithCTAButton`)

### Visual Description
Combines an image with call-to-action functionality:
- Flexible image positioning
- Overlay text and button support
- Responsive image sizing
- Multiple layout options

### Usage Examples

#### Feature Highlight
```json
{
  "__component": "sections.image-with-cta-button",
  "image": { "media": { "url": "/feature-image.jpg", "alt": "Amazing Feature" } },
  "title": "Revolutionary Feature",
  "description": "Discover how this game-changing feature can transform your workflow.",
  "button": {
    "text": "Learn More",
    "url": "/features",
    "variant": "primary"
  },
  "layout": "image-right"
}
```

---

## 9. Animated Logo Row (`StrapiAnimatedLogoRow`)

### Visual Description
A horizontal showcase of brand logos with:
- Smooth scrolling animation
- Responsive logo sizing
- Client/partner showcase functionality
- Infinite scroll effect

### Usage Examples

#### Client Showcase
```json
{
  "__component": "sections.animated-logo-row",
  "title": "Trusted by Industry Leaders",
  "logos": [
    { "id": "1", "image": { "media": { "url": "/logo-1.png", "alt": "Company 1" } } },
    { "id": "2", "image": { "media": { "url": "/logo-2.png", "alt": "Company 2" } } },
    { "id": "3", "image": { "media": { "url": "/logo-3.png", "alt": "Company 3" } } }
  ],
  "animationSpeed": "slow"
}
```

---

## Component Integration

### Page Builder Registration
All components are registered in the main page builder:

```tsx
// File: apps/web/src/components/page-builder/index.tsx
export const PageContentComponents: {
  [K in UID.Component]?: React.ComponentType
} = {
  // Sections
  "sections.hero": StrapiHero,
  "sections.carousel": StrapiCarousel,
  "sections.faq": StrapiFaq,
  "sections.heading-with-cta-button": StrapiHeadingWithCTAButton,
  "sections.horizontal-images": StrapiHorizontalImages,
  "sections.image-with-cta-button": StrapiImageWithCTAButton,
  "sections.animated-logo-row": StrapiAnimatedLogoRow,
  
  // Forms
  "forms.contact-form": StrapiContactForm,
  "forms.newsletter-form": StrapiNewsletterForm,
  
  // Utilities
  "utilities.ck-editor-content": StrapiCkEditorContent,
}
```

### Dynamic Rendering
Components are dynamically rendered based on Strapi content:

```tsx
{pageData.content?.map((component, index) => {
  const Component = PageContentComponents[component.__component]
  if (!Component) return null
  
  return <Component key={index} component={component} />
})}
```

## Accessibility Features

### Built-in Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmark elements
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: ARIA labels and descriptions where needed
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Visible focus indicators and logical tab order

### Form Accessibility
- **Label Association**: Proper label-input relationships
- **Error Handling**: Clear error messages and validation feedback
- **Required Fields**: Visual and programmatic indication of required fields

## Performance Considerations

### Image Optimization
- **Next.js Image**: Automatic WebP conversion and lazy loading
- **Responsive Images**: Multiple sizes for different viewports
- **Placeholder**: Blur placeholder during loading

### Code Splitting
- **Component Level**: Each block component is separately bundled
- **Dynamic Imports**: Components loaded only when needed
- **Tree Shaking**: Unused code automatically removed

### CSS Performance
- **CSS Custom Properties**: Runtime theming without JavaScript
- **Minimal CSS**: Only necessary styles included
- **Critical CSS**: Above-the-fold styles prioritized

---

This component showcase provides all the necessary information to effectively use and customize the UI block components in your Strapi Next.js application.
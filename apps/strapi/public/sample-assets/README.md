# Sample Assets Directory

This directory contains sample assets used by the seed script to populate the database with realistic content.

## Directory Structure

```
sample-assets/
├── images/
│   ├── hero/
│   │   └── hero-bg.jpg              # Hero section background
│   ├── features/
│   │   ├── typescript-feature.jpg   # TypeScript support illustration
│   │   ├── ui-components.jpg        # UI components showcase
│   │   └── api-development.jpg      # API development workflow
│   ├── testimonials/
│   │   └── team-collaboration.jpg   # Team collaboration image
│   ├── carousel/
│   │   ├── dashboard-ui.jpg         # Modern dashboard interface
│   │   ├── mobile-design.jpg        # Mobile-first responsive design
│   │   └── code-editor.jpg          # Code editor with TypeScript
│   └── logos/
│       ├── company-logo.png         # Main company logo
│       ├── favicon.ico              # Site favicon
│       └── partners/                # Partner/client logos
│           ├── techcorp.png
│           ├── innovateio.png
│           ├── startupxyz.png
│           ├── devstudio.png
│           └── cloudtech.png
└── documents/
    ├── sample-blog-content.md       # Additional blog post content
    └── legal/
        ├── privacy-policy.md
        ├── terms-of-service.md
        └── cookie-policy.md
```

## Asset Requirements

### Images
- **Format**: JPG/PNG for photos, PNG for logos with transparency
- **Hero images**: 1920x1080px (16:9 aspect ratio)
- **Feature images**: 400x300px (4:3 aspect ratio)
- **Carousel images**: 800x600px (4:3 aspect ratio)
- **Logos**: Various sizes, maintain aspect ratio
- **Optimization**: Compressed for web use (use tools like TinyPNG)

### Placeholder Services Used

The seed script uses placeholder services when actual images are not available:

1. **Unsplash**: High-quality stock photos
   - `https://images.unsplash.com/photo-ID?w=WIDTH&h=HEIGHT&fit=crop`
   
2. **Placeholder.com**: Simple colored placeholders
   - `https://via.placeholder.com/WIDTHxHEIGHT/COLOR/TEXTCOLOR?text=TEXT`

## Adding Your Own Assets

To use custom assets instead of placeholders:

1. **Add images** to the appropriate subdirectories
2. **Update the seed script** (`scripts/seed.ts`) to reference your local files
3. **Upload to Strapi** media library during seeding

Example of updating the seed script:

```typescript
// Instead of fallback URLs, use local files
const createHeroBlock = (): ComponentData => ({
  __component: 'sections.hero',
  // ... other properties
  image: {
    media: '/sample-assets/images/hero/hero-bg.jpg', // Local path
    alt: 'Hero background showcasing modern web development',
    width: 1920,
    height: 1080,
    fallbackSrc: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=1080&fit=crop'
  },
  // ...
});
```

## Media Upload Integration

For production use, integrate with your media storage solution:

- **AWS S3**: Configure Strapi S3 provider
- **Cloudinary**: Use Cloudinary provider plugin
- **Local uploads**: Ensure proper file permissions

## SEO-Optimized Images

All sample images include:
- **Descriptive alt text** for accessibility
- **Appropriate dimensions** for their use case
- **Compressed file sizes** for performance
- **Responsive sizing** configuration

## Legal Considerations

- Use only images with appropriate licensing
- Provide attribution where required
- Consider using your own branded assets for production
- Replace placeholder content with real content before launch

## Performance Tips

- **Lazy loading**: Implement for below-the-fold images
- **WebP format**: Use modern image formats when possible
- **Responsive images**: Serve appropriate sizes for different devices
- **CDN**: Use a CDN for faster image delivery

## Running the Seed Script

After adding your assets, run the seed script:

```bash
# Start database if not running
pnpm run:db

# Run the seed script
pnpm seed

# Or do both in one command
pnpm seed:dev
```

The script will create all content types with references to these sample assets, giving you a fully populated application ready for development and demonstration.
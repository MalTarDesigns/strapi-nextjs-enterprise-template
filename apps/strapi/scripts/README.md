# Database Seeding Scripts

This directory contains scripts for populating your Strapi database with sample content.

## Seed Script (`seed.ts`)

The comprehensive seed script creates a fully functional website with:

### Content Types Created

1. **Site Configuration** (`api::site.site`)
   - Site name and branding
   - Domain configuration 
   - Theme tokens (colors, fonts, spacing, etc.)
   - Logo and favicon references

2. **Navigation Structure** (`api::navigation-item.navigation-item`)
   - Hierarchical menu items
   - Top-level and sub-navigation
   - Proper ordering and relationships

3. **Homepage** (`api::page.page`)
   - 10 different content blocks showcasing all component types:
     - Hero section with background image and CTAs
     - Feature grid with images and descriptions
     - Rich text content with MDX formatting
     - Testimonial section with team image
     - Image carousel with multiple slides
     - FAQ accordion with common questions
     - Animated logo row for partners/clients
     - Contact form with GDPR compliance
     - Newsletter signup form
     - Final call-to-action section

4. **Additional Pages** (`api::page.page`)
   - Features page
   - Documentation page  
   - Contact page
   - All with SEO metadata and structured content

5. **Blog Posts** (`api::post.post`)
   - 4 comprehensive articles with realistic content:
     - "Getting Started with Modern Web Development"
     - "Building Scalable APIs with Strapi"  
     - "Next.js Performance Optimization Strategies"
     - "Advanced TypeScript Patterns for React Applications"
   - Rich HTML content with code examples
   - Proper SEO metadata and excerpts

6. **Navigation Components**
   - **Navbar** (`api::navbar.navbar`) with logo and main navigation links
   - **Footer** (`api::footer.footer`) with organized link sections and legal pages

### Component Types Used

The seed script demonstrates all available Strapi components:

- `sections.hero` - Hero banners with background images and CTAs
- `sections.horizontal-images` - Feature grids and image galleries
- `sections.image-with-cta-button` - Testimonials and promotional sections
- `sections.faq` - FAQ accordions with questions and answers
- `sections.heading-with-cta-button` - Section headers with call-to-actions
- `sections.carousel` - Image carousels with navigation
- `sections.animated-logo-row` - Partner/client logo displays
- `forms.contact-form` - Contact forms with GDPR compliance
- `forms.newsletter-form` - Email subscription forms
- `utilities.ck-editor-content` - Rich text content with HTML/MDX
- `utilities.basic-image` - Image components with alt text and dimensions
- `utilities.image-with-link` - Linked images for CTAs
- `utilities.link` - Navigation and CTA links
- `utilities.accordions` - FAQ and collapsible content
- `seo-utilities.seo` - SEO metadata for pages and posts

## Usage

### Prerequisites

1. **Database running**: Ensure PostgreSQL is running
   ```bash
   pnpm run:db
   ```

2. **Dependencies installed**: Make sure all packages are installed
   ```bash
   pnpm install
   ```

3. **Strapi built**: Build Strapi admin panel if needed
   ```bash
   pnpm build
   ```

### Running the Seed Script

#### Option 1: Run seed script only
```bash
pnpm seed
```

#### Option 2: Start database and run seed script  
```bash
pnpm seed:dev
```

#### Option 3: Manual execution
```bash
npx ts-node scripts/seed.ts
```

### Expected Output

The script provides detailed logging of its progress:

```
🌱 Starting database seeding...

Creating site configuration...
✅ Site created: [document-id]

Creating navigation items...
✅ Navigation item created: Home
✅ Navigation item created: Features
  ✅ Child navigation item created: TypeScript Support
  ✅ Child navigation item created: UI Components
  ✅ Child navigation item created: API Development
✅ Navigation item created: Documentation
  ✅ Child navigation item created: Getting Started
  ✅ Child navigation item created: API Reference
  ✅ Child navigation item created: Deployment
✅ Navigation item created: Blog
✅ Navigation item created: Contact

Creating homepage with content blocks...
✅ Homepage created with 10 content blocks

Creating additional sample pages...
✅ Page created: Features
✅ Page created: Documentation
✅ Page created: Contact

Creating sample blog posts...
✅ Blog post created: Getting Started with Modern Web Development
✅ Blog post created: Building Scalable APIs with Strapi
✅ Blog post created: Next.js Performance Optimization Strategies
✅ Blog post created: Advanced TypeScript Patterns for React Applications

Creating navbar configuration...
✅ Navbar created

Creating footer configuration...
✅ Footer created

🎉 Database seeding completed successfully!

📊 Summary:
- ✅ Site configuration created
- ✅ 5 navigation items created
- ✅ Homepage with 10 content blocks created
- ✅ 3 additional pages created
- ✅ 4 blog posts created
- ✅ Navbar and footer configured

🚀 Your application is now populated with comprehensive sample data!
Visit http://localhost:1337/admin to manage your content.
```

## Customization

### Modifying Sample Data

1. **Theme Tokens**: Update `SAMPLE_THEME_TOKENS` object to match your brand
2. **Content**: Modify the content blocks and sample text
3. **Navigation**: Adjust `NAVIGATION_ITEMS` structure
4. **Blog Posts**: Replace `SAMPLE_POSTS` with your own content
5. **Images**: Update image URLs or add local asset references

### Adding New Content Types

To seed additional content types:

1. **Add creation function**:
   ```typescript
   async function createCustomContent() {
     const items = await strapi.entityService.create('api::custom.custom', {
       data: {
         title: 'Sample Custom Content',
         publishedAt: new Date(),
         locale: 'en'
       }
     });
     console.log('✅ Custom content created');
     return items;
   }
   ```

2. **Call in main seed function**:
   ```typescript
   export default async function seed() {
     // ... existing code
     await createCustomContent();
   }
   ```

### Error Handling

The script includes comprehensive error handling:
- Transaction rollback on failures
- Detailed error messages
- Graceful exit with error codes

## Database Reset

To clear all seeded data and start fresh:

```bash
# Stop all services
pnpm docker:down

# Reset database (this will delete all data!)
pnpm docker:reset

# Run seed script
pnpm seed:dev
```

## Production Considerations

⚠️ **Warning**: This seed script is intended for development and demonstration purposes only.

For production:
1. **Remove or modify** sensitive sample data
2. **Replace placeholder images** with real assets
3. **Update sample text** with actual content
4. **Review and modify** theme tokens to match your brand
5. **Test thoroughly** before deployment

## Troubleshooting

### Common Issues

1. **Database connection errors**:
   - Ensure PostgreSQL is running: `pnpm run:db`
   - Check database credentials in `.env`

2. **TypeScript compilation errors**:
   - Ensure ts-node is installed: `pnpm install ts-node --save-dev`
   - Check TypeScript configuration

3. **Strapi not initialized**:
   - Make sure Strapi is built: `pnpm build`
   - Check that all content types exist

4. **Permission errors**:
   - Ensure proper file permissions for uploads
   - Check Strapi admin user exists

### Getting Help

- Check the Strapi documentation: [strapi.io/documentation](https://strapi.io/documentation)
- Review the content type schemas in `src/api/*/content-types/*/schema.json`
- Check the generated TypeScript types in `types/generated/`

## Contributing

When modifying the seed script:

1. **Test thoroughly** with a fresh database
2. **Update documentation** if adding new features
3. **Follow TypeScript best practices**
4. **Add appropriate error handling**
5. **Include progress logging** for new operations
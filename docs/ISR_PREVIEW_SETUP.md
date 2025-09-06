# ISR Revalidation & Preview Mode Setup Guide

This guide explains how to configure and use Incremental Static Regeneration (ISR) revalidation and draft preview functionality in your Strapi + Next.js application.

## Overview

The implementation provides:
- **ISR Revalidation**: Automatic cache invalidation when content changes in Strapi
- **Preview Mode**: Draft content preview for editors and content creators
- **Webhook Automation**: Automatic revalidation triggers from Strapi lifecycle events

## Environment Variables Setup

### Next.js (.env.local)

```env
# Preview & Revalidation secrets
STRAPI_PREVIEW_SECRET=your-secret-key
REVALIDATE_SECRET=your-revalidation-secret

# Base URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
APP_PUBLIC_URL=http://localhost:3000
```

### Strapi (.env)

```env
# Preview Configuration
STRAPI_PREVIEW_ENABLED=true
STRAPI_PREVIEW_SECRET=your-secret-key
CLIENT_URL=http://localhost:3000

# Revalidation Configuration
REVALIDATE_SECRET=your-revalidation-secret
NEXT_REVALIDATE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### 1. Revalidation Endpoint (/api/revalidate)

Handles ISR revalidation webhooks from Strapi.

**POST Request:**
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer your-revalidation-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "entry.update",
    "model": "page",
    "entry": {
      "id": 1,
      "slug": "homepage",
      "url": "/",
      "locale": "en"
    },
    "paths": ["/"],
    "tags": ["pages"]
  }'
```

**Manual Revalidation (GET):**
```bash
# Revalidate specific path
curl "http://localhost:3000/api/revalidate?secret=your-revalidation-secret&path=/about"

# Revalidate specific tag
curl "http://localhost:3000/api/revalidate?secret=your-revalidation-secret&tag=pages"
```

### 2. Preview Endpoint (/api/preview)

Enables draft content preview.

**Preview URL Format:**
```
http://localhost:3000/api/preview?secret=your-secret-key&url=/page-slug&status=draft&locale=en
```

**Exit Preview (POST):**
```bash
curl -X POST "http://localhost:3000/api/preview?action=exit"
```

## Strapi Integration

### Lifecycle Hooks

The following content types automatically trigger revalidation:

- **Pages**: Revalidates specific page paths and homepage
- **Posts**: Revalidates post pages and blog listings
- **Navbar**: Triggers site-wide revalidation (affects all pages)
- **Footer**: Triggers site-wide revalidation (affects all pages)  
- **Site**: Triggers site-wide revalidation (theme/config changes)
- **Redirects**: Revalidates affected source paths

### Content Type Configurations

Each content type has lifecycle hooks in:
```
apps/strapi/src/api/{content-type}/content-types/{content-type}/lifecycles.ts
```

Example for pages:
```typescript
import { LifecycleEventType } from "../../../../../types/internals";
import { 
  triggerRevalidation, 
  createPageRevalidationPayload 
} from "../../../../utils/revalidation";

export default {
  async afterUpdate(event: LifecycleEventType<"afterUpdate">) {
    if (event.result) {
      const payload = createPageRevalidationPayload('entry.update', event.result);
      await triggerRevalidation(payload);
    }
  },
  // ... other lifecycle methods
};
```

## Revalidation Strategies

### Model-Specific Revalidation

1. **Page Content**:
   - Revalidates specific page URL
   - Revalidates all localized versions
   - Revalidates homepage if applicable
   - Tags: `pages`

2. **Blog Posts**:
   - Revalidates post URL
   - Revalidates blog listing page
   - Revalidates localized versions
   - Tags: `posts`

3. **Global Content** (Navigation, Footer):
   - Triggers site-wide revalidation
   - Affects all pages through layout changes
   - Tags: `navigation`, `footer`

4. **Site Configuration**:
   - Bulk revalidation for theme/config changes
   - Tags: `site-config`

### Cache Tags

The system uses these cache tags for efficient revalidation:
- `pages`: All page content
- `posts`: All blog/post content
- `navigation`: Navigation menu data
- `footer`: Footer content
- `site-config`: Global site settings
- `content`: Generic content fallback

## Preview Mode Usage

### For Content Editors

1. **Enable Preview**: Click preview button in Strapi admin panel
2. **View Draft**: Opens draft content in new tab with preview mode enabled
3. **Cross-Origin Support**: Works within Strapi's iframe preview
4. **Exit Preview**: Use exit preview button or call exit endpoint

### Preview URL Parameters

- `secret`: Authentication secret (required)
- `url`: Page URL to preview (required)
- `status`: `draft` or `published` (default: published)
- `locale`: Content locale (optional)
- `contentType`: Content type name (optional)
- `id`: Content entry ID (optional)

## Development Testing

### Test Revalidation

```bash
# Create test page in Strapi
# Check frontend shows old content
# Update page in Strapi
# Verify frontend shows updated content (may take a few seconds)

# Manual revalidation test
curl "http://localhost:3000/api/revalidate?secret=your-secret&path=/test-page"
```

### Test Preview Mode

```bash
# Enable preview for draft content
curl "http://localhost:3000/api/preview?secret=your-secret&url=/draft-page&status=draft"

# Check if preview mode is active (look for draft mode indicators)

# Disable preview
curl -X POST "http://localhost:3000/api/preview?action=exit"
```

## Production Deployment

### Security Considerations

1. **Use Strong Secrets**: Generate cryptographically secure secrets
2. **HTTPS Required**: Preview mode cookies require secure connections
3. **Environment Separation**: Use different secrets per environment
4. **Rate Limiting**: Consider implementing rate limiting for revalidation endpoint

### Performance Optimization

1. **Selective Revalidation**: Use specific paths/tags instead of bulk revalidation when possible
2. **Webhook Reliability**: Implement retry logic for webhook failures
3. **Monitoring**: Log revalidation events for debugging
4. **Caching Strategy**: Consider CDN cache invalidation for global deployments

## Troubleshooting

### Common Issues

1. **Revalidation Not Working**:
   - Check environment variables are set correctly
   - Verify webhook endpoint is accessible from Strapi
   - Check Strapi and Next.js logs for errors

2. **Preview Mode Issues**:
   - Ensure HTTPS in production for cookie security
   - Check cross-origin cookie settings for iframe support
   - Verify preview secret matches between apps

3. **Performance Issues**:
   - Monitor bulk revalidation frequency
   - Consider implementing queue system for high-traffic sites
   - Use specific cache tags instead of full site revalidation

### Debug Endpoints

```bash
# Check revalidation webhook
curl -X POST http://localhost:3000/api/revalidate \
  -H "Authorization: Bearer wrong-secret" \
  # Should return 401 Unauthorized

# Test preview authentication  
curl "http://localhost:3000/api/preview?secret=wrong-secret&url=/test"
# Should return 401 Unauthorized
```

## Advanced Configuration

### Custom Content Types

To add revalidation to custom content types:

1. Create lifecycle hooks file
2. Import revalidation utilities
3. Implement payload creation function
4. Add to lifecycle events

Example for custom "Event" content type:
```typescript
// apps/strapi/src/api/event/content-types/event/lifecycles.ts
export function createEventRevalidationPayload(event, entry) {
  return {
    event,
    model: 'event',
    entry: { id: entry.id, url: entry.url },
    paths: [entry.url, '/events'], // Event page + listing
    tags: ['events']
  }
}
```

### Webhook Customization

Modify `apps/strapi/src/utils/revalidation.ts` to:
- Add retry logic
- Implement queue system
- Add custom webhook endpoints
- Include additional metadata

This completes the ISR revalidation and preview mode setup for your Strapi + Next.js application.
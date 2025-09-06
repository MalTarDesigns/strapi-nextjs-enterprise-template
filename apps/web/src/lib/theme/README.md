# Site-Based Theming System

This theming system allows dynamic customization of your Next.js application based on Site configuration stored in Strapi.

## Overview

The theming system consists of:

1. **Site Configuration**: Stores theme tokens in Strapi Site content type
2. **Theme Injection**: Injects CSS variables into the document head
3. **Tailwind Integration**: Consumes CSS variables for styling
4. **React Context**: Provides theme access throughout the app

## Site Configuration

The Site content type in Strapi contains a `themeTokens` JSON field with the following structure:

```json
{
  "primary": {
    "50": "#eff6ff",
    "100": "#dbeafe",
    // ... all color shades 50-950
  },
  "secondary": {
    "50": "#f8fafc",
    "100": "#f1f5f9",
    // ... all color shades 50-950
  },
  "font": {
    "family": "Inter",
    "fallback": ["system-ui", "sans-serif"]
  },
  "radius": {
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem"
  }
}
```

## Usage in Components

### Using CSS Variables Directly

```tsx
function MyComponent() {
  return (
    <div 
      className="p-4" 
      style={{ 
        backgroundColor: "var(--color-primary-500)",
        borderRadius: "var(--radius-md)"
      }}
    >
      Content
    </div>
  )
}
```

### Using Tailwind Classes

```tsx
function MyComponent() {
  return (
    <div className="p-4 bg-primary-500 rounded-md">
      Content with themed colors and radius
    </div>
  )
}
```

### Using Theme Context

```tsx
import { useSiteTheme } from "@/components/theme"

function ThemedComponent() {
  const { siteConfig, themeTokens, updateTheme } = useSiteTheme()
  
  return (
    <div>
      <h1>Site: {siteConfig?.name}</h1>
      <p>Primary Color: {themeTokens.primary[500]}</p>
    </div>
  )
}
```

## Available CSS Variables

### Colors
- `--color-primary-{50-950}`: Primary brand colors
- `--color-secondary-{50-950}`: Secondary brand colors

### Typography
- `--font-family-primary`: Configured font family with fallbacks

### Border Radius
- `--radius-sm`: Small border radius
- `--radius-md`: Medium border radius  
- `--radius-lg`: Large border radius
- `--radius-xl`: Extra large border radius

## Integration

The theming system is automatically integrated into:

1. **Root Layout**: Injects theme CSS and provides context
2. **Tailwind CSS**: Consumes variables for utility classes
3. **Component Library**: Uses themed colors and spacing

## Environment Variables

```env
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token
```

## Development

To test the theming system:

1. Configure theme tokens in Strapi Admin
2. Use the `ThemeDemo` component to verify styling
3. Create components using `primary-*` and `secondary-*` classes
4. Test responsive behavior across viewport sizes
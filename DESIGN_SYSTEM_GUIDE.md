# Design System Guide - Comprehensive Theming Documentation

## Overview
The Strapi Next.js starter template features a robust design system built with CSS custom properties (CSS variables) and TailwindCSS integration. This system enables runtime theme customization, consistent styling, and maintainable code.

---

## Architecture

### Design System Structure
```
packages/design-system/
├── src/
│   ├── styles.css          # Main entry point
│   ├── theme.css           # CSS custom properties
│   ├── custom-styles.css   # Component-specific styles
│   └── build-ck-config.js  # CKEditor theme builder
├── package.json
└── README.md
```

### Integration Points
- **TailwindCSS**: Utilizes design tokens for consistent spacing, colors, and typography
- **CSS Custom Properties**: Runtime customization without recompilation
- **Component Library**: Shared UI components consume design tokens
- **CKEditor**: Rich text editor inherits theme styling

---

## Color System

### Primary Color Palette
The design system uses OKLCH color space for perceptually uniform colors:

```css
/* Primary Brand Colors */
--color-primary-50: oklch(0.971 0.013 17.38)      /* Lightest */
--color-primary-100: oklch(0.936 0.032 17.717)
--color-primary-200: oklch(0.885 0.062 18.334)
--color-primary-300: oklch(0.808 0.114 19.571)
--color-primary-400: oklch(0.704 0.191 22.216)
--color-primary-500: oklch(0.637 0.237 25.331)    /* Base */
--color-primary-600: oklch(0.577 0.245 27.325)
--color-primary-700: oklch(0.505 0.213 27.518)
--color-primary-800: oklch(0.444 0.177 26.899)
--color-primary-900: oklch(0.396 0.141 25.723)
--color-primary-950: oklch(0.258 0.092 26.042)    /* Darkest */
```

### Secondary Color Palette
```css
/* Secondary/Neutral Colors */
--color-secondary-50: oklch(0.984 0.003 247.858)
--color-secondary-500: oklch(0.554 0.046 257.417)  /* Base */
--color-secondary-950: oklch(0.129 0.042 264.695)
```

### Extended Color System
The design system includes the complete TailwindCSS color palette with OKLCH values for:
- Red, Orange, Amber, Yellow
- Lime, Green, Emerald, Teal
- Cyan, Sky, Blue, Indigo
- Violet, Purple, Fuchsia, Pink, Rose
- Slate, Gray, Zinc, Neutral, Stone

### Color Customization
Override colors by redefining CSS custom properties:

```css
:root {
  /* Brand Colors */
  --color-primary-500: oklch(0.7 0.25 280);    /* Purple brand */
  --color-secondary-500: oklch(0.6 0.15 200);  /* Blue accent */
  
  /* Semantic Colors */
  --color-success: var(--color-green-500);
  --color-warning: var(--color-amber-500);
  --color-error: var(--color-red-500);
}
```

---

## Typography System

### Font Configuration
```css
/* Primary Font Family */
--font-family-primary: var(--font-family-primary, Roboto, system-ui, sans-serif);
--font-sans: Roboto;
```

### Type Scale
The design system uses a modular scale for consistent typography:

```css
/* Text Sizes with Line Heights */
--text-xs: 0.75em      /* 12px - small captions */
--text-sm: 0.875em     /* 14px - labels, small text */
--text-base: 1em       /* 16px - body text */
--text-lg: 1.125em     /* 18px - large body */
--text-xl: 1.25em      /* 20px - small headings */
--text-2xl: 1.5em      /* 24px - headings */
--text-3xl: 1.875em    /* 30px - section titles */
--text-4xl: 2.25em     /* 36px - page titles */
--text-5xl: 3em        /* 48px - hero headings */
--text-6xl: 3.75em     /* 60px - display text */
--text-7xl: 4.5em      /* 72px - large display */
--text-8xl: 6em        /* 96px - extra large */
--text-9xl: 8em        /* 128px - massive text */
--text-10xl: 10em      /* 160px - hero display */
```

### Font Weights
```css
--font-weight-thin: 100
--font-weight-extralight: 200
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
--font-weight-extrabold: 800
--font-weight-black: 900
```

### Typography Classes
The system provides utility classes for consistent typography:

```css
/* Heading Classes */
.typo-h1 { @apply text-10xl mb-2; }    /* Hero headings */
.typo-h2 { @apply text-8xl mb-1.5; }   /* Section headings */
.typo-h3 { @apply text-7xl mb-1; }     /* Subsection headings */
.typo-h4 { @apply text-6xl mb-1; }     /* Component headings */
.typo-h5 { @apply text-5xl mb-1; }     /* Small headings */
.typo-h6 { @apply text-4xl mb-1; }     /* Minor headings */

/* Body Text */
.typo-p { @apply text-2xl mb-0.5; }    /* Paragraph text */
```

### Usage Examples

#### Component Typography
```tsx
import Heading from "@/components/typography/Heading"
import { Paragraph } from "@/components/typography/Paragraph"

// Semantic heading component
<Heading tag="h1" variant="heading1" className="mb-4">
  Your Page Title
</Heading>

// Body text component
<Paragraph className="mb-6">
  Your content text with consistent styling.
</Paragraph>
```

#### Direct CSS Classes
```tsx
<h1 className="typo-h1 text-primary-900">Hero Title</h1>
<h2 className="typo-h2 text-secondary-700">Section Title</h2>
<p className="typo-p text-gray-600">Body paragraph</p>
```

---

## Spacing System

### Base Spacing Unit
```css
--spacing: 0.25em  /* 4px at default font size */
```

### TailwindCSS Integration
The spacing system integrates with TailwindCSS utilities:
- `p-1` = 4px padding
- `m-4` = 16px margin
- `gap-6` = 24px gap
- `space-y-8` = 32px vertical spacing

### Container Sizes
```css
/* Container Widths */
--container-3xs: 16em    /* 256px */
--container-2xs: 18em    /* 288px */
--container-xs: 20em     /* 320px */
--container-sm: 24em     /* 384px */
--container-md: 28em     /* 448px */
--container-lg: 32em     /* 512px */
--container-xl: 36em     /* 576px */
--container-2xl: 42em    /* 672px */
--container-3xl: 48em    /* 768px */
--container-4xl: 56em    /* 896px */
--container-5xl: 64em    /* 1024px */
--container-6xl: 72em    /* 1152px */
--container-7xl: 80em    /* 1280px */
```

---

## Responsive Design

### Breakpoint System
```css
/* Responsive Breakpoints */
--breakpoint-sm: 40em     /* 640px */
--breakpoint-md: 48em     /* 768px */
--breakpoint-lg: 64em     /* 1024px */
--breakpoint-xl: 80em     /* 1280px */
--breakpoint-2xl: 96em    /* 1536px */
```

### Mobile-First Approach
All components follow a mobile-first design pattern:

```tsx
// Example: Responsive grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content adapts to screen size */}
</div>

// Example: Responsive typography
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Responsive Heading
</h1>
```

---

## Border Radius System

### Radius Scale
```css
/* Site-configurable border radius */
--radius-sm: var(--radius-sm, 0.125rem)    /* 2px */
--radius-md: var(--radius-md, 0.375rem)    /* 6px */
--radius-lg: var(--radius-lg, 0.5rem)      /* 8px */
--radius-xl: var(--radius-xl, 0.75rem)     /* 12px */

/* Extended radius scale */
--radius-xs: 0.125em      /* Extra small */
--radius-2xl: 1em         /* Large radius */
--radius-3xl: 1.5em       /* Extra large */
--radius-4xl: 2em         /* Pill-like radius */
```

### Usage Examples
```tsx
// Rounded corners
<div className="rounded-md">...</div>        // 6px radius
<div className="rounded-lg">...</div>        // 8px radius
<div className="rounded-3xl">...</div>       // Large radius

// Custom radius
<div style={{ borderRadius: 'var(--radius-xl)' }}>...</div>
```

---

## Shadow System

### Shadow Scale
```css
/* Drop Shadows */
--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)

/* Inset Shadows */
--inset-shadow-sm: inset 0 2px 4px rgb(0 0 0 / 0.05)
```

### Usage Examples
```tsx
// TailwindCSS shadow utilities
<div className="shadow-md">...</div>         // Medium shadow
<div className="shadow-lg hover:shadow-xl">...</div>  // Interactive shadow

// Custom shadow
<div style={{ boxShadow: 'var(--shadow-lg)' }}>...</div>
```

---

## Animation System

### Predefined Animations
```css
/* Animation Keyframes */
--animate-spin: spin 1s linear infinite
--animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite
--animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
--animate-bounce: bounce 1s infinite

/* Easing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Animation Classes
```tsx
// Loading animations
<div className="animate-spin">Loading...</div>
<div className="animate-pulse">Skeleton loading</div>

// Hover animations
<button className="transition-all duration-300 ease-in-out hover:scale-105">
  Hover me
</button>
```

---

## Theme Customization

### Method 1: CSS Custom Properties
Create a theme override file:

```css
/* themes/corporate.css */
:root {
  /* Corporate blue theme */
  --color-primary-50: oklch(0.97 0.02 240);
  --color-primary-500: oklch(0.6 0.25 240);
  --color-primary-950: oklch(0.2 0.15 240);
  
  /* Typography adjustments */
  --font-family-primary: "Inter", system-ui, sans-serif;
  
  /* Increased border radius for modern look */
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}
```

### Method 2: TailwindCSS Theme Extension
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(from var(--color-primary-50) r g b)',
          500: 'rgb(from var(--color-primary-500) r g b)',
          950: 'rgb(from var(--color-primary-950) r g b)',
        }
      },
      fontFamily: {
        sans: ['var(--font-family-primary)', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

### Method 3: Runtime Theme Switching
```tsx
// Theme switching component
const ThemeCustomizer = () => {
  const setTheme = (primaryColor: string) => {
    document.documentElement.style.setProperty('--color-primary-500', primaryColor)
  }
  
  return (
    <div>
      <button onClick={() => setTheme('oklch(0.6 0.25 280)')}>Purple</button>
      <button onClick={() => setTheme('oklch(0.6 0.25 120)')}>Green</button>
      <button onClick={() => setTheme('oklch(0.6 0.25 0)')}>Red</button>
    </div>
  )
}
```

---

## Component Integration

### Using Design Tokens in Components
```tsx
// Component with design system integration
const Button = ({ variant = 'primary', size = 'md', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:ring-2'
  
  const variants = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-base rounded-lg',
    lg: 'px-6 py-3 text-lg rounded-xl'
  }
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      {...props}
    />
  )
}
```

### Styled Components with CSS Variables
```tsx
// Using styled-components with design tokens
const StyledCard = styled.div`
  background: rgb(from var(--color-primary-50) r g b);
  border: 1px solid rgb(from var(--color-primary-200) r g b);
  border-radius: var(--radius-lg);
  padding: calc(var(--spacing) * 4);
  box-shadow: var(--shadow-md);
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    transition: all 0.2s var(--ease-out);
  }
`
```

---

## Dark Mode Support

### CSS Custom Properties for Dark Mode
```css
/* Dark mode theme overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary-50: oklch(0.2 0.1 240);    /* Darker backgrounds */
    --color-primary-950: oklch(0.95 0.02 240); /* Lighter text */
    
    /* Adjust semantic colors */
    --color-background: oklch(0.15 0.005 240);
    --color-foreground: oklch(0.95 0.005 240);
  }
}

/* Manual dark mode class */
.dark {
  --color-primary-50: oklch(0.2 0.1 240);
  --color-primary-950: oklch(0.95 0.02 240);
}
```

### Dark Mode Toggle Implementation
```tsx
const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])
  
  return (
    <button onClick={() => setIsDark(!isDark)}>
      {isDark ? '☀️' : '🌙'} Toggle Theme
    </button>
  )
}
```

---

## Best Practices

### Design Token Usage
1. **Always use CSS custom properties** for theme values
2. **Avoid hardcoded colors** in component styles
3. **Use semantic naming** for component-specific tokens
4. **Test with different themes** to ensure flexibility

### Performance Considerations
1. **CSS custom properties are fast** - no runtime compilation needed
2. **Use CSS-in-JS sparingly** - prefer CSS custom properties
3. **Optimize for critical CSS** - inline essential design tokens
4. **Use CSS containment** for complex animated components

### Accessibility Guidelines
1. **Maintain color contrast ratios** (WCAG AA: 4.5:1 for normal text)
2. **Test with screen readers** and keyboard navigation
3. **Use semantic color names** (success, warning, error)
4. **Support high contrast mode** with appropriate fallbacks

---

This comprehensive design system guide provides all the tools and knowledge needed to customize, extend, and maintain a consistent visual identity across your Strapi Next.js application.
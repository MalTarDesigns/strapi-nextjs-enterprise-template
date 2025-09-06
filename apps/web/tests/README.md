# Next.js Frontend Tests

This directory contains comprehensive tests for the Next.js frontend application.

## Test Structure

```
tests/
├── e2e/                     # End-to-end tests (Playwright)
│   ├── page-rendering.spec.ts # Page rendering and UX tests
│   └── revalidation.spec.ts   # Content revalidation tests
└── README.md                # This file

src/
├── components/
│   └── **/__tests__/        # Component unit tests
├── lib/
│   └── __tests__/           # Utility function tests
└── app/api/
    └── __tests__/           # API route tests
```

## Test Categories

### 1. Component Tests (`src/components/**/__tests__/`)

- **Page Builder** (`page-builder/__tests__/index.test.tsx`): Tests component mapping and registration
- **Section Components** (`sections/__tests__/StrapiHero.test.tsx`): Tests individual block components
- **Form Components** (`forms/__tests__/StrapiContactForm.test.tsx`): Tests form interactions and validation

### 2. Utility Tests (`src/lib/__tests__/`)

- **Strapi Helpers** (`strapi-helpers.test.ts`): Tests URL formatting and API utilities
- **Theming System** (`theming.test.ts`): Tests CSS variable injection and theme management

### 3. API Route Tests (`src/app/api/__tests__/`)

- **Revalidation API** (`revalidate.test.ts`): Tests ISR revalidation endpoints and security

### 4. E2E Tests (`tests/e2e/`)

- **Page Rendering** (`page-rendering.spec.ts`): Tests complete user flows and UX
- **Revalidation** (`revalidation.spec.ts`): Tests content updates and cache invalidation

## Running Tests

### Unit Tests (Jest)
```bash
# All unit tests
pnpm test

# Watch mode for development
pnpm test:watch

# Coverage report
pnpm test:coverage

# Specific test categories
pnpm test:component    # Component tests only
pnpm test:lib         # Library tests only  
pnpm test:api         # API route tests only
```

### E2E Tests (Playwright)
```bash
# All E2E tests
pnpm test:e2e

# Interactive mode with UI
pnpm test:e2e:ui

# Headed mode (visible browser)
pnpm test:e2e:headed

# Specific test files
npx playwright test tests/e2e/page-rendering.spec.ts
```

### Combined Tests
```bash
# Run all tests (unit + E2E)
pnpm test:all
```

## Test Environment Setup

### Jest Configuration (`jest.config.js`)
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Jest Setup (`jest.setup.js`)
Mock configurations for:
- Next.js router and navigation
- next-intl for internationalization
- next-auth for authentication
- next-themes for theming
- Browser APIs (IntersectionObserver, ResizeObserver)

### Playwright Configuration (`playwright.config.ts`)
```typescript
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['html'], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 7'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 14'] } },
  ],
  webServer: [
    { command: 'pnpm dev:strapi', port: 1337 },
    { command: 'pnpm dev:web', port: 3000 }
  ],
});
```

## Test Coverage Goals

### Component Tests
- **Page Builder Components**: 90% coverage
- **Form Interactions**: All user input scenarios
- **Responsive Behavior**: Mobile, tablet, desktop viewports
- **Accessibility**: WCAG compliance and keyboard navigation

### Utility Tests  
- **Strapi Helpers**: All URL formatting scenarios
- **Theme System**: CSS variable injection and validation
- **API Clients**: Request/response handling

### E2E Tests
- **Critical User Flows**: Homepage, navigation, forms
- **Content Management**: Page creation, updates, revalidation
- **Cross-browser Compatibility**: Chrome, Firefox, Safari
- **Mobile Experience**: Touch interactions, responsive design

## Component Testing Patterns

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { StrapiHero } from '../StrapiHero';

describe('StrapiHero', () => {
  const mockComponent = {
    id: 1,
    __component: 'sections.hero',
    title: 'Test Hero Title',
    subTitle: 'Test Hero Subtitle',
  };

  it('should render hero with title and subtitle', () => {
    render(<StrapiHero component={mockComponent} />);
    
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Test Hero Subtitle')).toBeInTheDocument();
  });
});
```

### Form Testing with User Interactions
```typescript
import userEvent from '@testing-library/user-event';

it('should handle form submission', async () => {
  const user = userEvent.setup();
  render(<StrapiContactForm component={mockFormComponent} />);
  
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Email'), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

## E2E Testing Patterns

### Page Navigation Test
```typescript
test('should navigate between pages correctly', async ({ page }) => {
  await page.goto('/');
  
  await page.click('nav a[href="/about"]');
  await expect(page.locator('h1')).toContainText('About');
  
  await expect(page).toHaveURL(/.*about/);
});
```

### Content Revalidation Test
```typescript
test('should update content after revalidation', async ({ page }) => {
  await page.goto('/test-page');
  
  // Trigger content update
  await page.request.post('/api/revalidate', {
    data: {
      secret: process.env.REVALIDATE_SECRET,
      path: '/test-page',
      type: 'page'
    }
  });
  
  await page.reload();
  await expect(page.locator('h1')).toBeVisible();
});
```

## Mock Strategies

### Component Dependencies
```typescript
// Mock complex dependencies to focus on component logic
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />
}));
```

### API Calls
```typescript
// Mock fetch for API interactions
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ success: true })
  })
) as jest.Mock;
```

### Next.js Features
```typescript
// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));
```

## Testing Best Practices

### 1. Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names that explain the expected behavior
- Follow Arrange-Act-Assert pattern

### 2. Component Testing
- Test component props and rendering
- Test user interactions and event handlers
- Test conditional rendering and edge cases
- Mock external dependencies appropriately

### 3. E2E Testing
- Test complete user workflows
- Use page objects for complex interactions
- Test across different devices and browsers
- Verify accessibility and performance

### 4. Test Data
- Use minimal test data for faster tests
- Create reusable test fixtures
- Clean up test data to prevent test pollution

## Debugging Tests

### Jest Tests
```bash
# Run specific test with verbose output
npx jest StrapiHero.test.tsx --verbose

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest StrapiHero.test.tsx --runInBand
```

### Playwright Tests
```bash
# Run with debug mode
npx playwright test --debug

# Run specific test with UI
npx playwright test page-rendering.spec.ts --ui

# Generate test code
npx playwright codegen localhost:3000
```

### Common Issues

**Tests timeout**: Increase timeout for async operations
```typescript
jest.setTimeout(30000);
```

**Mock not working**: Check mock import order and hoisting
```typescript
// Move mocks to top of file
jest.mock('./module', () => ({ ... }));
```

**E2E tests flaky**: Add proper wait conditions
```typescript
await page.waitForLoadState('networkidle');
await expect(element).toBeVisible({ timeout: 10000 });
```

## CI/CD Integration

### GitHub Actions
```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Run unit tests
        run: pnpm test:coverage
      
      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          NEXT_PUBLIC_STRAPI_URL: http://localhost:1337
          STRAPI_URL: http://localhost:1337
```

## Performance Considerations

- **Parallel Testing**: Jest and Playwright run tests in parallel
- **Test Isolation**: Each test has isolated environment
- **Mock Heavy Dependencies**: Mock large libraries and external services
- **Selective Testing**: Use test patterns to run specific test suites

## Extending Tests

### Adding Component Tests
1. Create `__tests__` directory in component folder
2. Create `ComponentName.test.tsx` file
3. Import testing utilities and component
4. Write tests for props, rendering, and interactions

### Adding E2E Tests  
1. Create `.spec.ts` file in `tests/e2e/`
2. Import Playwright test utilities
3. Write test scenarios for user workflows
4. Add page object patterns for complex interactions

### Custom Test Utilities
Create shared utilities in `tests/utils/` for:
- Custom render functions with providers
- Common test data factories
- Reusable page object methods
- Mock server configurations
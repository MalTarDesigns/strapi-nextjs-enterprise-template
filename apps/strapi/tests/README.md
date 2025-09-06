# Strapi Backend Tests

This directory contains comprehensive tests for the Strapi backend application.

## Test Structure

```
tests/
├── api/                      # API endpoint tests
│   ├── site.test.ts         # Site configuration API tests
│   ├── page.test.ts         # Page content API tests  
│   ├── navigation-item.test.ts # Navigation API tests
│   ├── post.test.ts         # Blog post API tests
│   ├── authentication.test.ts # Auth & user management tests
│   ├── dynamic-zones.test.ts # Dynamic zone block tests
│   └── lifecycles.test.ts   # Lifecycle hooks & revalidation tests
├── helpers/
│   ├── strapi.ts           # Test database & instance helpers
│   └── strapi.js           # Legacy helper (if exists)
├── setup.ts                # Global test setup
└── README.md               # This file
```

## Test Categories

### 1. API Tests (`tests/api/`)

- **Site API** (`site.test.ts`): Tests site configuration CRUD operations, theme tokens, and validation
- **Page API** (`page.test.ts`): Tests page content management, dynamic zones, hierarchical structure
- **Navigation API** (`navigation-item.test.ts`): Tests navigation item management and ordering
- **Post API** (`post.test.ts`): Tests blog post CRUD, SEO metadata, and publishing workflows  
- **Authentication** (`authentication.test.ts`): Tests user auth, JWT tokens, role-based permissions
- **Dynamic Zones** (`dynamic-zones.test.ts`): Tests all block components (Hero, FAQ, Forms, etc.)
- **Lifecycles** (`lifecycles.test.ts`): Tests lifecycle hooks, revalidation triggers, breadcrumbs

### 2. Helper Functions (`tests/helpers/`)

- **Strapi Helper** (`strapi.ts`): Database setup, test data creation/cleanup, instance management

## Running Tests

### All Tests
```bash
pnpm test
```

### Watch Mode (Development)
```bash
pnpm test:watch
```

### Coverage Report
```bash
pnpm test:coverage
```

### Specific Test Categories
```bash
# API tests only
pnpm test:api

# Unit tests only (excluding API tests)
pnpm test:unit
```

### Individual Test Files
```bash
# Test specific API
npx jest tests/api/page.test.ts

# Test dynamic zones
npx jest tests/api/dynamic-zones.test.ts
```

## Test Environment

### Database Setup
Tests use SQLite in-memory database for isolation and speed:

```typescript
// Configured in tests/helpers/strapi.ts
process.env.DATABASE_CLIENT = 'sqlite';
process.env.DATABASE_FILENAME = '.tmp/test.db';
```

### Environment Variables
Required for testing:
```bash
# Test database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/test.db

# JWT secret for authentication tests
JWT_SECRET=test-jwt-secret

# Admin JWT secret
ADMIN_JWT_SECRET=test-admin-jwt-secret

# API token salt
API_TOKEN_SALT=test-api-token-salt
```

### Test Data
Each test creates isolated test data using the `createTestData()` helper:

- Test site configuration
- Test pages with dynamic zones
- Test navigation items
- Test blog posts
- Test users and authentication

Data is automatically cleaned up after each test.

## Test Coverage Goals

- **API Endpoints**: 100% route coverage
- **Authentication**: All auth flows and permissions
- **Dynamic Zones**: All block component types
- **Lifecycle Hooks**: All CRUD operations and revalidation
- **Validation**: All input validation scenarios
- **Error Handling**: All error states and edge cases

## Best Practices

### Writing Tests

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Setup/Teardown**: Use `beforeEach` and `afterEach` for data setup and cleanup
3. **Descriptive Names**: Test names should clearly describe what is being tested
4. **Assertions**: Use specific assertions that test the exact behavior expected
5. **Error Cases**: Test both success and failure scenarios

### Example Test Structure

```typescript
describe('API Endpoint', () => {
  let strapi: any;
  let testData: any;

  beforeAll(async () => {
    strapi = getStrapiInstance();
  });

  beforeEach(async () => {
    testData = await createTestData(strapi);
  });

  afterEach(async () => {
    if (testData) {
      await cleanupTestData(strapi, testData);
    }
  });

  describe('GET /api/endpoint', () => {
    it('should return expected data with proper structure', async () => {
      const response = await request(strapi.server.httpServer)
        .get('/api/endpoint')
        .expect(200);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0].attributes).toHaveProperty('title');
    });
  });
});
```

## Debugging Tests

### Failed Tests
```bash
# Run specific failing test
npx jest tests/api/page.test.ts --verbose

# Run with debug output
DEBUG=* npx jest tests/api/page.test.ts
```

### Database Issues
```bash
# Clean test database
rm -f .tmp/test.db

# Reset database and run tests
pnpm test
```

### Memory Leaks
Tests use `--forceExit --detectOpenHandles` flags to handle Strapi's async operations:

```json
{
  "scripts": {
    "test": "jest --forceExit --detectOpenHandles"
  }
}
```

## CI/CD Integration

Tests are designed to run in CI/CD environments:

```yaml
# GitHub Actions example
- name: Run Strapi Tests
  run: |
    pnpm install
    pnpm test:coverage
  env:
    DATABASE_CLIENT: sqlite
    DATABASE_FILENAME: .tmp/test.db
    NODE_ENV: test
```

## Performance Considerations

- **SQLite**: Faster than PostgreSQL for testing
- **Parallel Tests**: Jest runs tests in parallel by default
- **Test Data**: Minimal data creation for faster setup
- **Cleanup**: Proper cleanup prevents memory leaks

## Extending Tests

### Adding New API Tests

1. Create test file in `tests/api/`
2. Import test helpers
3. Follow existing patterns for setup/teardown
4. Add test to `testMatch` patterns in `package.json`

### Adding New Block Components

1. Add component tests to `dynamic-zones.test.ts`
2. Test component-specific validation
3. Test component rendering and data structure
4. Update test data helpers if needed

### Custom Test Utilities

Add shared test utilities to `tests/helpers/` directory and import as needed.
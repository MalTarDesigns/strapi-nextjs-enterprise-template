/**
 * Tests for theming system and CSS variable injection
 * This tests the dynamic theme token application from Strapi site configuration
 */

// Mock CSS variable injection functions
const mockSetCSSVariable = jest.fn();
const mockGetCSSVariable = jest.fn();
const mockRemoveCSSVariable = jest.fn();

// Mock document and CSS manipulation
Object.defineProperty(document, 'documentElement', {
  value: {
    style: {
      setProperty: mockSetCSSVariable,
      getPropertyValue: mockGetCSSVariable,
      removeProperty: mockRemoveCSSVariable,
    }
  },
  writable: true
});

// Theme utilities (these would be in your actual app)
const applyThemeTokens = (tokens: Record<string, any>) => {
  const flattenTokens = (obj: any, prefix = '') => {
    const result: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      const cssVar = prefix ? `${prefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        Object.assign(result, flattenTokens(value, cssVar));
      } else {
        result[`--${cssVar}`] = String(value);
      }
    }
    
    return result;
  };

  const flatTokens = flattenTokens(tokens);
  
  for (const [variable, value] of Object.entries(flatTokens)) {
    document.documentElement.style.setProperty(variable, value);
  }
  
  return flatTokens;
};

const removeThemeTokens = (tokens: Record<string, any>) => {
  const flattenTokens = (obj: any, prefix = '') => {
    const result: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      const cssVar = prefix ? `${prefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        result.push(...flattenTokens(value, cssVar));
      } else {
        result.push(`--${cssVar}`);
      }
    }
    
    return result;
  };

  const variableNames = flattenTokens(tokens);
  
  for (const variable of variableNames) {
    document.documentElement.style.removeProperty(variable);
  }
  
  return variableNames;
};

const validateThemeTokens = (tokens: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!tokens || typeof tokens !== 'object') {
    errors.push('Theme tokens must be an object');
    return { isValid: false, errors };
  }
  
  const validateValue = (value: any, path: string) => {
    if (typeof value === 'object' && value !== null) {
      for (const [key, nestedValue] of Object.entries(value)) {
        validateValue(nestedValue, `${path}.${key}`);
      }
    } else if (typeof value === 'string') {
      // Validate CSS values
      if (path.includes('color') && !isValidColor(value)) {
        errors.push(`Invalid color value at ${path}: ${value}`);
      }
      if (path.includes('spacing') && !isValidSpacing(value)) {
        errors.push(`Invalid spacing value at ${path}: ${value}`);
      }
    } else if (typeof value !== 'number') {
      errors.push(`Invalid value type at ${path}: ${typeof value}`);
    }
  };
  
  for (const [key, value] of Object.entries(tokens)) {
    validateValue(value, key);
  }
  
  return { isValid: errors.length === 0, errors };
};

const isValidColor = (value: string): boolean => {
  // Basic color validation - hex, rgb, rgba, hsl, named colors
  const colorRegex = /^(#([0-9a-f]{3}|[0-9a-f]{6})|rgb\(.*\)|rgba\(.*\)|hsl\(.*\)|hsla\(.*\)|[a-z]+)$/i;
  return colorRegex.test(value);
};

const isValidSpacing = (value: string): boolean => {
  // Basic spacing validation - px, rem, em, %, vh, vw
  const spacingRegex = /^\d+(\.\d+)?(px|rem|em|%|vh|vw)$/;
  return spacingRegex.test(value) || value === '0';
};

describe('Theming System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyThemeTokens', () => {
    it('should apply simple theme tokens as CSS variables', () => {
      const tokens = {
        primary: '#007bff',
        secondary: '#6c757d',
        fontFamily: 'Arial, sans-serif'
      };

      const applied = applyThemeTokens(tokens);

      expect(mockSetCSSVariable).toHaveBeenCalledWith('--primary', '#007bff');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--secondary', '#6c757d');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--fontFamily', 'Arial, sans-serif');
      
      expect(applied).toEqual({
        '--primary': '#007bff',
        '--secondary': '#6c757d',
        '--fontFamily': 'Arial, sans-serif'
      });
    });

    it('should handle nested theme token objects', () => {
      const tokens = {
        colors: {
          primary: {
            50: '#eff6ff',
            500: '#3b82f6',
            900: '#1e3a8a'
          },
          gray: {
            100: '#f3f4f6',
            500: '#6b7280',
            900: '#111827'
          }
        },
        spacing: {
          xs: '0.25rem',
          sm: '0.5rem',
          md: '1rem',
          lg: '1.5rem'
        }
      };

      const applied = applyThemeTokens(tokens);

      // Check nested color applications
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--colors-primary-50', '#eff6ff');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--colors-primary-500', '#3b82f6');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--colors-primary-900', '#1e3a8a');
      
      // Check nested spacing applications
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--spacing-xs', '0.25rem');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--spacing-md', '1rem');
      
      expect(applied).toHaveProperty('--colors-primary-500', '#3b82f6');
      expect(applied).toHaveProperty('--spacing-md', '1rem');
    });

    it('should handle deeply nested theme tokens', () => {
      const tokens = {
        components: {
          button: {
            primary: {
              background: '#007bff',
              color: '#ffffff',
              hover: {
                background: '#0056b3'
              }
            }
          }
        }
      };

      applyThemeTokens(tokens);

      expect(mockSetCSSVariable).toHaveBeenCalledWith('--components-button-primary-background', '#007bff');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--components-button-primary-color', '#ffffff');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--components-button-primary-hover-background', '#0056b3');
    });

    it('should handle numeric values', () => {
      const tokens = {
        borderRadius: 8,
        lineHeight: 1.5,
        zIndex: {
          modal: 1000,
          dropdown: 100
        }
      };

      applyThemeTokens(tokens);

      expect(mockSetCSSVariable).toHaveBeenCalledWith('--borderRadius', '8');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--lineHeight', '1.5');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--zIndex-modal', '1000');
    });

    it('should handle empty theme tokens', () => {
      const tokens = {};

      const applied = applyThemeTokens(tokens);

      expect(mockSetCSSVariable).not.toHaveBeenCalled();
      expect(applied).toEqual({});
    });
  });

  describe('removeThemeTokens', () => {
    it('should remove simple theme tokens', () => {
      const tokens = {
        primary: '#007bff',
        secondary: '#6c757d'
      };

      const removed = removeThemeTokens(tokens);

      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--primary');
      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--secondary');
      expect(removed).toEqual(['--primary', '--secondary']);
    });

    it('should remove nested theme tokens', () => {
      const tokens = {
        colors: {
          primary: '#007bff',
          secondary: '#6c757d'
        },
        spacing: {
          sm: '0.5rem',
          md: '1rem'
        }
      };

      removeThemeTokens(tokens);

      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--colors-primary');
      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--colors-secondary');
      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--spacing-sm');
      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--spacing-md');
    });
  });

  describe('validateThemeTokens', () => {
    it('should validate valid theme tokens', () => {
      const tokens = {
        primary: '#007bff',
        spacing: '1rem',
        borderRadius: 8
      };

      const result = validateThemeTokens(tokens);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-object theme tokens', () => {
      const result1 = validateThemeTokens(null);
      const result2 = validateThemeTokens('invalid');
      const result3 = validateThemeTokens(123);

      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain('Theme tokens must be an object');
      
      expect(result2.isValid).toBe(false);
      expect(result3.isValid).toBe(false);
    });

    it('should validate color values', () => {
      const validColors = {
        hex: '#ff0000',
        rgb: 'rgb(255, 0, 0)',
        rgba: 'rgba(255, 0, 0, 0.5)',
        hsl: 'hsl(0, 100%, 50%)',
        named: 'red'
      };

      const invalidColors = {
        badHex: '#gggggg',
        badRgb: 'rgb(300, 0, 0)', // > 255
        empty: ''
      };

      const validResult = validateThemeTokens({ colors: validColors });
      const invalidResult = validateThemeTokens({ colors: invalidColors });

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should validate spacing values', () => {
      const validSpacing = {
        px: '16px',
        rem: '1.5rem',
        em: '2em',
        percent: '50%',
        viewport: '10vh',
        zero: '0'
      };

      const invalidSpacing = {
        noUnit: '16',
        invalidUnit: '16xyz',
        negative: '-16px' // depending on your validation rules
      };

      const validResult = validateThemeTokens({ spacing: validSpacing });
      const invalidResult = validateThemeTokens({ spacing: invalidSpacing });

      expect(validResult.isValid).toBe(true);
      expect(invalidResult.isValid).toBe(false);
    });

    it('should handle nested validation', () => {
      const tokens = {
        colors: {
          primary: {
            500: '#007bff', // valid
            600: '#invalid-color' // invalid
          }
        },
        spacing: {
          sm: '0.5rem', // valid
          md: 'invalid-spacing' // invalid
        }
      };

      const result = validateThemeTokens(tokens);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2);
      expect(result.errors).toContain('Invalid color value at colors.primary.600: #invalid-color');
      expect(result.errors).toContain('Invalid spacing value at spacing.md: invalid-spacing');
    });
  });

  describe('Theme Integration', () => {
    it('should handle real-world Strapi theme tokens', () => {
      const strapiThemeTokens = {
        colors: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a'
          },
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            500: '#6b7280',
            900: '#111827'
          }
        },
        spacing: {
          0: '0',
          1: '0.25rem',
          2: '0.5rem',
          4: '1rem',
          8: '2rem',
          16: '4rem'
        },
        typography: {
          fontFamily: {
            sans: 'Inter, sans-serif',
            mono: 'Monaco, monospace'
          },
          fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem'
          }
        }
      };

      const applied = applyThemeTokens(strapiThemeTokens);
      const validation = validateThemeTokens(strapiThemeTokens);

      expect(validation.isValid).toBe(true);
      expect(applied).toHaveProperty('--colors-primary-500', '#3b82f6');
      expect(applied).toHaveProperty('--spacing-4', '1rem');
      expect(applied).toHaveProperty('--typography-fontFamily-sans', 'Inter, sans-serif');
    });

    it('should handle theme token updates', () => {
      // Initial theme
      const initialTokens = {
        primary: '#007bff',
        secondary: '#6c757d'
      };

      // Updated theme
      const updatedTokens = {
        primary: '#28a745', // Changed
        secondary: '#6c757d', // Same
        tertiary: '#ffc107' // New
      };

      applyThemeTokens(initialTokens);
      mockSetCSSVariable.mockClear();

      applyThemeTokens(updatedTokens);

      expect(mockSetCSSVariable).toHaveBeenCalledWith('--primary', '#28a745');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--secondary', '#6c757d');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--tertiary', '#ffc107');
    });

    it('should handle theme token removal and cleanup', () => {
      const tokens = {
        oldPrimary: '#007bff',
        oldSecondary: '#6c757d'
      };

      applyThemeTokens(tokens);
      removeThemeTokens(tokens);

      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--oldPrimary');
      expect(mockRemoveCSSVariable).toHaveBeenCalledWith('--oldSecondary');
    });
  });

  describe('CSS Variable Usage', () => {
    it('should generate proper CSS variable names', () => {
      const tokens = {
        'kebab-case': '#123456',
        camelCase: '#654321',
        'PascalCase': '#abcdef'
      };

      applyThemeTokens(tokens);

      expect(mockSetCSSVariable).toHaveBeenCalledWith('--kebab-case', '#123456');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--camelCase', '#654321');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--PascalCase', '#abcdef');
    });

    it('should handle special characters in token names', () => {
      const tokens = {
        'color_primary': '#007bff',
        'spacing.sm': '0.5rem',
        'font-family': 'Arial'
      };

      applyThemeTokens(tokens);

      expect(mockSetCSSVariable).toHaveBeenCalledWith('--color_primary', '#007bff');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--spacing.sm', '0.5rem');
      expect(mockSetCSSVariable).toHaveBeenCalledWith('--font-family', 'Arial');
    });
  });
});
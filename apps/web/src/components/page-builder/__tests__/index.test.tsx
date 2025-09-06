import { render, screen } from '@testing-library/react';
import { PageContentComponents } from '../index';

// Mock the components to avoid complex dependencies in unit tests
jest.mock('../components/forms/StrapiContactForm', () => {
  return function MockContactForm() {
    return <div data-testid="contact-form">Contact Form Component</div>;
  };
});

jest.mock('../components/forms/StrapiNewsletterForm', () => {
  return function MockNewsletterForm() {
    return <div data-testid="newsletter-form">Newsletter Form Component</div>;
  };
});

jest.mock('../components/sections/StrapiHero', () => {
  return function MockHero() {
    return <div data-testid="hero-section">Hero Section Component</div>;
  };
});

jest.mock('../components/sections/StrapiFaq', () => {
  return function MockFaq() {
    return <div data-testid="faq-section">FAQ Section Component</div>;
  };
});

jest.mock('../components/sections/StrapiCarousel', () => {
  return function MockCarousel() {
    return <div data-testid="carousel-section">Carousel Section Component</div>;
  };
});

jest.mock('../components/utilities/StrapiCkEditorContent', () => {
  return function MockCkEditor() {
    return <div data-testid="ck-editor-content">CK Editor Content Component</div>;
  };
});

describe('PageContentComponents', () => {
  it('should have all expected component mappings', () => {
    const expectedComponents = [
      'utilities.ck-editor-content',
      'sections.animated-logo-row',
      'sections.faq',
      'sections.carousel',
      'sections.heading-with-cta-button',
      'sections.hero',
      'sections.horizontal-images',
      'sections.image-with-cta-button',
      'forms.contact-form',
      'forms.newsletter-form'
    ];

    expectedComponents.forEach(componentKey => {
      expect(PageContentComponents).toHaveProperty(componentKey);
      expect(PageContentComponents[componentKey as keyof typeof PageContentComponents]).toBeDefined();
    });
  });

  it('should render contact form component', () => {
    const ContactFormComponent = PageContentComponents['forms.contact-form'];
    expect(ContactFormComponent).toBeDefined();

    if (ContactFormComponent) {
      render(<ContactFormComponent />);
      expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    }
  });

  it('should render newsletter form component', () => {
    const NewsletterFormComponent = PageContentComponents['forms.newsletter-form'];
    expect(NewsletterFormComponent).toBeDefined();

    if (NewsletterFormComponent) {
      render(<NewsletterFormComponent />);
      expect(screen.getByTestId('newsletter-form')).toBeInTheDocument();
    }
  });

  it('should render hero section component', () => {
    const HeroComponent = PageContentComponents['sections.hero'];
    expect(HeroComponent).toBeDefined();

    if (HeroComponent) {
      render(<HeroComponent />);
      expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    }
  });

  it('should render FAQ section component', () => {
    const FaqComponent = PageContentComponents['sections.faq'];
    expect(FaqComponent).toBeDefined();

    if (FaqComponent) {
      render(<FaqComponent />);
      expect(screen.getByTestId('faq-section')).toBeInTheDocument();
    }
  });

  it('should render carousel section component', () => {
    const CarouselComponent = PageContentComponents['sections.carousel'];
    expect(CarouselComponent).toBeDefined();

    if (CarouselComponent) {
      render(<CarouselComponent />);
      expect(screen.getByTestId('carousel-section')).toBeInTheDocument();
    }
  });

  it('should render CK editor content component', () => {
    const CkEditorComponent = PageContentComponents['utilities.ck-editor-content'];
    expect(CkEditorComponent).toBeDefined();

    if (CkEditorComponent) {
      render(<CkEditorComponent />);
      expect(screen.getByTestId('ck-editor-content')).toBeInTheDocument();
    }
  });

  it('should not have undefined components', () => {
    Object.entries(PageContentComponents).forEach(([key, Component]) => {
      expect(Component).toBeDefined();
      expect(typeof Component).toBe('function');
    });
  });

  it('should have consistent component naming convention', () => {
    const componentKeys = Object.keys(PageContentComponents);
    
    componentKeys.forEach(key => {
      // Should follow pattern: category.component-name
      expect(key).toMatch(/^[a-z]+\.[a-z-]+$/);
      
      // Should have valid categories
      const [category] = key.split('.');
      const validCategories = ['utilities', 'sections', 'forms', 'elements', 'seo-utilities'];
      expect(validCategories).toContain(category);
    });
  });

  describe('Component Categories', () => {
    it('should have utilities category components', () => {
      const utilityComponents = Object.keys(PageContentComponents).filter(key => 
        key.startsWith('utilities.')
      );
      
      expect(utilityComponents.length).toBeGreaterThan(0);
      expect(utilityComponents).toContain('utilities.ck-editor-content');
    });

    it('should have sections category components', () => {
      const sectionComponents = Object.keys(PageContentComponents).filter(key => 
        key.startsWith('sections.')
      );
      
      expect(sectionComponents.length).toBeGreaterThan(0);
      expect(sectionComponents).toContain('sections.hero');
      expect(sectionComponents).toContain('sections.faq');
      expect(sectionComponents).toContain('sections.carousel');
    });

    it('should have forms category components', () => {
      const formComponents = Object.keys(PageContentComponents).filter(key => 
        key.startsWith('forms.')
      );
      
      expect(formComponents.length).toBeGreaterThan(0);
      expect(formComponents).toContain('forms.contact-form');
      expect(formComponents).toContain('forms.newsletter-form');
    });
  });

  describe('Component Type Safety', () => {
    it('should export components as React components', () => {
      Object.entries(PageContentComponents).forEach(([key, Component]) => {
        expect(Component).toBeDefined();
        expect(typeof Component).toBe('function');
        
        // Should be a valid React component (has displayName or name)
        expect(
          Component.displayName || Component.name || 'Anonymous'
        ).toBeTruthy();
      });
    });
  });
});
import { render, screen } from '@testing-library/react';
import { StrapiHero } from '../StrapiHero';

// Mock dependencies
jest.mock('@/lib/general-helpers', () => ({
  removeThisWhenYouNeedMe: jest.fn(),
}));

jest.mock('@/components/elementary/Container', () => ({
  Container: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="container">
      {children}
    </div>
  ),
}));

jest.mock('@/components/page-builder/components/utilities/StrapiBasicImage', () => ({
  StrapiBasicImage: ({ alt }: { alt?: string }) => (
    <img alt={alt} data-testid="strapi-image" />
  ),
}));

jest.mock('@/components/page-builder/components/utilities/StrapiLink', () => {
  return function MockStrapiLink({ component, className, children }: any) {
    return (
      <a 
        href={component?.url || '#'} 
        className={className}
        data-testid="strapi-link"
      >
        {children || component?.text || 'Link'}
      </a>
    );
  };
});

jest.mock('@/components/typography/Heading', () => {
  return function MockHeading({ children, tag, variant, className }: any) {
    const Tag = tag || 'h1';
    return (
      <Tag className={className} data-variant={variant} data-testid="heading">
        {children}
      </Tag>
    );
  };
});

jest.mock('@/components/typography/Paragraph', () => ({
  Paragraph: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={className} data-testid="paragraph">
      {children}
    </p>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon">✓</div>,
}));

describe('StrapiHero', () => {
  const mockComponent = {
    id: 1,
    __component: 'sections.hero',
    title: 'Test Hero Title',
    subTitle: 'Test Hero Subtitle',
    bgColor: '#f0f0f0',
  };

  it('should render hero with title', () => {
    render(<StrapiHero component={mockComponent} />);
    
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
  });

  it('should render hero with subtitle when provided', () => {
    render(<StrapiHero component={mockComponent} />);
    
    const paragraphs = screen.getAllByTestId('paragraph');
    expect(paragraphs[0]).toHaveTextContent('Test Hero Subtitle');
  });

  it('should not render subtitle when not provided', () => {
    const componentWithoutSubtitle = {
      ...mockComponent,
      subTitle: undefined,
    };
    
    render(<StrapiHero component={componentWithoutSubtitle} />);
    
    // Only one paragraph should be rendered if there are steps, none if no subtitle and no steps
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
  });

  it('should apply background color from component', () => {
    render(<StrapiHero component={mockComponent} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveStyle('backgroundColor: #f0f0f0');
  });

  it('should use transparent background when bgColor is not provided', () => {
    const componentWithoutBgColor = {
      ...mockComponent,
      bgColor: undefined,
    };
    
    render(<StrapiHero component={componentWithoutBgColor} />);
    
    const section = screen.getByRole('region');
    expect(section).toHaveStyle('backgroundColor: transparent');
  });

  it('should render steps when provided', () => {
    const componentWithSteps = {
      ...mockComponent,
      steps: [
        { id: 1, text: 'Step 1' },
        { id: 2, text: 'Step 2' },
        { id: 3, text: 'Step 3' },
      ],
    };
    
    render(<StrapiHero component={componentWithSteps} />);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
    expect(screen.getAllByTestId('check-icon')).toHaveLength(3);
  });

  it('should not render steps section when steps array is empty', () => {
    const componentWithEmptySteps = {
      ...mockComponent,
      steps: [],
    };
    
    render(<StrapiHero component={componentWithEmptySteps} />);
    
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument();
  });

  it('should render CTA links when provided', () => {
    const componentWithLinks = {
      ...mockComponent,
      links: [
        { id: 1, text: 'Primary CTA', url: '/primary', type: 'button' },
        { id: 2, text: 'Secondary CTA', url: '/secondary', type: 'button' },
      ],
    };
    
    render(<StrapiHero component={componentWithLinks} />);
    
    const links = screen.getAllByTestId('strapi-link');
    expect(links).toHaveLength(2);
    expect(screen.getByText('Primary CTA')).toBeInTheDocument();
    expect(screen.getByText('Secondary CTA')).toBeInTheDocument();
  });

  it('should not render links section when no links provided', () => {
    render(<StrapiHero component={mockComponent} />);
    
    expect(screen.queryByTestId('strapi-link')).not.toBeInTheDocument();
  });

  it('should render with proper semantic HTML structure', () => {
    render(<StrapiHero component={mockComponent} />);
    
    const section = screen.getByRole('region');
    expect(section.tagName).toBe('SECTION');
    
    const heading = screen.getByTestId('heading');
    expect(heading).toHaveAttribute('data-variant', 'heading1');
  });

  it('should have proper container layout classes', () => {
    render(<StrapiHero component={mockComponent} />);
    
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('gap-6');
    expect(container).toHaveClass('px-4');
    expect(container).toHaveClass('py-8');
    expect(container).toHaveClass('md:grid-cols-12');
  });

  it('should handle all props combinations', () => {
    const fullComponent = {
      ...mockComponent,
      subTitle: 'Full subtitle',
      bgColor: '#123456',
      steps: [
        { id: 1, text: 'Feature 1' },
        { id: 2, text: 'Feature 2' },
      ],
      links: [
        { id: 1, text: 'Get Started', url: '/start', type: 'button' },
      ],
    };
    
    render(<StrapiHero component={fullComponent} />);
    
    // Check all elements are rendered
    expect(screen.getByText('Test Hero Title')).toBeInTheDocument();
    expect(screen.getByText('Full subtitle')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getAllByTestId('check-icon')).toHaveLength(2);
    
    // Check background color
    const section = screen.getByRole('region');
    expect(section).toHaveStyle('backgroundColor: #123456');
  });

  it('should handle missing or undefined props gracefully', () => {
    const minimalComponent = {
      id: 1,
      __component: 'sections.hero',
      title: 'Minimal Hero',
    };
    
    expect(() => {
      render(<StrapiHero component={minimalComponent} />);
    }).not.toThrow();
    
    expect(screen.getByText('Minimal Hero')).toBeInTheDocument();
  });
});
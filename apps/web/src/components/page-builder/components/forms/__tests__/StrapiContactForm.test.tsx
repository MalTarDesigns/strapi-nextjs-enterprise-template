import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StrapiContactForm from '../StrapiContactForm';

// Mock dependencies
jest.mock('@/lib/general-helpers', () => ({
  removeThisWhenYouNeedMe: jest.fn(),
}));

jest.mock('@/components/forms/AppForm', () => {
  return function MockAppForm({ 
    children, 
    onSubmit, 
    className 
  }: { 
    children: React.ReactNode; 
    onSubmit: (data: any) => void;
    className?: string;
  }) {
    return (
      <form 
        className={className}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const data = Object.fromEntries(formData.entries());
          onSubmit(data);
        }}
        data-testid="contact-form"
      >
        {children}
      </form>
    );
  };
});

jest.mock('@/components/forms/AppField', () => {
  return function MockAppField({ 
    name, 
    label, 
    type = 'text', 
    required = false,
    placeholder 
  }: { 
    name: string; 
    label: string; 
    type?: string; 
    required?: boolean;
    placeholder?: string;
  }) {
    return (
      <div data-testid={`field-${name}`}>
        <label htmlFor={name}>{label} {required && '*'}</label>
        {type === 'textarea' ? (
          <textarea 
            id={name}
            name={name} 
            required={required}
            placeholder={placeholder}
            data-testid={`input-${name}`}
          />
        ) : (
          <input 
            id={name}
            name={name} 
            type={type} 
            required={required}
            placeholder={placeholder}
            data-testid={`input-${name}`}
          />
        )}
      </div>
    );
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, type, disabled, ...props }: any) => (
    <button 
      type={type} 
      disabled={disabled} 
      data-testid="submit-button"
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/typography/Heading', () => {
  return function MockHeading({ children, tag = 'h2' }: any) {
    const Tag = tag;
    return <Tag data-testid="heading">{children}</Tag>;
  };
});

jest.mock('@/components/typography/Paragraph', () => ({
  Paragraph: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="paragraph">{children}</p>
  ),
}));

// Mock fetch for form submission
global.fetch = jest.fn();

describe('StrapiContactForm', () => {
  const mockComponent = {
    id: 1,
    __component: 'forms.contact-form',
    title: 'Contact Us',
    description: 'Send us a message',
    fields: [
      {
        id: 1,
        name: 'name',
        label: 'Full Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your name'
      },
      {
        id: 2,
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter your email'
      },
      {
        id: 3,
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Enter your message'
      }
    ],
    submitButtonText: 'Send Message',
    successMessage: 'Thank you for your message!',
    errorMessage: 'Failed to send message. Please try again.'
  };

  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render contact form with title and description', () => {
    render(<StrapiContactForm component={mockComponent} />);
    
    expect(screen.getByTestId('heading')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByTestId('paragraph')).toBeInTheDocument();
    expect(screen.getByText('Send us a message')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    render(<StrapiContactForm component={mockComponent} />);
    
    expect(screen.getByTestId('field-name')).toBeInTheDocument();
    expect(screen.getByTestId('field-email')).toBeInTheDocument();
    expect(screen.getByTestId('field-message')).toBeInTheDocument();
    
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Message *')).toBeInTheDocument();
  });

  it('should render submit button with custom text', () => {
    render(<StrapiContactForm component={mockComponent} />);
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Send Message');
  });

  it('should handle form submission successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    const user = userEvent.setup();
    render(<StrapiContactForm component={mockComponent} />);
    
    // Fill out the form
    await user.type(screen.getByTestId('input-name'), 'John Doe');
    await user.type(screen.getByTestId('input-email'), 'john@example.com');
    await user.type(screen.getByTestId('input-message'), 'Test message');
    
    // Submit the form
    await user.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message'
        })
      });
    });
  });

  it('should handle form submission failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const user = userEvent.setup();
    render(<StrapiContactForm component={mockComponent} />);
    
    // Fill out the form
    await user.type(screen.getByTestId('input-name'), 'John Doe');
    await user.type(screen.getByTestId('input-email'), 'john@example.com');
    await user.type(screen.getByTestId('input-message'), 'Test message');
    
    // Submit the form
    await user.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should render form without title when not provided', () => {
    const componentWithoutTitle = {
      ...mockComponent,
      title: undefined
    };
    
    render(<StrapiContactForm component={componentWithoutTitle} />);
    
    expect(screen.queryByTestId('heading')).not.toBeInTheDocument();
  });

  it('should render form without description when not provided', () => {
    const componentWithoutDescription = {
      ...mockComponent,
      description: undefined
    };
    
    render(<StrapiContactForm component={componentWithoutDescription} />);
    
    expect(screen.queryByTestId('paragraph')).not.toBeInTheDocument();
  });

  it('should handle different field types correctly', () => {
    const componentWithDifferentFields = {
      ...mockComponent,
      fields: [
        {
          id: 1,
          name: 'text_field',
          label: 'Text Field',
          type: 'text',
          required: false
        },
        {
          id: 2,
          name: 'email_field',
          label: 'Email Field',
          type: 'email',
          required: true
        },
        {
          id: 3,
          name: 'textarea_field',
          label: 'Textarea Field',
          type: 'textarea',
          required: false
        },
        {
          id: 4,
          name: 'tel_field',
          label: 'Phone Field',
          type: 'tel',
          required: false
        }
      ]
    };
    
    render(<StrapiContactForm component={componentWithDifferentFields} />);
    
    expect(screen.getByTestId('input-text_field')).toHaveAttribute('type', 'text');
    expect(screen.getByTestId('input-email_field')).toHaveAttribute('type', 'email');
    expect(screen.getByTestId('input-textarea_field').tagName).toBe('TEXTAREA');
    expect(screen.getByTestId('input-tel_field')).toHaveAttribute('type', 'tel');
  });

  it('should show required indicators for required fields', () => {
    render(<StrapiContactForm component={mockComponent} />);
    
    // All fields in mockComponent are required
    expect(screen.getByText('Full Name *')).toBeInTheDocument();
    expect(screen.getByText('Email Address *')).toBeInTheDocument();
    expect(screen.getByText('Message *')).toBeInTheDocument();
  });

  it('should handle empty fields array', () => {
    const componentWithoutFields = {
      ...mockComponent,
      fields: []
    };
    
    render(<StrapiContactForm component={componentWithoutFields} />);
    
    expect(screen.getByTestId('contact-form')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should use default submit button text when not provided', () => {
    const componentWithoutButtonText = {
      ...mockComponent,
      submitButtonText: undefined
    };
    
    render(<StrapiContactForm component={componentWithoutButtonText} />);
    
    const submitButton = screen.getByTestId('submit-button');
    expect(submitButton).toHaveTextContent('Submit'); // Default text
  });

  it('should handle form validation', async () => {
    const user = userEvent.setup();
    render(<StrapiContactForm component={mockComponent} />);
    
    // Try to submit form without filling required fields
    await user.click(screen.getByTestId('submit-button'));
    
    // Check that required fields are marked as required
    expect(screen.getByTestId('input-name')).toBeRequired();
    expect(screen.getByTestId('input-email')).toBeRequired();
    expect(screen.getByTestId('input-message')).toBeRequired();
  });

  it('should have proper form structure and accessibility', () => {
    render(<StrapiContactForm component={mockComponent} />);
    
    const form = screen.getByTestId('contact-form');
    expect(form.tagName).toBe('FORM');
    
    // Check that labels are associated with inputs
    mockComponent.fields.forEach(field => {
      const label = screen.getByLabelText(new RegExp(field.label));
      expect(label).toBeInTheDocument();
    });
  });

  it('should render field placeholders', () => {
    render(<StrapiContactForm component={mockComponent} />);
    
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
  });
});
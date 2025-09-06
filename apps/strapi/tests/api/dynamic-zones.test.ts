import request from 'supertest';
import { getStrapiInstance, createTestData, cleanupTestData } from '../helpers/strapi';

describe('Dynamic Zone Block Components', () => {
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

  describe('Hero Section Block', () => {
    it('should create page with hero block', async () => {
      const heroBlockData = {
        data: {
          title: 'Hero Block Test',
          slug: 'hero-block-test',
          fullPath: '/hero-block-test',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'Hero Title',
              description: 'Hero Description',
              backgroundImage: null,
              ctaButtons: [
                {
                  text: 'Primary CTA',
                  url: '/primary-cta',
                  variant: 'primary'
                },
                {
                  text: 'Secondary CTA',
                  url: '/secondary-cta',
                  variant: 'secondary'
                }
              ]
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(heroBlockData)
        .expect(200);

      const heroBlock = response.body.data.attributes.blocks[0];
      expect(heroBlock.__component).toBe('sections.hero');
      expect(heroBlock.title).toBe('Hero Title');
      expect(heroBlock.description).toBe('Hero Description');
      expect(heroBlock.ctaButtons).toHaveLength(2);
    });

    it('should validate hero block required fields', async () => {
      const invalidHeroData = {
        data: {
          title: 'Invalid Hero Test',
          slug: 'invalid-hero-test',
          fullPath: '/invalid-hero-test',
          blocks: [
            {
              __component: 'sections.hero'
              // Missing required title
            }
          ]
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(invalidHeroData)
        .expect(400);
    });
  });

  describe('FAQ Section Block', () => {
    it('should create page with FAQ block', async () => {
      const faqBlockData = {
        data: {
          title: 'FAQ Block Test',
          slug: 'faq-block-test',
          fullPath: '/faq-block-test',
          blocks: [
            {
              __component: 'sections.faq',
              title: 'Frequently Asked Questions',
              items: [
                {
                  question: 'What is this?',
                  answer: 'This is a test FAQ.'
                },
                {
                  question: 'How does it work?',
                  answer: 'It works by testing.'
                }
              ]
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(faqBlockData)
        .expect(200);

      const faqBlock = response.body.data.attributes.blocks[0];
      expect(faqBlock.__component).toBe('sections.faq');
      expect(faqBlock.title).toBe('Frequently Asked Questions');
      expect(faqBlock.items).toHaveLength(2);
      expect(faqBlock.items[0]).toHaveProperty('question');
      expect(faqBlock.items[0]).toHaveProperty('answer');
    });
  });

  describe('Carousel Section Block', () => {
    it('should create page with carousel block', async () => {
      const carouselBlockData = {
        data: {
          title: 'Carousel Block Test',
          slug: 'carousel-block-test',
          fullPath: '/carousel-block-test',
          blocks: [
            {
              __component: 'sections.carousel',
              title: 'Image Carousel',
              items: [
                {
                  title: 'Slide 1',
                  description: 'First slide description',
                  image: null
                },
                {
                  title: 'Slide 2',
                  description: 'Second slide description',
                  image: null
                }
              ],
              autoplay: true,
              showDots: true,
              showArrows: true
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(carouselBlockData)
        .expect(200);

      const carouselBlock = response.body.data.attributes.blocks[0];
      expect(carouselBlock.__component).toBe('sections.carousel');
      expect(carouselBlock.title).toBe('Image Carousel');
      expect(carouselBlock.items).toHaveLength(2);
      expect(carouselBlock.autoplay).toBe(true);
      expect(carouselBlock.showDots).toBe(true);
    });
  });

  describe('Contact Form Block', () => {
    it('should create page with contact form block', async () => {
      const contactFormData = {
        data: {
          title: 'Contact Form Test',
          slug: 'contact-form-test',
          fullPath: '/contact-form-test',
          blocks: [
            {
              __component: 'forms.contact-form',
              title: 'Get in Touch',
              description: 'Send us a message',
              fields: [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  required: true
                },
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  required: true
                },
                {
                  name: 'message',
                  label: 'Message',
                  type: 'textarea',
                  required: true
                }
              ],
              submitButtonText: 'Send Message',
              successMessage: 'Thank you for your message!',
              errorMessage: 'Something went wrong. Please try again.'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(contactFormData)
        .expect(200);

      const contactBlock = response.body.data.attributes.blocks[0];
      expect(contactBlock.__component).toBe('forms.contact-form');
      expect(contactBlock.title).toBe('Get in Touch');
      expect(contactBlock.fields).toHaveLength(3);
      expect(contactBlock.fields[0]).toHaveProperty('name', 'name');
      expect(contactBlock.fields[0]).toHaveProperty('required', true);
    });
  });

  describe('Newsletter Form Block', () => {
    it('should create page with newsletter form block', async () => {
      const newsletterFormData = {
        data: {
          title: 'Newsletter Form Test',
          slug: 'newsletter-form-test',
          fullPath: '/newsletter-form-test',
          blocks: [
            {
              __component: 'forms.newsletter-form',
              title: 'Subscribe to Newsletter',
              description: 'Stay updated with our latest news',
              placeholder: 'Enter your email address',
              buttonText: 'Subscribe',
              successMessage: 'Successfully subscribed!',
              errorMessage: 'Subscription failed. Please try again.'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(newsletterFormData)
        .expect(200);

      const newsletterBlock = response.body.data.attributes.blocks[0];
      expect(newsletterBlock.__component).toBe('forms.newsletter-form');
      expect(newsletterBlock.title).toBe('Subscribe to Newsletter');
      expect(newsletterBlock.placeholder).toBe('Enter your email address');
      expect(newsletterBlock.buttonText).toBe('Subscribe');
    });
  });

  describe('CK Editor Content Block', () => {
    it('should create page with rich content block', async () => {
      const richContentData = {
        data: {
          title: 'Rich Content Test',
          slug: 'rich-content-test',
          fullPath: '/rich-content-test',
          blocks: [
            {
              __component: 'utilities.ck-editor-content',
              content: '<h2>Rich Content Title</h2><p>This is <strong>rich text</strong> content with <em>formatting</em>.</p><ul><li>List item 1</li><li>List item 2</li></ul>'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(richContentData)
        .expect(200);

      const contentBlock = response.body.data.attributes.blocks[0];
      expect(contentBlock.__component).toBe('utilities.ck-editor-content');
      expect(contentBlock.content).toContain('<h2>Rich Content Title</h2>');
      expect(contentBlock.content).toContain('<strong>rich text</strong>');
    });

    it('should validate HTML content in CK editor block', async () => {
      const invalidContentData = {
        data: {
          title: 'Invalid Content Test',
          slug: 'invalid-content-test',
          fullPath: '/invalid-content-test',
          blocks: [
            {
              __component: 'utilities.ck-editor-content',
              content: '<script>alert("XSS")</script>' // Should be sanitized/rejected
            }
          ]
        }
      };

      // Depending on your validation rules, this might be accepted but sanitized
      // or rejected entirely
      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(invalidContentData);

      if (response.status === 200) {
        // If accepted, script tags should be removed
        const contentBlock = response.body.data.attributes.blocks[0];
        expect(contentBlock.content).not.toContain('<script>');
      } else {
        // If rejected, expect 400
        expect(response.status).toBe(400);
      }
    });
  });

  describe('Image with CTA Button Block', () => {
    it('should create page with image CTA block', async () => {
      const imageCTAData = {
        data: {
          title: 'Image CTA Test',
          slug: 'image-cta-test',
          fullPath: '/image-cta-test',
          blocks: [
            {
              __component: 'sections.image-with-cta-button',
              title: 'Feature Image',
              description: 'This is a featured image with call to action',
              image: null, // Would be populated with actual image ID
              ctaButton: {
                text: 'Learn More',
                url: '/learn-more',
                variant: 'primary'
              },
              imagePosition: 'left'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(imageCTAData)
        .expect(200);

      const imageCTABlock = response.body.data.attributes.blocks[0];
      expect(imageCTABlock.__component).toBe('sections.image-with-cta-button');
      expect(imageCTABlock.title).toBe('Feature Image');
      expect(imageCTABlock.ctaButton).toHaveProperty('text', 'Learn More');
      expect(imageCTABlock.imagePosition).toBe('left');
    });
  });

  describe('Mixed Block Components', () => {
    it('should create page with multiple different blocks', async () => {
      const mixedBlockData = {
        data: {
          title: 'Mixed Blocks Test',
          slug: 'mixed-blocks-test',
          fullPath: '/mixed-blocks-test',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'Page Hero',
              description: 'Hero section description'
            },
            {
              __component: 'utilities.ck-editor-content',
              content: '<h2>Content Section</h2><p>Some content here.</p>'
            },
            {
              __component: 'sections.faq',
              title: 'FAQ Section',
              items: [
                {
                  question: 'Question 1?',
                  answer: 'Answer 1'
                }
              ]
            },
            {
              __component: 'forms.newsletter-form',
              title: 'Subscribe',
              description: 'Get updates',
              buttonText: 'Subscribe Now'
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(mixedBlockData)
        .expect(200);

      const blocks = response.body.data.attributes.blocks;
      expect(blocks).toHaveLength(4);
      expect(blocks[0].__component).toBe('sections.hero');
      expect(blocks[1].__component).toBe('utilities.ck-editor-content');
      expect(blocks[2].__component).toBe('sections.faq');
      expect(blocks[3].__component).toBe('forms.newsletter-form');
    });

    it('should maintain block order', async () => {
      const orderedBlockData = {
        data: {
          title: 'Block Order Test',
          slug: 'block-order-test',
          fullPath: '/block-order-test',
          blocks: [
            {
              __component: 'sections.hero',
              title: 'First Block'
            },
            {
              __component: 'utilities.ck-editor-content',
              content: '<p>Second Block</p>'
            },
            {
              __component: 'sections.faq',
              title: 'Third Block',
              items: []
            }
          ]
        }
      };

      const response = await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(orderedBlockData)
        .expect(200);

      const blocks = response.body.data.attributes.blocks;
      expect(blocks[0].__component).toBe('sections.hero');
      expect(blocks[1].__component).toBe('utilities.ck-editor-content');
      expect(blocks[2].__component).toBe('sections.faq');
    });
  });

  describe('Block Validation', () => {
    it('should reject invalid component types', async () => {
      const invalidComponentData = {
        data: {
          title: 'Invalid Component Test',
          slug: 'invalid-component-test',
          fullPath: '/invalid-component-test',
          blocks: [
            {
              __component: 'invalid.component-type',
              title: 'Invalid Component'
            }
          ]
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(invalidComponentData)
        .expect(400);
    });

    it('should validate component-specific required fields', async () => {
      const missingFieldsData = {
        data: {
          title: 'Missing Fields Test',
          slug: 'missing-fields-test',
          fullPath: '/missing-fields-test',
          blocks: [
            {
              __component: 'sections.hero'
              // Missing required title field for hero component
            }
          ]
        }
      };

      await request(strapi.server.httpServer)
        .post('/api/pages')
        .send(missingFieldsData)
        .expect(400);
    });
  });
});
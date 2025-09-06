import { formatStrapiMediaUrl } from '../strapi-helpers';

describe('strapi-helpers', () => {
  describe('formatStrapiMediaUrl', () => {
    it('should return undefined for null input', () => {
      expect(formatStrapiMediaUrl(null)).toBeUndefined();
    });

    it('should return undefined for undefined input', () => {
      expect(formatStrapiMediaUrl(undefined)).toBeUndefined();
    });

    it('should return the same URL for HTTP URLs', () => {
      const httpUrl = 'http://example.com/image.jpg';
      expect(formatStrapiMediaUrl(httpUrl)).toBe(httpUrl);
    });

    it('should return the same URL for HTTPS URLs', () => {
      const httpsUrl = 'https://example.com/image.jpg';
      expect(formatStrapiMediaUrl(httpsUrl)).toBe(httpsUrl);
    });

    it('should format local upload URLs that start with /uploads', () => {
      const localUrl = '/uploads/image.jpg';
      const expected = '/api/asset/uploads/image.jpg';
      expect(formatStrapiMediaUrl(localUrl)).toBe(expected);
    });

    it('should format nested local upload URLs', () => {
      const nestedUrl = '/uploads/folder/subfolder/image.jpg';
      const expected = '/api/asset/uploads/folder/subfolder/image.jpg';
      expect(formatStrapiMediaUrl(nestedUrl)).toBe(expected);
    });

    it('should return the same URL for relative URLs that do not start with /uploads', () => {
      const relativeUrl = '/images/logo.png';
      expect(formatStrapiMediaUrl(relativeUrl)).toBe(relativeUrl);
    });

    it('should return the same URL for paths that do not start with http or /uploads', () => {
      const otherUrl = '/api/custom/image.jpg';
      expect(formatStrapiMediaUrl(otherUrl)).toBe(otherUrl);
    });

    it('should handle empty string', () => {
      expect(formatStrapiMediaUrl('')).toBe('');
    });

    it('should handle URLs with query parameters', () => {
      const httpUrlWithQuery = 'https://example.com/image.jpg?width=300&height=200';
      expect(formatStrapiMediaUrl(httpUrlWithQuery)).toBe(httpUrlWithQuery);
    });

    it('should handle local upload URLs with query parameters', () => {
      const localUrlWithQuery = '/uploads/image.jpg?v=1';
      const expected = '/api/asset/uploads/image.jpg?v=1';
      expect(formatStrapiMediaUrl(localUrlWithQuery)).toBe(expected);
    });

    it('should handle URLs with fragments', () => {
      const httpUrlWithFragment = 'https://example.com/image.jpg#section';
      expect(formatStrapiMediaUrl(httpUrlWithFragment)).toBe(httpUrlWithFragment);
    });

    it('should handle local upload URLs with fragments', () => {
      const localUrlWithFragment = '/uploads/image.jpg#preview';
      const expected = '/api/asset/uploads/image.jpg#preview';
      expect(formatStrapiMediaUrl(localUrlWithFragment)).toBe(expected);
    });

    it('should handle complex S3 URLs', () => {
      const s3Url = 'https://bucket-name.s3.amazonaws.com/uploads/image.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256';
      expect(formatStrapiMediaUrl(s3Url)).toBe(s3Url);
    });

    it('should handle CDN URLs', () => {
      const cdnUrl = 'https://cdn.example.com/images/optimized.webp';
      expect(formatStrapiMediaUrl(cdnUrl)).toBe(cdnUrl);
    });

    it('should handle data URLs', () => {
      const dataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...';
      expect(formatStrapiMediaUrl(dataUrl)).toBe(dataUrl);
    });

    it('should handle protocol-relative URLs', () => {
      const protocolRelativeUrl = '//example.com/image.jpg';
      expect(formatStrapiMediaUrl(protocolRelativeUrl)).toBe(protocolRelativeUrl);
    });

    it('should handle FTP URLs', () => {
      const ftpUrl = 'ftp://example.com/image.jpg';
      expect(formatStrapiMediaUrl(ftpUrl)).toBe(ftpUrl);
    });

    it('should handle file URLs', () => {
      const fileUrl = 'file:///path/to/image.jpg';
      expect(formatStrapiMediaUrl(fileUrl)).toBe(fileUrl);
    });

    describe('Edge Cases', () => {
      it('should handle URLs starting with /uploads but with additional paths', () => {
        const uploadsSubPath = '/uploads-backup/image.jpg';
        expect(formatStrapiMediaUrl(uploadsSubPath)).toBe(uploadsSubPath);
      });

      it('should handle URLs containing /uploads but not starting with it', () => {
        const containsUploads = '/api/uploads/image.jpg';
        expect(formatStrapiMediaUrl(containsUploads)).toBe(containsUploads);
      });

      it('should handle malformed URLs gracefully', () => {
        const malformedUrl = 'http:/malformed-url';
        expect(formatStrapiMediaUrl(malformedUrl)).toBe(malformedUrl);
      });

      it('should handle URLs with only /uploads', () => {
        const uploadsOnly = '/uploads';
        const expected = '/api/asset/uploads';
        expect(formatStrapiMediaUrl(uploadsOnly)).toBe(expected);
      });

      it('should handle URLs with /uploads/', () => {
        const uploadsWithSlash = '/uploads/';
        const expected = '/api/asset/uploads/';
        expect(formatStrapiMediaUrl(uploadsWithSlash)).toBe(expected);
      });
    });

    describe('Type Safety', () => {
      it('should handle non-string types gracefully', () => {
        // The function expects string | StaticImport | undefined | null
        // StaticImport is an object, so let's test with an object
        const staticImport = { src: '/test.jpg', height: 100, width: 100 };
        expect(formatStrapiMediaUrl(staticImport as any)).toBe(staticImport);
      });

      it('should maintain type consistency', () => {
        const url = 'https://example.com/image.jpg';
        const result = formatStrapiMediaUrl(url);
        expect(typeof result).toBe('string');
      });
    });

    describe('Real-world Scenarios', () => {
      it('should handle typical Strapi local media URLs', () => {
        const strapiUrls = [
          '/uploads/thumbnail_image_abc123.jpg',
          '/uploads/large_photo_def456.png',
          '/uploads/small_icon_ghi789.svg',
          '/uploads/documents/pdf_file.pdf'
        ];

        strapiUrls.forEach(url => {
          const result = formatStrapiMediaUrl(url);
          expect(result).toBe(`/api/asset${url}`);
          expect(result).toMatch(/^\/api\/asset\/uploads\//);
        });
      });

      it('should handle typical S3 URLs from Strapi', () => {
        const s3Urls = [
          'https://my-bucket.s3.us-east-1.amazonaws.com/uploads/image.jpg',
          'https://my-bucket.s3.amazonaws.com/uploads/documents/file.pdf',
          'https://my-cdn.cloudfront.net/uploads/optimized.webp'
        ];

        s3Urls.forEach(url => {
          expect(formatStrapiMediaUrl(url)).toBe(url);
        });
      });

      it('should handle mixed URL scenarios in an array-like structure', () => {
        const mixedUrls = [
          'https://cdn.example.com/image1.jpg', // Should remain unchanged
          '/uploads/image2.jpg', // Should be prefixed
          'http://example.com/image3.jpg', // Should remain unchanged
          '/uploads/folder/image4.jpg', // Should be prefixed
        ];

        const results = mixedUrls.map(formatStrapiMediaUrl);
        
        expect(results[0]).toBe('https://cdn.example.com/image1.jpg');
        expect(results[1]).toBe('/api/asset/uploads/image2.jpg');
        expect(results[2]).toBe('http://example.com/image3.jpg');
        expect(results[3]).toBe('/api/asset/uploads/folder/image4.jpg');
      });
    });
  });
});
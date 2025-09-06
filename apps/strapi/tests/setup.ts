import Strapi from '@strapi/strapi';
import { setupStrapi, cleanupStrapi } from './helpers/strapi';

let instance: Strapi | null = null;

beforeAll(async () => {
  instance = await setupStrapi();
});

afterAll(async () => {
  if (instance) {
    await cleanupStrapi(instance);
  }
});

// Global test timeout
jest.setTimeout(30000);
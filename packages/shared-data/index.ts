// This value must be in sync with the fullPath of root page in the Strapi
export const ROOT_PAGE_PATH = "/";

// Simple stub for Strapi types to prevent build errors
export namespace Data {
  export interface Component {
    [key: string]: any;
  }
  
  export interface ComponentMap {
    [component: string]: any;
  }
}

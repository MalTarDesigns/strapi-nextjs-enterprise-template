export type { Core, Utils } from "@strapi/strapi";

export * from "./generated/components";
export * from "./generated/contentTypes";

// Temporary Data namespace for components
export namespace Data {
  export type Component = any; // This should be properly typed later
}

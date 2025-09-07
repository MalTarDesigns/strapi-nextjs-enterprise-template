import { Core } from "@strapi/strapi";

export type StrapiPreviewConfig = {
  enabled: boolean;
  previewSecret?: string;
  clientUrl?: string;
  enabledContentTypeUids: Array<string>;
};

export type LifecycleEventType<T extends string> = {
  model?: any;
  params?: any;
  result?: any;
  state?: any;
};

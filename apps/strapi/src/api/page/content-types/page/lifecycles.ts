import { LifecycleEventType } from "../../../../../types/internals";
import { PAGES_HIERARCHY_ENABLED } from "../../../../utils/constants";
import { handleHierarchyBeforeCreate } from "../../../../utils/hierarchy";
import { 
  triggerRevalidation, 
  createPageRevalidationPayload 
} from "../../../../utils/revalidation";

export default {
  async beforeCreate(event: LifecycleEventType<"beforeCreate">) {
    // Security audit logging
    strapi.log.info('Page Lifecycle: Creating new page', {
      title: event.params.data.title,
      slug: event.params.data.slug,
      userId: event.state?.user?.id,
      userEmail: event.state?.user?.email,
      userRole: event.state?.user?.role?.name,
      timestamp: new Date().toISOString(),
    });

    if (PAGES_HIERARCHY_ENABLED) {
      await handleHierarchyBeforeCreate(event, "api::page.page");
    }
  },

  async afterCreate(event: LifecycleEventType<"afterCreate">) {
    if (event.result) {
      // Security audit logging
      strapi.log.info('Page Lifecycle: Page created successfully', {
        pageId: event.result.id,
        title: event.result.title,
        slug: event.result.slug,
        publishedAt: event.result.publishedAt,
        userId: event.state?.user?.id,
        timestamp: new Date().toISOString(),
      });

      const payload = createPageRevalidationPayload('entry.create', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUpdate(event: LifecycleEventType<"afterUpdate">) {
    if (event.result) {
      // Security audit logging
      strapi.log.info('Page Lifecycle: Page updated successfully', {
        pageId: event.result.id,
        title: event.result.title,
        slug: event.result.slug,
        publishedAt: event.result.publishedAt,
        userId: event.state?.user?.id,
        timestamp: new Date().toISOString(),
      });

      const payload = createPageRevalidationPayload('entry.update', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterDelete(event: LifecycleEventType<"afterDelete">) {
    if (event.result) {
      // Security audit logging - deletion is a critical operation
      strapi.log.warn('Page Lifecycle: Page deleted', {
        pageId: event.result.id,
        title: event.result.title,
        slug: event.result.slug,
        userId: event.state?.user?.id,
        userEmail: event.state?.user?.email,
        userRole: event.state?.user?.role?.name,
        timestamp: new Date().toISOString(),
      });

      const payload = createPageRevalidationPayload('entry.delete', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterPublish(event: LifecycleEventType<"afterPublish">) {
    if (event.result) {
      const payload = createPageRevalidationPayload('entry.publish', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUnpublish(event: LifecycleEventType<"afterUnpublish">) {
    if (event.result) {
      const payload = createPageRevalidationPayload('entry.unpublish', event.result);
      await triggerRevalidation(payload);
    }
  },
};

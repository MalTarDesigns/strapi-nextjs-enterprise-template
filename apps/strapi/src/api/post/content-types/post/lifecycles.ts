import { LifecycleEventType } from "../../../../../types/internals";
import { 
  triggerRevalidation, 
  createPostRevalidationPayload 
} from "../../../../utils/revalidation";

export default {
  async beforeCreate(event: LifecycleEventType<"beforeCreate">) {
    // Security audit logging
    strapi.log.info('Post Lifecycle: Creating new post', {
      title: event.params.data.title,
      slug: event.params.data.slug,
      userId: event.state?.user?.id,
      userEmail: event.state?.user?.email,
      userRole: event.state?.user?.role?.name,
      timestamp: new Date().toISOString(),
    });
  },

  async afterCreate(event: LifecycleEventType<"afterCreate">) {
    if (event.result) {
      // Security audit logging
      strapi.log.info('Post Lifecycle: Post created successfully', {
        postId: event.result.id,
        title: event.result.title,
        slug: event.result.slug,
        publishedAt: event.result.publishedAt,
        userId: event.state?.user?.id,
        timestamp: new Date().toISOString(),
      });

      const payload = createPostRevalidationPayload('entry.create', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUpdate(event: LifecycleEventType<"afterUpdate">) {
    if (event.result) {
      // Security audit logging
      strapi.log.info('Post Lifecycle: Post updated successfully', {
        postId: event.result.id,
        title: event.result.title,
        slug: event.result.slug,
        publishedAt: event.result.publishedAt,
        userId: event.state?.user?.id,
        timestamp: new Date().toISOString(),
      });

      const payload = createPostRevalidationPayload('entry.update', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterDelete(event: LifecycleEventType<"afterDelete">) {
    if (event.result) {
      // Security audit logging - deletion is a critical operation
      strapi.log.warn('Post Lifecycle: Post deleted', {
        postId: event.result.id,
        title: event.result.title,
        slug: event.result.slug,
        userId: event.state?.user?.id,
        userEmail: event.state?.user?.email,
        userRole: event.state?.user?.role?.name,
        timestamp: new Date().toISOString(),
      });

      const payload = createPostRevalidationPayload('entry.delete', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterPublish(event: LifecycleEventType<"afterPublish">) {
    if (event.result) {
      const payload = createPostRevalidationPayload('entry.publish', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUnpublish(event: LifecycleEventType<"afterUnpublish">) {
    if (event.result) {
      const payload = createPostRevalidationPayload('entry.unpublish', event.result);
      await triggerRevalidation(payload);
    }
  },
};
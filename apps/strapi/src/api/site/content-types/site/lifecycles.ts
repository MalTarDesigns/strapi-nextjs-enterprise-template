import { LifecycleEventType } from "../../../../../types/internals";
import { 
  triggerRevalidation, 
  createSiteRevalidationPayload 
} from "../../../../utils/revalidation";

export default {
  async afterCreate(event: LifecycleEventType<"afterCreate">) {
    if (event.result) {
      const payload = createSiteRevalidationPayload('entry.create', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUpdate(event: LifecycleEventType<"afterUpdate">) {
    if (event.result) {
      const payload = createSiteRevalidationPayload('entry.update', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterDelete(event: LifecycleEventType<"afterDelete">) {
    if (event.result) {
      const payload = createSiteRevalidationPayload('entry.delete', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterPublish(event: LifecycleEventType<"afterPublish">) {
    if (event.result) {
      const payload = createSiteRevalidationPayload('entry.publish', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUnpublish(event: LifecycleEventType<"afterUnpublish">) {
    if (event.result) {
      const payload = createSiteRevalidationPayload('entry.unpublish', event.result);
      await triggerRevalidation(payload);
    }
  },
};
import { LifecycleEventType } from "../../../../../types/internals";
import { 
  triggerRevalidation, 
  createNavigationRevalidationPayload 
} from "../../../../utils/revalidation";

export default {
  async afterCreate(event: LifecycleEventType<"afterCreate">) {
    if (event.result) {
      const payload = createNavigationRevalidationPayload('entry.create', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUpdate(event: LifecycleEventType<"afterUpdate">) {
    if (event.result) {
      const payload = createNavigationRevalidationPayload('entry.update', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterDelete(event: LifecycleEventType<"afterDelete">) {
    if (event.result) {
      const payload = createNavigationRevalidationPayload('entry.delete', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterPublish(event: LifecycleEventType<"afterPublish">) {
    if (event.result) {
      const payload = createNavigationRevalidationPayload('entry.publish', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUnpublish(event: LifecycleEventType<"afterUnpublish">) {
    if (event.result) {
      const payload = createNavigationRevalidationPayload('entry.unpublish', event.result);
      await triggerRevalidation(payload);
    }
  },
};
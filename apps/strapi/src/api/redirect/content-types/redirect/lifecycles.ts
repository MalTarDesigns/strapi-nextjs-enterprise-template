import { LifecycleEventType } from "../../../../../types/internals";
import { 
  triggerRevalidation, 
  createRedirectRevalidationPayload 
} from "../../../../utils/revalidation";

export default {
  async afterCreate(event: LifecycleEventType<"afterCreate">) {
    if (event.result) {
      const payload = createRedirectRevalidationPayload('entry.create', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUpdate(event: LifecycleEventType<"afterUpdate">) {
    if (event.result) {
      const payload = createRedirectRevalidationPayload('entry.update', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterDelete(event: LifecycleEventType<"afterDelete">) {
    if (event.result) {
      const payload = createRedirectRevalidationPayload('entry.delete', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterPublish(event: LifecycleEventType<"afterPublish">) {
    if (event.result) {
      const payload = createRedirectRevalidationPayload('entry.publish', event.result);
      await triggerRevalidation(payload);
    }
  },

  async afterUnpublish(event: LifecycleEventType<"afterUnpublish">) {
    if (event.result) {
      const payload = createRedirectRevalidationPayload('entry.unpublish', event.result);
      await triggerRevalidation(payload);
    }
  },
};
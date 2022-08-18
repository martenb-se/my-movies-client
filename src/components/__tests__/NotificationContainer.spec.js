import { describe, it, expect, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import NotificationContainer from "@/components/NotificationContainer.vue";

describe("NotificationContainer.vue Test", () => {
  it("should be possible to read the slot contents", async () => {
    const NotificationComponent = {
      name: "AlertMessageComponent",
      template: "<span data-vitest='notification-message'>Notification</span>",
    };

    const wrapper = mount(NotificationContainer, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      slots: {
        default: NotificationComponent,
      },
    });

    const slotComponent = wrapper.findComponent(
      "[data-vitest=notification-message]"
    );
    expect(Object.keys(slotComponent).length).toBeGreaterThan(0);
    expect(slotComponent.text()).toBe("Notification");
  });
});

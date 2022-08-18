import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { mount } from "@vue/test-utils";
import AlertNotification from "@/components/AlertNotification.vue";

import { createTestingPinia } from "@pinia/testing";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { setActivePinia } from "pinia";

describe("AlertNotification.vue Test", () => {
  it("should be possible to find slot component and its contents", () => {
    const AlertMessageComponent = {
      name: "AlertMessageComponent",
      template: "<span data-vitest='alert-message'>Alert message</span>",
    };

    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      slots: {
        default: AlertMessageComponent,
      },
    });

    const slotComponent = wrapper.findComponent("[data-vitest=alert-message]");
    expect(Object.keys(slotComponent).length).toBeGreaterThan(0);
    expect(slotComponent.text()).toBe("Alert message");
  });

  it("should have standard option type as 'primary'", () => {
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    expect(wrapper.classes()).toContain("alert-primary");
  });

  it("should be possible to use option 'primary' for type", () => {
    const curOption = "primary";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'secondary' for type", () => {
    const curOption = "secondary";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'success' for type", () => {
    const curOption = "success";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'danger' for type", () => {
    const curOption = "danger";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'warning' for type", () => {
    const curOption = "warning";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'info' for type", () => {
    const curOption = "info";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'light' for type", () => {
    const curOption = "light";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'dark' for type", () => {
    const curOption = "dark";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        type: curOption,
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(true);
    expect(wrapper.classes()).toContain("alert-" + curOption);
  });

  it("should be possible to use option 'time'", () => {
    const curTimeObject = new Date();
    const curTimeSend = curTimeObject.toString();
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        time: curTimeSend,
      },
    });

    const expectedTimeStamp =
      String(curTimeObject.getHours()).padStart(2, "0") +
      ":" +
      String(curTimeObject.getMinutes()).padStart(2, "0") +
      ":" +
      String(curTimeObject.getSeconds()).padStart(2, "0");
    expect(wrapper.vm.$options.props.time.validator(curTimeSend)).toBe(true);
    expect(wrapper.text()).toContain(expectedTimeStamp);
  });

  it("should be possible to use option 'messageId'", () => {
    const curOption = 1;
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      propsData: {
        messageId: curOption,
      },
    });
    expect(wrapper.vm.$options.props.messageId.validator(curOption)).toBe(true);
  });

  describe("when an alert message is created", () => {
    let errorMessageStore;
    let alertWrapper;
    let errorMessageId, errorMessageTime, errorMessageText;

    beforeEach(async () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        stubActions: false,
      });
      setActivePinia(pinia);

      errorMessageStore = useErrorMessageStore();
      errorMessageStore.addMessage("This is a test error");

      [errorMessageId, errorMessageTime, errorMessageText] =
        errorMessageStore.message[0];

      alertWrapper = mount(AlertNotification, {
        global: {
          plugins: [pinia],
        },
        slots: {
          default: errorMessageText,
        },
        propsData: {
          messageId: errorMessageId,
          time: errorMessageTime,
        },
      });
    });

    afterEach(() => {
      alertWrapper.unmount();
    });

    it("should have a close button", () => {
      const closeButton = alertWrapper.find("[data-vitest=close-button]");
      expect(Object.keys(closeButton).length).toBeGreaterThan(0);
    });

    it("should call store to remove message if close button is clicked", async () => {
      const closeButton = alertWrapper.find("[data-vitest=close-button]");
      await closeButton.trigger("click");
      expect(errorMessageStore.removeMessage).toHaveBeenCalledTimes(1);
      expect(errorMessageStore.removeMessage).toHaveBeenCalledWith(
        errorMessageId
      );
    });
  });

  it("should not be allowed by validator to use other option for type than the defined ones", () => {
    const curOption = "bad-option";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    expect(wrapper.vm.$options.props.type.validator(curOption)).toBe(false);
  });

  it("should not be allowed by validator to use other option for time than a valid time", () => {
    const curOption = "bad date";
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    expect(wrapper.vm.$options.props.time.validator(curOption)).toBe(false);
  });

  it("should not be allowed by validator to use other option for messageId than a non negative number", () => {
    const curOption = -1;
    const wrapper = mount(AlertNotification, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });
    expect(wrapper.vm.$options.props.messageId.validator(curOption)).toBe(
      false
    );
  });

  it("should not try to remove message if 'messageId' is unset", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error");

    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
    const errorMessageStore = useErrorMessageStore();

    const alertWrapper = mount(AlertNotification, {
      global: {
        plugins: [pinia],
      },
      propsData: {
        messageId: undefined,
      },
    });
    const closeButton = alertWrapper.find("[data-vitest=close-button]");

    await closeButton.trigger("click");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "[MyMovies implementation error]: Cannot remove alert from store as it contains no 'messageId'."
    );
    expect(errorMessageStore.removeMessage).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { shallowMount } from "@vue/test-utils";
import App from "@/App.vue";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { useMyMoviesStore } from "@/stores/myMovies";

describe("App.vue Test", () => {
  let pinia;

  beforeEach(() => {
    pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    setActivePinia(pinia);
  });

  it("should fetch all available movies upon instantiation", async () => {
    const myMoviesStore = useMyMoviesStore();

    shallowMount(App, {
      global: {
        plugins: [pinia],
      },
    });

    expect(myMoviesStore.fetchAllMovies).toHaveBeenCalled();
  });

  describe("when mounted with no notifications", () => {
    let appWrapper;

    beforeEach(async () => {
      appWrapper = shallowMount(App, {
        global: {
          plugins: [pinia],
        },
      });
    });

    afterEach(() => {
      appWrapper.unmount();
    });

    it("should contain NavbarMain", () => {
      expect(
        Object.keys(appWrapper.find("navbar-main-stub")).length
      ).toBeGreaterThan(0);
    });

    it("should contain RouterView", () => {
      expect(
        Object.keys(appWrapper.find("router-view-stub")).length
      ).toBeGreaterThan(0);
    });
  });

  describe("when mounted with active notifications", () => {
    let appWrapper;
    let errorMessageStore;

    beforeEach(() => {
      errorMessageStore = useErrorMessageStore();

      errorMessageStore.message = [
        [1, new Date().toJSON(), "This is a test error"],
      ];

      appWrapper = shallowMount(App, {
        global: {
          plugins: [pinia],
        },
      });
    });

    afterEach(() => {
      appWrapper.unmount();
    });

    it("should contain NotificationContainer", () => {
      expect(
        Object.keys(appWrapper.find("notification-container-stub")).length
      ).toBeGreaterThan(0);
    });
  });
});

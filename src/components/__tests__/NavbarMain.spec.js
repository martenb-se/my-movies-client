import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import NavbarMain from "@/components/NavbarMain.vue";

describe("NavbarMain.vue Test", () => {
  describe("when mounted with a couple of links", () => {
    let navbarWrapper;

    beforeEach(async () => {
      const curViews = [
        { name: "foo", path: "foo" },
        { name: "bar", path: "bar" },
      ];

      navbarWrapper = shallowMount(NavbarMain, {
        propsData: {
          views: curViews,
        },
      });
    });

    afterEach(() => {
      navbarWrapper.unmount();
    });

    it("should contain home link 'My Movies'", () => {
      const routerLinkHome = navbarWrapper.find(
        "[data-vitest=router-link-my-movies]"
      );
      expect(Object.keys(routerLinkHome).length).toBeGreaterThan(0);
    });

    it("should contain links to entries found in prop 'views'", () => {
      const routerLinkFoo = navbarWrapper.find("router-link-stub[to=foo]");
      const routerLinkBar = navbarWrapper.find("router-link-stub[to=bar]");
      expect(Object.keys(routerLinkFoo).length).toBeGreaterThan(0);
      expect(Object.keys(routerLinkBar).length).toBeGreaterThan(0);
    });
  });

  it("should not be allowed by validator to use option 'views' with an object array not containing necessary data", () => {
    const curViews = [{ name: "foo", path: "foo" }, { name: "bar" }];
    const wrapper = shallowMount(NavbarMain);
    expect(wrapper.vm.$options.props.views.validator(curViews)).toBe(false);
  });
});

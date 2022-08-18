import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { shallowMount } from "@vue/test-utils";
import HomeView from "@/views/HomeView.vue";

describe("SearchView.vue Test", () => {
  let homeViewWrapper;

  beforeEach(async () => {
    homeViewWrapper = shallowMount(HomeView);
  });

  afterEach(() => {
    homeViewWrapper.unmount();
  });

  it("should contain MyMovieList", () => {
    expect(
      Object.keys(homeViewWrapper.find("my-movie-list-stub")).length
    ).toBeGreaterThan(0);
  });
});

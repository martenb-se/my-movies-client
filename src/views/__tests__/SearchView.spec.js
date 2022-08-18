import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { shallowMount } from "@vue/test-utils";
import SearchView from "@/views/SearchView.vue";

describe("SearchView.vue Test", () => {
  let searchViewWrapper;

  beforeEach(async () => {
    searchViewWrapper = shallowMount(SearchView);
  });

  afterEach(() => {
    searchViewWrapper.unmount();
  });

  it("should contain MovieSearch", async () => {
    expect(
      Object.keys(searchViewWrapper.find("movie-search-stub")).length
    ).toBeGreaterThan(0);
  });

  it("should contain MovieSearchList", async () => {
    expect(
      Object.keys(searchViewWrapper.find("movie-search-list-stub")).length
    ).toBeGreaterThan(0);
  });
});

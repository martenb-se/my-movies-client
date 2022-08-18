import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";

import { shallowMount } from "@vue/test-utils";
import MovieSearch from "@/components/MovieSearch.vue";

import { createTestingPinia } from "@pinia/testing";
import { setActivePinia } from "pinia";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { useMovieSearchStore } from "@/stores/movieSearch";
import omdbApi from "@/api/external/omdbApi";

import { SearchType } from "@/enum/omdbApiEnum";
import InvalidArgumentError from "@/util/customError/invalidArgumentError";

describe("MovieSearch.vue Test", () => {
  it("search button exists", () => {
    const wrapper = shallowMount(MovieSearch, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
      props: { msg: "Search" },
    });

    expect(wrapper.text()).toContain("Search");
  });

  const env = import.meta.env;
  const apiKey = "00000000";

  beforeEach(async () => {
    vi.resetModules();
    import.meta.env = { ...env };
  });

  afterEach(() => {
    import.meta.env = env;
  });

  describe("when the API key is set in the environment", () => {
    beforeEach(async () => {
      import.meta.env.VITE_APP_API_KEY_OMDB = apiKey;
    });

    it("should verify and use OMDB API settings on mount", () => {
      const pinia = createTestingPinia({
        createSpy: vi.fn,
        stubActions: false,
      });
      setActivePinia(pinia);

      const errorMessageStore = useErrorMessageStore();
      const movieSearchStore = useMovieSearchStore();

      shallowMount(MovieSearch, {
        global: {
          plugins: [pinia],
        },
      });

      expect(errorMessageStore.addMessage).not.toHaveBeenCalled();
      expect(movieSearchStore.apiInstance).toBeInstanceOf(omdbApi);
      expect(movieSearchStore.apiInstance.apiKey).toBe(apiKey);
    });

    describe("when mounted and stores are mocked", () => {
      let movieSearchWrapper;
      let errorMessageStore;
      let movieSearchStore;

      beforeEach(async () => {
        const pinia = createTestingPinia({
          createSpy: vi.fn,
        });

        setActivePinia(pinia);
        errorMessageStore = useErrorMessageStore();
        movieSearchStore = useMovieSearchStore();

        movieSearchWrapper = shallowMount(MovieSearch, {
          global: {
            plugins: [pinia],
          },
        });
      });

      afterEach(() => {
        movieSearchWrapper.unmount();
      });

      it("should have a search form with the name input", async () => {
        const searchFormNameInput = movieSearchWrapper.find(
          "[data-vitest=input-movieName]"
        );
        expect(Object.keys(searchFormNameInput).length).toBeGreaterThan(0);
      });

      it("should have a search form with the type input", async () => {
        const searchFormTypeInput = movieSearchWrapper.find(
          "[data-vitest=input-movieType]"
        );
        expect(Object.keys(searchFormTypeInput).length).toBeGreaterThan(0);
      });

      it("should have a search form with the year input", async () => {
        const searchFormYearInput = movieSearchWrapper.find(
          "[data-vitest=input-movieYear]"
        );
        expect(Object.keys(searchFormYearInput).length).toBeGreaterThan(0);
      });

      it("should have a search form with a search button", async () => {
        const searchFormSubmitButton = movieSearchWrapper.find(
          "[data-vitest=button-submit]"
        );
        expect(Object.keys(searchFormSubmitButton).length).toBeGreaterThan(0);
      });

      it("should have disabled option and all search types in the SearchType enum available in the search form type input", async () => {
        const searchFormTypeInput = movieSearchWrapper.find(
          "[data-vitest=input-movieType]"
        );

        expect(searchFormTypeInput.find("[disabled='']").text()).toBe(
          "Please select one"
        );

        Object.keys(SearchType).forEach((curEntry) => {
          expect(
            Object.keys(
              searchFormTypeInput.find(
                "[value=" + SearchType[curEntry].name + "]"
              )
            ).length
          ).toBeGreaterThan(0);
        });
      });

      it("should call search method in movieSearchStore with correct data upon submit", async () => {
        const movieName = "Guardians";
        const movieType = "movie";
        const movieYear = "2015";
        const searchForm = movieSearchWrapper.find("[data-vitest=form-search]");

        movieSearchWrapper
          .find("[data-vitest=input-movieName]")
          .setValue(movieName);
        movieSearchWrapper
          .find("[data-vitest=input-movieType]")
          .setValue(movieType);
        movieSearchWrapper
          .find("[data-vitest=input-movieYear]")
          .setValue(movieYear);

        await searchForm.trigger("submit");

        expect(movieSearchStore.searchByMovieName).toHaveBeenCalledTimes(1);
        expect(movieSearchStore.searchByMovieName).toHaveBeenCalledWith(
          movieName,
          { type: movieType, year: movieYear }
        );
      });

      it("should add an error message if search form is submitted without a name", async () => {
        vi.spyOn(movieSearchStore, "searchByMovieName").mockImplementation(
          async () => {
            throw new InvalidArgumentError(
              "Movie name must be set before searching!",
              "name"
            );
          }
        );

        const searchForm = movieSearchWrapper.find("[data-vitest=form-search]");
        await searchForm.trigger("submit");

        expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
        expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
          "Movie name must be set before searching!"
        );
      });

      it("should add an error message if search form is submitted with a bad type", async () => {
        vi.spyOn(movieSearchStore, "searchByMovieName").mockImplementation(
          async () => {
            throw new InvalidArgumentError(
              "Movie type must be any of: test, test, test",
              "type"
            );
          }
        );

        const searchForm = movieSearchWrapper.find("[data-vitest=form-search]");
        await searchForm.trigger("submit");

        expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
        expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
          "Movie type is wrong! It must be any of: " +
            Object.keys(SearchType)
              .reduce((res, key) => {
                return res + ", " + SearchType[key].name;
              }, "")
              .substring(2)
        );
      });

      it("should add an error message if search form is submitted with a year less than 0 or greater than 9999", async () => {
        vi.spyOn(movieSearchStore, "searchByMovieName").mockImplementation(
          async () => {
            throw new InvalidArgumentError(
              "Movie year must be between 0 - 9999!",
              "year"
            );
          }
        );

        const searchForm = movieSearchWrapper.find("[data-vitest=form-search]");
        await searchForm.trigger("submit");

        expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
        expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
          "Movie year must be a number between 0 and 9999!"
        );
      });

      it("should add an error message if search form is submitted and an unknown error happened", async () => {
        vi.spyOn(movieSearchStore, "searchByMovieName").mockImplementation(
          async () => {
            throw new InvalidArgumentError(
              "Argument 'apiInstance' is not correctly initiated, searchByMovieName() cannot run!",
              "apiInstance"
            );
          }
        );

        const searchForm = movieSearchWrapper.find("[data-vitest=form-search]");
        await searchForm.trigger("submit");

        expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
        expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
          "Searching failed because of an unknown error. Try again later."
        );
      });

      it("should disable search form if successful search is active", async () => {
        vi.spyOn(movieSearchStore, "searchByMovieName").mockImplementation(
          () => {
            return new Promise((doResolve) => {
              setTimeout(() => {
                doResolve();
              }, 5000);
            });
          }
        );

        const searchForm = movieSearchWrapper.find("[data-vitest=form-search]");
        const searchFormNameInput = movieSearchWrapper.find(
          "[data-vitest=input-movieName]"
        );
        const searchFormTypeInput = movieSearchWrapper.find(
          "[data-vitest=input-movieType]"
        );
        const searchFormYearInput = movieSearchWrapper.find(
          "[data-vitest=input-movieYear]"
        );
        const searchFormSubmitButton = movieSearchWrapper.find(
          "[data-vitest=button-submit]"
        );
        expect(searchFormNameInput.attributes()).not.toHaveProperty("disabled");
        expect(searchFormTypeInput.attributes()).not.toHaveProperty("disabled");
        expect(searchFormYearInput.attributes()).not.toHaveProperty("disabled");
        expect(searchFormSubmitButton.attributes()).not.toHaveProperty(
          "disabled"
        );
        await searchForm.trigger("submit");
        expect(searchFormNameInput.attributes()).toHaveProperty("disabled");
        expect(searchFormTypeInput.attributes()).toHaveProperty("disabled");
        expect(searchFormYearInput.attributes()).toHaveProperty("disabled");
        expect(searchFormSubmitButton.attributes()).toHaveProperty("disabled");
      });
    });
  });

  it("should present the user with an error and not set the 'apiInstance' if OMDB API settings are not properly set upon mount", () => {
    import.meta.env.VITE_APP_API_KEY_OMDB = undefined;

    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });
    setActivePinia(pinia);

    const errorMessageStore = useErrorMessageStore();
    const movieSearchStore = useMovieSearchStore();

    shallowMount(MovieSearch, {
      global: {
        plugins: [pinia],
      },
    });

    expect(errorMessageStore.addMessage).toHaveBeenCalledTimes(1);
    expect(errorMessageStore.addMessage).toHaveBeenCalledWith(
      "OMDbAPI api key is not set in the environment, please set 'VITE_APP_API_KEY_OMDB' in the .env-file!"
    );
    expect(movieSearchStore.apiInstance).not.toBeInstanceOf(omdbApi);
    expect(movieSearchStore.apiInstance).toEqual({});
  });
});

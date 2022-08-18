<script setup>
import { ref, onMounted, computed } from "vue";
import { useMovieSearchStore } from "@/stores/movieSearch";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { SearchType } from "@/enum/omdbApiEnum";
import IconMovie from "@/components/icons/IconMovie.vue";
import IconFilter from "@/components/icons/IconFilter.vue";
import IconDate from "@/components/icons/IconDate.vue";
import omdbApi from "@/api/external/omdbApi";

const movieSearchStore = useMovieSearchStore();
const errorMessageStore = useErrorMessageStore();

const ongoingSearch = ref(false);
const movieName = ref(movieSearchStore.movie);
const movieType = ref(movieSearchStore.type);
const movieYear = ref(movieSearchStore.year);

/**
 * Submit action for the search form.
 * @returns {Promise<void>} Nothing
 */
const formSearchSubmit = async () => {
  ongoingSearch.value = true;
  try {
    await movieSearchStore.searchByMovieName(movieName.value, {
      type: movieType.value,
      year: movieYear.value,
    });
  } catch (errorData) {
    if (errorData.message === "Movie name must be set before searching!")
      errorMessageStore.addMessage("Movie name must be set before searching!");
    else if (errorData.message.includes("Movie type must be any of"))
      errorMessageStore.addMessage(
        "Movie type is wrong! It must be any of: " +
          Object.keys(SearchType)
            .reduce((res, key) => {
              return res + ", " + SearchType[key].name;
            }, "")
            .substring(2)
      );
    else if (errorData.message === "Movie year must be between 0 - 9999!")
      errorMessageStore.addMessage(
        "Movie year must be a number between 0 and 9999!"
      );
    else
      errorMessageStore.addMessage(
        "Searching failed because of an unknown error. Try again later."
      );
  }
  ongoingSearch.value = false;
};

/**
 * Verifies and sets (if valid) the OMDbAPI instance, if invalid, an error message will be added.
 */
const verifyAndSetOmdbApiSetting = () => {
  if (
    import.meta.env.VITE_APP_API_KEY_OMDB === undefined ||
    typeof import.meta.env.VITE_APP_API_KEY_OMDB !== "string"
  )
    errorMessageStore.addMessage(
      "OMDbAPI api key is not set in the environment, please set 'VITE_APP_API_KEY_OMDB' in the .env-file!"
    );
  else
    movieSearchStore.apiInstance = new omdbApi(
      import.meta.env.VITE_APP_API_KEY_OMDB
    );
};

/**
 * Check if search is disabled. Search is disabled if an ongoing search is running or if there is no API key.
 * @type {ComputedRef<boolean>} True if search is disabled, false otherwise.
 */
const isSearchDisabled = computed(() => {
  return (
    ongoingSearch.value ||
    import.meta.env.VITE_APP_API_KEY_OMDB === undefined ||
    typeof import.meta.env.VITE_APP_API_KEY_OMDB !== "string"
  );
});

onMounted(() => {
  verifyAndSetOmdbApiSetting();
});
</script>

<template>
  <div class="container">
    <form
      @submit.prevent="formSearchSubmit"
      data-cy="form-search"
      data-vitest="form-search"
    >
      <div class="row g-3">
        <div class="col-sm-5">
          <div class="input-group">
            <div class="input-group-text">
              <label for="formMovieName"><IconMovie /></label>
            </div>
            <input
              v-model="movieName"
              type="text"
              class="form-control"
              id="formMovieName"
              placeholder="Movie name"
              required="required"
              :disabled="isSearchDisabled"
              data-cy="input-movieName"
              data-vitest="input-movieName"
            />
          </div>
        </div>
        <div class="col-sm">
          <div class="input-group">
            <div class="input-group-text">
              <label for="formMovieType"><IconFilter /></label>
            </div>
            <select
              v-model="movieType"
              class="form-select"
              id="formMovieType"
              :disabled="isSearchDisabled"
              data-cy="input-movieType"
              data-vitest="input-movieType"
            >
              <option disabled value="">Please select one</option>
              <option
                v-for="validSearchType in SearchType"
                :key="validSearchType.name"
                :value="validSearchType.name"
              >
                {{ validSearchType.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-sm">
          <div class="input-group">
            <div class="input-group-text">
              <label for="formMovieYear"><IconDate /></label>
            </div>
            <input
              v-model="movieYear"
              type="text"
              class="form-control"
              id="formMovieYear"
              placeholder="Movie year"
              :disabled="isSearchDisabled"
              data-cy="input-movieYear"
              data-vitest="input-movieYear"
            />
          </div>
        </div>
        <div class="col-sm">
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSearchDisabled"
            data-cy="button-submit"
            data-vitest="button-submit"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  margin-top: 10px;
}
input:disabled,
select:disabled,
button:disabled {
  cursor: not-allowed;
  pointer-events: all !important;
}
</style>

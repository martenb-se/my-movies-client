<script setup>
import { computed, ref } from "vue";
import { useMovieSearchStore } from "@/stores/movieSearch";
import { useMyMoviesStore } from "@/stores/myMovies";
import { useErrorMessageStore } from "@/stores/errorMessage";

const errorMessageStore = useErrorMessageStore();
const movieSearchStore = useMovieSearchStore();
const myMoviesStore = useMyMoviesStore();
const ongoingSearch = ref(false);

/**
 * Add a movie found in the search results to the personal collection.
 * @param {string} imdbId The IMDB id of the movie to add.
 * @param {string} name The name of the movie to add.
 * @param {Proxy<*>} movieResultRef The reference to the search result.
 * @returns {Promise<void>} Nothing
 */
const addMovie = async (imdbId, name, movieResultRef) => {
  if (typeof imdbId !== "string" || imdbId.length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot add movie if 'imdbId' is not correctly set."
    );
    errorMessageStore.addMessage(
      "Could not add movie due to a client error. Contact the system administrator."
    );
  } else if (typeof name !== "string" || name.length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot add movie if 'name' is not correctly set."
    );
    errorMessageStore.addMessage(
      "Could not add movie due to a client error. Contact the system administrator."
    );
  } else {
    try {
      await myMoviesStore.addMovie(imdbId, name);
      movieResultRef.inMyMovies = true;
    } catch (error) {
      const errorMessageStore = useErrorMessageStore();
      errorMessageStore.addMessage(
        "Updating movie seen failed because of the following error: " +
          error.message
      );
    }
  }
};

/**
 * Go to a specific page in the search results.
 * @param {number} page The page to go to and get results from.
 * @returns {Promise<void>} Nothing
 */
const goToPage = async (page) => {
  ongoingSearch.value = true;
  await movieSearchStore.goToPage(page);
  ongoingSearch.value = false;
};

/**
 * Go to the next page in the search results.
 * @returns {Promise<void>} Nothing
 */
const nextPage = async () => {
  ongoingSearch.value = true;
  await movieSearchStore.nextPage();
  ongoingSearch.value = false;
};

/**
 * Go to the previous page in the search results.
 * @returns {Promise<void>} Nothing
 */
const previousPage = async () => {
  ongoingSearch.value = true;
  await movieSearchStore.previousPage();
  ongoingSearch.value = false;
};

/**
 * Total number of available pages with search results.
 * @type {ComputedRef<number>}
 */
const totalPages = computed(() => {
  if (movieSearchStore.search.length > 0 && movieSearchStore.results !== 0)
    return Math.ceil(movieSearchStore.results / 10);
  else return 0;
});

/**
 * A list of currently available pages when browsing the search results.
 * @type {ComputedRef<(number|string)[]>}
 */
const visiblePagesRange = computed(() => {
  if (totalPages.value > 18)
    if (movieSearchStore.page <= 2)
      return [
        ...Array.from(new Array(5), (x, i) => i + 1),
        "...",
        ...Array.from(new Array(5), (x, i) => i + 1 + (totalPages.value - 5)),
      ];
    else if (movieSearchStore.page > 2 && movieSearchStore.page <= 8)
      return [
        ...Array.from(
          new Array(5 + (movieSearchStore.page - 3)),
          (x, i) => i + 1
        ),
        "...",
        ...Array.from(new Array(5), (x, i) => i + 1 + (totalPages.value - 5)),
      ];
    else if (
      movieSearchStore.page > 8 &&
      movieSearchStore.page <= totalPages.value + 1 - 9
    )
      return [
        ...Array.from(new Array(5), (x, i) => i + 1),
        "...",
        ...Array.from(
          new Array(5),
          (x, i) => i + 1 + (movieSearchStore.page - 3)
        ),
        "...",
        ...Array.from(new Array(5), (x, i) => i + 1 + (totalPages.value - 5)),
      ];
    else if (
      movieSearchStore.page > totalPages.value + 1 - 9 &&
      movieSearchStore.page <= totalPages.value - 3
    )
      return [
        ...Array.from(new Array(5), (x, i) => i + 1),
        "...",
        ...Array.from(
          new Array(5 + (totalPages.value - 2 - movieSearchStore.page)),
          (x, i) => i + movieSearchStore.page - 2
        ),
      ];
    else if (movieSearchStore.page > totalPages.value - 3)
      return [
        ...Array.from(new Array(5), (x, i) => i + 1),
        "...",
        ...Array.from(new Array(5), (x, i) => i + 1 + (totalPages.value - 5)),
      ];
    else return 0;
  else return Array.from(new Array(totalPages.value), (x, i) => i + 1);
});
</script>

<template>
  <div class="container search-results">
    <div class="loading-movies" v-if="ongoingSearch">
      <div class="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <div
      class="row row-cols-1 row-cols-md-5 g-4"
      data-cy="card-search-results"
      data-vitest="card-search-results"
    >
      <div
        class="col"
        v-for="(foundMovie, index) in movieSearchStore.search"
        :key="foundMovie.imdbID"
        :data-cy="`card-search-result-${index + 1}`"
        :data-vitest="`card-search-result-${foundMovie.imdbID}`"
      >
        <div
          class="card bg-dark text-white h-100"
          :data-vitest="`card-search-result-${foundMovie.imdbID}`"
        >
          <img
            :src="
              foundMovie.Poster !== 'N/A'
                ? foundMovie.Poster
                : 'https://i.imgur.com/R7mqXKL.png'
            "
            class="card-img-top"
            :alt="foundMovie.Title"
          />
          <div class="card-body">
            <h5 class="card-title">{{ foundMovie.Title }}</h5>
            <p class="card-text">
              <span
                class="badge bg-info text-dark badge-movie-info"
                :data-cy="`card-search-result-${index + 1}-type`"
                data-vitest="card-search-result-type"
              >
                {{ foundMovie.Type }}
              </span>
              <span
                class="badge bg-info text-dark badge-movie-info"
                :data-cy="`card-search-result-${index + 1}-year`"
                data-vitest="card-search-result-year"
              >
                {{ foundMovie.Year }}
              </span>
              <span
                class="badge bg-info text-dark badge-movie-info"
                :data-cy="`card-search-result-${index + 1}-imdbid`"
                data-vitest="card-search-result-imdbid"
              >
                {{ foundMovie.imdbID }}
              </span>
            </p>
          </div>
          <div class="card-footer">
            <div class="d-grid gap-2">
              <a
                href="#"
                @click.prevent="
                  addMovie(foundMovie.imdbID, foundMovie.Title, foundMovie)
                "
                class="btn"
                :class="{
                  'btn-success': foundMovie.inMyMovies,
                  'btn-primary': !foundMovie.inMyMovies,
                  disabled: foundMovie.inMyMovies,
                }"
                data-vitest="button-add-movie"
                >{{
                  (foundMovie.inMyMovies && "Already added") || "Add movie"
                }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <nav
    v-if="movieSearchStore.search.length > 0"
    class="page-nav"
    aria-label="Page navigation example"
    data-cy="nav-pages"
    data-vitest="nav-pages"
  >
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: movieSearchStore.page === 1 }">
        <a
          class="page-link"
          href="#"
          @click.prevent="previousPage"
          data-cy="page-link-page-previous"
          data-vitest="page-link-page-previous"
          >Previous</a
        >
      </li>
      <li
        class="page-item"
        :class="{
          active: movieSearchStore.page === curPage,
          disabled: curPage === '...',
        }"
        v-for="curPage in visiblePagesRange"
        :key="`page-link-${curPage}`"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="goToPage(curPage)"
          :data-cy="`page-link-page-${curPage}`"
          :data-vitest="`page-link-page-${curPage}`"
          >{{ curPage }}</a
        >
      </li>
      <li
        class="page-item"
        :class="{
          disabled:
            movieSearchStore.page === Math.ceil(movieSearchStore.results / 10),
        }"
      >
        <a
          class="page-link"
          href="#"
          @click.prevent="nextPage"
          data-cy="page-link-page-next"
          data-vitest="page-link-page-next"
          >Next</a
        >
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.container {
  margin-top: 10px;
}
.page-nav {
  margin-top: 20px;
}
.search-results {
  position: relative;
}
.loading-movies {
  z-index: 8000;
  position: absolute;
  top: 300px;
  right: 100px;
  bottom: 300px;
  left: 100px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 100px;
  text-align: center;
}
.badge-movie-info {
  margin-right: 5px;
}
/* CSS Loader From: https://loading.io/css/ */
.lds-ellipsis {
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #fff;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}
</style>

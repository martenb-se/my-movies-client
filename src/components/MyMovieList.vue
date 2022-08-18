<script setup>
import { ref, computed } from "vue";
import { useMyMoviesStore } from "@/stores/myMovies";
import { useErrorMessageStore } from "@/stores/errorMessage";
import { useMovieSearchStore } from "@/stores/movieSearch";
import IconSortAlphaDown from "@/components/icons/IconSortAlphaDown.vue";
import IconSortAlphaUp from "@/components/icons/IconSortAlphaUp.vue";
import IconSortNumericDown from "@/components/icons/IconSortNumericDown.vue";
import IconSortNumericUp from "@/components/icons/IconSortNumericUp.vue";
import IconSortDown from "@/components/icons/IconSortDown.vue";
import IconSortUp from "@/components/icons/IconSortUp.vue";
import { getEnumByName } from "@/util/enumHandling";
import { MovieSorting } from "@/enum/movieSortingEnum";

const myMoviesStore = useMyMoviesStore();
const errorMessageStore = useErrorMessageStore();
const movieSearchStore = useMovieSearchStore();
const ongoingAction = ref(false);

/**
 * Set rating from 1 to 10 for movie given by its IMDB id.
 * @param {string} imdbId The IMDB id of the movie to set a rating for.
 * @param {number} rating The rating to give the movie from 1 to 10.
 * @param {boolean=} seen (Optional) If the movie has been seen or not, if not set it is assumed that the movie has
 * been seen.
 * @returns {Promise<void>} Nothing
 */
const setRating = async (imdbId, rating, seen = true) => {
  if (typeof imdbId !== "string" || imdbId.length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot set rating when 'imdbId' is not valid."
    );
    errorMessageStore.addMessage(
      "Unable to set rating. Contact the system administrator."
    );
  } else if (rating < 1 || rating > 10) {
    console.error(
      "[MyMovies implementation error]: Cannot set rating when 'rating' is not a number between 1 and 10."
    );
    errorMessageStore.addMessage(
      "Unable to set rating. Contact the system administrator."
    );
  } else if (typeof seen !== "boolean") {
    console.error(
      "[MyMovies implementation error]: Cannot set rating when 'seen' is not a boolean."
    );
    errorMessageStore.addMessage(
      "Unable to set rating. Contact the system administrator."
    );
  } else {
    ongoingAction.value = true;
    await myMoviesStore.setMovieRating(imdbId, rating, seen);
    ongoingAction.value = false;
  }
};

/**
 * Update a movie's status to no longer having been seen.
 * @param {string} imdbId The IMDB id of the movie to set as no longer being seen.
 * @returns {Promise<void>} Nothing
 */
const setUnseen = async (imdbId) => {
  if (typeof imdbId !== "string" || imdbId.length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot set movie as unseen when when 'imdbId' is not valid."
    );
    errorMessageStore.addMessage(
      "Unable to set movie as no longer having been seen. Contact the system administrator."
    );
  } else {
    ongoingAction.value = true;
    await myMoviesStore.setMovieUnseen(imdbId);
    ongoingAction.value = false;
  }
};

/**
 * Update a search result to no longer marking that a movie is in the personal collection.
 * @param {string} imdbId The IMDB id of the search result to update.
 */
const setNotAddedInSearchStore = (imdbId) => {
  if (typeof imdbId !== "string" || imdbId.length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot remove a movie's status as being added if 'imdbId' is not valid."
    );
    errorMessageStore.addMessage(
      "Unable to remove the movie's status from being added. Contact the system administrator."
    );
  } else {
    movieSearchStore.search.forEach((movieSearchRef) => {
      if (movieSearchRef.imdbID === imdbId) movieSearchRef.inMyMovies = false;
    });
  }
};

/**
 * Remove a movie from the personal collection.
 * @param {string} imdbId The IMDB id of the movie to remove.
 * @returns {Promise<void>} Nothing
 */
const deleteMovie = async (imdbId) => {
  if (typeof imdbId !== "string" || imdbId.length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot remove movie if 'imdbId' is not valid."
    );
    errorMessageStore.addMessage(
      "Unable to remove movie from personal collection. Contact the system administrator."
    );
  } else {
    ongoingAction.value = true;
    await myMoviesStore.deleteMovie(imdbId);
    setNotAddedInSearchStore(imdbId);
    ongoingAction.value = false;
  }
};

/**
 * Get a copy of the personal movie object as a list.
 * @returns {{id: number, name: string, imdbId: string, seen: boolean, rating: number}[]} The movie list.
 */
const movieListCopy = () => {
  return Object.keys(myMoviesStore.movies).reduce(
    (currentList, currentMovieKey) => {
      currentList.push(myMoviesStore.movies[currentMovieKey]);
      return currentList;
    },
    []
  );
};

/**
 * Sort the personal movie list by the given MovieSorting enum.
 * @param {{name: string}|{}} chosenSort The chosen MovieSorting enum.
 */
const sortListBy = (chosenSort = {}) => {
  if (typeof chosenSort !== "object" || Object.keys(chosenSort).length < 1) {
    console.error(
      "[MyMovies implementation error]: Cannot sort list when 'chosenSort' is not an MovieSorting enum object."
    );
    errorMessageStore.addMessage(
      "Unable to perform sorting operation. Contact the system administrator."
    );
  } else if (
    Object.keys(chosenSort).length > 0 &&
    !Object.prototype.hasOwnProperty.call(chosenSort, "name")
  ) {
    console.error(
      "[MyMovies implementation error]: Cannot sort list when 'chosenSort' is not a valid MovieSorting enum " +
        "containing the 'name' property."
    );
    errorMessageStore.addMessage(
      "Unable to perform sorting operation. Contact the system administrator."
    );
  } else if (
    Object.keys(chosenSort).length > 0 &&
    Object.prototype.hasOwnProperty.call(chosenSort, "name") &&
    Object.keys(getEnumByName(MovieSorting, chosenSort.name)).length === 0
  ) {
    console.error(
      "[MyMovies implementation error]: Argument 'chosenSort' is not a valid MovieSorting enum, " +
        "the given object's name property is '" +
        chosenSort.name +
        "'! Valid name property values for a MovieSorting enum object are: " +
        Object.keys(MovieSorting)
          .reduce((res, key) => {
            return res + ", " + MovieSorting[key].name;
          }, "")
          .substring(2),
      "."
    );
    errorMessageStore.addMessage(
      "Unable to perform sorting operation. Contact the system administrator."
    );
  } else {
    if (Object.keys(chosenSort).length === 0) myMoviesStore.sorting = "";
    else myMoviesStore.sorting = chosenSort.name;
  }
};

/**
 * Object containing mapping from an internal (sometimes nonconsecutive) movie id to its consecutive number in the
 * movie list.
 * @type {ComputedRef<{}>}
 */
const movieIdToConsecutiveNumbering = computed(() => {
  const movieList = movieListCopy();

  movieList.sort((a, b) => {
    return a.id - b.id;
  });

  return movieList.reduce((currentMapping, currentMovie) => {
    currentMapping[currentMovie.imdbId] =
      Object.keys(currentMapping).length + 1;
    return currentMapping;
  }, {});
});

/**
 * Personal movie list sorted by the given sorting option.
 * @type {ComputedRef<{id: number, name: string, imdbId: string, seen: boolean, rating: number}[]>}
 */
const sortedMovieList = computed(() => {
  const movieList = movieListCopy();

  if (
    myMoviesStore.sorting === "" ||
    myMoviesStore.sorting === MovieSorting.IDASC.name ||
    myMoviesStore.sorting === MovieSorting.IDDESC.name ||
    myMoviesStore.sorting === MovieSorting.RATINGASC.name ||
    myMoviesStore.sorting === MovieSorting.RATINGDESC.name
  ) {
    movieList.sort((a, b) => {
      let fa, fb;
      if (
        myMoviesStore.sorting === "" ||
        myMoviesStore.sorting === MovieSorting.IDASC.name ||
        myMoviesStore.sorting === MovieSorting.IDDESC.name
      ) {
        fa = a.id;
        fb = b.id;
      } else if (
        myMoviesStore.sorting === MovieSorting.RATINGASC.name ||
        myMoviesStore.sorting === MovieSorting.RATINGDESC.name
      ) {
        fa = a.rating;
        fb = b.rating;
      }

      if (
        myMoviesStore.sorting === "" ||
        myMoviesStore.sorting === MovieSorting.IDASC.name ||
        myMoviesStore.sorting === MovieSorting.RATINGASC.name
      ) {
        return fa - fb;
      } else if (
        myMoviesStore.sorting === MovieSorting.IDDESC.name ||
        myMoviesStore.sorting === MovieSorting.RATINGDESC.name
      ) {
        return fb - fa;
      }
    });
  } else if (
    myMoviesStore.sorting === MovieSorting.NAMEASC.name ||
    myMoviesStore.sorting === MovieSorting.NAMEDESC.name ||
    myMoviesStore.sorting === MovieSorting.IMDBIDASC.name ||
    myMoviesStore.sorting === MovieSorting.IMDBIDDESC.name ||
    myMoviesStore.sorting === MovieSorting.SEENASC.name ||
    myMoviesStore.sorting === MovieSorting.SEENDESC.name
  ) {
    movieList.sort((a, b) => {
      let fa, fb;
      if (
        myMoviesStore.sorting === MovieSorting.NAMEASC.name ||
        myMoviesStore.sorting === MovieSorting.NAMEDESC.name
      ) {
        fa = a.name.toLowerCase();
        fb = b.name.toLowerCase();
      } else if (
        myMoviesStore.sorting === MovieSorting.IMDBIDASC.name ||
        myMoviesStore.sorting === MovieSorting.IMDBIDDESC.name
      ) {
        fa = a.imdbId.toLowerCase();
        fb = b.imdbId.toLowerCase();
      } else if (
        myMoviesStore.sorting === MovieSorting.SEENASC.name ||
        myMoviesStore.sorting === MovieSorting.SEENDESC.name
      ) {
        fa = a.seen;
        fb = b.seen;
      }

      if (
        myMoviesStore.sorting === MovieSorting.NAMEASC.name ||
        myMoviesStore.sorting === MovieSorting.IMDBIDASC.name ||
        myMoviesStore.sorting === MovieSorting.SEENASC.name
      ) {
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        return 0;
      } else if (
        myMoviesStore.sorting === MovieSorting.NAMEDESC.name ||
        myMoviesStore.sorting === MovieSorting.IMDBIDDESC.name ||
        myMoviesStore.sorting === MovieSorting.SEENDESC.name
      ) {
        if (fa < fb) return 1;
        if (fa > fb) return -1;
        return 0;
      }
    });
  }

  return movieList;
});
</script>

<template>
  <div class="container">
    <table class="table table-dark">
      <thead data-cy="table-thead-movies" data-vitest="table-thead-movies">
        <tr>
          <th data-cy="col-id" data-vitest="col-id">
            <span
              :class="{
                'sorted-by':
                  myMoviesStore.sorting.startsWith('id') ||
                  myMoviesStore.sorting === '',
              }"
              >#</span
            >
            <span class="sorting-icon">
              <IconSortNumericDown
                v-if="myMoviesStore.sorting === MovieSorting.IDDESC.name"
                @click.prevent="sortListBy(MovieSorting.IDASC)"
              />
              <IconSortNumericUp
                v-else
                @click.prevent="sortListBy(MovieSorting.IDDESC)"
              />
            </span>
          </th>
          <th data-cy="col-name" data-vitest="col-name">
            <span
              :class="{
                'sorted-by': myMoviesStore.sorting.startsWith('name'),
              }"
              >Name</span
            >
            <span class="sorting-icon">
              <IconSortAlphaDown
                v-if="myMoviesStore.sorting === MovieSorting.NAMEDESC.name"
                @click.prevent="sortListBy(MovieSorting.NAMEASC)"
              />
              <IconSortAlphaUp
                v-else
                @click.prevent="sortListBy(MovieSorting.NAMEDESC)"
              />
            </span>
          </th>
          <th data-cy="col-imdbId" data-vitest="col-imdbId">
            <span
              :class="{
                'sorted-by': myMoviesStore.sorting.startsWith('imdbId'),
              }"
              >IMDB id</span
            >
            <span class="sorting-icon">
              <IconSortAlphaDown
                v-if="myMoviesStore.sorting === MovieSorting.IMDBIDDESC.name"
                @click.prevent="sortListBy(MovieSorting.IMDBIDASC)"
              />
              <IconSortAlphaUp
                v-else
                @click.prevent="sortListBy(MovieSorting.IMDBIDDESC)"
              />
            </span>
          </th>
          <th data-cy="col-seen" data-vitest="col-seen">
            <span
              :class="{
                'sorted-by': myMoviesStore.sorting.startsWith('seen'),
              }"
              >Seen</span
            >
            <span class="sorting-icon">
              <IconSortDown
                v-if="myMoviesStore.sorting === MovieSorting.SEENDESC.name"
                @click.prevent="sortListBy(MovieSorting.SEENASC)"
              />
              <IconSortUp
                v-else
                @click.prevent="sortListBy(MovieSorting.SEENDESC)"
              />
            </span>
          </th>
          <th data-cy="col-rating" data-vitest="col-rating">
            <span
              :class="{
                'sorted-by': myMoviesStore.sorting.startsWith('rating'),
              }"
              >Rating</span
            >
            <span class="sorting-icon">
              <IconSortNumericDown
                v-if="myMoviesStore.sorting === MovieSorting.RATINGDESC.name"
                @click.prevent="sortListBy(MovieSorting.RATINGASC)"
              />
              <IconSortNumericUp
                v-else
                @click.prevent="sortListBy(MovieSorting.RATINGDESC)"
              />
            </span>
          </th>
          <th data-cy="col-delete" data-vitest="col-delete">Remove</th>
        </tr>
      </thead>
      <tbody data-cy="table-tbody-movies" data-vitest="table-tbody-movies">
        <tr
          v-for="myMovie in sortedMovieList"
          :key="myMovie.imdbId"
          :data-cy="`table-row-movie-${myMovie.imdbId}`"
          :data-vitest="`table-row-movie-${myMovie.imdbId}`"
        >
          <th scope="row" data-cy="col-id" data-vitest="col-id">
            {{ movieIdToConsecutiveNumbering[myMovie.imdbId] }}
          </th>
          <td data-cy="col-name" data-vitest="col-name">{{ myMovie.name }}</td>
          <td data-cy="col-imdbId" data-vitest="col-imdbId">
            {{ myMovie.imdbId }}
          </td>
          <td data-cy="col-seen" data-vitest="col-seen">
            <div>
              <input
                class="form-check-input"
                type="checkbox"
                v-model="myMovie.seen"
                :disabled="!myMovie.seen"
                aria-label="Seen movie"
                @click.prevent="setUnseen(myMovie.imdbId)"
                :data-cy="`table-row-movie-${myMovie.imdbId}-checkbox-seen`"
                :data-vitest="`table-row-movie-${myMovie.imdbId}-checkbox-seen`"
              />
            </div>
          </td>
          <td data-cy="col-rating" data-vitest="col-rating">
            <button
              class="btn bg-transparent btn-rating btn-rating-set"
              v-for="ratingNum in myMovie.rating"
              :key="`${myMovie.imdbId}-rate-${ratingNum}`"
              @click.prevent="
                setRating(myMovie.imdbId, ratingNum, myMovie.seen)
              "
              :data-cy="`table-row-movie-${myMovie.imdbId}-button-rate-${ratingNum}`"
              :data-vitest="`table-row-movie-${myMovie.imdbId}-button-rate-${ratingNum}`"
            >
              🟨
            </button>
            <button
              :disabled="ongoingAction"
              class="btn bg-transparent btn-rating btn-rating-unset"
              v-for="ratingNum in 10 - myMovie.rating"
              :key="`${myMovie.imdbId}-rate-${myMovie.rating + ratingNum}`"
              @click.prevent="
                setRating(
                  myMovie.imdbId,
                  myMovie.rating + ratingNum,
                  myMovie.seen
                )
              "
              :data-cy="`table-row-movie-${myMovie.imdbId}-button-rate-${
                myMovie.rating + ratingNum
              }`"
              :data-vitest="`table-row-movie-${myMovie.imdbId}-button-rate-${
                myMovie.rating + ratingNum
              }`"
            >
              ⬛
            </button>
          </td>
          <td data-cy="col-delete" data-vitest="col-delete">
            <button
              :disabled="ongoingAction"
              class="btn bg-transparent btn-delete"
              @click.prevent="deleteMovie(myMovie.imdbId)"
              :data-cy="`table-row-movie-${myMovie.imdbId}-button-delete`"
              :data-vitest="`table-row-movie-${myMovie.imdbId}-button-delete`"
            >
              🗑️
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.btn-rating,
.btn-delete {
  padding: 0;
}
.sorted-by {
  color: #53c5ff;
}
.sorting-icon:hover {
  cursor: pointer;
}
</style>

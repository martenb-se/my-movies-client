<script setup>
import { computed, onMounted } from "vue";
import router from "@/router";
import { RouterView } from "vue-router";
import NotificationContainer from "@/components/NotificationContainer.vue";
import AlertNotification from "@/components/AlertNotification.vue";
import NavbarMain from "@/components/NavbarMain.vue";

import { useErrorMessageStore } from "@/stores/errorMessage";
import myMoviesApi from "@/api/myMoviesApi";
import { useMyMoviesStore } from "@/stores/myMovies";

const errorMessageStore = useErrorMessageStore();
const myMoviesStore = useMyMoviesStore();

/**
 * Computed value with all available views (except the main one, Home)
 * @type {ComputedRef<{name: string, path: string}[]>} A list of names of all available views.
 */
const registeredViews = computed(() => {
  return router
    .getRoutes()
    .filter((currentView) => currentView.name !== "Home")
    .reduce((availableViews, currentView) => {
      return [
        ...availableViews,
        { name: currentView.name, path: currentView.path },
      ];
    }, []);
});

/**
 * Verifies and sets (if valid) the OMDbAPI instance, if invalid, an error message will be added.
 */
const verifyAndSetMyMoviesApiSetting = () => {
  myMoviesStore.apiInstance = new myMoviesApi();
  myMoviesStore.fetchAllMovies();
};

onMounted(() => {
  verifyAndSetMyMoviesApiSetting();
});
</script>

<template>
  <NotificationContainer v-if="errorMessageStore.message.length > 0">
    <AlertNotification
      v-for="[messageId, alertTime, alertMessage] in errorMessageStore.message"
      :key="`alert-${messageId}`"
      type="danger"
      :message-id="messageId"
      :time="alertTime"
    >
      {{ alertMessage }}
    </AlertNotification>
  </NotificationContainer>
  <header>
    <NavbarMain :views="registeredViews" />
  </header>
  <RouterView />
</template>

<script setup>
import { RouterLink } from "vue-router";
defineProps({
  views: {
    type: Array,
    default() {
      return [];
    },
    validator: (viewArray) => {
      if (typeof viewArray === "object" && Array.isArray(viewArray)) {
        let isValid = true;
        viewArray.forEach((view) => {
          if (isValid)
            isValid =
              Object.prototype.hasOwnProperty.call(view, "name") &&
              Object.prototype.hasOwnProperty.call(view, "path");
        });
        return isValid;
      } else return false;
    },
  },
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink
        to="/"
        class="navbar-brand"
        data-vitest="router-link-my-movies"
        >My Movies</RouterLink
      >
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="view in views" :key="view" class="nav-item">
            <RouterLink :to="view.path" class="nav-link" active-class="active">
              {{ view.name }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

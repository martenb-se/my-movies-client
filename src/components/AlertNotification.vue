<script setup>
import { useErrorMessageStore } from "@/stores/errorMessage";
import { computed } from "vue";
const errorMessageStore = useErrorMessageStore();

const props = defineProps({
  type: {
    type: String,
    default: "primary",
    validator: (value) =>
      [
        "primary",
        "secondary",
        "success",
        "danger",
        "warning",
        "info",
        "light",
        "dark",
      ].includes(value),
  },
  time: {
    type: String,
    validator: (value) => new Date(value).toString() !== "Invalid Date",
  },
  messageId: {
    type: Number,
    validator: (value) => value >= 0,
  },
});

/**
 * Alert message time stamp
 * @type {ComputedRef<string>}
 */
const alertTimeStamp = computed(() => {
  const timeDateObj = new Date(props.time);
  if (timeDateObj.toString() === "Invalid Date") return "--:--:--";

  return (
    String(timeDateObj.getHours()).padStart(2, "0") +
    ":" +
    String(timeDateObj.getMinutes()).padStart(2, "0") +
    ":" +
    String(timeDateObj.getSeconds()).padStart(2, "0")
  );
});

/**
 * Remove the alert popup.
 */
const removeAlert = () => {
  if (props.messageId !== undefined && props.messageId !== null)
    errorMessageStore.removeMessage(props.messageId);
  else
    console.error(
      "[MyMovies implementation error]: Cannot remove alert from store as it contains no 'messageId'."
    );
};
</script>

<template>
  <div :class="`alert alert-${type} alert-dismissible fade show`" role="alert">
    {{ alertTimeStamp }}
    -
    <slot />
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      data-vitest="close-button"
      @click="removeAlert"
    ></button>
  </div>
</template>

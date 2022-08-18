<template>
  <div class="notification-container" data-cy="container-notifications">
    <slot />
  </div>
</template>

<style scoped>
.notification-container {
  z-index: 9999;
  position: fixed;
  width: calc(100% - 40px);
  top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 0;
  opacity: 0.95;
}
</style>

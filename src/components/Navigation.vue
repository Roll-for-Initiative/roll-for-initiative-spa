<template>
  <nav class="nav">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex flex-row gap-2">
          <RouterLink class="router-link nav__item" to="/">Roll</RouterLink>
          <RouterLink class="router-link nav__item" to="/setup">Setup</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style lang="scss">
.nav {
  height: 24px;
  background-color: #000000;
}
.nav__item {
  color: yellow;
}
</style>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink class="router-link" to="/">Home</RouterLink>
        <RouterLink class="router-link" to="/setup">Setup</RouterLink>
        <RouterLink class="router-link" to="/roll">Roll</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style lang="scss">
.router-link {
  margin-inline-end: 0.5rem;
}
</style>

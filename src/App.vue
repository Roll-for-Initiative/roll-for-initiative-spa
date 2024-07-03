<template>
  <header>
    <nav>
      <RouterLink class="router-link" to="/">Home</RouterLink>
      <RouterLink class="router-link" to="/setup">Setup</RouterLink>
      <RouterLink class="router-link" to="/roll">Roll</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { usePlayerStore } from './stores/players'

const playerStore = usePlayerStore()

const loadStateFromLocalStorage = () => {
  const jsonState = localStorage.getItem(playerStore.$id)

  if (jsonState) {
    const state = JSON.parse(jsonState || '{}')
    playerStore.$patch(state)
  }
}

loadStateFromLocalStorage()
</script>

<style lang="scss">
.router-link {
  margin-inline-end: 0.5rem;
}
</style>

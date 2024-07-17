<template>
  <main>
    <RouterView />
  </main>

  <Navigation />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import { usePlayerStore } from './stores/players'
import Navigation from './components/Navigation.vue'

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

<style>
main {
  min-height: calc(100vh - 24px);
}
</style>

<template>
  <header class="nav">
    <nav class="container">
      <div class="row">
        <div class="col-12 d-flex flex-row gap-2">
          <RouterLink class="router-link nav__item" to="/">Home</RouterLink>
          <RouterLink class="router-link nav__item" to="/setup">Setup</RouterLink>
          <RouterLink class="router-link nav__item" to="/roll">Roll</RouterLink>
        </div>
      </div>
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

<style>
.nav {
  background-color: #000000;
}
.nav__item {
  color: yellow;
}

</style>

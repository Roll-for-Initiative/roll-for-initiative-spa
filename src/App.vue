<template>
  <Scene />
  <Navigation />
  <Modal title="Heroes & Allies">
    <SetupView />
  </Modal>
  <div class="test"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import Modal from './components/Modal.vue'
import Navigation from './components/Navigation.vue'
import { addGlobalKeyBindings } from './composables/useKeyBindings'
import SetupView from './views/SetupView.vue'
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

onMounted(() => {
  document.addEventListener('keydown', addGlobalKeyBindings)
})

onUnmounted(() => {
  document.removeEventListener('keydown', addGlobalKeyBindings)
})
</script>

<style lang="scss">
body {
  overflow-y: hidden;
}
</style>

<template>
  <Scene />
  <Navigation />
  <Modal title="Heroes & Allies">
    <PlayerSetup />
  </Modal>
  <div class="test"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import Scene from './components/Scene.vue'
import Modal from './components/Modal.vue'
import Navigation from './components/Navigation.vue'
import { addGlobalKeyBindings } from './composables/useKeyBindings'
import PlayerSetup from './components/PlayerSetup.vue'
import { useLocalStorage } from './composables/useLocalStorage'

useLocalStorage()

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

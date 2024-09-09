<template>
  <Scene></Scene>
  <Navigation />
  <Modal title="Heroes & Allies">
    <SetupView />
  </Modal>
</template>

<script setup lang="ts">
import { usePlayerStore } from './stores/players'
import Modal from './components/Modal.vue'
import SetupView from './views/SetupView.vue'
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

<style lang="scss">
body {
  overflow-y: hidden;
}
</style>

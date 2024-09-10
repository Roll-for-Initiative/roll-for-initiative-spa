<template>
  <Scene></Scene>
  <Navigation />
  <Modal title="Heroes & Allies">
    <SetupView />
  </Modal>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import Modal from './components/Modal.vue'
import Navigation from './components/Navigation.vue'
import SetupView from './views/SetupView.vue'
import { usePlayerStore } from './stores/players'
import { useModalStore } from './stores/modal'

const playerStore = usePlayerStore()
const modalStore = useModalStore()

const loadStateFromLocalStorage = () => {
  const jsonState = localStorage.getItem(playerStore.$id)

  if (jsonState) {
    const state = JSON.parse(jsonState || '{}')
    playerStore.$patch(state)
  }
}

loadStateFromLocalStorage()

onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'p') {
      modalStore.showModal()
    }

    if (e.key === 'r') {
      modalStore.closeModal()
      playerStore.roll()
    }

    if (e.key === 'Escape') {
      modalStore.closeModal()
    }

    if (e.key === 'ArrowLeft') {
      console.log('change background')
    }

    if (e.key === 'ArrowRight') {
      console.log('change background')
    }
  })
})
</script>

<style lang="scss">
body {
  overflow-y: hidden;
}
</style>

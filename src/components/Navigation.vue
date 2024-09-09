<template>
  <nav class="nav">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex flex-row gap-3 justify-content-center">
          <button
            v-if="!playerStore.modalIsOpen"
            @click="showPlayerModal"
            @keydown.p="showPlayerModal"
          >
            Edit players
          </button>
          <button @click="roll" @keydown.r="roll">Roll for initiative</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/players'

const playerStore = usePlayerStore()

const roll = () => {
  playerStore.modalIsOpen = false
  playerStore.roll()
}

const showPlayerModal = () => {
  playerStore.showModal()
}
</script>

<style lang="scss">
.nav {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 100;
}
</style>

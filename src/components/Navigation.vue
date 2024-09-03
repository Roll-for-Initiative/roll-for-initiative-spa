<template>
  <nav class="nav">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex flex-row gap-3 justify-content-center">
          <button @click="showPlayerModal" @keydown.p="showPlayerModal">Edit players</button>
          <button @click="roll" @keydown.r="roll">Reroll</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/players'

const playerStore = usePlayerStore()

const roll = () => {
  playerStore.roll()
}

const showPlayerModal = () => {
  playerStore.showModal()
}
</script>

<style lang="scss">
.nav {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>

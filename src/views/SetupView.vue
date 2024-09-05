<template>
  <div class="container">
    <h1 class="setup-view__title display-2">Heroes & Allies</h1>

    <div class="row setup-view__cards position-relative z-10">
      <PlayerCard v-for="player in playerStore.players" :player="player" :key="player.id" />
      <div class="col">
        <button @click="handleAddPlayer">Add player</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PlayerCard from '../components/PlayerCard.vue'
import { usePlayerStore } from '../stores/players'

const playerStore = usePlayerStore()

const handleAddPlayer = () => {
  playerStore.addPlayer()
}

const handleClearAll = () => {
  playerStore.clearAll()
}

const handleClearPlayers = () => {
  playerStore.clearPlayers()
}

playerStore.$subscribe((mutation, state) => {
  localStorage.setItem(mutation.storeId, JSON.stringify(state))
})
</script>

<style lang="scss">
.setup-view__title {
  width: 100%;
  position: absolute;
  color: var(--rfi-gray-600);
  top: 1.5rem;
  z-index: 0;
}

.setup-view__cards {
  margin-top: 6.5rem;
}

.setup-view__actions {
  margin-top: 12px;
}

.setup-view__actions-btn {
  outline: 1px solid #ff0000;
}
</style>

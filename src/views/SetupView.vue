<template>
  <div class="container">
    <div class="row">
      <div class="col d-flex justify-content-between align-items-center">
        <h1>Heroes & Allies</h1>
        <button class="h-auto" @click="handleClearAll">Clear all</button>
      </div>
    </div>

    <div class="row">
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
.setup-view__actions {
  margin-top: 12px;
}

.setup-view__actions-btn {
  outline: 1px solid #ff0000;
}
</style>

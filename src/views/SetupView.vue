<template>
  <div class="setup-view">
    <PlayerCard v-for="player in playerStore.players" :player="player" :key="player.id" />
    <Card class="setup-view__add-play-card" centered @click="handleAddPlayer">
      <h2 class="w-75 text-center mb-0">Add player</h2>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '../components/Card.vue'
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
.setup-view {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: auto;
  gap: 0.5rem;
}

.setup-view__actions {
  margin-top: 12px;
}

.setup-view__add-play-card {
  cursor: pointer;
}
</style>

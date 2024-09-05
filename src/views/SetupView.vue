<template>
  <div class="container">
    <h1 class="setup-view__title display-2">Heroes & Allies</h1>

    <div class="row setup-view__cards position-relative z-10">
      <div class="col-12 setup-view__cards-grid">
        <PlayerCard v-for="player in playerStore.players" :player="player" :key="player.id" />
        <Card centered @click="handleAddPlayer">
          <h2 class="w-75 text-center">Add player</h2>
        </Card>
      </div>
    </div>
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

.setup-view__cards-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: auto;
  gap: 0.5rem;
}

.setup-view__actions {
  margin-top: 12px;
}

.setup-view__actions-btn {
  outline: 1px solid #ff0000;
}
</style>

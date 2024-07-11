<template>
  <main class="container">
    <div class="row">
      <div class="col d-flex justify-content-between align-items-center">
        <h1>Manage players</h1>
        <button class="h-auto" @click="handleClearAll">Clear all</button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h2>Dungeon Master</h2>
      </div>
    </div>

    <div class="row">
      <PlayerCard class="col-3" :player="playerStore.dungeonMaster" isDungeonMaster />
    </div>

    <div class="row">
      <div class="col d-flex justify-content-between align-items-center">
        <h2>Players ({{ playerStore.playerCount }})</h2>
        <button class="h-auto" @click="handleClearPlayers">Clear players</button>
      </div>
    </div>

    <div class="row">
      <PlayerCard
        class="col-3"
        v-for="player in playerStore.players"
        :player="player"
        :key="player.id"
      />
    </div>

    <div class="row">
      <div class="col">
        <button @click="handleAddPlayer">add player</button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="setup-view__actions">
          <RouterLink class="router-link setup-view__actions-btn" to="/roll">
            <button>Roll For Iniative >>></button>
          </RouterLink>

          <button @click="handleGenerate">Generate new order</button>
          <ul>
            <li v-for="player in playerStore.results" :key="player.id">
              {{ player.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
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

const handleGenerate = () => {
  playerStore.roll()
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

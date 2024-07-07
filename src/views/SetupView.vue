<template>
  <main class="container">
    <div class="row">
      <div class="col">
        <h1>Manage players</h1>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h2>Dungeon Master</h2>
        <PlayerCard :player="playerStore.dungeonMaster" :enableDelete="false" />
      </div>
    </div>

    <div class="row">
      <div class="col">
        <h2>Players ({{ playerStore.playerCount }})</h2>
        <div class="setup-view__cards">
          <PlayerCard v-for="player in playerStore.players" :player="player" :key="player.id" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <button @click="handleAddPlayer">add player</button>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div class="setup-view__actions">
          <RouterLink class="router-link setup-view__actions-btn" to="/roll"><button>Roll For Iniative >>></button></RouterLink>
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

playerStore.$subscribe((mutation, state) => {
  localStorage.setItem(mutation.storeId, JSON.stringify(state))
})
</script>

<style lang="scss">
.setup-view__cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.setup-view__actions {
  margin-top: 12px;
}

.setup-view__actions-btn {
  outline: 1px solid #ff0000;
}

</style>

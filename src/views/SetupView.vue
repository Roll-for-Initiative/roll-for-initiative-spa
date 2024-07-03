<template>
  <main>
    <h1>Manage players</h1>

    <h2>Dungeon Master</h2>
    <PlayerCard :player="playerStore.dungeonMaster" />

    <h2>Players ({{ playerStore.playerCount }})</h2>
    <PlayerCard v-for="player in playerStore.players" :player="player" :key="player.id" />

    <button @click="handleAddPlayer">add player</button>
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

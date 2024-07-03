<template>
  <main>
    <h1>Add new players</h1>

    <div>
      {{ playerStore.npc.name }}
      {{ playerStore.npc.modifier }}
    </div>

    <div>
      <div v-for="player in playerStore.players" :key="player.id">
        {{ player.name }}
        {{ player.modifier }}
      </div>
    </div>

    <button @click="handleAddPlayer">add player</button>
  </main>
</template>

<script setup lang="ts">
import { usePlayerStore } from '../stores/players'

const playerStore = usePlayerStore()

const handleAddPlayer = () => {
  playerStore.addPlayer()
}

playerStore.$subscribe((mutation, state) => {
  localStorage.setItem(mutation.storeId, JSON.stringify(state))
})
</script>

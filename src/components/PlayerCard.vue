<template>
  <div class="player-card">
    <label :for="`name-${player.id}`">Name:</label>
    <input v-model="name" :id="`name-${player.id}`" name="name" type="text" />

    <label :for="`modifier-${player.id}`">Modifier:</label>
    <input v-model="modifier" :id="`modifier-${player.id}`" name="modifier" type="number" />
    <button class="w-100" v-if="enableDelete" @click="handleDelete">Delete player</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import { type Player } from '../types/player'
import { usePlayerStore } from '@/stores/players'

interface Props {
  player: Player
  enableDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableDelete: true
})

const name = ref(props.player.name)
const modifier = ref(props.player.modifier)

const playerStore = usePlayerStore()

const handleDelete = () => {
  playerStore.deletePlayer(props.player.id)
}
</script>

<style lang="scss">
.player-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>

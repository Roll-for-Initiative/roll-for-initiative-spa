<template>
  <div class="player-card">
    <label :for="`name-${player.id}`">Name:</label>
    <input v-model="name" :id="`name-${player.id}`" name="name" type="text" />

    <label :for="`modifier-${player.id}`">modifier:</label>
    <input v-model="modifier" :id="`modifier-${player.id}`" name="modifier" type="number" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type Player } from '../types/player'

const props = defineProps<{ player: Player }>()

const name = ref(props.player.name)
const modifier = ref(props.player.modifier)
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

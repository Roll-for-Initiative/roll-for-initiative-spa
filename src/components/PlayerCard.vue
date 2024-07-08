<template>
  <div class="player-card">
    <TextInput v-model="model.name" :id="player.id" name="name" />
    <NumberInput v-model="model.modifier" :id="player.id" name="modifier" />
    <button class="w-100" v-if="enableDelete" @click="handleDelete">Delete player</button>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { type Player } from '../types/player'
import { usePlayerStore } from '@/stores/players'
import TextInput from './TextInput.vue'
import NumberInput from './NumberInput.vue'

interface Props {
  player: Player
  enableDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableDelete: true
})

const model = reactive({
  name: props.player.name,
  modifier: props.player.modifier
})

const playerStore = usePlayerStore()

watch(model, (value) => {
  playerStore.updatePlayer(props.player.id, value)
})

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

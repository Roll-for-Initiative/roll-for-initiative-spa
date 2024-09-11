<template>
  <Card class="player-card" :style="{ 'background-image': `url(${player.imgUrl})` }">
    <button
      class="button button--icon player-card__delete"
      v-if="playerStore.playerCount > 1"
      @click="handleDelete"
    >
      x
    </button>

    <TextInput v-model="model.name" :id="player.id" name="name" />
    <NumberInput v-model="model.modifier" :id="player.id" name="modifier" />
    <FileInput v-model="model.imgUrl" :id="player.id" name="image" />
  </Card>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { type Player } from '../types/player'
import { usePlayerStore } from '@/stores/players'
import Card from './Card.vue'
import TextInput from './TextInput.vue'
import NumberInput from './NumberInput.vue'
import FileInput from './FileInput.vue'

interface Props {
  player: Player
}

const props = defineProps<Props>()

const model = reactive({
  name: props.player.name,
  modifier: props.player.modifier,
  imgUrl: props.player.imgUrl
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
  &:before {
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    z-index: 0;
  }
}

.player-card__delete {
  align-self: flex-end;
  margin-bottom: auto;
}
</style>

<template>
  <div class="col-12 col-sm-4 col-lg-3">
    <div class="player-card" :style="{ 'background-image': `url(${player.imgUrl})` }">
      <button
        class="player-card__delete"
        v-if="!isDungeonMaster && playerStore.playerCount > 1"
        @click="handleDelete"
      >
        x
      </button>

      <TextInput v-model="model.name" :id="player.id" name="name" />
      <NumberInput v-model="model.modifier" :id="player.id" name="modifier" />
      <FileInput v-model="model.imgUrl" :id="player.id" name="image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

import { type Player } from '../types/player'
import { usePlayerStore } from '@/stores/players'
import TextInput from './TextInput.vue'
import NumberInput from './NumberInput.vue'
import FileInput from './FileInput.vue'

interface Props {
  player: Player
  isDungeonMaster?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDungeonMaster: false
})

const model = reactive({
  name: props.player.name,
  modifier: props.player.modifier,
  imgUrl: props.player.imgUrl
})

const playerStore = usePlayerStore()

watch(model, (value) => {
  if (props.isDungeonMaster) {
    playerStore.updateDungeonMaster(value)
  } else {
    playerStore.updatePlayer(props.player.id, value)
  }
})

const handleDelete = () => {
  playerStore.deletePlayer(props.player.id)
}
</script>

<style lang="scss">
@use '@/assets/scss/mixins' as *;

.player-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  border: solid 2px black;
  background-color: var(--rfi-black);
  padding: 0.5rem;
  margin-bottom: 1.5rem;
}

.player-card__delete {
  @include button;
  align-self: flex-end;
}
</style>

<template>
  <nav class="nav">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex gap-3 justify-content-center">
          <button
            v-if="!playerStore.modalIsOpen"
            class="text-button"
            @click="showPlayerModal"
            @keydown.p="showPlayerModal"
          >
            Edit players
          </button>
          <button class="text-button" @click="roll" @keydown.r="roll">Roll for initiative</button>

          <div class="nav__dm-modifier">
            <h4 class="mb-0">DM modifier</h4>
            <NumberInput
              v-model="playerStore.dungeonMaster.modifier"
              small
              id="dm-modifier"
              name="Dungeon master modifier"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/stores/players'
import NumberInput from './NumberInput.vue'

const playerStore = usePlayerStore()

const roll = () => {
  playerStore.modalIsOpen = false
  playerStore.roll()
}

const showPlayerModal = () => {
  playerStore.showModal()
}
</script>

<style lang="scss">
.nav {
  position: fixed;
  width: 100%;
  bottom: 1rem;
  padding: 1rem;
  z-index: 100;
}

.nav__dm-modifier {
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

<template>
  <dialog class="modal" ref="modal" :open="playerStore.modalIsOpen" @keydown.esc="closeModal">
    <div class="container">
      <h1 class="modal__title display-2">{{ title }}</h1>

      <div class="modal__content row">
        <div class="col-12">
          <slot></slot>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { onUpdated, ref } from 'vue'
import { usePlayerStore } from '@/stores/players'

interface Props {
  title: string
}
defineProps<Props>()

const playerStore = usePlayerStore()
const modal = ref<HTMLElement | null>(null)

const closeModal = () => {
  playerStore.closeModal()
}

onUpdated(() => {
  if (playerStore.modalIsOpen) {
    modal.value?.focus()
  }
})
</script>

<style lang="scss">
@use '@/assets/scss/variables' as *;

.modal {
  background-color: var(--rfi-body-bg);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  border: 0;
  color: unset;
  overflow-y: scroll;
}

.modal__title {
  width: 100%;
  position: fixed;
  color: var(--rfi-gray-600);
  margin: 0;
  top: 1.5rem;
  z-index: 0;
}

.modal__content {
  position: relative;
  z-index: 10;
  margin-block: 6.5rem;
}
</style>
